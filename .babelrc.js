module.exports = function (api) {
  api.cache(true);
  return {
    presets: [["next/babel"],  '@babel/preset-typescript'],
    env: {
      test: {
        plugins: ["babel-plugin-transform-import-meta", "transform-class-properties", "istanbul"],
      },
    },
  };
};
