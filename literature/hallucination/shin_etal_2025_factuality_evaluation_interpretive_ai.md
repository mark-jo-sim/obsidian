---
tags:
  - hallucination
  - llm
  - call_center_asr
author:
  - Hagyeong Shin
  - "[[Binoy Robin Dalal]]"
  - "[[Iwona Bialynicka-Birula]]"
  - "[[Navjot Matharu]]"
  - "[[Ryan Muir]]"
  - "[[Xingwei Yang]]"
  - "[[Samuel W. K. Wong]]"
year: 2025
conference: Agentic & GenAI Evaluation KDD
---
## Abstract

Call center transcripts lack ground truth for classification of sentiment, call type, etc. raising problem for evaluating LLM hallucination.
Propose **Decompose, Decouple, Detach** (3D) human annotation scheme and **Factuality Evaluation of Interpretive AI-Generated Claims in Contact Center Conversaiton Transcripts** (FECT) benchmark for eval.

## Problem definition

"Traditional" hallucination detection concerns objective facts: AI analyst produces *subjective analysis* of customer conversations.
## Background


## Dataset

### Human annotation

Annotate conversation, LLM claim pair for factual correctness.
Use **3D** paradigm (from linguistic semantics):

- **Decompose:** Annotator splits claim into *minimal informational units*, e.g. "The customer chose the plan for specific dentist coverage" $\mapsto$ `["customer", "chose", "plan", "specific", "dentist coverage"]`
- **Decouple:** Separate *concrete* words (`["customer", "plan", "dentist coverage"]`) from *subjective* `["chose", "(specfically) for"]`
- **Detach:**

Operationalized in *4-step process*:

1. Verify concrete words in claim with mentions in conversation (decompose, decouple).
2. Verify words *modifying* concrete words with evidence from conversation (decompose, decouple).
3. Verify words about subjective interpretations pertaining to *entire conversation*, e.g. conclusions about customer sentiment, inference about call outcomes and resolutions (decompose, decouple)
4. Verify *causal relation* asserted by claim in the conversation, beyond the word/entity meanings (detach)

Annotators then classify pair as *factual* IFF all 4 steps were verified, else *non-factual*.
## Look into

