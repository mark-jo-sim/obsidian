---
taskwarrior: fd571f72-76f6-46a8-b7b0-c42b1fb9ae6c
linear: VOIP-5819
url: "https://linear.app/cresta/issue/VOIP-5819/create-spanish-test-set-for-asr-eval"
title: "inspect ambiguous channel calls"
---

## Overview

LLM sanity check on channel probe reported 3 ambiguous calls, namely:

- 019de0c9 (Snapfinance): agent 0, visitor 1, lots of echo
- 019f1aaf (Brinks): agent 0, visitor 1, visitor channel is just recorded audio and is super garbled
- 019f1af7 (Brinks): Single pre-recorded English sentence, drop from dataset

And 5 calls that reversed channel0=agent, channel1=visitor (all Guitar center): 

- "019ca2d9-0fb4-7aac-9ba5-04a5e424d814": confirmed
- "019ca2d9-1000-78f6-b80d-20ad5547dcc3": confirmed
- "019ca2d9-1030-75fb-bd8b-5b31e5179fd1": confirmed
- "019ca7fe-ecf1-7137-a26a-1c0d9620871b": confirmed
- "019ca7fe-ecf4-737b-8213-f4358663f8dd": confirmed
