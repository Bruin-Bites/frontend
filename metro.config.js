// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add web-specific resolver for react-native-maps
config.resolver = {
  ...config.resolver,
  resolveRequest: (context, moduleName, platform) => {
    // Use web mock for react-native-maps on web platform
    if (platform === 'web' && moduleName === 'react-native-maps') {
      return {
        filePath: path.resolve(__dirname, 'web/react-native-maps.js'),
        type: 'sourceFile',
      };
    }
    // Use default resolver for everything else
    return context.resolveRequest(context, moduleName, platform);
  },
};

module.exports = config;

