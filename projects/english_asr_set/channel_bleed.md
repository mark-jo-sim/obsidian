---
type: task
project: "[[english_asr_test_data]]"
tags:
  - audio
  - audio_channels
  - dataset_creation
linear_tickets:
  - VOIP-5631
coda_docs:
  - https://docs.superhuman.com/d/_dNk4SsJHuO0/VOIP-5631-English-STT-test-set-message-alignment-and-channel-ble_suJgGKPr
---
## Context

For audio QA, detect whether audio bleeds over between channels. Fully bled audio may invalidate GT message transcript, whereas partial bleed (i.e. cross-channel lower amplitude than same-channel) is acceptable.

IVR: Interactive voice response

## Channel bleed detection pipeline

From Qinbang:

>  Hi Mark — good catch. The code isn't committed; `ivr_cut_ranges.csv` is a one-off artifact \(only the CSV was kept\).
> 
> Despite the name, it's a *cross-channel bleed cut-list, not IVR prompts*: 238 rows, 220 runs / 49 min are `BLEED` \(one speaker's audio leaking onto the other channel — exactly the effect you described\), only \~1 min is genuine `IVR_OPENING`.
> 
> Detection: take aligned Nova-3 batch output \(word-level timestamps per channel\) → find structural runs >8 words \(long insert/delete runs = bleed/IVR/media\) → extract `[start,end]` + speaker + text on the receiving channel → classify \(BLEED / IVR\_OPENING / MEDIA / OTHER\). Each bleed run is a pure insertion, so muting `[start–end]` on that channel is safe. Per-call artifact-fraction >2% → the 22 contaminated calls excluded → 201-call CLEAN set. Full method's in the Phase 1.6 report.

**Question:** How is `BLEED/IVR_OPENING/MEDIA/OTHER` classification handled?

## Modifications to existing code

[[2026-07-22#Alignment iteration pseudocode]]

- For each message, identify all *alignment spans* contained within
- Compute ground truth WER with and without inserted or deleted spans
- For each inserted span, identify the most similar message from the *opposite channel* using substring matching

## Work log

### 30 Jul 2026

- Vibe-coded tool for visualizing message alignment between split & combined ASR runs
- Began annotating instances of insertions

### 31 Jul 2026

 - Finished annotating insertions
 - Annotated part of deletions
 - Added visualizations for count of edit span length across dataset