# QMS Verification

Use before delivery and whenever a task changes shared behavior.

## Baseline Commands

From repository root:

```bash
mvn -pl qms-lab-manage -am compile
```

For broader changes:

```bash
mvn clean compile
```

If tests exist or are added:

```bash
mvn test
```

## SQL Verification

When SQL changes:

```bash
python qms-lab-manage/src/main/resources/sql/_build_init.py
```

Then inspect:

- changed increment script,
- changed terminal source script,
- regenerated `full.sql`,
- optional SQL README/version table if present.

## Manual Checks

- Affected imports resolve.
- Method calls match actual signatures.
- Entity field names and types match actual definitions.
- DTO/VO fields match API expectations.
- Controller routes do not conflict with existing routes.
- Workflow business keys and node paths match existing conventions.

## Delivery Wording

Report:

- files changed,
- verification commands and result,
- unverified areas or environment blockers,
- any memory/spec updates.
