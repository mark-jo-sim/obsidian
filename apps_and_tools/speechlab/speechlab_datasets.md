---
type: internal_code
tags:
  - asr
  - dataset_creation
  - cresta_internal_api
---
## Resources

- [Speechlab server github](https://github.com/cresta/go-servers/tree/94f9018dfc832ff205ca582fb2ebcc07d7d53f97/speechlab)
- [Speechlab CRUD skill](https://github.com/cresta/go-servers/blob/main/.claude/skills/speechlab-crud/SKILL.md)
- [Speechlab user guide](https://github.com/cresta/go-servers/blob/94f9018dfc832ff205ca582fb2ebcc07d7d53f97/speechlab/docs/user-guide.md)

## URLs

- https://speechlab-go.us-west-2-staging.internal.cresta.ai/
- https://speechlab-go.us-west-2-prod.internal.cresta.ai

## Overview

- A `Dataset` is a list of `AudioSample` objects with additional metadata

## Models

### AudioSample

Snippet for creation from CLI (AFAICT this is only when running speechlab locally):

```shell
# put audio to tmp location in s3
aws --profile speechlab-staging s3 cp \
  ./your-test.wav \
  s3://speechlab-us-west-2-staging/tmp/your-test.wav

# put audio from s3 to speechlab (deletes tmp file in s3)
grpcurl -plaintext \
  -H "authorization: Bearer $TOKEN" \
  -d '{
    "audio_sample": {
      "description": "smoke test",
      "customer_id": "<your-customer>"
    },
    "audio_s3_uri": "s3://speechlab-us-west-2-staging/tmp/your-test.wav"
  }' \
  localhost:9070 cresta.v1.speechlab.AudioSampleService/CreateAudioSample
```

### Dataset

Expected cols (from Claude):

```
audio_filename, display_name, customer_id, language_code, description, agent_transcript, customer_transcript, audio_duration_seconds — where agent_transcript→ch0, customer_transcript→ch1. display_name = call_id (UUID, unique per customer, immutable — perfect). language_code = en-US for all.
```

Go snippet for dataset creation

```go
datasetModel := &dbmodel.Datasets{
	State:         int32(evalpb.Dataset_DRAFT),
	DisplayName:   incoming.GetDisplayName(),
	Description:   incoming.GetDescription(),
	LanguageScope: incoming.GetLanguageScope(),
	CustomerID:    incoming.GetCustomerId(),
	Intent:        incoming.GetIntent(),
	Creator:       actorIdentity,
	ClonedFrom:    "",
	CreatedAt:     now.AsTime(),
	UpdatedAt:     now.AsTime(),
}
```

### Sample creation script

Courtesy of Clanker Code

```sh
# ── setup ──────────────────────────────────────────────────────────────────
TOK="$(cresta-cli cresta-token us-west-2-staging --bearer | sed -E 's/^Bearer[[:space:]]+//' | tr -d '[:space:]')"
HOST="https://speechlab-go.us-west-2-staging.internal.cresta.ai"
CALL=7810fe5d-8c0c-4251-83bd-6239789aa31b
D=/tmp/speechlab-example

# ── step 1: upload the (already transcoded) mp3 ────────────────────────────
#   returns {"s3_uri":"s3://speechlab-us-west-2-staging/tmp/uploads/…","s3_file_path":"…"}
UP=$(curl -sS -H "Authorization: Bearer $TOK" -F audio_file=@$D/$CALL.mp3 $HOST/v1/audio/upload)
S3URI=$(echo "$UP" | python3 -c "import json,sys;print(json.load(sys.stdin)['s3_uri'])")
echo "uploaded -> $S3URI"

# ── step 2: create the AudioSample (audioS3Uri is a URL-encoded query param) ─
ENC=$(python3 -c "import urllib.parse,sys;print(urllib.parse.quote(sys.argv[1],safe=''))" "$S3URI")
RESP=$(curl -sS -H "Authorization: Bearer $TOK" -H "Content-Type: application/json" \
  -X POST "$HOST/v1/speechlab/audioSamples?audioS3Uri=$ENC" \
  --data @"$D/$CALL.create.json")
SAMPLE=$(echo "$RESP" | python3 -c "import json,sys;print(json.load(sys.stdin)['audioSample']['name'])")
echo "created -> $SAMPLE"     # e.g. audioSamples/311

# ── step 3: flip the sample DRAFT -> SAVED (one-way, idempotent) ───────────
curl -sS -H "Authorization: Bearer $TOK" -X POST "$HOST/v1/speechlab/audioSamples/${SAMPLE#audioSamples/}:save"

# ── step 4: create the per-customer dataset (DRAFT container) ──────────────
DS=$(curl -sS -H "Authorization: Bearer $TOK" -H "Content-Type: application/json" \
  -X POST "$HOST/v1/speechlab/eval/datasets" \
  --data '{"displayName":"EN Entity-Heavy v2 Greenix","languageScope":"en-US","customerId":"greenix","intent":"VOIP-5029 EN ASR baseline — entity_heavy_v2 Greenix subset (true-stereo). [NE]..[/] markup retained; SpeechLab text-norm handles it."}')
DSNAME=$(echo "$DS" | python3 -c "import json,sys;print(json.load(sys.stdin)['dataset']['name'])")
echo "dataset -> $DSNAME"     # e.g. datasets/14

# ── step 5: add the sample to the dataset ──────────────────────────────────
curl -sS -H "Authorization: Bearer $TOK" -H "Content-Type: application/json" \
  -X POST "$HOST/v1/speechlab/eval/datasets/${DSNAME#datasets/}:addSamples" \
  --data "{\"audioSampleIds\":[\"$SAMPLE\"]}"

# ── step 6: finalize the dataset (requires ALL members already SAVED) ──────
curl -sS -H "Authorization: Bearer $TOK" -X POST "$HOST/v1/speechlab/eval/datasets/${DSNAME#datasets/}:save"
```

## Open questions

