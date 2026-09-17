---
type: api
tags:
  - asr
  - cartesia
---
## Usage

**Note:** Cartesia ASR API does not allow for prior transcripts to be used as context.

Example CURL:
```sh
curl --request POST \
  --url https://api.cartesia.ai/stt \
  --header 'Authorization: $CARTESIA_API_KEY' \
  --header 'Cartesia-Version: 2026-03-01' \
  --header 'Content-Type: multipart/form-data' \
  --form file='@example-file' \
  --form model=ink-whisper \
  --form language=en \
  --form 'timestamp_granularities[]=word'
```

