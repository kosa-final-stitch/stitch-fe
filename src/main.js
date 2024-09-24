//  담당자: 김호영
//  시작 일자: 2024.09.04
//  설명 : 기본 설정 설정
//  ---------------------
//  2024.09.04 김호영 | MemberApp에 대한 라우터 설정
//  2024.09.06 김호영 | member-store 테스트를 위한 pinia 설정
//  2024.09.10 김호영 | admin 라우터 설정
//  2024.09.12 김호영 | Font Awesome 설정.
//  2024.09.16 박요한 | localStorage.getItem("jwt") 로 변경.
//  2024.09.18 박요한 | 전역 가드 설정 추가(로그인 리다이렉트). faHeart 아이콘 추가.

import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import memberRoutes from "./router/member-routes"; // member 라우터
import adminRoutes from "./router/admin-routes"; // admin 라우터
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import MemberApp from "./components/member/MemberApp.vue"; // 기본 앱은 MemberApp
import "@fortawesome/fontawesome-free/css/all.css";
import "@fortawesome/fontawesome-free/js/all.js";

import axios from "axios";

// Axios 인터셉터 설정
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt"); // 저장된 JWT 토큰 가져오기
    console.log("메인js에서 토큰가져오기: " + token);
    if (token) {
      config.headers["Authorization"] = "Bearer " + token; // 토큰을 Authorization 헤더에 추가
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Font Awesome 관련 설정
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faMagnifyingGlass,
  faBars,
  faAngleUp,
  faAngleDown,
  faTrashCan,
  faQuestion,
  faCircleCheck,
  faCheck,
  faLock,
  faUnlock,
  faHeart,
} from "@fortawesome/free-solid-svg-icons"; // 원하는 아이콘 추가
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

// Pinia 설정
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

// Font Awesome 라이브러리에 아이콘 추가
library.add(
  faBars,
  faMagnifyingGlass,
  faAngleUp,
  faAngleDown,
  faTrashCan,
  faQuestion,
  faCircleCheck,
  faCheck,
  faLock,
  faUnlock,
  faHeart
);

// member와 admin 라우터 통합
const routes = [...memberRoutes, ...adminRoutes];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 전역 가드 설정
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem("jwt"); // 토큰 여부로 인증 확인
  const memberStore = useMemberStore(); // Pinia 스토어 가져오기
  const isAdmin = memberStore.isAdmin; // 관리자 여부 확인

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next({ name: "Login" }); // 인증되지 않으면 로그인 페이지로 이동
    } else if (to.matched.some((record) => record.meta.requiresAdmin) && !isAdmin) {
      next({ name: "NotAuthorized" }); // 관리자가 아닌 경우 접근 불가 처리
    } else {
      next();
    }
  } else {
    next(); // 인증이 필요 없는 페이지는 그대로 진행
  }
});

// Vue 앱 생성 및 설정
const app = createApp(MemberApp); // 기본 앱으로 MemberApp 사용
app.use(router); // 라우터 적용
app.use(pinia); // Pinia 적용



// Pinia 스토어를 콘솔에서 접근할 수 있게 설정
import { useMemberStore } from "@/store/member-store"; // Pinia 스토어 가져오기
window.memberStore = useMemberStore(); // Pinia 스토어를 window 객체에 할당


// FontAwesomeIcon을 전역 컴포넌트로 등록
app.component("font-awesome-icon", FontAwesomeIcon);
app.mount("#app"); // #app에 마운트
