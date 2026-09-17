---
tags:
  - call_center_asr
  - named_entity_recognition
author:
  - Sihyoung Jurn
  - Wooje Kim
year: 2025
journal: electronics
---
## Abstract

Improve classification of call center conversations in Korean using data augmentation based on meta-information from NER output.
## Problem definition

Call center data tends to have a heavily imbalanced distribution towards a small subset of categories.
[[shou_etal_2022_data_augmentation_abstract_meaning_representation]] proposes using AMR semantic graphs for data augmentation, but this requires an existing AMR model, not present for Korean.

## Background


## Dataset

NER tags used:

- **PS:** Person
- **LC:** Location
- **OG:** Organization
- **DT:** Date
- **TT:** Time
- **QT:** Quantity
- **AF:** Artifact
- **CV:** Culture
- **TM:** Term
## Model

Perform NER on call-center transcripts with KoBERT (Korean BERT), ==perform data augmentation how?==
## Look into

