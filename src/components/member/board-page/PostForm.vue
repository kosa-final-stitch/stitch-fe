<!--작성자 : 박주희 -->

<template>
  <MemberHeader></MemberHeader>
  <div class="board-container">
    <router-link to="/board/FCommunityBoard" class="back-button">
      <span>&lt; 뒤로가기</span>
    </router-link>

    <div class="board-main">
      <h1>정보공유 게시판</h1>
      <form @submit.prevent="submitPost">
        <div class="form-group category-group">
          <select v-model="category" id="category" class="category-select">
            <option disabled value="">카테고리</option>
            <option>취업정보</option>
            <option>시험정보</option>
            <option>공부방법</option>
            <option>기업정보</option>
            <option>국비정보</option>
          </select>
        </div>

        <div class="form-group">
          <input
              type="text"
              v-model="title"
              placeholder="제목을 입력하세요"
              class="title-input"
              required
          />
          <div class="line"></div> <!-- 라인 추가 -->
        </div>

        <div class="form-group">
          <textarea
              v-model="content"
              placeholder="내용을 입력하세요"
              class="content-input"
              required
          ></textarea>
          <div class="line"></div> <!-- 라인 추가 -->
        </div>
        <div class="button-group">
          <button type="button" @click="cancelPost" class="cancel-button">취소</button>
          <button type="submit" class="submit-button">등록</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import MemberHeader from '../member-header/MemberHeader.vue';

export default {
  name: "BoardMain",
  components: {
    MemberHeader,
  },
  data() {
    return {
      category: '',
      title: '',
      content: '',
      tag: '', // 선택 사항
    };
  },
  methods: {
    async submitPost() {
      if (this.title && this.content && this.category) {
        try {
          await axios.post('/api/member/community/create', {
            category: this.category,
            title: this.title,
            content: this.content,
            tag: this.tag || null,  // tag 필드가 비어 있으면 null로 보냄
            memberId: 1, // 임시로 1번 회원 아이디를 넣습니다.
          });
        alert('게시글이 등록되었습니다.');
          this.$router.push('/member/board/free-community'); // 작성 후 게시판 목록으로 이동
        } catch (error) {
          console.error("Error creating post:", error);
        }
      } else {
        alert('모든 필드를 입력해 주세요.');
        // 실제 게시글 등록 로직을 추가하세요
      }
    },
    cancelPost() {
      this.title = '';
      this.content = '';
      this.category = '';
      this.tag = ''; // 선택 사항 리셋
    },
  },
};
</script>

<style scoped>
.board-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 30px;
  position: relative;
}

.board-main {
  width: 70%;
  margin-top: 20px;
}

.back-button {
  position: absolute;
  top: 10px; /* 헤더와의 간격을 조정 */
  left: 20px; /* 왼쪽으로 약간의 여백을 둠 */
  font-size: 1rem;
  color: #000;
  text-decoration: none;
}


h1 {
  text-align: center;
  font-size: 2rem;
  font-weight: bold;
}

.form-group {
  margin-bottom: 20px;
  position: relative;
}



.category-group {
  display: flex;
  justify-content: flex-start;
  width: 100%;
}

.category-select {
  width: 20%; /* 카테고리 크기를 줄임 */
  padding: 8px;
  border: 1px solid #ccc;
  font-size: 0.9rem;
  margin-bottom: 10px;
}

input, select, textarea {
  width: 100%;
  padding: 10px;
  font-size: 1rem;
  border: none;
  border-radius: 0;
  outline: none;
  background-color: transparent;
  color: #333;
}
.line {
  height: 1px;
  background-color: #ccc;
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
}
textarea {
  height: 250px;
  resize: none;
}

.button-group {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

button {
  padding: 10px 30px;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.cancel-button {
  background-color: #ccc;
  margin-right: 20px;
}

.submit-button {
  background-color: #f28c28;
  color: white;
}

button:hover {
  opacity: 0.8;
}
</style>