// 24.9.24. 박요한 | proxy target 환경변수로 전환.

const { defineConfig } = require("@vue/cli-service");
const webpack = require("webpack"); // webpack 추가

module.exports = defineConfig({
  transpileDependencies: true,
  runtimeCompiler: true,
  devServer: {
    proxy: {
      "/api": {
        // target: "http://localhost:8080", // Spring Boot가 동작하는 서버
        target: process.env.VUE_APP_API_URL, // 공유용: localhost 대신 로컬 IP를 사용
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
