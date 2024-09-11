<!--
 담당자: 김호영, 박주희
 시작 일자: 2024.09.04
 설명: 로그인 컴포넌트
 ---------------------
 2024.09.04 김호영 | 기능 담을 디자인 구현
-->

<template>
  <div class="login-container">
    <img @click="goHome" src="@/assets/full-logo.jpg" alt="Stitch 로고" class="logo" />

    <h1>로그인</h1>
    <form @submit.prevent="login"> <!-- 페이지 새로고침 방지 -->
      <div class="input-container">
        <input
          type="text"
          v-model="email"
          id="email"
          placeholder="이메일을 입력해주세요."
          required
        />
      </div>
      <div class="input-container">
        <input
          type="password"
          v-model="password"
          id="password"
          placeholder="비밀번호를 입력해주세요."
          required
        />
      </div>
      <button type="submit" class="login-btn">로그인</button>
    </form>

    <!-- 링크 컨테이너 -->
    <div class="link-container">
      <a @click="goSign"><strong>아직 회원이 아니신가요?</strong></a>
    </div>

    <!-- 간편 로그인 타이틀 -->
    <div class="social-login-separator">
      <span class="separator-text">간편 로그인</span>
    </div>
    <!-- 소셜 로그인 아이콘 -->
    <div class="social-login mt-4">
      <div class="social-icons flex justify-center space-x-4">
        <img src="@/assets/kakao-icon.png" alt="Kakao 로그인" class="w-10 h-10" />
        <img src="@/assets/google-icon.png" alt="Google 로그인" class="w-10 h-10" />
      </div>
    </div>
  </div>
</template>

<script>
import { useMemberStore } from '@/store/member-store'; // Pinia store import
import { useRouter } from 'vue-router';
import axios from 'axios';

export default {
  data() {
    return {
      email: '',
      password: '',
    };
  },
  setup() {
    const memberStore = useMemberStore(); // Pinia store 사용
    const router = useRouter(); // Vue router 사용
    return { memberStore, router };
  },
  methods: {
    goHome() {
      this.router.push('/'); // 홈으로 이동
    },
    goSign() {
      this.router.push('/signup'); // 회원가입 페이지로 이동
    },
    async login() {
      // 아이디(이메일) 입력 확인
      if (!this.email) {
        alert('아이디를 입력해주세요.');
        return;
      }
      // 비밀번호 입력 확인
      if (!this.password) {
        alert('비밀번호를 입력해주세요.');
        return;
      }

      console.log("Vue에서 넘기는 이메일:", this.email);
      console.log("보내는 비밀번호:", this.password);

      try {
        // 서버로 로그인 요청
        const response = await axios.post('/api/login', {
          username: this.email,
          password: this.password
        },{withCredentials:true
        });

        // 서버의 응답이 성공이면
        if (response.status === 200) {
          // 로그인 성공 시 상태 업데이트 및 리디렉션
          this.memberStore.setMember({ email: this.email }); // 로그인 상태로 업데이트
          this.router.push('/'); // 홈 페이지로 이동
        }
      } catch (error) {
        // 로그인 실패 시 처리
        console.error(error);
        alert('아이디와 비밀번호를 확인해주세요.');
      }
    }
  }
};
</script>

<style scoped>
/* 로그인 컨테이너 */
.login-container {
  width: 80%;
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}
/* 로고 스타일 */
.logo {
  width: 150px;
  margin: 20px auto 30px;
  display: block;
  cursor: pointer;
}
/* 제목 스타일 */
h1 {
  font-size: 24px;
  margin-bottom: 60px;
  font-weight: bold;
}
/* 입력 필드 컨테이너 */
.input-container {
  margin-bottom: 20px;
}
/* 입력 필드 포커스 스타일 */
input:focus {
  outline: none; /* 기본 아웃라인 제거 */
  border-color: #F8A060; /* 포커스 시 테두리 색상 변경 */
}
/* 입력 필드 스타일 */
input {
  width: 100%;
  padding: 15px;
  font-size: 16px;
  border: 1.5px solid #ddd;
  border-radius: 12px;
  box-sizing: border-box;
}
/* 로그인 버튼 스타일 */
.login-btn {
  width: 100%;
  padding: 15px;
  background-color: #F8A060;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  color: white;
  cursor: pointer;
  margin-top: 15px;
  transition: background-color 0.5s ease;
}
.login-btn:hover {
  background-color: #f5812e;
}
/* 링크 컨테이너 */
.link-container {
  margin-top: 15px;
  font-size: 14px;
  color: rgb(87, 87, 87);
  text-align: center;
  cursor: pointer;
}
.link-container a {
  text-decoration: none;
  color: inherit;
}
.link-container a:hover {
  text-decoration: underline;
  color: rgb(0, 0, 0);
}
/* 간편 로그인 타이틀 스타일 */
.social-login-separator {
  display: flex;
  align-items: center;
  text-align: center;
  margin-top: 30px;
  margin-bottom: 20px;
}
.social-login-separator::before,
.social-login-separator::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #ddd;
}
.social-login-separator::before {
  margin-right: 10px;
}
.social-login-separator::after {
  margin-left: 10px;
}
.separator-text {
  color: #aaa;
  font-size: 14px;
  white-space: nowrap; /* 텍스트 줄바꿈 방지 */
}
/* 소셜 로그인 아이콘 */
.social-icons img {
  width: 50px;
  height: 50px;
  margin: 0 15px;
  cursor: pointer;
}
</style>