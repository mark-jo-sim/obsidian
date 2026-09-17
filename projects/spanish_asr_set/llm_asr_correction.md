---
type: task
projects:
  - "[[spanish_asr_test_data]]"
  - "[[mas_asr_project]]"
tags:
  - asr_correction
  - llm_judge
---
## Why

Early PoC found ~5x RT for ASR correction and >10x RT for adjudication.
This is much higher than initial projected cost for Spanish ASR dataset.
Add option to speed up ASR transcript correction process using HITL + LLM as judge routine.
Also sets up for [[mas_asr_project]].

## Risks

If added to the Spanish ASR dataset creation pipeline, interferes with ASR bias study.
May wish to set aside partition of ASR dataset for human review only for purposes of bias study and other portion of data for LLM-assisted correction.

Also has no way of detecting if a speech turn was completely missed by transcription or, conversely, hallucinated transcriptions, as the LLM judge has no access to audio.

## Scope

Use pre/post corrected transcripts as ICL prompt.
Compare single vs multiple ASR transcripts as pre-correction.

## Methods

### Data

- ASR transcripts from approved vendors (Deepgram, Cartesia, Elevenlabs, OpenAI)
- Spanish annotation + adjudication PoC from Mark & Till

### Models

- Vertex LLM model...?

## Resources

- [[johnson_etal_2025_framework_llm_assisted_human_annotation_speech]]: related experiment
- [[vertex]]: internal LLM API notes

## Artifacts

- Github: [mas-asr-correction](https://github.com/cresta/chat-ai/tree/mas-asr-correction/notebooks/asr/asr_eval/mas-asr-correction)

## Out of scope

Possible opportunities for follow-up

- SICL with speech LLM
- Iterativity (LLM $\rightarrow$ human $\rightarrow$ LLM$\ldots$)
- Differences in VAD/segmentation across ASR models

## Work log

### 30 July 2026

- Wrote scope doc
- Configured LLM proxy with vertex

### 10 Aug 2026

- End-to-end scraping pipeline running
- Initial run w/ naive prompt + WER results