// Webpack config for Expo web to handle react-native-maps
const path = require('path');

module.exports = async function (env, argv) {
  let config;
  
  try {
    // Try to use Expo's webpack config if available
    const createExpoWebpackConfigAsync = require('@expo/webpack-config');
    config = await createExpoWebpackConfigAsync(env, argv);
  } catch (e) {
    // Fallback: create basic webpack config
    config = {
      resolve: {
        alias: {},
      },
    };
  }

  // Alias react-native-maps to web mock for web builds
  if (!config.resolve) {
    config.resolve = {};
  }
  if (!config.resolve.alias) {
    config.resolve.alias = {};
  }
  
  config.resolve.alias['react-native-maps'] = path.resolve(__dirname, 'web/react-native-maps.js');

  return config;
};

