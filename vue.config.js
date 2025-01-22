const { defineConfig } = require("@vue/cli-service");
const webpack = require("webpack");
module.exports = defineConfig({
  transpileDependencies: true,
  plugins: [
    new webpack.ProvidePlugin({
      process: "process/browser",
    }),
  ],
});
