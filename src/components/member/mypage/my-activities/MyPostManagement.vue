<template>
  <div class="post-management">
    <h1>게시판 글 관리</h1>
    <p>회원님께서 작성한 게시글 정보입니다.</p>

    <!-- 탭 버튼 -->
    <div class="tabs">
      <button :class="{ active: selectedTab === 'info' }" @click="selectedTab = 'info'">정보공유 게시판</button>
      <button :class="{ active: selectedTab === 'qna' }" @click="selectedTab = 'qna'">Q&A</button>
      <button :class="{ active: selectedTab === 'free' }" @click="selectedTab = 'free'">자유게시판</button>
    </div>

    <!-- 게시글 테이블 -->
    <table>
      <thead>
        <tr>
          <th>번호</th>
          <th>제목</th>
          <th>내용</th>
          <th>카테고리</th>
          <th>작성일</th>
          <!-- <th>최종 수정일</th> -->
        </tr>
      </thead>
      <tbody>
        <tr v-for="(post, index) in posts" :key="post.postId">
          <td>{{ index + 1 }}</td>
          <td>{{ post.title }}</td>
          <td>{{ post.content }}</td>
          <td>{{ post.category }}</td>
          <td>{{ formatDate(post.regdate) }}</td>
          <!-- <td>{{ formatDate(post.editdate) }}</td> -->
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from "axios";
import { useMemberStore } from "/src/store/member-store"; // Pinia 상태관리에서 memberStore 가져오기

export default {
  data() {
    return {
      selectedTab: "info", // 기본 탭 설정
      posts: [], // 모든 게시글 데이터를 저장
      memberId: null, // 로그인한 사용자 ID
    };
  },
  computed: {
    currentUser() {
      const memberStore = useMemberStore();
      return memberStore.member || { memberId: null }; // 현재 로그인한 사용자 정보
    },
    // 선택된 탭에 따라 게시글을 필터링
    filteredPosts() {
      return this.posts.filter((post) => post.category === this.selectedTab); // category로 필터링
    },
  },
  mounted() {
    this.memberId = this.currentUser.memberId;
    console.log("마페게시판 현재 사용자 정보:", this.memberId); // 컴포넌트가 마운트되면 사용자 정보 및 게시글 데이터를 가져옴
    if (this.memberId) {
      this.fetchPosts(); // 게시글을 가져옴
    }
  },
  methods: {
    fetchPosts() {
      // 로그인한 사용자 ID로 게시글을 가져옴

      axios
        .get(`/api/board/community/${this.memberId}`)
        .then((response) => {
          const posts = response.data; // 모든 게시글을 저장
          console.log("게시판 글들 :", posts); // 데이터를 확인

          if (Array.isArray(posts)) {
            this.posts = posts.map((post) => {
              return {
                boardId: post.boardId,
                category: post.category,
                content: post.content,
                editdate: post.editdate,
                regdate: post.regdate,
                title: post.title,
              };
            });
          } else {
            console.error("받아온 데이터가 배열이 아닙니다:", posts);
          }
        })
        .catch((error) => {
          console.error("게시글 데이터를 가져오는 중 오류 발생", error);
        });
    },

    // 날짜 형식 변환
    formatDate(date) {
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

/* 체크박스 스타일 */
input[type="checkbox"] {
  margin: 0;
}
</style>
