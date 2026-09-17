Database for product telemetry, analytics
- Former postgres system had excessive latency
- Postgres still main source of truth, some queries offloaded to Clickhouse

Clickhouse reads **one column** at a time.

Principle of **eventual consistency:** data propagates from postgres to clickhouse to elasticsearch.