// /*
//  담당자: 박요한, 김호영
//  시작 일자: 2024.08.30
//  설명 : member 라우터 컴포넌트
//  ---------------------
//  2024.08.30 박요한 | 라우터 설계
//  2024.09.05 김호영 | 라우터 통합,수정,개선
//  */

import { createRouter, createWebHistory } from "vue-router";
import routes from "./member-routes"; // routes.js에서 라우트 정의를 가져옵니다.

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
