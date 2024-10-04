// 24.9.24. 박요한 | proxy target 환경변수로 전환.

const { defineConfig } = require("@vue/cli-service");
const webpack = require("webpack"); // webpack 추가

module.exports = defineConfig({
  transpileDependencies: true,
  runtimeCompiler: true,
  devServer: {
    proxy: {
      "/api": {
        // 로컬 개발에서는 localhost로 설정
        target: process.env.VUE_APP_API_URL || "http://localhost:8080", // API 서버 URL을 환경 변수로 처리, 없을 시 로컬 기본값
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