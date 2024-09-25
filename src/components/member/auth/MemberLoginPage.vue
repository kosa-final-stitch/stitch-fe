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
        <img @click="googleLogin" src="@/assets/google-icon.png" alt="Google 로그인" class="w-10 h-10" />
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
      if (this.email && this.password) {
        try {
          const response = await axios.post('/api/login', {
            email: this.email,
            password: this.password
          });

          const token = response.data.token; // 서버에서 받은 JWT 토큰
          localStorage.setItem('jwt', token); // 로컬 스토리지에 JWT 저장

          // 이후 모든 요청에서 Authorization 헤더에 토큰을 포함시킴
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          // Pinia 스토어 불러오기
          const memberStore = useMemberStore();

          // 스토어에 사용자 정보를 설정
          memberStore.setMember(token);

          // 로그인 성공 후 페이지 이동
          this.$router.push('/');
          alert("로그인 성공")
        } catch (error) {
          console.error("로그인 실패:", error);
          alert('로그인에 실패했습니다. 다시 시도해주세요.');
        }
      } else {
        alert('이메일과 비밀번호를 입력해주세요.');
      }
    },
    googleLogin() {
      // 구글 소셜 로그인 URL로 리다이렉트
      window.location.href = 'http://localhost:8080/login/oauth2/code/google';
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