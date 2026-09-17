---
type: tool
tags:
  - llm_judge
  - llm
  - llm_api
---
## Resources

- [text-entity-detection](https://github.com/cresta/chat-ai/tree/mas-asr-correction/notebooks/asr/asr_eval/text_entity_detection) folder on Github


## Usage

### Secret retrieval

Use `boto3`

```python
import boto3
import json

profile_name = "infra-prod_ro"
secret_id = "arn:aws:secretsmanager:us-west-2:242659714806:secret:shared/gemini-api-key-2FH7f1"
region_name = "us-west-2"

session = boto3.Session(profile_name)
client = session.client("secretsmanager", region_name=region_name)
raw = client.get_secret_value(SecretId=secret_id)["SecretString"]
api_key = json.loads(raw)["API_KEY"]
```

### Inference

Model endpoint:

```python
from google import genai
from google.genai import types

llm_client = genai.Client(api_key=api_key)
model = "gemini-3.1-pro-preview"

response = llm_client.models.generate_content(
	model=model,
	contents=[
		types.Content(
			role="user",
			parts=[types.Part.from_text(text=user_content)]
		)
	],
	config=types.GenerateContentConfig(**config_kwargs),
)

# `MessageDetectionResult` is a pydantic model defined elsewhere
result = MessageDetectionResult.model_validate_json(response.text)
```

Config kwargs:

```python
config_kwargs = dict(
	temperature=0.0,
	top_p=1.0,
	response_mime_type="application/json",
	response_schema=MessageDetectionResult,
	http_options=types.HttpOptions(
		timeout=180_000,  # 3 min; longest observed successful call was ~140s
		retry_options=types.HttpRetryOptions(attempts=3),
	),
)
```