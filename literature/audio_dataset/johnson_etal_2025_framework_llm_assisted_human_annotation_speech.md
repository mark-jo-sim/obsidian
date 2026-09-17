---
tags:
  - asr
  - dataset_creation
  - llm_judge
  - human_in_the_loop
author:
  - Alexander Johnson
  - Harsh Deshpande
  - Emmy Phung
  - Ahmad Emami
year: 2025
journal: Interspeech
---
## Abstract

Propose LLM + HITL strategy for correcting ASR call transcriptions involving LLM-driven flagging of likely error regions for human annotation.

## Problem definition


## Background


## Dataset

**Earnings 21**

- 44 corporate earnings calls
- 39 hours of speech
- High density of named entities
## Model

### HITL routine

- GPT-4o & Llama3-8B
- Prompted to retrieve sentences that (for example):
	- Most likely to need correction
	- That best summarize dataset
	- Most unique to call
	- Highest number of named entities
	- Highest number of misspelled named entities
- Pass $N$ selected sentences to human annotation
- Use corrected sentences as ICL prompt for LLM correction of remaining document
- Reject LLM corrections that have $\geq25\%$ WER with original ASR transcript to minimize hallucination

### Finetuning

- Llama3-8B: Finetune QLoRA with first 10 GT sentences from human annotation before ICL

## Results

- Prompts related to misspelling & entity content outperformed prompts related to overall call content or sentence importance.
- Best WER w/o LLM correction: $11.05$
- Best WER w/ LLM correction: $10.87$

## Look into

