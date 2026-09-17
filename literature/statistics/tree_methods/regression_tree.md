---
type: statistical_model
tags:
  - regression
  - decision_trees
---
## Overview

In order to use a decision tree to predict a continuous output, bin the output space into buckets with minimum variance and predict, for some unseen input, the average outcome for the corresponding group of training data. 

## Training

Given some feature, pick a threshold value such that the variance of data above and below the threshold is minimized. 