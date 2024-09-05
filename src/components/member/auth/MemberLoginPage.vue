<!-- 
 담당자: 김호영 
 시작 일자: 2024.09.04
 설명 : 로그인 컴포넌트
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
          v-model="useremail"
          id="useremail"
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
      <a href="#"><strong>이메일 찾기</strong></a> | 
      <a href="#"><strong>비밀번호 찾기</strong></a> | 
      <a href="#"><strong>회원가입</strong></a>
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
export default {
  data() {
    return {
      useremail: '',
      password: ''
    };
  },
  methods: {
    goHome() {
      this.$router.push('/'); // / 경로로 이동
    },
  login() {
    // 아이디(이메일) 입력 확인
    if (!this.useremail) {
      alert('아이디를 입력해주세요.');
      return;
    }

    // 비밀번호 입력 확인
    if (!this.password) {
      alert('비밀번호를 입력해주세요.');
      return;
    }

    // 여기서 실제 아이디와 비밀번호 검증 로직이 들어가야 합니다.
    // 예를 들어, 서버로부터 받은 아이디와 비밀번호가 일치하는지 확인하는 부분.

    const correctEmail = "test@example.com";  // 가정된 올바른 이메일
    const correctPassword = "123456";  // 가정된 올바른 비밀번호

    if (this.useremail !== correctEmail || this.password !== correctPassword) {
      alert('아이디와 비밀번호를 확인해주세요.');
    } else {
      alert(`이메일: ${this.useremail}, 비밀번호: ${this.password}`);
      // 실제 로그인 로직(API 호출 등)을 여기에 추가
    }
  }
}
};
</script>

<style scoped>
/* 로그인 컨테이너 */
.login-container {
  width: 30%;
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
  font-weight: 00; 
  text-align: center;
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