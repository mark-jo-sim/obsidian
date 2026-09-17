---
type: library
tags:
  - python
  - date
  - time
---
## Docs

[Official Python docs](https://docs.python.org/3/library/datetime.html)
## Usage

Seconds -> human time

```python
>>> datetime.fromtimestamp(3600).strftime("%H:%M:%S")
'01:00:00'
```

Converting relative time to seconds:

```python
>>> timedelta(hours=1).total_seconds()
3600.0
```

From shell:

Human > seconds:

```python
from datetime import datetime, timedelta
date_obj = datetime.strptime($time_str, "%H:%M:%S")
timedelta = timedelta(
	hours=date_obj.hour,
	minutes=date_obj.minute,
	seconds=date_obj.second,
)
seconds=timedelta.seconds
print(seconds)
```

Seconds > human:

```python
from datetime import datetime
date_obj = datetime.fromtimestamp($seconds)
human_str = date_obj.strftime("%H:%M:%S")
print(human_str)
```