const { defineConfig } = require("@vue/cli-service");
const webpack = require("webpack"); // webpack 추가

module.exports = defineConfig({
  transpileDependencies: true,
  runtimeCompiler: true,
  devServer: {
    proxy: {
      "/api": {
        // target: "http://localhost:8080", // Spring Boot가 동작하는 서버
        target: process.env.VUE_APP_API_URL,
        ws: false, // 웹소켓 비활성화
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
});
