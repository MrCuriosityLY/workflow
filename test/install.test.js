const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const {
  doctor,
  doctorGenericProject,
  installGenericProject,
  installGlobal,
  installProject,
  resolveTargets,
} = require('../lib/install');

function makeTempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'qms-dev-workflow-'));
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

test('installGlobal copies plugin assets and writes personal marketplace', () => {
  const homeDir = makeTempDir();

  const result = installGlobal({ homeDir });

  assert.equal(result.mode, 'global');
  assert.equal(fs.existsSync(path.join(homeDir, '.codex', 'plugins', 'qms-dev-workflow', '.codex-plugin', 'plugin.json')), true);
  assert.equal(fs.existsSync(path.join(homeDir, '.codex', 'plugins', 'qms-dev-workflow', 'skills', 'qms-dev-flow', 'SKILL.md')), true);

  const marketplace = readJson(path.join(homeDir, '.agents', 'plugins', 'marketplace.json'));
  assert.equal(marketplace.name, 'personal');
  assert.equal(marketplace.plugins.length, 1);
  assert.equal(marketplace.plugins[0].name, 'qms-dev-workflow');
  assert.equal(marketplace.plugins[0].source.path, '../.codex/plugins/qms-dev-workflow');
});

test('installProject copies plugin assets and writes repo marketplace', () => {
  const cwd = makeTempDir();

  const result = installProject({ cwd });

  assert.equal(result.mode, 'project');
  assert.equal(fs.existsSync(path.join(cwd, 'plugins', 'qms-dev-workflow', '.codex-plugin', 'plugin.json')), true);

  const marketplace = readJson(path.join(cwd, '.agents', 'plugins', 'marketplace.json'));
  assert.equal(marketplace.name, 'qms-workflows');
  assert.equal(marketplace.plugins.length, 1);
  assert.equal(marketplace.plugins[0].name, 'qms-dev-workflow');
  assert.equal(marketplace.plugins[0].source.path, './plugins/qms-dev-workflow');
});

test('installGenericProject copies workflow assets and writes agent entrypoints', () => {
  const cwd = makeTempDir();

  const result = installGenericProject({ cwd });

  assert.equal(result.mode, 'generic');
  assert.equal(fs.existsSync(path.join(cwd, '.agent-workflows', 'qms-dev-workflow', 'AGENT_WORKFLOW.md')), true);
  assert.equal(fs.existsSync(path.join(cwd, '.agent-workflows', 'qms-dev-workflow', 'qms-openspec.md')), true);
  assert.equal(fs.existsSync(path.join(cwd, '.agent-workflows', 'qms-dev-workflow', 'qms-sql-full.md')), true);

  const agents = fs.readFileSync(path.join(cwd, 'AGENTS.md'), 'utf8');
  const claude = fs.readFileSync(path.join(cwd, 'CLAUDE.md'), 'utf8');
  const gemini = fs.readFileSync(path.join(cwd, 'GEMINI.md'), 'utf8');
  const copilot = fs.readFileSync(path.join(cwd, '.github', 'copilot-instructions.md'), 'utf8');
  const cursor = fs.readFileSync(path.join(cwd, '.cursor', 'rules', 'qms-dev-workflow.mdc'), 'utf8');

  for (const content of [agents, claude, gemini, copilot, cursor]) {
    assert.match(content, /\.agent-workflows\/qms-dev-workflow\/AGENT_WORKFLOW\.md/);
    assert.match(content, /qms-dev-workflow:start/);
    assert.match(content, /qms-dev-workflow:end/);
  }
});

test('installGenericProject writes slash command adapters for supported agents', () => {
  const cwd = makeTempDir();

  installGenericProject({ cwd });

  const claudeCommands = [
    'qms.md',
    'qms-analyze.md',
    'qms-design.md',
    'qms-develop.md',
    'qms-test.md',
    'qms-fix.md',
    'qms-openspec.md',
    'qms-sql-full.md',
  ];

  for (const command of claudeCommands) {
    const content = fs.readFileSync(path.join(cwd, '.claude', 'commands', command), 'utf8');
    assert.match(content, /\.agent-workflows\/qms-dev-workflow\/AGENT_WORKFLOW\.md/);
    assert.match(content, /\$ARGUMENTS/);
  }

  const geminiCommands = [
    'workflow.toml',
    'analyze.toml',
    'design.toml',
    'develop.toml',
    'test.toml',
    'fix.toml',
    'openspec.toml',
    'sql-full.toml',
  ];

  for (const command of geminiCommands) {
    const content = fs.readFileSync(path.join(cwd, '.gemini', 'commands', 'qms', command), 'utf8');
    assert.match(content, /description = /);
    assert.match(content, /prompt = /);
    assert.match(content, /\.agent-workflows\/qms-dev-workflow\/AGENT_WORKFLOW\.md/);
    assert.match(content, /\{\{args\}\}/);
  }
});

test('installGenericProject updates the managed block without deleting existing guidance', () => {
  const cwd = makeTempDir();
  const agentsPath = path.join(cwd, 'AGENTS.md');
  fs.writeFileSync(agentsPath, '# Existing Guidance\n\nKeep this line.\n', 'utf8');

  installGenericProject({ cwd });
  installGenericProject({ cwd });

  const agents = fs.readFileSync(agentsPath, 'utf8');
  assert.match(agents, /Keep this line\./);
  assert.equal((agents.match(/qms-dev-workflow:start/g) || []).length, 1);
});

test('doctorGenericProject reports ok for a completed generic install', () => {
  const cwd = makeTempDir();
  installGenericProject({ cwd });

  const result = doctorGenericProject({ cwd });

  assert.equal(result.ok, true);
  assert.deepEqual(result.missing, []);
});

test('doctor reports ok for a completed global install', () => {
  const homeDir = makeTempDir();
  installGlobal({ homeDir });

  const result = doctor({ homeDir, mode: 'global' });

  assert.equal(result.ok, true);
  assert.deepEqual(result.missing, []);
});

test('resolveTargets returns cross-platform global and project paths', () => {
  const homeDir = makeTempDir();
  const cwd = makeTempDir();

  const globalTargets = resolveTargets({ homeDir, cwd, mode: 'global' });
  assert.equal(globalTargets.pluginDir, path.join(homeDir, '.codex', 'plugins', 'qms-dev-workflow'));
  assert.equal(globalTargets.marketplacePath, path.join(homeDir, '.agents', 'plugins', 'marketplace.json'));

  const projectTargets = resolveTargets({ homeDir, cwd, mode: 'project' });
  assert.equal(projectTargets.pluginDir, path.join(cwd, 'plugins', 'qms-dev-workflow'));
  assert.equal(projectTargets.marketplacePath, path.join(cwd, '.agents', 'plugins', 'marketplace.json'));
});
