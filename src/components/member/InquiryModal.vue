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
        <option value="">카테고리</option>
        <!-- 카테고리 옵션들 -->
      </select>

      <label for="title">제목</label>
      <input v-model="title" id="title" type="text" placeholder="제목을 입력하세요" />

      <label for="content">내용</label>
      <textarea v-model="content" id="content" placeholder="내용을 입력하세요"></textarea>

      <div style="text-align: center">
        <button class="submit-button" @click="submitInquiry">등록</button>
        <button class="close-button" @click="close">취소</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedCategory: "",
      title: "",
      content: "",
    };
  },
  methods: {
    close() {
      this.$emit("close"); // 부모 컴포넌트로 'close' 이벤트를 전달
    },
    submitInquiry() {
      // 문의 등록 처리 로직
      this.$emit("close"); // 문의 제출 후 모달 닫기
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
