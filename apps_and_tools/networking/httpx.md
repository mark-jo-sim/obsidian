---
type: tool
tags:
  - python
  - http
  - httpx
---
## Overview

Python bindings for HTTP client, designed for compatibility with `requests`


## Usage

```python
# http request methods
httpx.post
httpx.get
httpx.put
httpx.delete
httpx.head
httpx.options

# passing parameters
params = {"mode": "streaming", "language": "en_US"}
response = httpx.post("website.com", params=params)

# customer headers
headers = {"user-agent": "my-app/0.0.1"}
response = httpx.post("website.com", headers=headers)
```