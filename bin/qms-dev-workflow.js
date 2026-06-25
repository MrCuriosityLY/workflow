#!/usr/bin/env node

const {
  doctor,
  installGlobal,
  installProject,
} = require('../lib/install');

function printHelp() {
  console.log(`QMS Dev Workflow installer

Usage:
  qms-dev-workflow install      Install for the current user
  qms-dev-workflow init         Install into the current repository
  qms-dev-workflow doctor       Check the current user installation
  qms-dev-workflow doctor --project
  qms-dev-workflow help
`);
}

function printResult(result, verb) {
  console.log(`${verb}: ${result.mode}`);
  console.log(`Plugin: ${result.pluginDir}`);
  console.log(`Marketplace: ${result.marketplacePath}`);
}

function run(argv) {
  const command = argv[2] || 'help';
  const projectMode = argv.includes('--project');

  if (command === 'install') {
    printResult(installGlobal(), 'Installed');
    console.log('Restart Codex, then open /plugins and install qms-dev-workflow.');
    return 0;
  }

  if (command === 'init') {
    printResult(installProject(), 'Initialized');
    console.log('Commit the generated plugins/ and .agents/plugins/marketplace.json files if this should be repo-scoped.');
    return 0;
  }

  if (command === 'doctor') {
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
