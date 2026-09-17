---
taskwarrior: 66c07e5f-7e4f-47c8-807d-44d240a23f60
linear: VOIP-5937
url: "https://linear.app/cresta/issue/VOIP-5937/compare-human-vs-llm-error-spotting"
title: "VOIP-5937 Compare human vs LLM error spotting"
---

## Linear description

**Why**

* Smoke-test ASR error taxonomy
* Calibrate expectations for what errors can be recognized w/o GT

**Definition of Done**

- [ ] 6 human & LLM annotated convos (3 English, 3 Spanish)
- [ ] Compare error flags to ASR/GT diff (prec, recall, patterns in what errors are recalled or missed)

## Scoring

As this is a detection problem, evaluate results using precision and recall against GT WER.
If a confidence score is output, also have option to tune ROC and mAP.

Every detected and underlying error is a *span of words*.
So we can define agreement as the exact overlap in words *or* the number of overlapping spans
By the second metric, a detected error is a TP iff some word is shared with an underlying error span, and a FP iff no word in the detected span overlaps with an underlying error span.
Likewise an underlying error span is a missed detection iff no detected/predicted error span overlaps with it.

## LLM judge iteration

### False positives

- VAD failure: Remove from LLM prompt entirely, later down the road rely on deterministic and non-LLM checks.
- Redaction: Instruct LLM to not correct redaction tags
- Over-aggressive grammar correction
    - "[AGENT:] La puedes esperar dos minutos..." LLM incorrectly assumes GT should be 1st person "Le puedo" b.c. agent is waiting for visitor.
    - "[AGENT:] A mí me gustas también las de Pro..." LLM identifies a likely grammatical correction gustas > gustan but the GT audio does contain "gustas." Zooming out, this is probably too small of an error (if it were indeed an error) to raise a flag, should calibrate prompt for severity
    - "[AGENT:] Que empezó por [BANK ACCOUNT]" LLM mistakenly corrects empezó > empieza. Maybe treat "grammatical / conjugation error" as a separate category set to a lower priority than other ASR errors
    - "[AGENT:] ...también al al presupuesto, ¿no?" LLM mistakenly labels "al al" as a stutter, calibrate prompt to only flag true model stutters which many times more egregious in length than human stutters. Occurs later with "siempre siempre" and "algo que que sea"
    - "[VISITOR:] ¿O cómo funcion eso?" LLM incorrectly changes cómo > como even though an accent is required in a question word.
    - "[AGENT:] Ahora, mucho gusto Hector" LLM incorrectly changes ahora > hola, but correctly identifies that "ahora" is a misrecognition (GT is "bueno")
    - "[AGENT:] Su hijo está empezando ahora solamente como clases?" LLM identifies a plausible change "como > toma / con" but GT does have "como", this is another symptom of hyper-grammaticalism
    - A few small corrections of prepositions/function words (o > a, a > de, que > lo que)
    - "del del los el" LLM flags as "ASR stutter or severe disfluency", but this kind of disfluency is common in natural conversation and should not trigger an error flag.
    - Likewise with "no me no me no me no me..."
    - "[AGENT:] OK, permítame verificar algo aquí. Son." LLM overaggressively tags "Son" as a non-sequitur, but this is the kind of false start that occurs frequently in natural language conversations.
    - "[AGENT:] ¿Qué código estaba utilizando Penélope?" LLM overaggressively normalizes to "en el panel" when "Penélope" is recoverable from conversation context as the visitors keyphrase.


## Work log

### 15 Sep 2026

Iterate on LLM judge prompt. Start by documenting false positives and dividing into taxonomy.

## Next steps

- [ ] Add batched inference
- [ ] Get WER agreement across multiple models & batch sizes
- [ ] Annotate dev set
