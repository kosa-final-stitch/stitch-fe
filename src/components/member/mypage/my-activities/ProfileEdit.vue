<template>
  <div class="profile-edit">
    <h3>나의 정보</h3>
    <p>
      회원정보를 관리할 수 있습니다. 아래에서 정보를 수정하고 저장할 수
      있습니다.
    </p>

    <div class="info-section">
      <h4>내 정보</h4>
      <div class="info-row">이름: 김준영</div>
      <div class="info-row">이메일: email@stitch.com</div>
      <div class="info-row">닉네임: 김준영닉네임</div>
      <div class="info-row">성별: 남자</div>
      <div class="info-row">휴대전화: 010-9330-0253</div>
    </div>

    <div class="edit-section">
      <h4>기본 정보 변경</h4>
      <label for="region">지역</label>
      <select id="region">
        <option>서울특별시</option>
        <option>부산광역시</option>
        <!-- 다른 지역 옵션 -->
      </select>
      <button>변경하기</button>

      <h4>비밀번호 변경</h4>
      <!--비번 변경 필드 숨김-->
      <!-- 비밀번호 변경 입력 필드 숨김상태-->
      <div>
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

    <button class="submit-btn">확인하기</button>
  </div>
</template>

<script>
export default {
  name: "ProfileEdit",
};
</script>

<style scoped>
.profile-edit {
  padding: 20px;
  background-color: white;
  border-radius: 5px;
}

.info-section,
.edit-section {
  margin-bottom: 20px;
}

.info-row {
  margin-bottom: 5px;
}

.submit-btn {
  background-color: #ff6600;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
}
</style>
