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