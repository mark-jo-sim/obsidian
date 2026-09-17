---
type: meeting
people:
  - "[[Justine Liang]]"
  - "[[Nicole Erickson]]"
date: 2026-06-10T09:00:00
---
## Background

**External observability** aimed at procurement, not product differentiation.
Goal is *happy CIO* for client companies.

- Customer-facing metrics
- Admin change logs
- Per-call recording assurance

## Outside of scope

- **AI Agent observability** through [[Langfuse]]
- **Internal observability:** engineering, ops, internal dashboards
- **Customer-facing central error log**
- **Real-time SIEM streaming**

## Differentiation

Observability pipelines already exist.
Gap is three key points:

- Customer-facing **operational metrics** (what's meant by this? more than uptime/throughput?)
- **Admin change logs** (not sure what's meant here)
- **Recording assurance** (i.e. clients have easy access to recorded calls?)

## User journey

- Metrics exposed to client via `/metrics` endpoint in OpenTelemetry pipeline
- Track whenever a config is modified by Cresta staff or client admin via `HistoryEntry`
	- Don't log everything: follow priority ladder
- Per-call recording assurance
	- Capture through [[SIPREC]] or local media
	- Log reason for exception if a recording is not saved
	- $\Rightarrow$ *explicitly* catch missed recordings

## Cross-functional dependencies

- **Customer-facing metrics:**
	- [[Daniel Hoske]]
- **Admin change log:**
	- Core platform team
	- Built on existing `HistoryEntry` infra
- **Per-call recording assurance:**
	- Voice platform team

## Core requirements


- **Customer-facing metrics:**
	- Only provide access *when customer asks*
	- Phase 1
		- Calls connected
		- Calls being transcribed
		- Calls ended
		- Calls missed / not connected
		- Burger webhook status
		- Burger webhook latency
	- Future metrics to be negotiated with clients
	- Metrics decided on per-client basis
- **Admin logs:**
	- P1:
		- **Actor-type discrimination:** who did it (role name, not exact username)
		- **OAuth client:** lifecycle data, don't store actual secret
		- **Integration config changes:** capture what changed when and by whom, *not* meant to enable reversion or provide comprehensive version history
		- **Job schedule and execution events:** capture admin actions around job scheduling and ad-hoc job runs
		- **Config changes broadly:** *config-as-data*
	- P2:
		- Feature-specific config changes
	- **Access and sensitivity:**
		- Restrict who has access to logs
		- Full config diffs used only when safe
- **Per-call recording assurance:**
	- Cresta-owned recording outcome detection