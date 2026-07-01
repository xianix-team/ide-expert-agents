## Framework module: Record Keeping And Logging

- **Module ID:** record-keeping-and-logging
- **Applies when:** The system is high-risk. Also strongly recommended for any agent taking actions.
- **Primary regime:** EU AI Act (mapped to ISO/IEC 42001 Annex A and NIST AI RMF)
- **Controls:** 3 (2 Automatable, 1 Partial, 0 Manual)

| # | Requirement (control question) | EU AI Act | ISO/IEC 42001 | NIST AI RMF | Severity | Automation | How to check |
|---|---|---|---|---|---|---|---|
| 1 | Events are automatically recorded (logging) over the system's lifetime. | Art 12(1) | A.6.2 | MEASURE 3; MANAGE 4 | Critical | Automatable | Inspect for logging of inputs, decisions, tool calls, and timestamps. |
| 2 | Logging provides traceability appropriate to purpose (period of use, reference data, input data, persons involved in verification). | Art 12(2)-(3) | A.6.2 | MEASURE 3 | High | Automatable | Check end-to-end trace coverage intent to retrieval to tool calls to output, with correlation IDs. |
| 3 | Logs are retained appropriately and are tamper-evident. | Art 12; Art 19 | A.6 | MANAGE 4 | High | Partial | Inspect retention config and immutability; actual retention is confirmed at runtime. |

