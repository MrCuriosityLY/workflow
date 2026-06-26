# QMS Codex Workflow

English | [中文](#中文)

Codex plugin marketplace for `qms-lab-control` development. It packages QMS-specific workflow skills based on:

- existing `dev-flow` staged development practice,
- `qms-lab-control` architecture and coding conventions,
- Superpowers-style discipline for design, TDD, debugging, and verification,
- OpenSpec-style change proposals, task lists, and spec deltas.

## Install With npm

```bash
npm install -g github:MrCuriosityLY/workflow
qms-dev-workflow install
qms-dev-workflow doctor
```

This installs the workflow package from [MrCuriosityLY/workflow](https://github.com/MrCuriosityLY/workflow), copies the plugin to `~/.codex/plugins/qms-dev-workflow`, and updates `~/.agents/plugins/marketplace.json`.

If PowerShell blocks `npm.ps1`, run the same command with `npm.cmd` instead:

```powershell
npm.cmd install -g github:MrCuriosityLY/workflow
```

## Enable In Codex

After installation:

1. Restart Codex if the plugin does not appear immediately.
2. Open Plugins in the Codex app, or start Codex CLI and open the plugin browser with:

```text
/plugins
```

3. Install or enable `qms-dev-workflow`.
4. Start a new thread in your QMS repository.

## Use The Workflow

Invoke skills explicitly:

```text
$qms-dev-flow research
$qms-dev-flow analyze <your requirement>
$qms-dev-flow design <your requirement>
$qms-dev-flow develop <confirmed design>
$qms-dev-flow test
$qms-dev-flow fix <error or failing test>
$qms-openspec create spec for <change>
$qms-sql-full check SQL sync
```

You can also describe the task naturally. Codex may choose the skill when the request matches its description:

```text
Analyze this QMS requirement and create an OpenSpec-style proposal before implementation.
```

## Install Locally For Testing

From this repository root:

```bash
npm install -g .
qms-dev-workflow install
qms-dev-workflow doctor
```

Restart Codex if the plugin does not appear immediately.

## Contents

- `qms-dev-flow`: end-to-end QMS development workflow.
- `qms-openspec`: specification-first change workflow compatible with OpenSpec-style folders.
- `qms-sql-full`: SQL migration and `full.sql` synchronization guardrail.

---

# 中文

[English](#qms-codex-workflow) | 中文

这是一个面向 `qms-lab-control` 的 Codex 插件市场项目，用来沉淀 QMS 项目的开发工作流。它融合了：

- 当前项目已有的 `dev-flow` 分阶段开发模式；
- `qms-lab-control` 的架构、模块边界和代码规范；
- Superpowers 风格的设计、TDD、系统化调试和完成前验证纪律；
- OpenSpec 风格的变更提案、任务拆分、设计文档和规格增量。

## 使用 npm 安装

```bash
npm install -g github:MrCuriosityLY/workflow
qms-dev-workflow install
qms-dev-workflow doctor
```

这会从 [MrCuriosityLY/workflow](https://github.com/MrCuriosityLY/workflow) 安装工作流包，把插件复制到 `~/.codex/plugins/qms-dev-workflow`，并更新 `~/.agents/plugins/marketplace.json`。

如果 PowerShell 拦截了 `npm.ps1`，把第一行改成 `npm.cmd` 即可：

```powershell
npm.cmd install -g github:MrCuriosityLY/workflow
```

## 在 Codex 中启用

安装完成后：

1. 如果插件没有立即出现，先重启 Codex。
2. 在 Codex 桌面端打开 Plugins 页面，或启动 Codex CLI 后用下面的指令打开插件列表：

```text
/plugins
```

3. 安装或启用 `qms-dev-workflow`。
4. 在 QMS 项目仓库里新开一个线程使用。

## 使用工作流

推荐显式调用 skill：

```text
$qms-dev-flow research
$qms-dev-flow analyze <你的需求>
$qms-dev-flow design <你的需求>
$qms-dev-flow develop <已确认的设计>
$qms-dev-flow test
$qms-dev-flow fix <错误信息或失败测试>
$qms-openspec create spec for <变更>
$qms-sql-full check SQL sync
```

也可以直接用自然语言描述任务，Codex 会在匹配到 skill 描述时自动选择：

```text
分析这个 QMS 需求，先生成 OpenSpec 风格的 proposal，再进入设计和开发。
```

## 本地测试安装

在本仓库根目录运行：

```bash
npm install -g .
qms-dev-workflow install
qms-dev-workflow doctor
```

如果插件没有立即出现，重启 Codex。

## 内容说明

- `qms-dev-flow`：QMS 端到端开发工作流。
- `qms-openspec`：兼容 OpenSpec 风格目录的规格驱动变更流程。
- `qms-sql-full`：SQL 迁移脚本和 `full.sql` 同步规则。
