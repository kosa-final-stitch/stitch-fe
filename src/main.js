//  담당자: 김호영 
//  시작 일자: 2024.09.04
//  설명 : 기본 설정 설정
//  ---------------------
//  2024.09.04 김호영 | MemberApp에 대한 라우터 설정
//  2024.09.06 김호영 | member-store 테스트를 위한 pinia 설정 
//  2024.09.10 김호영 | admin 라우터 설정
//  2024.09.12 김호영 | Font Awesome 설정.

import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import memberRoutes from './router/member-routes';  // member 라우터
import adminRoutes from './router/admin-routes';    // admin 라우터
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import MemberApp from './components/member/MemberApp.vue'; // 기본 앱은 MemberApp

// Font Awesome 관련 설정
import { library } from '@fortawesome/fontawesome-svg-core';
import { faMagnifyingGlass, faBars, faAngleUp, faAngleDown } from '@fortawesome/free-solid-svg-icons'; // 원하는 아이콘 추가
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

// Pinia 설정
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

// Font Awesome 라이브러리에 아이콘 추가
library.add(faBars, faMagnifyingGlass, faAngleUp, faAngleDown);

// member와 admin 라우터 통합
const routes = [...memberRoutes, ...adminRoutes];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Vue 앱 생성 및 설정
const app = createApp(MemberApp); // 기본 앱으로 MemberApp 사용
app.use(router); // 라우터 적용
app.use(pinia);  // Pinia 적용

// FontAwesomeIcon을 전역 컴포넌트로 등록
app.component('font-awesome-icon', FontAwesomeIcon);

app.mount('#app'); // #app에 마운트