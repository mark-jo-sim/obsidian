---
taskwarrior: 5c78ba66-a115-4eb3-9319-7d560236e830
linear: VOIP-5937
url: "https://linear.app/cresta/issue/VOIP-5937/compare-human-vs-llm-error-spotting"
title: "partition data for experiment"
---

## Overview

Need to decide on what portion of data should be human-annotated, LLM-only or HITL-annotated.

## Data size

Spanish dataset:

- 43 convos
- 6180 sentences
- Avg 144 sentences per convo

English dataset:

- 219 convos
- 31117 sentences
- Avg 142 sentences per convo

## Split strategy

For initial PoC, all conversations can be LLM-annotated.
Goal is descriptive metrics + agreement with GT WER, not human agreement yet.
Set aside 20% of convos for human annotation to track LLM-human agreement later.
Use this split for hyperparam tuning as well.
