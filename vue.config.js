// 24.9.24. 박요한 | proxy target 환경변수로 전환.

const { defineConfig } = require("@vue/cli-service");
const webpack = require("webpack");

module.exports = defineConfig({
  transpileDependencies: true,
  runtimeCompiler: true,
  devServer: {
    proxy: {
      "/api": {
        target: process.env.VUE_APP_API_URL || "http://localhost:8080",
        ws: false,
        changeOrigin: true,
      },
    },
  },
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        __VUE_PROD_DEVTOOLS__: JSON.stringify(false),
        __VUE_OPTIONS_API__: JSON.stringify(true),
      }),
    ],
  },
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].minify = {
        removeComments: true,
        collapseWhitespace: false,  // 공백 유지
        removeAttributeQuotes: false,  // 속성에 따옴표 유지
      };
      return args;
    });
  },
});