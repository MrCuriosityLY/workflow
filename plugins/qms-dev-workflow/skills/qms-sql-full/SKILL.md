---
name: qms-sql-full
description: Use when QMS SQL changes are created or modified under qms-lab-manage/src/main/resources/sql, including V1.0.x scripts, table DDL, dictionary data, migration scripts, _build_init.py, or full.sql synchronization.
---

# QMS SQL And full.sql

## Rule

Every SQL change that affects an empty database terminal state must be reflected in `full.sql`.

Paths:

- SQL directory: `qms-lab-manage/src/main/resources/sql/`
- Incremental scripts: `V1.0.x_*.sql`
- Full initialization output: `full.sql`
- Builder: `_build_init.py`

## Change Flow

1. Create or edit the incremental script for existing database upgrades.
2. Update terminal source SQL files for empty database state:
   - tables: `V1.0.0_qc_tables.sql` or the relevant DDL source,
   - dictionary data: `V1.0.1_qc_dict.sql`, `V1.0.2_qc_lab_dict.sql`, or relevant source,
   - Excel i18n: `V1.0.7_qc_plan_excel_i18n.sql`,
   - demo data: `V1.0.14_qc_demo_data.sql`.
3. Update `_build_init.py` if merge sources or historical scripts change.
4. Run:

```bash
python qms-lab-manage/src/main/resources/sql/_build_init.py
```

5. Verify `full.sql` contains the terminal result.

## Scenario Matrix

| Change | Incremental script | Terminal source | Rebuild full.sql |
| --- | --- | --- | --- |
| new table/field needed by empty DB | optional | yes | yes |
| existing DB data migration only | yes | no | only if terminal DDL/data changed |
| dictionary addition/change | yes | yes | yes |
| demo data | edit demo source | yes | yes |

## Prohibited

- Do not submit only `V1.0.x_*.sql` when empty DB state changes.
- Do not manually edit `full.sql` without updating source files.
- Do not replace `REPLACE_ME_DICT_ROOT_PARENT_ID` with real IDs in committed SQL.
