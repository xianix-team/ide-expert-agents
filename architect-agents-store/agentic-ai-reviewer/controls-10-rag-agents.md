## Checklist: RAG Agents

- **Module ID:** rag-agents
- **Applies when:** A vector store / retrieval pipeline is present (embeddings, vector DB, retriever, or reranker).
- **Applies in addition to:** Generic Baseline
- **Controls:** 20 (8 Automatable, 12 Partial, 0 Manual)

| # | Dimension | Control | Severity | Automation | How to check |
|---|---|---|---|---|---|
| 1 | Ingestion & Indexing | Source documents are cleaned, deduplicated, and parsed correctly (tables, layout, scans). | High | Partial | Inspect ingestion pipeline for clean/dedup/parse; parse quality needs sampling. |
| 2 | Ingestion & Indexing | Chunking strategy (size/overlap) respects semantic boundaries and is tuned, not default. | High | Partial | Inspect chunk size/overlap config; 'tuned' confirmed via eval. |
| 3 | Ingestion & Indexing | Embedding model fits the domain and language (e.g., Norwegian/English content). | High | Partial | Config shows embedding model; domain/language fit needs benchmark. |
| 4 | Ingestion & Indexing | Vector index type, metadata fields, and namespaces are appropriate to the query patterns. | Medium | Automatable | Inspect index type, metadata fields, namespaces vs query code. |
| 5 | Ingestion & Indexing | Knowledge base is re-indexed on source change; staleness is bounded with an SLA. | High | Partial | Inspect reindex jobs/triggers; staleness SLA is a documented target. |
| 6 | Retrieval Quality | Top-k retrieval precision/recall is measured on a labelled query set. | Critical | Partial | Detect retrieval eval harness; needs a labelled query set to run. |
| 7 | Retrieval Quality | Semantic reranking is applied to improve precision and trim context tokens. | Medium | Automatable | Inspect pipeline for a reranker stage. |
| 8 | Retrieval Quality | Hybrid (keyword + vector) search is used where exact matches matter (IDs, invoice numbers). | Medium | Automatable | Inspect retrieval for hybrid keyword+vector. |
| 9 | Retrieval Quality | Irrelevant chunks are filtered (relevance threshold) before generation. | High | Automatable | Inspect for relevance-threshold filtering pre-generation. |
| 10 | Retrieval Quality | Conflicting sources are resolved by a defined precedence (recency/authority). | Medium | Automatable | Inspect for source-precedence / conflict-resolution logic. |
| 11 | Generation Fidelity | Answer groundedness/faithfulness to retrieved context is measured (e.g., RAGAS-style). | Critical | Partial | Detect RAGAS/faithfulness eval; run if a dataset is present. |
| 12 | Generation Fidelity | Responses cite sources so users can verify claims. | High | Automatable | Inspect generation/prompt for source citations. |
| 13 | Generation Fidelity | The agent abstains or escalates when retrieval is empty or low-confidence. | Critical | Automatable | Inspect for abstain/escalate on empty/low-confidence retrieval. |
| 14 | Security & Access | Retrieval respects per-user/tenant document permissions (entitlement-aware). | Critical | Partial | Inspect for entitlement-aware retrieval filter; correctness needs test. |
| 15 | Security & Access | No PII/restricted chunks are retrievable beyond a user's entitlement. | Critical | Partial | Inspect chunk-level ACL/metadata; over-exposure confirmed by test. |
| 16 | Security & Access | Indirect prompt injection via poisoned source documents is defended and tested. | Critical | Partial | Detect injection isolation & tests on KB content; live test is manual. |
| 17 | Evaluation | RAG metrics (faithfulness, answer relevance, context precision/recall) are tracked over time. | High | Partial | Detect over-time RAG-metric tracking/CI. |
| 18 | Evaluation | Query/document language mismatch is handled for multilingual content. | Medium | Partial | Inspect for query/document language handling; recall impact needs test. |
| 19 | Retrieval Quality | Retrieval latency, cost, and scalability are within a defined budget and load-tested on the full corpus (large document sets). | High | Partial | Detect perf/load tests & budgets; the actual load test is a run. |
| 20 | Generation Fidelity | When retrieved knowledge is combined with live/tool data, conflicts are reconciled by a defined precedence and the fused result is validated/type-checked before use. | High | Automatable | Inspect RAG+live-data fusion for precedence + type-check. |

