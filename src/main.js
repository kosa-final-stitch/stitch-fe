//  담당자: 김호영 
//  시작 일자: 2024.09.04
//  설명 : 기본 설정 설정
//  ---------------------
//  2024.09.04 김호영 | MemberApp에 대한 라우터 설정
//  2024.09.06 김호영 | member-store 테스트를 위한 pinia 설정 




import { createApp } from 'vue';
import axios from "axios";

import MemberApp from './components/member/MemberApp.vue'; // MemberApp 사용
import router from './router/member-index'; // 라우터 파일

import { createPinia } from 'pinia'; // Pinia를 import
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

// Pinia 인스턴스를 생성 및 플러그인 사용
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

// Axios 인스턴스 설정
const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080', // 백엔드 서버 URL
    headers: {
        'Content-Type': 'application/json', // JSON 타입 설정
    },
    withCredentials: true, // 쿠키 인증 정보를 전송
});

// Vue 애플리케이션 생성 및 설정
const app = createApp(MemberApp);

app.use(router); // 라우터 사용
app.use(pinia);  // Pinia 상태 관리 사용

app.mount('#app'); // 애플리케이션을 #app에 마운트

export default axiosInstance; // Axios 인스턴스 내보내기