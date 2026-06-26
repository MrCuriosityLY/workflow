# QMS Development Workflow

Use this workflow for QMS lab/control development work in any agent environment.
It is intentionally plain Markdown so Codex, Claude Code, Gemini CLI, Copilot,
Cursor, and other coding agents can all read the same instructions.

## When To Use

Use this workflow when the task involves:

- QMS or lab-control requirements, features, fixes, or reviews.
- Java/Spring/MyBatis-Plus implementation work.
- OpenSpec-style proposals, tasks, designs, or spec deltas.
- SQL migration changes or `full.sql` synchronization.
- Verification, delivery checks, or regression fixes.

## Operating Rules

1. Read the repository guidance first: `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`,
   `.github/copilot-instructions.md`, and any nearer nested instruction files
   that exist in the target repository.
2. Keep changes scoped to the requested QMS workflow and the existing project
   conventions.
3. Prefer a specification-first path for non-trivial behavior changes.
4. Use test-first development for bug fixes and behavior changes when the target
   project has a usable test setup.
5. Never invent fake validation. If a command cannot run, report the exact
   blocker and what evidence was collected.
6. Preserve user changes. Do not revert unrelated files.

## Workflow Stages

### 1. Research

- Inspect the relevant modules, schemas, migrations, tests, and existing
  examples.
- Identify project conventions before proposing new structure.
- Note affected business rules, data flow, permissions, and SQL implications.

### 2. Analyze

- Restate the requirement in concrete terms.
- List assumptions and open questions.
- Identify affected modules, API contracts, database tables, tests, and rollout
  risks.

### 3. Specify

- For substantial changes, create or update an OpenSpec-style change using
  `qms-openspec.md`.
- Keep proposals, task lists, and spec deltas small enough to review.
- Confirm acceptance criteria before implementation when requirements are
  ambiguous.

### 4. Design

- Define the API, service, persistence, validation, and migration boundaries.
- Follow existing architecture and naming conventions.
- Avoid broad refactors unless they are necessary for the requested change.

### 5. Develop

- Implement the smallest behavior slice that satisfies the accepted design.
- Add or update tests near the changed behavior.
- For SQL changes, follow `qms-sql-full.md`.

### 6. Verify

- Run the narrowest relevant tests first, then broader checks when the change
  crosses module boundaries.
- Verify migrations and generated SQL artifacts when SQL changed.
- Report exact commands and outcomes.

### 7. Deliver

- Summarize behavior changes, files touched, tests run, and remaining risks.
- Call out skipped validation with the exact reason.

## Invocation Examples

Agents may invoke this workflow naturally:

```text
Use the QMS development workflow to analyze this requirement and prepare a spec.
```

```text
Follow the QMS workflow, implement the confirmed design, update tests, and verify.
```

For explicit sub-workflows, use:

- `qms-openspec.md` for proposal/spec lifecycle work.
- `qms-sql-full.md` for SQL migration and `full.sql` synchronization.
