---
type: project
tags:
  - internationalization
  - asr
  - evaluation
  - dataset_creation
people:
  - "[[Till Poppels]]"
linear_tickets:
  - I18-23
---

## Overview

- [Project document](https://docs.google.com/document/d/1fbJdnp0lKzoe3Kdkpxjf3rYuDDT2NazRx0O_x6QbKEs/edit?usp=sharing)

## Annotation

Get 1k **general conversational** gold transcripts and 1k **entity-heavy utterances** from human annotators.

### Sampling

- **Most important constraint:** Only consider audio with visitor/agent channel separation
- Ensure representativeness with embedding-based sampling (e.g. BERT embeddings from transcripts)
- Remove **unflagged duplicates**
- Sample entity-heavy utterances using noisy ASR transcript $\mapsto$ LLM judge NER pipeline, then pass on to human annotators for correction.
- Sample **entire conversations** rather than individual messages (consider conversation length: ensure proper diversity)

### Existing guidelines

- [English ASR guidelines](https://docs.google.com/document/d/1dD_E311YSIhVd0qi41ObV95k6LXSyz-8Ef0kdrMQLo8/edit?tab=t.0#heading=h.3o56q58myjls)
	- Annotators instructed to define ground truth **verbatim** (including fillers, repetitions etc.) but ASR often trained to omit disfluencies: potential source of artificial WER inflation?
	- Existing guide is engineer-facing. Who are the target annotators?
- **Desideratum:** "Message-level timestamps included from start"
	- Audio is convo-level, but message level timestamps from ASR are included.
	- ==Q: How much do we trust timestamps? Enc-Dec ASR timestamps can be super spotty==
### NER subtask

- Annotation question:
	- English test set already had ground truth: did ground truth include **entity labels?**
	- ~~[brat](https://brat.nlplab.org/) for annotation? Mention to Speechlab?~~
- Till's response:
	- LLM judge got 98% F1 on English set, so **not prioritizing** human labels for NER, instead focus on **iterative prompt engineering** for LLM judge

## Data

[Overview spreadsheet](https://docs.google.com/spreadsheets/d/1XJVL_Hi2j7eLmiWW78Z9lXmgr5FsvHmX_09dh1zizOY/edit)

### Customers

| Customer            | Internal id   | Cluster         | Profile    | Vertical                                                     |
| ------------------- | ------------- | --------------- | ---------- | ------------------------------------------------------------ |
| Monitronix (Brinks) | brinks        | voice-prod      | care-voice | Home security systems; lots of troubleshooting calls         |
| Snap Finance        | snapfinance   | us-west-2-proed | us-west-2  | Financial services; lending, collections, etc.               |
| Spirit Airlines     | spirit        | us-east-1-prod  | us-east-1  | Airline                                                      |
| Royal Caribbean     | rcg           | us-east-1-prod  | us-east-1  | Cruises (one of the 3 largest providers worldwide)           |
| Guitar Center       | guitar-center | us-east-1-prod  | us-east-1  | guitars & music equipment, lots of consulting & sales convos |


## Action items

- Review Till's LLM judge pipeline for translation naturalness (esp. how it's applied internally)
- Review [Qinbang's review of English ASR test results](https://coda.io/d/Voice-AI-Infra-Voice-Integration-Team-Hub_dNf1mdnopCe/VOIP-5029-Nova-3-English-STT-Baseline-Phase-1-Report_su4FQdqN#_lur-S0Pq)

## Work log

### 31 Jul 2026

- Provisioned Spanish ASR data to contractors
- Initial training of Spanish contractors