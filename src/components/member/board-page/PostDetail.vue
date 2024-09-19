<!--작성자 : 박주희 -->

<template>
  <MemberHeader></MemberHeader>
  <div class="board-container">
    <!-- 뒤로가기 버튼 -->
    <router-link to="/board/free-community" class="back-button">
      <span>&lt; 뒤로가기</span>
    </router-link>

    <!-- 게시판 제목 -->
    <h1 class="board-title">정보공유 게시판</h1>

    <!-- 게시글 -->
    <div class="post-section" v-if="post">
      <div class="post-header">
        <div class="category">{{ post.category }}</div>
        <div class="title">{{ post.title }}</div>
<!--        <div class="title">{{ post.title }} [{{ post.commentCount }}]</div>-->
        <div class="meta-info">
          <span class="nickname">{{ post.nickname }}</span>
          <span class="date">{{ post.regdate }}</span>
<!--          <span class="views">조회 {{ post.views }}</span>-->
        </div>
      </div>

      <div class="post-content">
        <p v-for="paragraph in post.content.split('\n')" :key="paragraph">{{ paragraph }}</p>
      </div>
    </div>

    <!-- 댓글 섹션 -->
<!--    <div class="comment-section" v-if="comments.length">-->
<!--      <div class="comment" v-for="comment in comments" :key="comment.commentId">-->
<!--        <div class="comment-header">-->
<!--          <span class="comment-author">{{ comment.author }}</span>-->
<!--          <span class="comment-date">{{ comment.regdate }}</span>-->
<!--        </div>-->
<!--        <div class="comment-content">{{ comment.content }}</div>-->
<!--      </div>-->
<!--    </div>-->

    <!-- 로딩 중일 때 -->
    <div v-else-if="loading">
      <p>게시글을 불러오는 중입니다...</p>
    </div>

    <!-- 게시글이나 댓글이 없는 경우 -->
    <div v-else>
      <p>게시글을 찾을 수 없습니다.</p>
    </div>
  </div>


</template>

<script>
import axios from 'axios';
import MemberHeader from '../member-header/MemberHeader.vue';
// import { useMemberStore } from '/src/store/member-store'; // Pinia 상태관리에서 memberStore 가져오기

export default {
  name: "PostDetail",
  components: {
    MemberHeader,
  },
  props: {
    boardId: {
      type: Number,
      required: true, // boardId가 반드시 필요함
    }
  },
  data(){
    return {
      post: null, // 게시글 데이터
      comments: [], // 댓글 데이터
      loading: true // 로딩 상태
    };
  },
  watch: {
    // boardId가 변경될 때마다 게시글을 가져옴
    boardId: {
      immediate: true,
      handler(newBoardId) {
        this.fetchPost(newBoardId);
      }
    }
  },
  methods: {
    fetchPost(boardId) {
      // 게시글 데이터를 가져오는 API 호출
      axios.get(`/api/board/post/${boardId}`)
          .then(response => {
            this.post = response.data.post;
          })
          .catch(error => {
            console.error('Error fetching post:', error);
          })
          .finally(() => {
            this.loading = false;
          });
    }
  }
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