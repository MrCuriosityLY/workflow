const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const {
  doctor,
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
