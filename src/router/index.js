/*
    담당자: 박요한, 김호영
    시작 일자: 2024.09.10
    설명 : admin 라우터 컴포넌트
    ---------------------
    2024.09.11 김호영 | 라우터 통합
 */


import { createRouter, createWebHistory } from 'vue-router';
import memberRoutes from './member-routes';
import adminRoutes from './admin-routes'; // admin과 member 라우트 모두 가져오기

const routes = [
  ...memberRoutes,  // member 라우트 추가
  ...adminRoutes,   // admin 라우트 추가
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;