<template>
  <div class="profile-edit">
    <h3>나의 정보</h3>
    <p>회원정보를 관리할 수 있습니다. 아래에서 정보를 수정하고 저장할 수 있습니다.</p>

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
          <option value="남">남자</option>
          <option value="여">여자</option>
        </select>
      </div>
      <div class="info-row">
        <label for="phone">휴대전화</label>
        <input type="text" id="phone" v-model="editableUserInfo.phone" />
      </div>
      <div class="info-row">
        <label for="address">지역</label>
        <select id="address" v-model="editableUserInfo.address">
          <option value="서울특별시">서울특별시</option>
          <option value="부산광역시">부산광역시</option>
          <option value="대구광역시">대구광역시</option>
          <option value="경기도">경기도</option>
          <option value="전라도">전라도</option>
        </select>
      </div>
      <!-- 비밀번호 변경 필드 -->
      <div class="info-row">
        <label for="currentPassword">현재 비밀번호</label>
        <input type="password" id="currentPassword" v-model="editableUserInfo.currentPassword" />
      </div>
      <div class="info-row">
        <label for="newPassword">새 비밀번호</label>
        <input type="password" id="newPassword" v-model="editableUserInfo.newPassword" />
      </div>
      <div class="info-row">
        <label for="confirmPassword">새 비밀번호 확인</label>
        <input type="password" id="confirmPassword" v-model="editableUserInfo.confirmPassword" />
      </div>
    </div>

    <button class="submit-btn" @click="saveProfile">확인하기</button>
  </div>
</template>
<script>
import axios from "axios";

export default {
  data() {
    return {
      userId: null, // 실제 사용자 ID를 설정합니다.
      userInfo: {
        name: "",
        email: "",
        nickname: "",
        gender: "",
        phone: "",
        address: "",
      },
      editableUserInfo: {
        name: "",
        email: "",
        nickname: "",
        gender: "",
        phone: "",
        address: "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      },
    };
  },
  mounted() {
    this.fetchUserInfo();
  },
  methods: {
    // 사용자 정보를 서버에서 가져오는 함수
    fetchUserInfo() {
      axios
        .get("https://stitchkosa.store/api/member/info")
        .then((response) => {
          this.userInfo = response.data;
          console.log(JSON.stringify("사용자정보를 서버에서 가져오기" + JSON.stringify(this.userInfo)));
          this.editableUserInfo = { ...this.userInfo };
        })
        .catch((error) => {
          console.error("회원 정보를 불러오는 중 오류가 발생했습니다.", error);
        });
    },
    // 사용자 정보를 서버에 저장하는 함수
    saveProfile() {
      if (this.editableUserInfo.newPassword !== this.editableUserInfo.confirmPassword) {
        alert("새 비밀번호와 비밀번호 확인이 일치하지 않습니다.");
        return;
      }
      axios
        .put("https://stitchkosa.store/api/member/info", this.editableUserInfo)
        .then(() => {
          alert("회원 정보가 저장되었습니다.");
          this.userInfo = { ...this.editableUserInfo }; // 저장 후 현재 사용자 정보 업데이트
          console.log("업데이트저장" + JSON.stringify(this.userInfo));
        })
        .catch((error) => {
          console.error("회원 정보를 저장하는 중 오류가 발생했습니다.", error);
        });
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
