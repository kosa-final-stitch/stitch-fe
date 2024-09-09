<template>
  <div class="profile-edit">
    <h3>나의 정보</h3>
    <p>
      회원정보를 관리할 수 있습니다. 아래에서 정보를 수정하고 저장할 수
      있습니다.
    </p>

    <div class="info-section">
      <h4>내 정보</h4>
      <div class="info-row">
        <label for="name">이름</label>
        <input type="text" id="name" v-model="editableUserInfo.name" />
      </div>
      <div class="info-row">
        <label for="email">이메일</label>
        <input type="email" id="email" v-model="editableUserInfo.email" />
      </div>
      <div class="info-row">
        <label for="nickname">닉네임</label>
        <input type="text" id="nickname" v-model="editableUserInfo.nickname" />
      </div>
      <div class="info-row">
        <label for="gender">성별</label>
        <select id="gender" v-model="editableUserInfo.gender">
          <option value="남자">남자</option>
          <option value="여자">여자</option>
        </select>
      </div>
      <div class="info-row">
        <label for="phone">휴대전화</label>
        <input type="text" id="phone" v-model="editableUserInfo.phone" />
      </div>
      <div class="info-row">
        <label for="region">지역</label>
        <select id="region" v-model="editableUserInfo.region">
          <option value="서울특별시">서울특별시</option>
          <option value="부산광역시">부산광역시</option>
          <option value="대구광역시">대구광역시</option>
        </select>
      </div>
    </div>

    <!-- 비밀번호 변경 파트 -->
    <div class="edit-section">
      <h4>비밀번호 변경</h4>
      <button @click="togglePasswordFields" class="btn-toggle">
        비밀번호 변경 {{ showPasswordFields ? "숨기기" : "보이기" }}
      </button>

      <!-- 비밀번호 변경 필드 -->
      <div v-if="showPasswordFields" class="password-section">
        <div class="inform__block">
          <label class="form-label">현재 비밀번호* </label>
          <input
            type="password"
            v-model="currentPassword"
            placeholder="현재 비밀번호를 입력하세요"
            class="form-input"
          />
        </div>

        <div class="inform__block">
          <label class="form-label">새 비밀번호* </label>
          <input
            type="password"
            v-model="newPassword"
            placeholder="새 비밀번호를 입력하세요"
            class="form-input"
          />
        </div>

        <div class="inform__block">
          <label class="form-label">새 비밀번호 확인* </label>
          <input
            type="password"
            v-model="confirmPassword"
            placeholder="새 비밀번호를 다시 입력하세요"
            class="form-input"
          />
        </div>

        <div class="btn-save">
          <button type="button" class="btn" @click="changepw">
            비밀번호 저장
          </button>
        </div>
      </div>
    </div>

    <button class="submit-btn" @click="saveProfile">확인하기</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userInfo: {
        name: "김준영",
        email: "email@stitch.com",
        nickname: "김준영닉네임",
        gender: "남자",
        phone: "010-9330-0253",
        region: "서울특별시",
      },
      editableUserInfo: {
        name: "김준영",
        email: "email@stitch.com",
        nickname: "김준영닉네임",
        gender: "남자",
        phone: "010-9330-0253",
        region: "서울특별시",
      },
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      showPasswordFields: false, // 비밀번호 변경 필드 가시성 상태
    };
  },
  methods: {
    togglePasswordFields() {
      this.showPasswordFields = !this.showPasswordFields;
      console.log("비밀번호 변경 화면 보이기/숨기기");
    },
    changepw() {
      if (this.newPassword === this.confirmPassword) {
        alert("비밀번호가 변경되었습니다.");
      } else {
        alert("새 비밀번호가 일치하지 않습니다.");
      }
    },
    saveProfile() {
      this.userInfo = { ...this.editableUserInfo };
      alert("회원 정보가 저장되었습니다.");
    },
  },
};
</script>

<style scoped>
.profile-edit {
  max-width: 600px;
  margin: 0 auto;
  background-color: #f9f9f9;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h3 {
  text-align: center;
  color: #333;
}

p {
  text-align: center;
  margin-bottom: 30px;
  color: #666;
}

.info-section,
.edit-section {
  margin-bottom: 30px;
}

.info-section {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.info-row {
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-row label {
  flex: 1;
  margin-right: 10px;
}

.info-row input,
.info-row select {
  flex: 2;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ddd;
}

.edit-section h4 {
  margin-bottom: 10px;
  color: #333;
}

select,
input {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  margin-bottom: 15px;
  border-radius: 5px;
  border: 1px solid #ddd;
}

.button,
.btn-toggle {
  background-color: #ff6600;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 5px;
  margin-bottom: 10px;
}

.submit-btn,
.btn-save button {
  width: 100%;
  padding: 12px;
  background-color: #ff6600;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.submit-btn:hover,
.btn-save button:hover,
.btn-toggle:hover {
  background-color: #e65c00;
}
</style>
