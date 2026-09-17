---
tags:
  - named_entity_recognition
  - asr
  - call_center_asr
author:
  - Sam Davidson
  - Jordan Hosier
  - Yu Zhou
  - Vijay K Gurbani
year: 2021
journal: WNUT 2021 proceedings
---
## Abstract

Goal is to perform NER in order to redact PII.
Existing BiLSTM NER model (with Flair embeddings as input) too expensive for production.
Propose high-compute RoBERTa model for offline labeling, low-compute BiLSTM-CRF finetuned on RoBERTA labels using "fixed pre-trained subword embeddings" (**model??**).

## Problem definition

Call center transcripts contain sensitive PII which can be hard to spot given noisy ASR models.

Traditional NER systems:
- Trained on cleaner data and smaller entity label sets.
- Lack phone number, account number, email etc. as category

## Annotation scheme

### Validation

- Iteratively revise annotation guideline until two annotators reached Krippendorf's $\alpha=0.80$.
- Final agreement was $\alpha=0.875$.
- Also calculate $\mathrm{F1}$-score between annotators
	- **Strict $\mathbf{F1}$:** Exact match in entity type and constituent words
	- **Partial overlap $\mathbf{F1}$:**  Match in entity type, partial overlap in constituent words

### Guidelines

| Entity label | Description                                                                  |
| ------------ | ---------------------------------------------------------------------------- |
| Person       | Name of a person, incl. titles and spelled names                             |
| Location     | Political divisions (country, city, etc.) and addresses                      |
| Organization | Name of company, store, website, service group etc.                          |
| DateTime     | Date, time of day/week, time duration (excl. card exp dates or customer DOB) |
| Product      | Named products (generic items excluded)                                      |
| Account      | Credit card, account, order numbers , expiration dates, CVV codes            |
| ID           | DL, SSN, member #, merchan #, DOB                                            |
| Phone        | Complete or partial phone #                                                  |
| Email        | Complete or partial email address                                            |
| Currency     | Dollar amounts                                                               |

### Challenges

- Emails not reliably recovered (strict and partial $\mathrm{F1}$ both 0.46)
- Phone, ID & account: id type reliable, disagree on boundaries

## Look into

- CoNLL 2003 BIO format for NER
- https://brat.nlplab.org/
- Krippendorf's $\alpha$