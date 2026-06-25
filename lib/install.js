const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const PLUGIN_NAME = 'qms-dev-workflow';
const PACKAGE_ROOT = path.resolve(__dirname, '..');

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function readJson(filePath, fallback) {
  if (!fs.existsSync(filePath)) {
    return fallback;
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, data) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

function samePath(a, b) {
  return path.resolve(a).toLowerCase() === path.resolve(b).toLowerCase();
}

function copyPlugin(sourceRoot, pluginDir) {
  const sourcePluginDir = path.join(sourceRoot, 'plugins', PLUGIN_NAME);
  if (!fs.existsSync(sourcePluginDir)) {
    throw new Error(`Plugin source not found: ${sourcePluginDir}`);
  }

  if (samePath(sourcePluginDir, pluginDir)) {
    return;
  }

  fs.rmSync(pluginDir, { recursive: true, force: true });
  ensureDir(path.dirname(pluginDir));
  fs.cpSync(sourcePluginDir, pluginDir, { recursive: true });
}

function marketplaceEntry(sourcePath) {
  return {
    name: PLUGIN_NAME,
    source: {
      source: 'local',
      path: sourcePath,
    },
    policy: {
      installation: 'AVAILABLE',
      authentication: 'ON_INSTALL',
    },
    category: 'Productivity',
  };
}

function upsertMarketplace({ marketplacePath, marketplaceName, displayName, sourcePath }) {
  const marketplace = readJson(marketplacePath, {
    name: marketplaceName,
    interface: {
      displayName,
    },
    plugins: [],
  });

  marketplace.name = marketplace.name || marketplaceName;
  marketplace.interface = marketplace.interface || {};
  marketplace.interface.displayName = marketplace.interface.displayName || displayName;
  marketplace.plugins = Array.isArray(marketplace.plugins) ? marketplace.plugins : [];

  const entry = marketplaceEntry(sourcePath);
  const index = marketplace.plugins.findIndex((plugin) => plugin.name === PLUGIN_NAME);
  if (index === -1) {
    marketplace.plugins.push(entry);
  } else {
    marketplace.plugins[index] = {
      ...marketplace.plugins[index],
      ...entry,
    };
  }

  writeJson(marketplacePath, marketplace);
  return marketplace;
}

function resolveTargets(options = {}) {
  const mode = options.mode || 'global';
  const homeDir = path.resolve(options.homeDir || os.homedir());
  const cwd = path.resolve(options.cwd || process.cwd());

  if (mode === 'project') {
    return {
      mode,
      pluginDir: path.join(cwd, 'plugins', PLUGIN_NAME),
      marketplacePath: path.join(cwd, '.agents', 'plugins', 'marketplace.json'),
      marketplaceName: 'qms-workflows',
      displayName: 'QMS Workflows',
      sourcePath: './plugins/qms-dev-workflow',
    };
  }

  return {
    mode: 'global',
    pluginDir: path.join(homeDir, '.codex', 'plugins', PLUGIN_NAME),
    marketplacePath: path.join(homeDir, '.agents', 'plugins', 'marketplace.json'),
    marketplaceName: 'personal',
    displayName: 'Personal',
    sourcePath: '../.codex/plugins/qms-dev-workflow',
  };
}

function installWithMode(options = {}, mode) {
  const sourceRoot = path.resolve(options.sourceRoot || PACKAGE_ROOT);
  const targets = resolveTargets({ ...options, mode });
  copyPlugin(sourceRoot, targets.pluginDir);
  upsertMarketplace(targets);
  return targets;
}

function installGlobal(options = {}) {
  return installWithMode(options, 'global');
}

function installProject(options = {}) {
  return installWithMode(options, 'project');
}

function doctor(options = {}) {
  const targets = resolveTargets(options);
  const required = [
    targets.pluginDir,
    path.join(targets.pluginDir, '.codex-plugin', 'plugin.json'),
    path.join(targets.pluginDir, 'skills', 'qms-dev-flow', 'SKILL.md'),
    path.join(targets.pluginDir, 'skills', 'qms-openspec', 'SKILL.md'),
    path.join(targets.pluginDir, 'skills', 'qms-sql-full', 'SKILL.md'),
    targets.marketplacePath,
  ];

  const missing = required.filter((filePath) => !fs.existsSync(filePath));
  let marketplaceHasPlugin = false;

  if (fs.existsSync(targets.marketplacePath)) {
    const marketplace = readJson(targets.marketplacePath, { plugins: [] });
    marketplaceHasPlugin = Array.isArray(marketplace.plugins)
      && marketplace.plugins.some((plugin) => plugin.name === PLUGIN_NAME);
  }

  if (!marketplaceHasPlugin) {
    missing.push(`${targets.marketplacePath}#plugins.${PLUGIN_NAME}`);
  }

  return {
    ok: missing.length === 0,
    mode: targets.mode,
    pluginDir: targets.pluginDir,
    marketplacePath: targets.marketplacePath,
    missing,
  };
}

module.exports = {
  PLUGIN_NAME,
  doctor,
  installGlobal,
  installProject,
  resolveTargets,
};
