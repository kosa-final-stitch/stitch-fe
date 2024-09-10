
//  담당자: 김호영 
//  시작 일자: 2024.09.04
//  설명 : 기본 설정 설정
//  ---------------------
//  2024.09.04 김호영 | MemberApp에 대한 라우터 설정
//  2024.09.06 김호영 | member-store 테스트를 위한 pinia 설정 
//  2024.09.10 김호영 | git 해결

import { createApp } from 'vue';
import axios from "axios";
import MemberApp from './components/member/MemberApp.vue';
import router from './router/member-index'; // 라우터 파일

createApp(MemberApp).use(router).mount('#app');

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080', // 백엔드 서버 URL
    headers: {
        'Content-Type': 'application/json', // JSON 타입 설정
    },
    withCredentials: true, // 쿠키 인증 정보를 전송
});

export default axiosInstance;