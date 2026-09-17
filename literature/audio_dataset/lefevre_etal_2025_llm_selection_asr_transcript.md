---
tags:
  - asr
  - asr_correction
  - telephony_speech
  - llm_judge
author:
  - Grace LeFevre
  - Jordan Hosier
  - Yu Zhou
  - Vijay K Gurbani
year: 2025
journal: SoutheastCon
---
## Abstract

LLM selection across multiple ASR transcripts of telephony speech improves resulting transcript relative to pure ASR.

## Problem definition

Improve ASR transcripts of telephony speech without requiring human correction.

## Background

Prior work focuses on rescoring $n$-best hypotheses from a single ASR model.
## Dataset

Two datasets of telephony speech derived from post-call customer service feedback surveys totaling to 4.7 hours of audio.
## Model

Pick three ASR models to generate transcripts and use LLM judge to reconcile differences and predicted corrected transcript.

### ASR model selection

To best leverage cross-model predictions, ASR models should have complimentary error patterns.
Ensure this is possible by measuring *empirical minimum WER*, that is the WER resulting from taking the best scoring transcript per-document across all three models.
Found $.034\sim.043$ absolute WER reduction with this method.

### LLM prompting

- Instruction-tuned Llama3.0-70B
- Prompted with domain-specific knowledge of customer service context and instructed to choose ASR transcription most likely to be *faithful* to original audio
	- Without specifying *faithfulness* model errs towards *overcorrection* (e.g. of nonstandard grammar)

### 1-best vs n-best

For a third held-out dataset with $n=3,081$ observations, (==model?? presumably Speechmatics?==) produced $792$ observations with **only one best path.**
For the remaining $2,289$ observations, no correlation was found between the delta in confidence between the top 1 & 2 sentences and the WER for that sentence.

## Results


| Dataset          | Best uncorrected WER     | Corrected WER |
| ---------------- | ------------------------ | ------------- |
| #1               | 0.108 (Whisper)          | 0.091         |
| #1 (hardest 20%) | 0.277 (Google Telephony) | 0.227         |
| #2               | 0.121 (Speechmatics)     | 0.119         |
| #2 (shortest)    | 0.146 (Google Telephony) | 0.126         |

## Look into

