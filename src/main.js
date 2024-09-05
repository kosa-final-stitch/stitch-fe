import { createApp } from 'vue';
import MemberApp from './components/member/MemberApp.vue';
import router from './router/member-index'; // 라우터 파일

createApp(MemberApp).use(router).mount('#app');