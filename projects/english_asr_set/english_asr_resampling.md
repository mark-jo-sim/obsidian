---
type: task
project: "[[english_asr_test_data]]"
linear_tickets:
  - VOIP-5190
---
## Background

Eval run on English ASR test set revealed three main data issues:

1. Channel mixup and merging (between agent/visitor input streams)
2. Lack of ground-truth timestamps for messages
3. Duplicated rows

## Related docs

- [Qinbang's eval results](https://coda.io/d/Voice-AI-Infra-Voice-Integration-Team-Hub_dNf1mdnopCe/VOIP-5029-Nova-3-English-STT-Baseline-Phase-1-Report_su4FQdqN#_lur-S0Pq)
- [Qinbang's eval repo](https://github.com/cresta/voice-integrations/tree/stt-eval-relocation/scripts/python/stt/eval/VOIP-5029-english-asr-baseline-eval)
- [English ASR test data spreadsheet](https://docs.google.com/spreadsheets/d/1Ecz_Nubk6grHMe2JXzlifaOV7IP-jugM-P5WCaJBl_c/edit?usp=sharing)

## Authentication

- Deepgram data access: `cresta-pci-account_AWSLimitedReadOnlyAccess` AWS role
- Gemini secret management: `infra-prod_ro` AWS role

## s3 directory structure

- Customer-specific prefixes stored in `customers.json`

## Gold transcript scraping code

[Deepgram gold transcript repo](https://github.com/cresta/chat-ai/blob/asr-eval-sample-test-set/notebooks/asr/asr_eval/existing_golden_transcripts/)

Overall pipeline is `discover-s3` $\mapsto$ `ingest-tar` $\mapsto$ `export`.
Conceptually:

- Search s3 paths for directories containing audio files & transcripts per customer
- Download tarballs from s3, save locally and inflate into transcripts + audio files
- Export transcript & audio files into a TSV spreadsheet

Main logic is stored in [export_golden_transcript_messages.py](https://github.com/cresta/chat-ai/blob/asr-eval-sample-test-set/notebooks/asr/asr_eval/existing_golden_transcripts/export_golden_transcript_messages.py).
Three cases:

- `discover-s3`:
	- Inspect s3 filepaths
		- Why? What needs to be discovered? Just where `.webm` files are stored?
	- Functions from `transcript_volume.py`
		- `resolve_golden_dir`
		- `list_s3_top_level_prefixes`
		- `rank_s3_prefix_candidates`
- `export`
	- Aggregate director{y|ies} of transcripts into a `.tsv` file.
	- Functions from `transcript_volume.py`
		- `resolve_golden_dir`
		- `export_customer_messages_transcript_only`
		- `export_customer_messages_matched`
		- `export_customer_audit_debug`
		- `write_volume_stats`
	- Expects data files in format `TRANSCRIPTS/$slug/$split?/$call_id.{webm|text}`
- `ingest-tar`
	- Write s3 files to local `.tar.gz` archives
	- Uses `aws s3 cp` so I'm assuming files on AWS are already tar'ed?
	- `--strip-components` seems to remove unnecessary intermediate directories but values to strip not specified anywhere

Utils in [transcript_volume.py](https://github.com/cresta/chat-ai/blob/asr-eval-sample-test-set/notebooks/asr/asr_eval/existing_golden_transcripts/transcript_volume.py)

- `resolve_golden_dir`: Scan PWD and candidate subdirectories for a folder containing `customers.{json|yaml}`
- `list_s3_top_level_prefixes`: Get directory name for all top directories in a bucket
- `rank_s3_prefix_candidates`: Fuzzy matches s3 bucket prefixes to candidate strings representing a given customer
- `export_customer_messages_matched`:
- `index_transcripts`: 
- `merge_s3_audio_by_prefixes`:

## New data ingestion pipeline

Focus on using small reproducible shell scripts rather than heavier Python scripts.
Use [[aws-cli#s3api|s3api]] for interfacing with s3 files.

### Prefix discovery

```sh
export bucket=deepgram-cresta-shared-s3
export slug=snapfinance
aws s3api list-objects-v2 --bucket $bucket --delimiter '/' --query 'CommonPrefixes[].Prefix' | ugrep -Z2 $slug
```

### Audio and transcript file mapping 

Use `s3api` to search for `.webm` files containing audio in the customer directory in the s3 bucket.

```sh
export prefix=holidayinn-transfers-voice_E6mTMFpqS7PMdLwCr2dfBD/

# list all files in customer directory
aws a3api list-objects-v2 --bucket $bucket --prefix $prefix \
	# get just filename from JSON data
	| jq '.Contents[].Key'
	# filter for .webm files
	| grep '.webm' \
	# save a list for each customer
	> $slug-audio-files.txt

# get all directories containing audio files
xargs -a $slug-audio-files.txt dirname | sort -u > $slug-audio-dirs.txt
```

Transcripts are stored in a tarball for each customer directory.

```sh
mkdir -p data/

# for every customer (identified by a unique slug)
for slug in $(jq '.customers[].slug' -r customers.json); do
	# for every prefix discovered for that customer
	for prefix in $(jq \
		'.customers[] | select(.slug == $slug).s3_prefixes[]' \
		-r customers.json \
	); do
		# find all tarballs
		aws s3api list-objects-v2 --bucket $bucket --prefix $prefix \
		| jq '.Contents[].Key' -r \
		| grep -E '\.tar(\.gz)?' \
		> data/$slug-tarballs.txt
		
		# save tar'ed filenames
		tar -tf data/$slug-tarballs.txt > data/$slug-transcripts.txt
		
		# find all .webm files
		aws s3api list-objects-v2 --bucket $bucket --prefix $prefix \
		| jq '.Contents[].Key' -r \
		| grep -E '\.webm' \
		> data/$slug-webm.txt
done
```
###  Metadata spreadsheet generation 


## Channel probing

Code: [01b_prob_channels.py](https://github.com/cresta/voice-integrations/blob/stt-eval-relocation/scripts/python/stt/eval/VOIP-5029-english-asr-baseline-eval/scripts/01b_probe_channels.py)

- Expect `ASR-test-set-en-US.xlsx`, `audio/*.webm` and `channel_map.json` all in `data/` directory (note: none in repo)
- Get channel info with `ffprobe` command
- Then get ASR hypotheses for each recording using Deepgram API
- Identify agent/visitor channel (when stereo) by selecting channel that minimizes WER for each role

## Timestamps

### Running forced align

Qinbang did implicit forced alignment by generating ASR hypotheses with Deepgram API and correlating with closet match ground truth strings.
Easier strategy is to use [Nvidia NeMo forced align](https://docs.nvidia.com/nemo-framework/user-guide/latest/nemotoolkit/tools/nemo_forced_aligner.html).

```sh
python $NEMO_DIR/tools/nemo_forced_aligner/align.py \
	pretrained_name="stt_en_fastconformer_hybrid_large_pc" \
	manifest_filepath=<path to manifest of utterances you want to align> \
	output_dir=<path to where your output files will be saved>
```

Need to create a manifest for input
- JSON file containing the path to the audio file and the text transcript for that audio file
- not entirely sure of the amount of pre-processing that will need to be done
- at least remove any flags indicated with square brackets indicating entities and speaker roles e.g. `[VISTIOR:]` or `[NE]`

###  Forced Align output

Saved as `.ctm` and `.ass` file.
`.ctm` or **conversation time marked** is a TSV which, in the flavor used by NeMo, has the following columns:

- Audio filename
- Audio channel
- Start time
- Duration
- Text
- Confidence score (`NA` if none given)
- Token type (defaults to `lex`)
- Speaker (`NA` if none given)

Convert to `.jsonl` with following snippet:

```sh
jq -Rsnc '[inputs
	| split("\n")[]
	| select(length > 0)
	| split(" ")
	| {
			audio_filepath: .[0],
			start_time: .[2],
			duration: .[3],
			text: .[4],
	}
	]' input.ctm \
	| jq -c '.[]' \
	| sed 's/<space>/ /g' \
	> output.json
```

### ASR timestamps from Deepgram streaming 

**BUG:** `HTTP 400` when connecting to websocket for streaming.
Batch transcribe API call works fine.

- Batch endpoint: `https://deepgram.voice-staging.internal.cresta.ai/v1`
- Streaming endpoint: `wss://deepgram-all-nova-3-global-staging.voice-staging.internal.cresta.ai`

## NER labeling

### Environment



### Iteration log notes

[Prompt iteration log](https://github.com/cresta/chat-ai/blob/asr-eval-sample-test-set/notebooks/asr/asr_eval/text_entity_detection/ITERATION_LOG.md)

Depends on:
- `tqdm`
- `google-genai`
- `pandas`
- `boto3`
- `yaml`
### Inference

- Code: [batch.py](https://github.com/cresta/chat-ai/blob/asr-eval-sample-test-set/notebooks/asr/asr_eval/text_entity_detection/batch.py)

```sh
# run on all *._messages.tsv files in ../existing_golden_transcripts/outputs/
python -m text_entity_detection.batch --all --workers 10

# run on single file
python -m text_entity_detection.batch --conversations-file $FILEPATH --workers 10
```

**From readme:** Expects data in `../existing_golden_transcripts/outputs/*_messages.tsv` with columns:

- `customer`
- `call_id`
- `transcript_path`
- `s3_uri`
- `speaker`
- `message`

**From `batch.py`:** 
- **Inference (outer funct):** `run_detection_on_conversation()`
- **Data input:** `data.py:load_all_golden_messages()`
- **Data input:** `data.py/get_conversation_messages(df, customer, call_id)`
- **Inference (inner funct):** `detect.py/detect_conversation()`
	- Expects rows `speaker`, `message`, ``
## Sampling

### Prior run

Log describes sample strategies for general partition and entity-heavy partition.

- [Sampling log](https://github.com/cresta/chat-ai/blob/asr-eval-sample-test-set/notebooks/asr/asr_eval/text_entity_detection/SAMPLING_NOTES.md)
- [sample_general.py](https://github.com/cresta/chat-ai/blob/asr-eval-sample-test-set/notebooks/asr/asr_eval/text_entity_detection/sample_general.py)
	- "Naive" sampling of $n=100$ messages per customer
- [sample_entity_heavy.py](https://github.com/cresta/chat-ai/blob/asr-eval-sample-test-set/notebooks/asr/asr_eval/text_entity_detection/sample_general.py)
	- "Greedy" sampling per entity type, with customer used as tiebreaker

### Adapting Spanish sampling code

API notes:
- `run_sampling.py`
	- Replace `convo_manifest=data/audio_manifest.jsonl`

Spanish dataset sampled at convo-level for entity heavy & general sets.
English dataset is not large enough to sample entity-heavy convos $\Rightarrow$ sample convos for general, messages for entity-heavy.

## Work log

### 4 Aug 2026

- Ran NER on English dataset
- Attempted to run sampling script, noted API differences from Spanish dataset

### 5 Aug 2026

- Got stereo WER for all convos (including convos w/o valid role mapping)
- Ran sampling on English dataset