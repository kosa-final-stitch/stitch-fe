<template>
  <!-- 메인 컨테이너 -->
  <div class="post-management">
    <h1>게시판 글 관리</h1>
    <p>회원님께서 작성한 게시글 정보입니다.</p>

    <!-- 탭 버튼 -->
    <div class="tabs">
      <!-- 정보공유 게시판 탭 -->
      <button
        :class="{ active: selectedTab === 'info' }"
        @click="selectedTab = 'info'"
      >
        정보공유 게시판
      </button>
      <!-- Q&A 탭 -->
      <button
        :class="{ active: selectedTab === 'qna' }"
        @click="selectedTab = 'qna'"
      >
        Q&A
      </button>
      <!-- 자유게시판 탭 -->
      <button
        :class="{ active: selectedTab === 'free' }"
        @click="selectedTab = 'free'"
      >
        자유게시판
      </button>
    </div>

    <!-- 정보공유 게시판 테이블 -->
    <table v-if="selectedTab === 'info'">
      <thead>
        <tr>
          <th></th>
          <th>번호</th>
          <th>내용</th>
          <th>작성일</th>
          <th>최종 수정일</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(post, index) in infoPosts" :key="index">
          <td><input type="checkbox" /></td>
          <td>{{ index + 1 }}</td>
          <td>{{ post.content }}</td>
          <td>{{ post.createdAt }}</td>
          <td>{{ post.updatedAt }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Q&A 게시판 테이블 -->
    <table v-if="selectedTab === 'qna'">
      <thead>
        <tr>
          <th></th>
          <th>번호</th>
          <th>내용</th>
          <th>작성일</th>
          <th>최종 수정일</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(post, index) in qnaPosts" :key="index">
          <td><input type="checkbox" /></td>
          <td>{{ index + 1 }}</td>
          <td>{{ post.content }}</td>
          <td>{{ post.createdAt }}</td>
          <td>{{ post.updatedAt }}</td>
        </tr>
      </tbody>
    </table>

    <!-- 자유게시판 테이블 -->
    <table v-if="selectedTab === 'free'">
      <thead>
        <tr>
          <th></th>
          <th>번호</th>
          <th>내용</th>
          <th>작성일</th>
          <th>최종 수정일</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(post, index) in freePosts" :key="index">
          <td><input type="checkbox" /></td>
          <td>{{ index + 1 }}</td>
          <td>{{ post.content }}</td>
          <td>{{ post.createdAt }}</td>
          <td>{{ post.updatedAt }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      selectedTab: "info", // 기본 선택된 탭
      infoPosts: [], // 정보공유 게시판 데이터
      qnaPosts: [], // Q&A 게시판 데이터
      freePosts: [], // 자유게시판 데이터
    };
  },
  methods: {
    fetchPosts() {
      // 정보공유 게시판 데이터 가져오기
      axios
        .get("http://localhost:8080/api/info-posts") // 실제 API 경로를 입력
        .then((response) => {
          this.infoPosts = response.data;
        })
        .catch((error) => {
          console.error(
            "정보공유 게시판 데이터를 가져오는 중 오류 발생",
            error
          );
        });

      // Q&A 게시판 데이터 가져오기
      axios
        .get("http://localhost:8080/api/qna-posts") // 실제 API 경로를 입력
        .then((response) => {
          this.qnaPosts = response.data;
        })
        .catch((error) => {
          console.error("Q&A 게시판 데이터를 가져오는 중 오류 발생", error);
        });

      // 자유게시판 데이터 가져오기
      axios
        .get("http://localhost:8080/api/free-posts") // 실제 API 경로를 입력
        .then((response) => {
          this.freePosts = response.data;
        })
        .catch((error) => {
          console.error("자유게시판 데이터를 가져오는 중 오류 발생", error);
        });
    },
  },
  mounted() {
    this.fetchPosts(); // 컴포넌트가 마운트되면 데이터를 가져옴
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
