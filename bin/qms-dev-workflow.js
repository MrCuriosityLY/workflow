#!/usr/bin/env node

const {
  doctor,
  doctorGenericProject,
  installGenericProject,
  installGlobal,
  installProject,
} = require('../lib/install');

function printHelp() {
  console.log(`QMS Dev Workflow installer

Usage:
  qms-dev-workflow init         Install generic agent workflow into the current repository
  qms-dev-workflow doctor       Check the generic agent workflow installation
  qms-dev-workflow install-codex
  qms-dev-workflow init-codex
  qms-dev-workflow doctor --codex
  qms-dev-workflow doctor --codex --project
  qms-dev-workflow install      Alias for install-codex
  qms-dev-workflow help
`);
}

function printResult(result, verb) {
  console.log(`${verb}: ${result.mode}`);
  console.log(`Plugin: ${result.pluginDir}`);
  console.log(`Marketplace: ${result.marketplacePath}`);
}

function printGenericResult(result, verb) {
  console.log(`${verb}: ${result.mode}`);
  console.log(`Workflow: ${result.workflowDir}`);
}

function run(argv) {
  const command = argv[2] || 'help';
  const projectMode = argv.includes('--project');
  const codexMode = argv.includes('--codex');

  if (command === 'init') {
    printGenericResult(installGenericProject(), 'Initialized');
    console.log('Agent entrypoints: AGENTS.md, CLAUDE.md, GEMINI.md, .github/copilot-instructions.md, .cursor/rules/qms-dev-workflow.mdc');
    console.log('Slash adapters: .claude/commands/*.md, .gemini/commands/qms/*.toml');
    return 0;
  }

  if (command === 'install' || command === 'install-codex') {
    printResult(installGlobal(), 'Installed');
    console.log('Restart Codex, then open Plugins in the app or /plugins in Codex CLI.');
    return 0;
  }

  if (command === 'init-codex') {
    printResult(installProject(), 'Initialized');
    console.log('Commit the generated plugins/ and .agents/plugins/marketplace.json files if this should be repo-scoped.');
    return 0;
  }

  if (command === 'doctor') {
    if (!codexMode) {
      const result = doctorGenericProject();
      printGenericResult(result, result.ok ? 'OK' : 'Problem');
      if (!result.ok) {
        console.error('Missing:');
        for (const item of result.missing) {
          console.error(`- ${item}`);
        }
        return 1;
      }
      return 0;
    }

    const result = doctor({ mode: projectMode ? 'project' : 'global' });
    printResult(result, result.ok ? 'OK' : 'Problem');
    if (!result.ok) {
      console.error('Missing:');
      for (const item of result.missing) {
        console.error(`- ${item}`);
      }
      return 1;
    }
    return 0;
  }

  if (command === 'help' || command === '--help' || command === '-h') {
    printHelp();
    return 0;
  }

  console.error(`Unknown command: ${command}`);
  printHelp();
  return 1;
}

process.exitCode = run(process.argv);
