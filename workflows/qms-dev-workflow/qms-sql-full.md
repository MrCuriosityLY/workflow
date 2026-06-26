# QMS SQL and full.sql Synchronization

Use this workflow whenever a QMS change touches SQL migrations, seed data,
database views, stored procedures, or `full.sql`.

## Rule

Any migration or SQL artifact change that affects the final schema or seed state
must be reflected in `full.sql` when the target repository maintains that file.

## Process

1. Identify the migration or SQL file being changed.
2. Determine whether the change affects schema, indexes, constraints, views,
   procedures, permissions, or seed/reference data.
3. Update the migration first.
4. Update `full.sql` to represent the final database state after all migrations.
5. Verify the migration and `full.sql` describe the same final structure.
6. Run the repository's SQL or integration validation commands when available.

## Checks

- New tables, columns, indexes, constraints, and comments exist in both the
  migration path and `full.sql`.
- Renames and drops are represented in final-state form in `full.sql`.
- Seed/reference data changes are included when `full.sql` contains seed data.
- Ordering remains valid for foreign keys and dependent objects.
- Character set, collation, and engine conventions match the repository.

## Reporting

When delivering SQL work, report:

- Migration files changed.
- Whether `full.sql` changed.
- Validation commands run.
- Any SQL validation that could not be run and why.
