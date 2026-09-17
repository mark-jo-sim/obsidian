---
type: tool
tags:
  - cli
  - bash
  - audio
---
-## Reference

[FFmpeg wiki page](https://trac.ffmpeg.org/wiki/AudioChannelManipulation)

## Splitting audio by channel

One option is to use **pan filtering**

```sh
ffmpeg -i stereo.wav -af "pan=mono|c0=c1" mono.m4a
```

The `-map_channel` option exists in older versions but is now deprecated.

```shell
ffmpeg -i $INPUT.wav -map_channel 0.0.0 left.wav -map_channel 0.0.1 right.wav
```

## Probing audio metadata

E.g. getting duration for audio

```shell
ffprobe -i $INPUT.wav -show_entries format=duration -sexagesimal -v quiet -of csv="p=0"
```

- `show_entries`: select metadata to print
- `format=duration`: under the `format` category select the `duration` value
- `-v quiet`: suppress logging
- `-of csv`: print as csv
	- `-of csv="p=0"` i.e. `-of csv="print_section=0"` disable printing the section name as a CSV col

Or getting number of channels:

```shell
ffprobe -v quiet -select_streams a:0 -show_entries stream=channels -i $webm -of csv="p=0"
```

- `stream=channels`: under the `stream` category select the `channels` value