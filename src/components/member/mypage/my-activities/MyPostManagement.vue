<template>
  <div class="post-management">
    <h1>게시판 글 관리</h1>
    <p>회원님께서 작성한 게시글 정보입니다.</p>

    <!-- 탭 버튼 -->
    <div class="tabs">
      <button :class="{ active: selectedTab === 'info' }" @click="selectedTab = 'info'">정보공유 게시판</button>
      <button :class="{ active: selectedTab === 'qna' }" @click="selectedTab = 'qna'">Q&A</button>
      <button :class="{ active: selectedTab === 'community' }" @click="selectedTab = 'community'">자유게시판</button>
    </div>

    <!-- 게시글 테이블 -->
    <table v-if="posts.length > 0">
      <thead>
        <tr>
          <th>번호</th>
          <th>제목</th>
          <th>내용</th>
          <th>카테고리</th>
          <th>작성일</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(post, index) in posts" :key="post.boardId">
          <td>{{ index + 1 }}</td>
          <td>{{ post.title }}</td>
          <td>{{ post.content }}</td>
          <td>{{ post.category }}</td>
          <td>{{ formatDate(post.regdate) }}</td>
        </tr>
      </tbody>
    </table>

    <!-- 게시글이 없는 경우 -->
    <p v-else>게시글이 없습니다.</p>
  </div>
</template>

<script>
import axios from "axios";
import { useMemberStore } from "/src/store/member-store"; // Pinia 상태관리에서 memberStore 가져오기

export default {
  data() {
    return {
      selectedTab: "community", // 기본 탭 설정
      posts: [], // 모든 게시글 데이터를 저장
      memberId: null, // 로그인한 사용자 ID
    };
  },
  computed: {
    currentUser() {
      const memberStore = useMemberStore();
      return memberStore.member || { memberId: null }; // 현재 로그인한 사용자 정보
    },
  },
  watch: {
    // selectedTab이 변경될 때마다 fetchPosts 호출
    selectedTab() {
      this.fetchPosts();
    },
  },
  mounted() {
    this.memberId = this.currentUser.memberId;
    console.log("마페게시판 현재 사용자 정보:", this.memberId);
    if (this.memberId) {
      this.fetchPosts(); // 초기 데이터 로드
    }
  },
  methods: {
    fetchPosts() {
      let apiUrl = "";

      // 선택된 탭에 맞는 API 호출
      if (this.selectedTab === "info") {
        apiUrl = `https://stitchkosa.store/api/board/info/${this.memberId}`; // 정보공유 게시판 API
      } else if (this.selectedTab === "qna") {
        apiUrl = `https://stitchkosa.store/api/board/qna/${this.memberId}`; // Q&A 게시판 API
      } else if (this.selectedTab === "community") {
        apiUrl = `https://stitchkosa.store/api/board/community/${this.memberId}`; // 자유게시판 API
      }

      axios
        .get(apiUrl)
        .then((response) => {
          const posts = response.data || []; // 데이터가 없을 경우 빈 배열 처리
          console.log("게시판 글들 :", posts); // 데이터를 확인

          if (Array.isArray(posts)) {
            this.posts = posts.map((post) => {
              return {
                boardId: post.boardId,
                category: post.category,
                content: post.content,
                regdate: post.regdate,
                title: post.title,
              };
            });
          } else {
            console.error("받아온 데이터가 배열이 아닙니다:", posts);
            this.posts = []; // 배열이 아닌 경우 빈 데이터 처리s
          }
        })
        .catch((error) => {
          console.error("게시글 데이터를 가져오는 중 오류 발생", error);
          this.posts = []; // 오류 발생 시 빈 배열로 설정
        });
    },

    // 날짜 형식 변환
    formatDate(date) {
      if (!date) return null;
      return new Date(date).toLocaleDateString();
    },
  },
};
</script>

<style scoped>
/* 메인 컨테이너 스타일 */
.post-management {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

/* 탭 버튼 스타일 */
.tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

/* 탭 버튼 기본 스타일 */
.tabs button {
  padding: 10px 20px;
  margin: 0 5px;
  border: none;
  background-color: #f5f5f5;
  cursor: pointer;
}

/* 선택된 탭 버튼 스타일 */
.tabs .active {
  border-bottom: 2px solid orange;
  font-weight: bold;
}

/* 테이블 스타일 */
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

/* 테이블 헤더와 셀 스타일 */
th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}

/* 테이블 헤더 배경색 */
th {
  background-color: #f2f2f2;
}
</style>
