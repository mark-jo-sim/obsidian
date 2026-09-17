---
taskwarrior: c8e3e367-b6e0-4bc8-a947-d2a94f7003ce
linear: VOIP-5819
url: "https://linear.app/cresta/issue/VOIP-5819/create-spanish-test-set-for-asr-eval"
title: "correct spelling"
---

## Overview

Ensure all words in Spanish dataset conform to standard es-MX spelling. Use LLM judge for spell correction.
Use `[partial: wo] word` to flag subword stutters.

## Requires attention

- 019ca2d9-1030-75fb-bd8b-5b31e517d1: Message "Message Visitor[background:]" missed "##" prefix and got inserted into agent message, fix manually.
