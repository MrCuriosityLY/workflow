const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const PLUGIN_NAME = 'qms-dev-workflow';
const WORKFLOW_NAME = 'qms-dev-workflow';
const PACKAGE_ROOT = path.resolve(__dirname, '..');
const MANAGED_START = '<!-- qms-dev-workflow:start -->';
const MANAGED_END = '<!-- qms-dev-workflow:end -->';

const COMMANDS = [
  {
    id: 'workflow',
    claudeFile: 'qms.md',
    geminiFile: 'workflow.toml',
    title: 'QMS workflow',
    description: 'Run the QMS development workflow',
    prompt: 'Use the QMS development workflow. Read .agent-workflows/qms-dev-workflow/AGENT_WORKFLOW.md, then handle this request: ',
  },
  {
    id: 'analyze',
    claudeFile: 'qms-analyze.md',
    geminiFile: 'analyze.toml',
    title: 'QMS analyze',
    description: 'Analyze a QMS requirement',
    prompt: 'Use .agent-workflows/qms-dev-workflow/AGENT_WORKFLOW.md. Focus on the Research and Analyze stages for this request: ',
  },
  {
    id: 'design',
    claudeFile: 'qms-design.md',
    geminiFile: 'design.toml',
    title: 'QMS design',
    description: 'Design a QMS change',
    prompt: 'Use .agent-workflows/qms-dev-workflow/AGENT_WORKFLOW.md. Focus on Specify and Design before implementation for this request: ',
  },
  {
    id: 'develop',
    claudeFile: 'qms-develop.md',
    geminiFile: 'develop.toml',
    title: 'QMS develop',
    description: 'Implement a confirmed QMS design',
    prompt: 'Use .agent-workflows/qms-dev-workflow/AGENT_WORKFLOW.md. Implement the confirmed QMS design, update tests, and verify this request: ',
  },
  {
    id: 'test',
    claudeFile: 'qms-test.md',
    geminiFile: 'test.toml',
    title: 'QMS test',
    description: 'Verify QMS changes',
    prompt: 'Use .agent-workflows/qms-dev-workflow/AGENT_WORKFLOW.md. Focus on verification and report exact commands for this request: ',
  },
  {
    id: 'fix',
    claudeFile: 'qms-fix.md',
    geminiFile: 'fix.toml',
    title: 'QMS fix',
    description: 'Fix a QMS bug',
    prompt: 'Use .agent-workflows/qms-dev-workflow/AGENT_WORKFLOW.md. Reproduce the issue, identify root cause, fix it, and verify this request: ',
  },
  {
    id: 'openspec',
    claudeFile: 'qms-openspec.md',
    geminiFile: 'openspec.toml',
    title: 'QMS OpenSpec',
    description: 'Run the QMS OpenSpec workflow',
    prompt: 'Use .agent-workflows/qms-dev-workflow/AGENT_WORKFLOW.md and .agent-workflows/qms-dev-workflow/qms-openspec.md. Prepare or update the OpenSpec change for this request: ',
  },
  {
    id: 'sql-full',
    claudeFile: 'qms-sql-full.md',
    geminiFile: 'sql-full.toml',
    title: 'QMS SQL full sync',
    description: 'Check SQL migration and full.sql synchronization',
    prompt: 'Use .agent-workflows/qms-dev-workflow/AGENT_WORKFLOW.md and .agent-workflows/qms-dev-workflow/qms-sql-full.md. Check SQL migration and full.sql synchronization for this request: ',
  },
];

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

function copyWorkflow(sourceRoot, workflowDir) {
  const sourceWorkflowDir = path.join(sourceRoot, 'workflows', WORKFLOW_NAME);
  if (!fs.existsSync(sourceWorkflowDir)) {
    throw new Error(`Workflow source not found: ${sourceWorkflowDir}`);
  }

  if (samePath(sourceWorkflowDir, workflowDir)) {
    return;
  }

  fs.rmSync(workflowDir, { recursive: true, force: true });
  ensureDir(path.dirname(workflowDir));
  fs.cpSync(sourceWorkflowDir, workflowDir, { recursive: true });
}

function agentEntrypointBlock() {
  return `${MANAGED_START}
This project uses the QMS development workflow.

For QMS lab/control development tasks, read and follow:

- \`.agent-workflows/qms-dev-workflow/AGENT_WORKFLOW.md\`
- \`.agent-workflows/qms-dev-workflow/qms-openspec.md\` for change/spec lifecycle work
- \`.agent-workflows/qms-dev-workflow/qms-sql-full.md\` for SQL migration and full.sql synchronization

${MANAGED_END}`;
}

function upsertManagedBlock(filePath, heading) {
  const block = agentEntrypointBlock();
  const existing = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : '';
  const pattern = new RegExp(`${MANAGED_START}[\\s\\S]*?${MANAGED_END}`);

  let next;
  if (pattern.test(existing)) {
    next = existing.replace(pattern, block);
  } else if (existing.trim()) {
    next = `${existing.replace(/\s*$/, '')}\n\n${block}\n`;
  } else {
    next = `${heading}\n\n${block}\n`;
  }

  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, next, 'utf8');
}

function tomlString(value) {
  return JSON.stringify(value);
}

function writeFile(filePath, content) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, 'utf8');
}

function claudeCommandContent(command) {
  return `# ${command.title}

${command.description}.

${command.prompt}$ARGUMENTS
`;
}

function geminiCommandContent(command) {
  return [
    `description = ${tomlString(command.description)}`,
    `prompt = ${tomlString(`${command.prompt}{{args}}`)}`,
    '',
  ].join('\n');
}

function writeSlashCommands(cwd) {
  for (const command of COMMANDS) {
    writeFile(
      path.join(cwd, '.claude', 'commands', command.claudeFile),
      claudeCommandContent(command),
    );
    writeFile(
      path.join(cwd, '.gemini', 'commands', 'qms', command.geminiFile),
      geminiCommandContent(command),
    );
  }
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

function resolveGenericTargets(options = {}) {
  const cwd = path.resolve(options.cwd || process.cwd());

  return {
    mode: 'generic',
    workflowDir: path.join(cwd, '.agent-workflows', WORKFLOW_NAME),
    slashCommands: [
      ...COMMANDS.map((command) => path.join(cwd, '.claude', 'commands', command.claudeFile)),
      ...COMMANDS.map((command) => path.join(cwd, '.gemini', 'commands', 'qms', command.geminiFile)),
    ],
    entrypoints: [
      {
        path: path.join(cwd, 'AGENTS.md'),
        heading: '# Agent Instructions',
      },
      {
        path: path.join(cwd, 'CLAUDE.md'),
        heading: '# Claude Instructions',
      },
      {
        path: path.join(cwd, 'GEMINI.md'),
        heading: '# Gemini Instructions',
      },
      {
        path: path.join(cwd, '.github', 'copilot-instructions.md'),
        heading: '# GitHub Copilot Instructions',
      },
      {
        path: path.join(cwd, '.cursor', 'rules', 'qms-dev-workflow.mdc'),
        heading: '---\ndescription: QMS development workflow\nalwaysApply: true\n---',
      },
    ],
  };
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

function installGenericProject(options = {}) {
  const sourceRoot = path.resolve(options.sourceRoot || PACKAGE_ROOT);
  const targets = resolveGenericTargets(options);

  copyWorkflow(sourceRoot, targets.workflowDir);
  for (const entrypoint of targets.entrypoints) {
    upsertManagedBlock(entrypoint.path, entrypoint.heading);
  }
  writeSlashCommands(path.resolve(options.cwd || process.cwd()));

  return targets;
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

function doctorGenericProject(options = {}) {
  const targets = resolveGenericTargets(options);
  const required = [
    targets.workflowDir,
    path.join(targets.workflowDir, 'AGENT_WORKFLOW.md'),
    path.join(targets.workflowDir, 'qms-openspec.md'),
    path.join(targets.workflowDir, 'qms-sql-full.md'),
    ...targets.entrypoints.map((entrypoint) => entrypoint.path),
    ...targets.slashCommands,
  ];

  const missing = required.filter((filePath) => !fs.existsSync(filePath));

  for (const entrypoint of targets.entrypoints) {
    if (!fs.existsSync(entrypoint.path)) {
      continue;
    }

    const content = fs.readFileSync(entrypoint.path, 'utf8');
    if (!content.includes(MANAGED_START) || !content.includes(MANAGED_END)) {
      missing.push(`${entrypoint.path}#qms-dev-workflow-managed-block`);
    }
  }

  return {
    ok: missing.length === 0,
    mode: targets.mode,
    workflowDir: targets.workflowDir,
    missing,
  };
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
  doctorGenericProject,
  installGenericProject,
  installGlobal,
  installProject,
  resolveGenericTargets,
  resolveTargets,
};
