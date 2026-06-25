# QMS Dev Workflow npm Installer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an npm-distributed installer CLI for the QMS Codex workflow plugin.

**Architecture:** Keep Codex plugin assets in `plugins/qms-dev-workflow` and add a Node.js CLI that copies those assets into either the user's Codex plugin directory or the current repository. The installer updates the corresponding `marketplace.json` and provides a `doctor` command to verify the installation.

**Tech Stack:** Node.js CommonJS, built-in `fs`, `path`, `os`, `node:test`, and `assert`.

## Global Constraints

- Do not depend on third-party npm packages.
- Keep installer paths cross-platform.
- Do not overwrite unrelated marketplace entries.
- Keep global install target under `~/.codex/plugins/qms-dev-workflow`.
- Keep global marketplace under `~/.agents/plugins/marketplace.json`.
- Keep project install target under `./plugins/qms-dev-workflow`.
- Keep project marketplace under `./.agents/plugins/marketplace.json`.

---

### Task 1: Add Installer Tests

**Files:**
- Create: `package.json`
- Create: `test/install.test.js`

**Interfaces:**
- Consumes: missing `lib/install.js`.
- Produces: expected exported functions `installGlobal(options)`, `installProject(options)`, `doctor(options)`, and `resolveTargets(options)`.

- [ ] **Step 1: Add tests for global install, project init, and doctor**

Test behavior:

- global install copies plugin assets into a fake home directory,
- project init copies plugin assets into a fake repo directory,
- marketplace JSON includes the `qms-dev-workflow` entry,
- doctor reports ok when plugin and skill files exist.

- [ ] **Step 2: Run tests to verify RED**

Run: `npm test`

Expected: FAIL because `./lib/install` does not exist.

### Task 2: Implement Installer Library And CLI

**Files:**
- Create: `lib/install.js`
- Create: `bin/qms-dev-workflow.js`

**Interfaces:**
- `installGlobal({ homeDir, sourceRoot })`
- `installProject({ cwd, sourceRoot })`
- `doctor({ homeDir, cwd, mode })`
- `resolveTargets({ homeDir, cwd, mode })`

- [ ] **Step 1: Implement recursive copy and marketplace update**

Use built-in Node APIs only.

- [ ] **Step 2: Implement CLI commands**

Commands:

- `qms-dev-workflow install`
- `qms-dev-workflow init`
- `qms-dev-workflow doctor`
- `qms-dev-workflow help`

- [ ] **Step 3: Run tests to verify GREEN**

Run: `npm test`

Expected: PASS.

### Task 3: Update Documentation

**Files:**
- Modify: `README.md`

**Interfaces:**
- Documents npm global install and project install.

- [ ] **Step 1: Add npm installation section**

Include:

- `npm i -g @your-scope/qms-dev-workflow`
- `qms-dev-workflow install`
- `qms-dev-workflow doctor`
- `npx @your-scope/qms-dev-workflow init`

- [ ] **Step 2: Re-run tests**

Run: `npm test`

Expected: PASS.
