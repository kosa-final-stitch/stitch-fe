//  담당자: 김호영 
//  시작 일자: 2024.09.04
//  설명 : 기본 설정 설정
//  ---------------------
//  2024.09.04 김호영 | MemberApp에 대한 라우터 설정
//  2024.09.06 김호영 | member-store 테스트를 위한 pinia 설정 

import { createApp } from 'vue';
import MemberApp from './components/member/MemberApp.vue'; // MemberApp 사용
import router from './router/member-index'; // 라우터 파일
import { createPinia } from 'pinia'; // Pinia를 import
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';


const pinia = createPinia(); // Pinia 인스턴스를 생성
pinia.use(piniaPluginPersistedstate);

const app = createApp(MemberApp); // MemberApp을 Vue 인스턴스로 사용
app.use(router);
app.use(pinia); // Pinia를 Vue 애플리케이션에 등록
app.mount('#app'); // 애플리케이션을 #app에 마운트