const { getDefaultConfig } = require("expo/metro-config");

module.exports = (() => {
  const config = getDefaultConfig(__dirname);
  config.resolver.unstable_enablePackageExports = false;

  return {
    ...config,
    resolver: {
      ...config.resolver,
      extraNodeModules: {
        ws: require.resolve("./ws-mock.js"), // Mock ws
        stream: require.resolve("stream-browserify"), // Polyfill stream
      },
      sourceExts: [...config.resolver.sourceExts, "cjs"],
    },
    transformer: {
      ...config.transformer,
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: true,
        },
      }),
    },
  };
})();
