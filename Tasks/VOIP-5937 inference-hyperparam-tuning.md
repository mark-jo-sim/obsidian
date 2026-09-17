---
taskwarrior: bf23bcca-3f92-4d6a-8a49-e1f8a3476a1e
linear: VOIP-5937
url: "https://linear.app/cresta/issue/VOIP-5937/compare-human-vs-llm-error-spotting"
title: "inference hyperparam tuning" 
---

## Overview

Settle on hyperparams that control inference behavior.

## Batching logic

Compare full convo vs. *n*-sentences.

## Messages > sentences

Former logic grouped sentences into messages and then iterated over those.
This doesn't work for the English dataset, which doesn't have message indices.

The function `get_message_detection` needs to be changed to `get_sentence_detection` and needs to accept either a single sentence or a batch of sentences.
Since `convo_rows` is already passed as an arg, ideal behavior is to replace `target` with an integer index rather than a dict.
Or it could be a `list[int]` of indices, that way the caller is the one handling batch logic.
Also replace the `for sentence in remaining` for loop with a `while len(remaining)` loop.
Then `remaining` is a set of indices rather than a dataframe.
At each iteration of the while loop, pop the smallest index and then all subsequent `batch_size` indices.

One problem is that the English dataset does not have relative timing between the two roles, since hypotheses are generated per-channel.
It seems like doing inference on messages in the order they appear in the conversation is ideal because that mirrors most closely the use case that will be applied in production.
If so, we might just want to use Deepgram on the audio directly rather than pulling eval results from SpeechLab.
But that raises the question of how to map sentences from each role to its channel if we're doing inference on stereo audio.
Just apply `align_reference_to_transcript`?

Trying to recover the sentence ordering from ground truth will be too complicated, but what we can do is use the pre-existing message ordering from the source S3 bucket and reuse code from the English resampling project.


## Models

Compare Gemini pro and gpt-4o-mini.
Other models available are...?
