<!-- 
 담당자: 박요한 
 시작 일자: 2024.09.19
 설명 : 헤더의 1:1 문의하기 클릭 시 나오는 모달.
 ---------------------
 2024.09.22 박요한 | 컴포넌트 생성
 -->

<template>
  <div>
    <!-- 모달 배경 (오버레이) -->
    <div class="inquiry-modal-overlay" @click="close"></div>

    <!-- 모달 본문 -->
    <div class="inquiry-modal-container">
      <h2>문의 하기</h2>

      <label for="category">문의 유형</label>
      <select v-model="selectedCategory" id="category">
        <option value="" disabled>카테고리</option>
        <option value="service-use">서비스 이용</option>
        <option value="account-management">계정 관리</option>
        <option value="payment-issue">결제 관련</option>
        <option value="technical-support">기술 지원</option>
        <option value="content-feedback">콘텐츠 피드백</option>
        <option value="other">기타</option>
      </select>
      <p v-if="categoryError" style="color: red">카테고리를 선택해 주세요.</p>

      <label for="title">제목</label>
      <input v-model="title" id="title" type="text" maxlength="85" placeholder="제목을 입력하세요" />
      <p v-if="titleError" style="color: red">제목을 입력해 주세요.</p>

      <label for="content">내용</label>
      <textarea v-model="content" id="content" maxlength="333" placeholder="내용을 입력하세요"></textarea>
      <p v-if="contentError" style="color: red">내용을 입력해 주세요.</p>

      <div style="text-align: center">
        <button class="submit-button" @click="submitInquiry">등록</button>
        <button class="close-button" @click="close">취소</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      selectedCategory: "",
      title: "",
      content: "",
      categoryError: false,
      titleError: false,
      contentError: false,
    };
  },
  methods: {
    close() {
      this.$emit("close"); // 부모 컴포넌트로 'close' 이벤트를 전달
    },
    async submitInquiry() {
      // 유효성 검사
      this.categoryError = !this.selectedCategory;
      this.titleError = !this.title.trim(); // 공백만 있을 경우도 처리
      this.contentError = !this.content.trim(); // 공백만 있을 경우도 처리

      // 모든 항목이 유효할 때만 제출
      if (!this.categoryError && !this.titleError && !this.contentError) {
        try {
          // 문의 등록 처리
          await axios.post("/api/member/inquiry", {
            category: this.selectedCategory,
            title: this.title,
            content: this.content,
          });
          alert("문의가 성공적으로 등록되었습니다."); // 성공 메시지 출력
          this.$emit("close"); // 모달 닫기
        } catch (error) {
          console.error("문의 등록 실패:", error);
          alert("문의 등록에 실패했습니다. 다시 시도해주세요."); // 실패 시 메시지 출력
        }
      }
    },
  },
};
</script>

<style scoped>
.inquiry-modal-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* 화면 중앙 고정 */
  z-index: 2001;
  width: 400px;
  background-color: white;
  padding: 20px;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.inquiry-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* 배경 어둡게 */
  z-index: 2000;
  pointer-events: all;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
}

select,
input,
textarea {
  width: 100%;
  padding: 8px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

textarea {
  height: 150px;
}

.submit-button {
  background-color: #f28c00;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.close-button {
  background-color: #ccc;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 10px;
}

button:hover {
  background-color: #ffdf50;
}
</style>
