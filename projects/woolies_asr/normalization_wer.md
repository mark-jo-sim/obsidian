---
type: task
project:
  - "[[woolies_asr]]"
linear_tickets:
  - VOIP-6067
---
## Why

Deepgram and 11labs are closely tied on Woolie's ASR dataset. To obtain a more reliable signal, compute WER with several ad-hoc normalization steps applied to transcript to understand better what types of errors make up the gap.

## Scope and methods

### Normalization steps

- Remove stop words
	- Fillers (uh, uhm, ah, ...)
- Merge (near)-equivalent words
	- Yeah/yep/yup/yes -> yes
	- Ok/okay -> ok

## Results

TBD

## Code notes

Main question: How to get single report comparing cross-vendor WER under all normalization options?

- Get normalization run with `scripts/generate_comparison_html.py --generate --runs-dir data/wer_runs --norm-spec $norm`
- Norm pipeline:
	- `en_aggressive` (`nfkc`, `lowercase`, `remove_fillers`, `en_numeral_canon`, `strip_all_punct_symbols`, `collapse_whitespace`)
	- Then follow by one of:
		- `ize_to_ise`
		- `merge_yes`
		- `merge_alright`
		- `merge_ok`
		- `merge_byebye`
		- `merge_oclock`
		- `merge_want_to`
		- `merge_got_to`
		- `merge_going_to`
		- `stopword_fillers`
- Get WER results from JSON:
	- Each WER run has a JSON file in `data/wer_runs`
	- Aggregate WER stored in `.aggregate.$vendor.(corrected|second_pass).(music|nomusic).(raw|norm).(micro|macro|stdev)`