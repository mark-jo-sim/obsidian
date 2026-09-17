---
type: task
project: "[[spanish_asr_test_data]]"
---

## Context

`scripts/probe_audio.py` infers mapping between speaker role and audio channel by comparing WER between ASR hypotheses for each channel with existing transcript for `VISITOR/AGENT` roles, as well as the combined transcript including both roles. A given channel is labeled as `VISITOR` if the WER with the `VISITOR` is lower than with `AGENT` or `COMBINED`, `AGENT` if the WER with `AGENT` is lowest, and likewise with `COMBINED`.

A stereo recording is said to have a "valid channel map" if one of the two channels is mapped to `AGENT` and the other to `VISITOR`, i.e. `left=AGENT, right=VISITOR` and `left=VISITOR, right=AGENT` are the only valid channel maps. If either channel is mapped to `COMBINED`, if both channels are mapped to the same role e.g. `left=AGENT, right=AGENT`, or if the transcript for either `AGENT` or `VISITOR` is missing entirely, then no valid channel mapping can be inferred for the recording.

## Numbers

| customer      | role_str                     | count |
| :------------ | :--------------------------- | ----: |
| brinks        | left_agent_right_visitor     |    69 |
| brinks        | left_combined_right_combined |    29 |
| brinks        | left_combined_right_visitor  |    24 |
| brinks        | unknown                      |    20 |
| brinks        | channels_combined            |     8 |
| brinks        | left_agent_right_combined    |     7 |
| brinks        | left_agent_right_agent       |     4 |
| brinks        | left_combined_right_agent    |     2 |
| guitar-center | left_visitor_right_agent     |   259 |
| guitar-center | unknown                      |    18 |
| guitar-center | left_combined_right_combined |     3 |
| guitar-center | left_visitor_right_combined  |     1 |
| guitar-center | left_combined_right_agent    |     1 |
| guitar-center | channels_combined            |     1 |
| snapfinance   | left_agent_right_visitor     |   197 |
| snapfinance   | unknown                      |    30 |
| snapfinance   | left_combined_right_visitor  |     3 |
| snapfinance   | left_visitor_right_agent     |     3 |
| spirit        | left_agent_right_visitor     |   194 |
| spirit        | unknown                      |     2 |
| spirit        | left_combined_right_combined |     1 |

## Examples by type

### Unknown

| Customer      | Call id                              | Notes                |
| ------------- | ------------------------------------ | -------------------- |
| Guitar Center | 019ad881-f5ad-79b6-9718-a2646a2e5e49 | No visitor speech    |
| Guitar Center | 019a38a6-b014-7d48-a333-2b61ba5ad3fc | No visitor speech    |
| Guitar Center | 019c17cc-c770-7a8d-8455-1900841abdd8 | English, not Spanish |
| Guitar Center | 019b7827-ba66-73e6-8be7-52401a973999 | No visitor speech    |
| Spirit        | 019de6b6-9f5b-7ead-ab31-4d77e8a33d97 | No visitor speech    |
| Snapfinance   | 019ca609-312b-7647-a1d2-35a75c346410 | Recording only       |
| Brinks        | 019ca6ab-7a5f-739b-be2f-28c69574fe6d | No visitor speech    |

### Combined

| Customer      | Role type                    | Call id                              | Notes                                             |
| ------------- | ---------------------------- | ------------------------------------ | ------------------------------------------------- |
| Brinks        | left_combined_right_combined | 019e7eb4-913f-7912-ad7c-9eb2145ad7f1 | Existing ASR transcript just has a lot of errors. |
| Brinks        | left_combined_right_visitor  | 019e7ef7-1f46-765b-83cd-13917766b94e | ASR errors                                        |
| Guitar Center | left_combined_right_combined | 019ca7fe-ecd6-7e85-9ece-be25d9457d4b | Audio English not Spanish                         |
| Guitar Center | channels_combined            | 019ad881-f5d0-79c5-9bf9-4710b24d0d47 | Audio English not Spanish                         |
| Spirit        | left_combined_right_combined | 019d464c-da55-77cd-8cef-1a5800f6ee57 | No visitor speech                                 |
