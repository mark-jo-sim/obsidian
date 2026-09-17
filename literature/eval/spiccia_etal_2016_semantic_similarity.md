---
tags:
  - asr
  - evaluation
  - metrics
  - semantic_embeddings
author:
  - Carmelo Spiccia
  - Agnese Augello
  - Giovanni Pilato
  - Giorgio Vassalo
year: 2016
journal: IEEE Tenth International Conference on Semantic Computing
---
## Abstract



## Problem definition

SOTA sentence comparison methods either don't take into account semantics or don't take into account word order.

## Background


## Dataset

Document + paraphrase pairs.

## Model

Levenshtein edit distance with substitutions weighted by cosine distance across word pair.
Embeddings computed using SVD of word/doc frequency matrix.

## Results

Very slight improvement over LSA, underperforms TF-KLD + FFN by a lot.

## Look into

