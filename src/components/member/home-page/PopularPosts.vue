<!-- 
 담당자: 박요한
 시작 일자: 2024.09.13
 설명 : 조회수 높은 게시글 목록
 ---------------------
 2024.09.13 박요한 | 컴포넌트 생성.
 2024.09.18 박요한 | 구체화.
 -->

<template>
  <div class="popular-posts">
    <h2>인기 게시글</h2>
    <div class="board-container">
      <!-- 정보 공유 게시판 -->
      <div class="board-section" v-if="infoSharePost">
        <h3>정보 공유</h3>
        <div class="post-card">
          <p>{{ infoSharePost.title }}</p>
          <p>조회수: {{ infoSharePost.views }}</p>
        </div>
        <more-button to="/board/info-share" />
      </div>

      <!-- 자유 게시판 -->
      <div class="board-section" v-if="freeCommunityPost">
        <h3>자유 게시판</h3>
        <div class="post-card">
          <p>{{ freeCommunityPost.title }}</p>
          <p>조회수: {{ freeCommunityPost.views }}</p>
        </div>
        <more-button to="/board/free-community" />
      </div>

      <!-- Q&A 게시판 -->
      <div class="board-section" v-if="qnaPost">
        <h3>Q&A 게시판</h3>
        <div class="post-card">
          <p>{{ qnaPost.title }}</p>
          <p>조회수: {{ qnaPost.views }}</p>
        </div>
        <more-button to="/board/qna" />
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import MoreButton from "./MoreButton.vue";

export default {
  components: { MoreButton },
  name: "PopularPosts",
  data() {
    return {
      infoSharePost: { title: "정보 공유 인기 게시글", views: 10 },
      freeCommunityPost: { title: "자유 게시판 인기 게시글", views: 10 },
      qnaPost: { title: "Q&A 인기 게시글", views: 10 },
    };
  },
  mounted() {
    this.fetchPopularPosts();
  },
  methods: {
    async fetchPopularPosts() {
      try {
        // 정보 공유 게시판 인기 게시글 가져오기
        const infoShareResponse = await axios.get("/api/home/posts/info-share/top");
        this.infoSharePost = infoShareResponse.data;
      } catch (error) {
        console.error("Error fetching info share post:", error);
      }

      try {
        // 자유 게시판 인기 게시글 가져오기
        const freeCommunityResponse = await axios.get("/api/home/posts/free-community/top");
        this.freeCommunityPost = freeCommunityResponse.data;
      } catch (error) {
        console.error("Error fetching free community post:", error);
      }

      try {
        // Q&A 게시판 인기 게시글 가져오기
        const qnaResponse = await axios.get("/api/home/posts/qna/top");
        this.qnaPost = qnaResponse.data;
      } catch (error) {
        console.error("Error fetching Q&A post:", error);
      }
    },
  },
};
</script>

<style scoped>
.popular-posts {
  margin: 0 auto;
}

.board-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.board-section {
  margin-bottom: 20px;
}

.post-card {
  border: 1px solid #ddd;
  padding: 25px;
  margin-bottom: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s ease;
}

.post-card:hover {
  transform: scale(1.05);
}
</style>
