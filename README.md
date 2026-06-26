# QMS Agent Workflow

English | [中文](#中文)

Reusable QMS development workflow instructions for coding agents. The npm
package installs plain Markdown workflow files into a project so Codex, Claude
Code, Gemini CLI, GitHub Copilot, Cursor, and other agents can all read the
same guidance.

It also keeps optional Codex plugin support for users who want a native Codex
plugin experience.

## Install With npm

From the project where you want agents to use the workflow:

```bash
npm install -g github:MrCuriosityLY/workflow
qms-dev-workflow init
qms-dev-workflow doctor
```

This creates or updates:

```text
.agent-workflows/qms-dev-workflow/
AGENTS.md
CLAUDE.md
GEMINI.md
.github/copilot-instructions.md
.cursor/rules/qms-dev-workflow.mdc
.claude/commands/
.gemini/commands/qms/
```

The agent entrypoint files keep a small managed block that points to the shared
workflow under `.agent-workflows/qms-dev-workflow/`. Existing content outside
that managed block is preserved.

For agents with project-level slash command support, the installer also creates
command adapters:

- Claude Code: `/qms`, `/qms-analyze`, `/qms-design`, `/qms-develop`,
  `/qms-test`, `/qms-fix`, `/qms-openspec`, `/qms-sql-full`
- Gemini CLI: `/qms:workflow`, `/qms:analyze`, `/qms:design`,
  `/qms:develop`, `/qms:test`, `/qms:fix`, `/qms:openspec`,
  `/qms:sql-full`

GitHub Copilot and Cursor receive project instruction/rule files. Their `/`
menu behavior depends on the client version and supported extension features.

If PowerShell blocks `npm.ps1`, run the npm command with `npm.cmd` instead:

```powershell
npm.cmd install -g github:MrCuriosityLY/workflow
```

## Use The Workflow

Ask your agent naturally:

```text
Use the QMS development workflow to analyze this requirement and prepare a spec.
```

```text
Follow the QMS workflow, implement the confirmed design, update tests, and verify.
```

The installed workflow includes:

- `AGENT_WORKFLOW.md`: end-to-end QMS development workflow.
- `qms-openspec.md`: OpenSpec-style change/spec lifecycle.
- `qms-sql-full.md`: SQL migration and `full.sql` synchronization rule.

In supported slash-command agents, you can also type `/` and choose the
installed command, for example `/qms-analyze` in Claude Code or `/qms:analyze`
in Gemini CLI.

## Optional Codex Plugin

If you also want the native Codex plugin marketplace integration:

```bash
qms-dev-workflow install-codex
qms-dev-workflow doctor --codex
```

For a repo-scoped Codex plugin install:

```bash
qms-dev-workflow init-codex
qms-dev-workflow doctor --codex --project
```

After installing the Codex plugin, restart Codex if it does not appear
immediately. Open Plugins in the Codex app, or start Codex CLI and use:

```text
/plugins
```

## Local Development

From this repository root:

```bash
npm install -g .
qms-dev-workflow init
qms-dev-workflow doctor
```

Run tests:

```bash
npm test
```

---

# 中文

[English](#qms-agent-workflow) | 中文

这是一个面向 QMS 开发的通用 agent 工作流包。它通过 npm 把纯 Markdown
工作流安装到目标项目中，让 Codex、Claude Code、Gemini CLI、GitHub
Copilot、Cursor 和其他 coding agent 都能读取同一套规则。

同时，它也保留了可选的 Codex 插件支持，方便需要 Codex 原生插件体验的用户使用。

## 使用 npm 安装

在需要使用该工作流的项目根目录运行：

```bash
npm install -g github:MrCuriosityLY/workflow
qms-dev-workflow init
qms-dev-workflow doctor
```

这会创建或更新：

```text
.agent-workflows/qms-dev-workflow/
AGENTS.md
CLAUDE.md
GEMINI.md
.github/copilot-instructions.md
.cursor/rules/qms-dev-workflow.mdc
.claude/commands/
.gemini/commands/qms/
```

这些 agent 入口文件只会写入一小段受管理的说明，并指向
`.agent-workflows/qms-dev-workflow/` 下的共享工作流。受管理区块之外的已有内容会保留。

对于支持项目级 slash command 的 agent，安装器还会生成命令适配文件：

- Claude Code：`/qms`、`/qms-analyze`、`/qms-design`、`/qms-develop`、
  `/qms-test`、`/qms-fix`、`/qms-openspec`、`/qms-sql-full`
- Gemini CLI：`/qms:workflow`、`/qms:analyze`、`/qms:design`、
  `/qms:develop`、`/qms:test`、`/qms:fix`、`/qms:openspec`、
  `/qms:sql-full`

GitHub Copilot 和 Cursor 会收到项目说明/规则文件。它们的 `/` 菜单行为取决于当前客户端版本和扩展能力。

如果 PowerShell 拦截了 `npm.ps1`，把 npm 命令改成 `npm.cmd` 即可：

```powershell
npm.cmd install -g github:MrCuriosityLY/workflow
```

## 使用工作流

可以直接用自然语言要求 agent 使用该工作流：

```text
Use the QMS development workflow to analyze this requirement and prepare a spec.
```

```text
Follow the QMS workflow, implement the confirmed design, update tests, and verify.
```

安装后的工作流包含：

- `AGENT_WORKFLOW.md`：QMS 端到端开发工作流。
- `qms-openspec.md`：OpenSpec 风格的变更和规格生命周期。
- `qms-sql-full.md`：SQL 迁移脚本和 `full.sql` 同步规则。

在支持 slash command 的 agent 中，也可以输入 `/` 选择安装好的命令，例如
Claude Code 里的 `/qms-analyze`，或 Gemini CLI 里的 `/qms:analyze`。

## 可选 Codex 插件

如果还需要 Codex 原生插件市场集成：

```bash
qms-dev-workflow install-codex
qms-dev-workflow doctor --codex
```

如果要安装到当前仓库作为 repo-scoped Codex 插件：

```bash
qms-dev-workflow init-codex
qms-dev-workflow doctor --codex --project
```

安装 Codex 插件后，如果插件没有立即出现，先重启 Codex。可以在 Codex
桌面端打开 Plugins 页面，或启动 Codex CLI 后使用：

```text
/plugins
```

## 本地开发

在本仓库根目录运行：

```bash
npm install -g .
qms-dev-workflow init
qms-dev-workflow doctor
```

运行测试：

```bash
npm test
```
