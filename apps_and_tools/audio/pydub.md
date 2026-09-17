---
type: tool
tags:
  - python
  - audio
---
## Usage

Splitting audio into chunks by timestamps in seconds:

```python
    segment = pydub.AudioSegment.from_file(audio_path)
    left_segment, right_segment = segment.split_to_mono()

    def seconds_to_frames(seconds: float) -> int:
        return int(seconds * segment.frame_rate)

    with tempfile.TemporaryDirectory(dir="data/") as temp_dir:
        audio_paths = []
        for i, message in enumerate(messages):
            start_frame = seconds_to_frames(message["start"])
            end_frame = seconds_to_frames(message["end"])
            if message.get("channel") == "left":
                subsegment = left_segment.get_sample_slice(
	                start_frame,
	                end_frame
	            )
            elif message.get("channel") == "right":
                subsegment = right_segment.get_sample_slice(
	                start_frame,
	                end_frame
	            )
            # conversation may not have valid channel map
            else:
                subsegment = segment.get_sample_slice(start_frame, end_frame)

            subsegment.export(
	            os.path.join(temp_dir, f"{i}.wav"), format="wav"
	        )
```