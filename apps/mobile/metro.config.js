const { getDefaultConfig } = require('expo/metro-config');
const { FileStore } = require('metro-cache');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

// Find the project and workspace directories
const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// Set up watch folders for monorepo
config.watchFolders = [monorepoRoot];

// SVG transformer configuration
config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer'),
};

// Set up module resolution for node_modules
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];

// Modify assetExts and sourceExts for SVG support
config.resolver.assetExts = config.resolver.assetExts.filter((ext) => ext !== 'svg');
config.resolver.sourceExts = [...config.resolver.sourceExts, 'svg'];

// Use TurboRepo to restore the cache when possible
config.cacheStores = [
  new FileStore({ root: path.join(projectRoot, 'node_modules', '.cache', 'metro') }),
];

// Enable NativeWind with global CSS input
module.exports = withNativeWind(config, { input: './global.css' });
