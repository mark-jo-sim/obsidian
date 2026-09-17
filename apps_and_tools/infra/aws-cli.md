---
type: tool
tags:
  - aws
  - cli
  - prod
---

## Roles

- `cresta-pci-account_AWSLimitedReadOnlyAccess` - downloading prod data for English dataset

## s3

### Audio data access (offline, terminal)

```shell
aws --profile customer-buckets-prod_ro s3 cp $AUDIO_URI $SAVE_PATH
```

### Audio data access (offline, python)

**Source:** [pull_walter_voice_data.ipynb](https://cresta.sourcegraph.com/r/github.com/cresta/chat-ai/-/blob/notebooks/asr/pull_walter_voice_data.ipynb)

Overall flow:

- Retrieve s3 audio URIs using `clickhouse`
- Instantiate bucket using `boto3`, retrieve bucket URI from chunk of file URI
- Download file from bucket to local temp directory
- Silence redacted segments using `ffmpeg`
	- Timestamps for redaction come from human labels

```python
s3 = boto3.session.Session(
	profile_name='customer-buckets-prod_ro'
).resource('s3')

audio_uri = "s3://cresta-prod-snapfinance-us-west-2-private/snapfinance/us-west-2/audio-recording/call-019ea9b9-bdeb-7a1e-bad0-6e8fd9038c43-combined.webm"

src_bucket_str = audio_uri.split("/")[2]
src_bucket = s3.Bucket(src_bucket_str)

file_key = "/".join(audio_uri.split("/")[:3])

src_bucket.download_file(file_key, local_input_file)
```

### Audio data access (production)

```python
def _download_audio(
	stub: VoiceSubscriptionServiceStub,
	conversation: ConversationName
) -> bytes:
    """Downloads audio for the given conversation via voice-api-server."""
    
    auth_metadata = create_auth_metadata_from_env(
	    "evaluation_engine_download_audio"
    )
    s3_uri = stub.FetchAudio(
        FetchAudioRequest(parent=str(conversation)),
        metadata=auth_metadata,
        timeout=AUDIO_DOWNLOAD_TIMEOUT_S,
    ).presigned_s3_uri
    if ".webm" not in s3_uri:
        raise NotImplementedError(
            f"Audio URI {s3_uri} does not seem to point to a webm file."
            "Right now we assume in these utils that the source audio is"
            "in webm format."
        )
    response = requests.get(s3_uri, timeout=AUDIO_DOWNLOAD_TIMEOUT_S)
    response.raise_for_status()
    return response.content
```

## s3api

Alternative to `aws s3 ls` subcommand that queries s3 filepaths as JSON objects.
Can provide query parameters with `--query` flag or pipe output directly to [[jq]].

```sh
aws s3api --bucket $bucket --prefix $prefix
```

