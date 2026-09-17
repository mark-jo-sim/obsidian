---
type: tool
tags:
  - llm
  - llm_api
  - cresta_internal_api
---
## Resources

- [Vertex gemini skill](https://github.com/cresta/claude-code-marketplace/blob/main/plugins/ai-platform/skills/vertex-ai-gemini/references/vertex-ai-gemini-usage-guideline.md)
- [LLM proxy config skill](https://github.com/cresta/claude-code-marketplace/blob/main/plugins/ai-platform/skills/llm-proxy-config/references/llm-proxy-config-framework.md)
- [Unit tests for Vertex AI client](https://github.com/cresta/llm-proxy-client/blob/main/tests/llm_proxy_client/test_vertex_ai_client_non_hermetic.py#L23)
- [LLM task protocol](https://github.com/cresta/cresta-proto/blob/main/cresta/nonpublic/llm_proxy/llm_task.proto)
- [LLM proxy client Github](https://github.com/cresta/llm-proxy-client/tree/main)

## Usage

Glean snippet:

Requires:

- `OPENAI_API_KEY=dummy` (Environment variable must be set even if value is not used. )
- `LLM_PROXY_BASE_URL="https://api-exampleappenv.us-west-2-staging.internal.cresta.ai"`

```python
from llm_proxy_client import LLMProxyClient
from cresta.nonpublic.llm_proxy.llm_task_pb2 import (
    LLMTask,
    TaskType,
    TrafficType,
)

VERTEX_MODEL_HANDLE = "vertex-gemini-3-1-pro-preview"

client = LLMProxyClient()

task = LLMTask(
	llm_model_id=VERTEX_MODEL_HANDLE,
	profile_id="infra-prod_ro",
	usecase_id="arc",
	customer_id="cresta",
)

system_prompt = "Say your favorite quote from Metro 2033"
user_content = "Hi!"

response = client.beta.chat.completions.parse(
	llm_task=task,
    messages=[
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_content},
    ],
    # response_format=MessageDetectionResult,
    temperature=0.0,
)

result = response.choices[0].message.content
```