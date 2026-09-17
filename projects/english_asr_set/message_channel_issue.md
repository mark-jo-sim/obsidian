---
type: task
project:
  - "[[english_asr_test_data]]"
tags:
  - audio_channels
  - dataset_creation
---
## Summary

Several messages in Entity Heavy set have wrong channel uploaded.

## Channel swapping logic

**`12_export_dataset.py`:**

```python

```

## Message triage

### 6c58bc27-d8d7-46fe-afb2-ce67209f0926_88z

**From Speechlab:**
- Expected:
	- LEFT: "The number is four seven nine seven one nine two eight nine five"
	- RIGHT: `None`
- Actual:
	- LEFT: "Okay s--"
	- RIGHT: `None`

**From `entity_heavy_v2_messages.csv`:**
- `role_prediction=left_agent_right_visitor`
- `role=VISITOR`
- `channel=left`
- `left_wer=0.0`
- `right_wer=1.0`

Seems impossible!

**From source audio:**

Audio is definitely on right, not left. How did `left_wer=0.0` happen?

**From channel-split audio:**

Definitely also on right in `data/aquafinance/ogg-channels/6c58bc27-d8d7-46fe-afb2-ce67209f0926-right.ogg`

**From `data/alignments/aquafinance/6c58bc27-d8d7-46fe-afb2-ce67209f0926.jsonl`:**

Right WER > left WER. So `channel=left` got assigned later by accident!

**From `data/ner/aligned_messages.tsv`**

- `message_index=102`

**From `data/message_aggregate.csv**

- `message_index=88` ‼️