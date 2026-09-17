---
taskwarrior: d1594705-9a67-4cd8-8d69-ec4c9ed62f9f
linear: VOIP-5819
url: "https://linear.app/cresta/issue/VOIP-5819/create-spanish-test-set-for-asr-eval"
title: "upload entity heavy dataset"
---

## Linear description

Sibling to [I18-11](https://linear.app/cresta/issue/I18-11/create-english-test-set-for-asr-eval) (English test set). Build a Spanish-language gold test set covering baseline WER and entities, suitable for cross-vendor STT evaluation.

Deliverable: Spreadsheet with columns

- [ ] Conversation ID
- [ ] Message ID
- [ ] Audio URL (per conversation)
- [ ] word_level_json => start/end times, DG confidence scores
- [ ] message-level audio offset
- [ ] director link
- [ ] Entities

Constraints:

- [X] 10x larger than the eventual sample size (true production distribution)
- [X] Randomly sampled, then sub-sampled uniformly across features/challenges
- [X] Restricted to customers with legal clearance for audio use
- [X] Spanish Latam priority; flag European Spanish samples separately if present

Sub-tasks:

- [X] Audit existing golden Spanish transcripts for coverage (mirror [I18-7](https://linear.app/cresta/issue/I18-7/audit-existing-golden-transcripts-wrt-languageverticalentity-coverage) for ES)
- [X] Identify candidate customers with sufficient ES message volume
- [X] Sample audio + word-level JSON from production
- [X] Seed audio transcripts across multiple ASR vendors to reduce bias. [I18-52](https://linear.app/cresta/issue/I18-52/spanish-asr-golden-dataset-asr-engine-rotation-study-design)
- [X] Native-speaker review pass for transcript correction (use [I18-10](https://linear.app/cresta/issue/I18-10/vibe-coded-internal-tool-asr-review-correction-workload-distribution) tool)
- [X] Tag entities using product-supported taxonomy (per [I18-1](https://linear.app/cresta/issue/I18-1/compile-complete-list-of-product-supported-entity-types-for-each-of))

Done = reviewed gold ES transcripts ready to consume by SpeechLab eval tooling ([VOIP-4833](https://linear.app/cresta/issue/VOIP-4833/speechlab-evaluation-tooling-metric-primitives)) for cross-vendor baseline runs.

## Local subtasks (taskwarrior only)

- [ ] Normalize numerals in entity heavy dataset
