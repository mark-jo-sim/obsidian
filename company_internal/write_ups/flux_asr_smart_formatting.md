---
type: internal_writeup
people:
  - "[[Kris Diallo]]"
tags:
  - deepgram
  - flux
  - smart_formatting
---
## Overview

- Deepgram Flux failing on *recognition* errors, not formatting errors
- Overaggressive formatting (esp. $o\mapsto0$) *hurt* more than helped
- Prioritize closing recognition gaps first, leave formatting to LLM prompt
- One low-hanging fruit for formatting: "then N zeros" (or equivalent) $\mapsto0000\ldots$ rather than literal sentence.