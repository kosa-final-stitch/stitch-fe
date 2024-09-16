<!--작성자 : 박주희 -->

<template>
  <MemberHeader></MemberHeader>
  <div class="board-container">
    <!-- 뒤로가기 버튼 -->
    <router-link to="/board/FCommunityBoard" class="back-button">
      <span>&lt; 뒤로가기</span>
    </router-link>

    <!-- 게시판 제목 -->
    <h1 class="board-title">정보공유 게시판</h1>

    <!-- 게시글 -->
    <div class="post-section">
      <div class="post-header">
        <div class="category">공부방법</div>
        <div class="title">공부할 때 GPT 사용 괜찮을까요? [2]</div>
        <div class="meta-info">
          <span class="author">박주희</span>
          <span class="date">2024-09-02</span>
          <span class="views">조회 4</span>
        </div>
      </div>

      <div class="post-content">
        <p>안녕하세요. 취준 준비중인 학생입니다.</p>
        <p>개발공부를 하며 GPT사용을 권장하셔서 유료버전을 열심히 사용하고 있는데..</p>
        <p>Gpt를 사용하지만요 구글링으로 문제를 해결하는것과 Gpt를 잘 이용하는것이 좋다는 조언을 들었습니다.</p>
        <p>여러분은 어떻게 공부하고 계시나요</p>
        <p>혹시 현업에서 계셨던 분들중 업무에서 사용해보신 적이 있으신가요?</p>
      </div>
    </div>

    <!-- 댓글 섹션 -->
    <div class="comment-section">
      <div class="comment">
        <div class="comment-header">
          <span class="comment-author">김명중</span>
          <span class="comment-date">2024.09.02 17:42</span>
        </div>
        <div class="comment-content">협업에서 주수준은 느낌으로 사용한다면 문제없을 것 같아요!</div>
      </div>
      <div class="comment">
        <div class="comment-header">
          <span class="comment-author">박주희</span>
          <span class="comment-date">2024.09.02 17:45</span>
        </div>
        <div class="comment-content">감사합니다!</div>
      </div>
    </div>
  </div>
</template>

<script>
// import axios from 'axios';
import MemberHeader from '../member-header/MemberHeader.vue';
// import { useMemberStore } from '/src/store/member-store'; // Pinia 상태관리에서 memberStore 가져오기

export default {
  name: "PostDetail",
  components: {
    MemberHeader,
  },
};
</script>

<style scoped>
.board-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  font-family: 'Arial', sans-serif;
}

.back-button {
  display: block;
  margin-bottom: 20px;
  color: #f28c28;
  text-decoration: none;
}

.board-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
}

.post-section {
  border: 1px solid #ddd;
  padding: 20px;
  margin-bottom: 30px;
}

.post-header .category {
  color: #f28c28;
  font-weight: bold;
  margin-bottom: 10px;
}

.post-header .title {
  font-size: 20px;
  margin-bottom: 10px;
}

.meta-info {
  font-size: 12px;
  color: #666;
}

.post-content {
  margin-top: 20px;
  line-height: 1.5;
}

.comment-section {
  border-top: 1px solid #ddd;
  padding-top: 20px;
}

.comment {
  margin-bottom: 20px;
}

.comment-header {
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
}

.comment-content {
  font-size: 16px;
  color: #333;
}
</style>