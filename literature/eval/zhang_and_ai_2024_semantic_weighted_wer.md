---
tags:
  - asr
  - evaluation
  - semantic_embeddings
  - metrics
author:
  - Yutao Zhang
  - Jun Ai
year: 2024
journal: 11th International Conference on Dependable Systems and Their Applications
---
## Abstract


## Problem definition


## Background


## Dataset


## Model

Weight each word in a sentence by the cosine similarity between it's word embedding with the `[CLS]` embedding for the sentence, then compute WER where each edit is the weight of the word inserted/deleted/substituted (for substitutions use the weight of the reference word).

## Results


## Look into

