---
name: qms-dev-flow
description: Use for qms-lab-control or QMS lab development tasks: project research, requirement analysis, OpenSpec-style proposals, design contracts, task splitting, Java/Spring/MyBatis-Plus implementation, SQL migration changes, tests, bug fixing, verification, and delivery. Trigger when the user says dev-flow, qms-dev-flow, analyze, design, develop, test, fix, OpenSpec, specification, or asks Codex to implement QMS features.
---

# QMS Dev Flow

Use this skill as the default development workflow for `qms-lab-control` and similar QMS lab-control services.

## Operating Mode

Choose the smallest mode that fits the request:

- **Research**: update or read project memory and architecture.
- **Analyze**: turn a requirement into scope, risks, affected modules, and questions.
- **Spec**: create or update an OpenSpec-style change under `.openspec/changes/`.
- **Design**: produce an implementation design and machine-readable contract.
- **Develop**: implement a confirmed design with dependency verification.
- **Test/Fix**: run focused verification, diagnose failures, and apply fixes.
- **Hotfix**: diagnose and patch a concrete error quickly, then verify.

For full-flow work, run:

`Research -> Analyze -> Spec -> Design -> Task Split -> Develop -> Test/Fix -> Delivery`

Pause after Analyze, Spec, and Design unless the user explicitly asks for direct implementation.

## First Steps

1. Read repository guidance: `AGENTS.md`, nearest nested `AGENTS.md`, and `.dev-flow/memory/` if present.
2. If project memory is missing or stale, perform Research before design.
3. If the request changes behavior or introduces a feature, use the OpenSpec-style workflow in `references/openspec-workflow.md` or invoke `$qms-openspec`.
4. If SQL under `qms-lab-manage/src/main/resources/sql/` changes, invoke `$qms-sql-full`.
5. Before writing code, read existing implementations in the affected modules.

## Context Budget

Use progressive loading:

- Read `references/project-architecture.md` for modules and boundaries.
- Read `references/code-conventions.md` before generating Java code.
- Read `references/code-patterns.md` for examples only when implementing similar code.
- Read `references/openspec-workflow.md` when creating or changing specs.
- Read `references/superpowers-practices.md` when planning, debugging, or verifying.
- Read `references/verification.md` before claiming completion.

For large tasks, write stage outputs to `.dev-flow/sessions/<session-id>/` and only keep summaries in context.

## Research

Research should produce durable project knowledge, not empty templates.

Inspect:

- root `pom.xml`, module `pom.xml` files, and application config,
- Java package structure,
- existing Entity/DTO/VO/Mapper/Service/Controller patterns,
- SQL folder structure and `full.sql` builder,
- existing `.dev-flow/memory/` and `.openspec/` folders.

Write useful results to `.dev-flow/memory/` when the repository allows it.

## Analyze

Output:

- requirement classification,
- functional points,
- affected modules and files,
- API/data model/SQL/workflow impacts,
- compatibility and migration risks,
- verification strategy,
- open questions.

If the requirement is ambiguous, ask focused questions. If a reasonable assumption is safe, state it and continue.

## Spec

For feature or behavior changes, create an OpenSpec-style change:

```text
.openspec/changes/<change-id>/
├── proposal.md
├── tasks.md
├── design.md
└── specs/<domain>/spec.md
```

Use `references/openspec-workflow.md` for required sections and lifecycle.

## Design

Design must be concrete enough for implementation:

- entities, DTOs, VOs, enums, mappers, services, controllers, Feign clients,
- request/response contracts,
- SQL migration and `full.sql` impact,
- workflow/BPM node behavior,
- validation and error handling,
- test and verification commands.

For Java entities, read actual existing entity classes before deciding getter/setter names, field types, package paths, and imports.

Write design contracts to:

```text
.dev-flow/docs/<change-id>-design-contract.yaml
```

## Develop

Implement in dependency order:

1. SQL and data model, if needed.
2. Entity/DTO/VO/Enum.
3. Mapper.
4. Converter/Support/Manager.
5. Service and workflow service.
6. Controller and Feign clients.
7. Tests and verification artifacts.

Before each code file:

- search for the existing class or closest pattern,
- read dependency class definitions,
- verify imports, method names, field types, and return types,
- record any assumptions in the session artifact.

Never generate TODO stubs, empty shells, fake tests, or `return null` placeholders.

## Test/Fix

Use systematic debugging:

1. Capture the exact failure.
2. Identify the failing layer.
3. Form one hypothesis at a time.
4. Apply a focused fix.
5. Re-run the smallest relevant verification.
6. Escalate to broader tests only after local checks pass.

Record durable lessons in `.dev-flow/memory/mistakes.md` or `.dev-flow/memory/patterns.md`.

## Delivery

Before saying work is complete:

- run the verification listed in `references/verification.md`,
- confirm SQL/full.sql sync when SQL changed,
- summarize changed files and residual risk,
- do not claim tests passed unless command output confirms it.
