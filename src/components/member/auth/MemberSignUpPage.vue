<!--
 담당자: 김호영, 박주희
 시작 일자: 2024.09.05
 설명: 회원가입 컴포넌트
 ---------------------
 2024.09.05 김호영 | 기능 담을 디자인 구현
 2024.09.11 김호영 | "이미 회원이신가요?" 누르면 로그인화면으로 이동 추가시킴 (1줄)
-->

<template>
  <div class="signup-container">
    <h1>회원가입</h1>
    <form @submit.prevent="signUp">
      <div class="form-grid">
        <div class="left-side">
          <div class="input-container">
            <label for="email">이메일</label>
            <input
              type="email"
              v-model="email"
              id="email"
              placeholder="example@email.com"
              required
            />
            <p class="error-message" v-if="emailError">{{ emailError }}</p>
          </div>
          <div class="input-container">
            <label for="nickname">닉네임</label>
            <input
              type="text"
              v-model="nickname"
              id="nickname"
              placeholder="닉네임을 입력해 주세요."
              required
            />
            <p class="error-message" v-if="nicknameError">{{ nicknameError }}</p>
          </div>
          <div class="input-container">
            <label for="password">비밀번호</label>
            <input
              type="password"
              v-model="password"
              id="password"
              placeholder="8자 이상 15자 이하이며 영문/숫자/특수문자를 포함해야 합니다."
              required
            />
            <p class="error-message" v-if="passwordError">{{ passwordError }}</p>
          </div>
          <div class="input-container">
            <label for="confirmPassword">비밀번호 확인</label>
            <input
              type="password"
              v-model="confirmPassword"
              id="confirmPassword"
              placeholder="비밀번호 확인"
              required
            />
            <p class="error-message" v-if="password !== confirmPassword && confirmPassword">
              비밀번호가 일치하지 않습니다.
            </p>
          </div>
        </div>
        <div class="right-side">
          <div class="input-container">
            <label for="name">이름</label>
            <input
              type="text"
              v-model="name"
              id="name"
              placeholder="이름을 입력해 주세요."
              required
            />
            <p class="error-message" v-if="nameError">{{ nameError }}</p>
          </div>
          <div class="input-container">
            <label for="phone">전화번호</label>
            <input
              type="text"
              v-model="phone"
              id="phone"
              placeholder="전화번호를 입력해 주세요."
              @input="formatPhone"
              maxlength="13"
              required
            />
            <p class="error-message" v-if="phoneError">{{ phoneError }}</p>
          </div>
          <div class="input-container">
            <label for="birthDate">생년월일</label>
            <input
              type="date"
              v-model="birth"
              id="birth"
              required
            />
          </div>
          <div class="input-container">
            <label for="address">지역</label>
            <select v-model="address" id="address" required>
              <option disabled value="">지역</option>
              <option value="서울특별시">서울특별시</option>
              <option value="경기도">경기도</option>
              <option value="경상도">경상도</option>
              <option value="인천광역시">인천광역시</option>
              <option value="전라도">전라도</option>
              <option value="제주도">제주도</option>
              <option value="충청도">충청도</option>
            </select>
          </div>
          <div class="input-container">
            <label for="gender">성별</label>
            <select v-model="gender" id="gender" required>
              <option disabled value="">성별을 골라주세요.</option>
              <option value="남">남</option>
              <option value="여">여</option>
            </select>
          </div>
        </div>
      </div>
      <div class="terms-container">
        <div class="terms-box">
          <h3>이용약관</h3>
          <div class="checkbox-container" @click="toggleCheck('all')">
            <div class="custom-checkbox" :class="{ 'checked': acceptTerms.all }"></div>
            <p>모두 동의</p>
          </div>
          <div class="checkbox-container" @click="toggleCheck('personalInfo')">
            <div class="custom-checkbox" :class="{ 'checked': acceptTerms.personalInfo }"></div>
            <p>(필수) 개인 정보 수집 및 이용 동의</p>
          </div>
          <div class="checkbox-container" @click="toggleCheck('contentAgreement')">
            <div class="custom-checkbox" :class="{ 'checked': acceptTerms.contentAgreement }"></div>
            <p>(필수) 사용자는 본 서비스에 게시하는 모든 콘텐츠에 대한 저작권을 보유합니다.
              단, 사용자는 콘텐츠를 제출함으로써, 본 서비스가 해당 콘텐츠를 상업적 목적으로 사용,
              수정, 배포할 수 있는 권한을 부여합니다.* </p>
          </div>
        </div>
      </div>
      <button type="submit" class="signup-btn" :disabled="!formIsValid">회원가입</button>
    </form>
    <div class="link-container">
      <a @click="goLogin"><strong>이미 회원이신가요?</strong></a>
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

회원가입 axios 처리시

<script>
import axios from 'axios';

export default {
  data() {
    return {
      email: '',
      emailError: '',
      nickname: '',
      nicknameError: '',
      password: '',
      confirmPassword: '',
      passwordError: '',
      name: '',
      nameError: '',
      phone: '',
      phoneError: '',
      birth: '',
      address: '',
      gender: '',
      acceptTerms: {
        all: false,
        personalInfo: false,
        contentAgreement: false,
      },
    };
  },
  computed: {
    formIsValid() {
      return (
          this.email &&
          this.nickname &&
          this.password &&
          this.confirmPassword &&
          !this.passwordsDoNotMatch &&
          this.name &&
          this.phone &&
          this.birth &&
          this.address &&
          this.gender &&
          this.acceptTerms.personalInfo &&
          this.acceptTerms.contentAgreement
      );
    },
  },
  methods: {
    goLogin() {
    this.$router.push('/login'); // '/login' 경로로 이동
  },
    async validateEmail() {
      const regPassed = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(this.email);
      if (!regPassed) {
        this.emailError = '올바른 이메일 형식이 아닙니다.';
        return false;
      }
      try {
        const res = await axios.post('/api/validate-email', { email: this.email });
        if (!res.data.isValid) {
          this.emailError = '이미 사용 중인 이메일입니다.';
          return false;
        }
        this.emailError = '';
        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    },
    validatePassword() {
      const passwordPattern = /^[a-zA-Z0-9!@#$%^&*]{8,15}$/;
      if (!passwordPattern.test(this.password)) {
        this.passwordError = '비밀번호는 8자 이상 15자 이하이며 영문/숫자/특수문자를 포함해야 합니다.';
        return false;
      }
      if (this.password !== this.confirmPassword) {
        this.passwordError = '비밀번호가 일치하지 않습니다.';
        return false;
      }
      this.passwordError = '';
      return true;
    },
    async validateNickname() {
      const nicknamePattern = /^[a-zA-Z가-힣0-9]{2,12}$/;
      if (!nicknamePattern.test(this.nickname)) {
        this.nicknameError = '닉네임은 2~12자의 한글, 영문, 숫자만 가능합니다.';
        return false;
      }
      try {
        const res = await axios.post('/api/validate-nickname', { nickname: this.nickname });
        if (!res.data.isValid) {
          this.nicknameError = '이미 사용 중인 닉네임입니다.';
          return false;
        }
        this.nicknameError = '';
        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    },
    formatPhone() {
      let cleaned = this.phone.replace(/\D/g, '');
      if (cleaned.length <= 10) {
        this.phone = cleaned.replace(/(\d{3})(\d{3,4})(\d{4})/, '$1-$2-$3');
      } else {
        this.phone = cleaned.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
      }
    },
    toggleCheck(type) {
      if (type === 'all') {
        const newValue = !this.acceptTerms.all;
        this.acceptTerms.all = newValue;
        this.acceptTerms.personalInfo = newValue;
        this.acceptTerms.contentAgreement = newValue;
      } else {
        this.acceptTerms[type] = !this.acceptTerms[type];
        if (this.acceptTerms.personalInfo && this.acceptTerms.contentAgreement) {
          this.acceptTerms.all = true;
        } else {
          this.acceptTerms.all = false;
        }
      }
    },
    async signUp() {
      const isEmailValid = await this.validateEmail();
      const isPasswordValid = this.validatePassword();
      const isNicknameValid = await this.validateNickname();

      if (!isEmailValid || !isPasswordValid || !isNicknameValid) {
        alert('유효성 검사를 통과하지 못했습니다. 다시 시도해 주세요.');
        return;
      }

      // gender 값을 0 또는 1로 변환
      const genderValue = this.gender === '남' ? 0 : 1;

      const reqData = {
        email: this.email,
        nickname: this.nickname,
        password: this.password,
        name: this.name,
        phone: this.phone,
        birth: this.birth,
        address: this.address,
        gender: genderValue,
      };

      try {
        await axios.post('/api/signup', reqData, {
          headers: { 'Content-Type': 'application/json' },
        });
        alert('회원가입이 완료되었습니다.');
        this.$router.push('/login');
      } catch (error) {
        console.error(error);
        alert('회원가입에 실패했습니다. 다시 시도해 주세요.');
      }
    },
  },
};
</script>

<style scoped>
.signup-container {
  width: 60%;
  height: 100%;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
  margin-bottom: 100px;
  max-width: 700px;
}
h1 {
  font-size: 30px;
  margin-bottom: 70px;
}
h3 {
  text-align: left;
  margin-bottom: 30px;
}
/* 좌우로 영역을 나누는 스타일 */
.form-grid {
  display: flex;
  justify-content: space-between;
}
.left-side, .right-side {
  width: 48%;
}
.input-container {
  margin-bottom: 15px;
  text-align: left;
}
/* 입력 필드 포커스 스타일 */
input:focus {
  outline: none;
  border-color: #F8A060;
}
label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: bold;
  color: #333;
  margin-left: 5px;
}
.terms-container {
  margin: 10px 0;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.terms-box {
  width: 100%;
  max-width: 400px;
  text-align: left;
}
.checkbox-container {
  display: flex;
  align-items: flex-start;
  cursor: pointer;
  margin-bottom: 15px;
  justify-content: left;
  text-align: left;
}
.custom-checkbox {
  width: 20px;
  height: 20px;
  min-width: 20px;
  border: 1px solid #b0b0b0;
  border-radius: 4px;
  margin-right: 10px;
  position: relative;
  background-color: white;
  flex-shrink: 0;
}
.custom-checkbox.checked {
  background-color: #F8A060;
  border: 1px solid #F8A060;
}
.custom-checkbox.checked::after {
  content: '';
  position: absolute;
  top: 3px;
  left: 6px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}
p {
  margin: 0;
  font-size: 12px;
  color: #333;
  line-height: 1.5;
  max-width: 450px;
}
input, select {
  width: 100%;
  padding: 10px;
  font-size: 14px;
  border: 1.5px solid #ddd;
  border-radius: 5px;
  box-sizing: border-box;
}
.signup-btn {
  width: 80%;
  padding: 12px;
  background-color: #f8a060;
  border: none;
  border-radius: 12px;
  font-size: 20px;
  color: white;
  cursor: pointer;
  margin-top: 10px;
  transition: background-color 0.5s ease;
}
.signup-btn:disabled {
  background-color: #ddd;
}
.signup-btn:hover {
  background-color: #f5812e;
  transition: background-color 0.2s ease;
}
.error-message {
  color: red;
  font-size: 12px;
}
.password-guideline {
  font-size: 12px;
  color: #777;
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
  white-space: nowrap;
}
/* 소셜 로그인 아이콘 */
.social-icons img {
  width: 50px;
  height: 50px;
  margin: 0 15px;
  cursor: pointer;
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
</style>