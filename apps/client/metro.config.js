const { getDefaultConfig } = require('@expo/metro-config');
const path = require('path');

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  const projectRoot = __dirname;
  const workspaceRoot = path.resolve(projectRoot, '../..');

  config.watchFolders = [workspaceRoot];
  config.resolver.nodeModulesPaths = [
    path.resolve(projectRoot, 'node_modules'),
    path.resolve(workspaceRoot, 'node_modules'),
  ];

  config.resolver.extraNodeModules = {
    '@kpopduel/shared': path.resolve(workspaceRoot, 'packages/shared/src')
  };

  return config;
})();