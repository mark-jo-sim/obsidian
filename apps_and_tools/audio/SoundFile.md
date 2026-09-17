---
type: tool
tags:
  - python
  - audio
---
## Links

- [[english_asr_resampling]]

## Usage

```python
with SoundFile("path") as audio_file:
	# get duration
	duration_sec = audio_file.frames / audio_file.samplerate
	
	# read at a given point in time
	start_time_sec = 2.0
	data = audio_file.read(start_time_sec*audio_file.samplerate)
```