---
type: task
linear_tickets:
  - VOIP-5665
project:
  - "[[english_asr_test_data]]"
---
## Why

Obtain precise mapping of ground truth messages to audio channel for stereo audio files in English STT dataset. Benefits downstream message time alignment.

## Context

Previous strategy for aligning messages to individual channels for stereo audio for the English ASR test set assigned all messages of a given role (i.e. agent or visitor) to one of the two channels. Manual inspection later revealed that several messages were not consistently mapped to the same channel as other messages of that role. For example, multi-agent conversations, background noise could be on either role and some agent or visitor messages were mislabeled.

## Scope + methods

Map message to channel using beam search.

```
for message in ground_truth:
  for beam_hyp in beams:
    add message to beam_hyp
    get wer for beam_hyp w/ message
    append extended beam_hyp to beam list
  sort beams by WER
  keep k=20 beams with lowest WER

return messages corresponding to beam w/ lowest WER
```

## Definition of done

- [ ] Channel → message index mapping for every conversation in English dataset
- [ ] Descriptive statistics on distribution of conversation roles, message overlap between channels, etc.

## Results

Split WER is **worse** than in previous setup, this is an unexpected regression.
Debug before figuring anything else out.

## Work log

### 3 Aug 2026

- Wrote linear issue + added write-up to Coda page
- Passed to Stan + Qinbang for go-ahead
- Vibe-coded PoC w/ Cursor, not checked yet

### 4 Aug 2026

- At Stan + Qinbang's recommendation bailing on DP message->channel map
- Manual inspection of convos w/ high insertion/WER ratio or message/convo WER delta showed good alignment -> trusting **entire dataset** of convos w/ valid role mapping