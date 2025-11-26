// babel.config.js
module.exports = function (api) {
  api.cache(true);

  return {
    presets: [
      // Expo preset, with NativeWind JSX support
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],

      // NativeWind preset – this is a PRESET, not a plugin
      "nativewind/babel",
    ],
    // no plugins field needed here for nativewind
  };
};
