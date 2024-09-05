import { createRouter, createWebHistory } from 'vue-router';
import routes from './member-routes'; // routes.js에서 라우트 정의를 가져옵니다.

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;