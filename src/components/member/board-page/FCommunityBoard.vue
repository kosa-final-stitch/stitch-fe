<!--작성자 : 박주희 -->

<template>
  <MemberHeader></MemberHeader>
  <div class="board-container">
    <h1 class="board-title">정보공유 게시판</h1>
    <h5 class="board-description">자유롭게 여러분의 의견을 입력하세요.</h5>
    <div class="category-tab">
      <button
          v-for="(category, index) in categories"
          :key="index"
          :class="{ active: activeTab === index }"
          @click="activeTab = index"
      >
        {{ category }}
      </button>
    </div>
    <div class="board-header">
      <button class="write" @click="goToPostForm">글쓰기</button>
      <div class="sort-options">
         <span
             :class="{ active: activeSort === 'recent' }"
             @click="setActiveSort('recent')"
         >
          최근순
        </span>
        <span
            :class="{ active: activeSort === 'popular' }"
            @click="setActiveSort('popular')"
        >
          인기순
        </span>
      </div>
    </div>
    <div class="table-container">
      <table class="board-table">
        <thead>
        <tr>
          <th>번호</th>
          <th>제목</th>
          <th>작성자</th>
          <th>등록일</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, index) in paginatedData" :key="index">
          <td>{{ index + 1 }}</td>
          <td>{{ item.title }}</td>
          <td>{{ item.author }}</td>
          <td>{{ item.date }}</td>
        </tr>
        <!-- 빈 항목을 채우기 위한 추가 빈 줄 -->
        <tr v-for="i in emptyRows" :key="'empty-' + i">
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
        </tr>
        </tbody>
      </table>
    </div>
    <div class="search-bar">
      <div class="search-wrapper">
        <input type="text" placeholder="검색어를 입력하세요..." />
        <button class="search-button">
          <i class="fas fa-search"></i>
        </button>
      </div>
    </div>

    <div class="pagination">
      <button @click="previousPage" :disabled="currentPage === 1">
        &larr; Previous
      </button>
      <span :class="{ active: true }">{{ currentPage }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">
        Next &rarr;
      </button>
    </div>
  </div>
</template>

<script>
import MemberHeader from '../member-header/MemberHeader.vue';

export default {
  name: "BoardMain",
  components: {
    MemberHeader,
  },
  data() {
    return {
      categories: ["취업정보", "시험정보", "공부방법", "기업정보", "국비정보"],
      activeTab: 0, // 현재 선택된 탭을 관리하는 변수
      activeSort: 'recent',
      items: [
        { title: '공부 할 때 GPT 사용 괜찮을까요?', author: '박쓸개', date: '2024-09-02' },
        { title: '공부 할 때 GPT 사용 괜찮을까요?', author: '박쓸개', date: '2024-09-02' },
        { title: '공부 할 때 GPT 사용 괜찮을까요?', author: '박쓸개', date: '2024-09-02' },
        { title: '공부 할 때 GPT 사용 괜찮을까요?', author: '박쓸개', date: '2024-09-02' },
        { title: '공부 할 때 GPT 사용 괜찮을까요?', author: '박쓸개', date: '2024-09-02' },
        { title: '공부 할 때 GPT 사용 괜찮을까요?', author: '박쓸개', date: '2024-09-02' },
        { title: '공부 할 때 GPT 사용 괜찮을까요?', author: '박쓸개', date: '2024-09-02' },
        { title: '공부 할 때 GPT 사용 괜찮을까요?', author: '박쓸개', date: '2024-09-02' },
        { title: '공부 할 때 GPT 사용 괜찮을까요?', author: '박쓸개', date: '2024-09-02' },
        { title: '공부 할 때 GPT 사용 괜찮을까요?', author: '박쓸개', date: '2024-09-02' },
        { title: '공부 할 때 GPT 사용 괜찮을까요?', author: '박쓸개', date: '2024-09-02' },
        { title: '공부 할 때 GPT 사용 괜찮을까요?', author: '박쓸개', date: '2024-09-02' },
        { title: '공부 할 때 GPT 사용 괜찮을까요?', author: '박쓸개', date: '2024-09-02' },
        { title: '공부 할 때 GPT 사용 괜찮을까요?', author: '박쓸개', date: '2024-09-02' },
        { title: '공부 할 때 GPT 사용 괜찮을까요?', author: '박쓸개', date: '2024-09-02' },
        { title: '공부 할 때 GPT 사용 괜찮을까요?', author: '박쓸개', date: '2024-09-02' },
        { title: '공부 할 때 GPT 사용 괜찮을까요?', author: '박쓸개', date: '2024-09-02' },
        { title: '공부 할 때 GPT 사용 괜찮을까요?', author: '박쓸개', date: '2024-09-02' },
        { title: '공부 할 때 GPT 사용 괜찮을까요?', author: '박쓸개', date: '2024-09-02' },
        { title: '공부 할 때 GPT 사용 괜찮을까요?', author: '박쓸개', date: '2024-09-02' },
        { title: '공부 할 때 GPT 사용 괜찮을까요?', author: '박쓸개', date: '2024-09-02' },
        { title: '공부 할 때 GPT 사용 괜찮을까요?', author: '박쓸개', date: '2024-09-02' },
        { title: '공부 할 때 GPT 사용 괜찮을까요?', author: '박쓸개', date: '2024-09-02' },
        { title: '공부 할 때 GPT 사용 괜찮을까요?', author: '박쓸개', date: '2024-09-02' },
        { title: '공부 할 때 GPT 사용 괜찮을까요?', author: '박쓸개', date: '2024-09-02' },
        { title: '공부 할 때 GPT 사용 괜찮을까요?', author: '박쓸개', date: '2024-09-02' },
        { title: '공부 할 때 GPT 사용 괜찮을까요?', author: '박쓸개', date: '2024-09-02' },
        { title: '공부 할 때 GPT 사용 괜찮을까요?', author: '박쓸개', date: '2024-09-02' },
        { title: '공부 할 때 GPT 사용 괜찮을까요?', author: '박쓸개', date: '2024-09-02' },
        { title: '공부 할 때 GPT 사용 괜찮을까요?', author: '박쓸개', date: '2024-09-02' },
        { title: '공부 할 때 GPT 사용 괜찮을까요?', author: '박쓸개', date: '2024-09-02' },
        { title: '오늘 면접 보고 왔습니다.', author: '김땅콩', date: '2024-08-31' },
        // 더 많은 데이터 추가
      ],
      currentPage: 1,
      itemsPerPage: 10, // 한 페이지에 10개 항목
    };
  },
  computed: {
    paginatedData() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.items.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.items.length / this.itemsPerPage);
    },
  },
  methods: {
    goToPostForm() {
      this.$router.push('/board/PostForm'); // Vue Router를 사용하여 페이지 이동
    },
    setActiveSort(sortType) {
      this.activeSort = sortType;
    },
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
  },
};
</script>

<style scoped>
.board-container {
  width: 100%;
  padding: 20px;
  text-align: center;
  box-sizing: border-box;
}

.board-title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 10px;
}

.board-description {
  font-size: 1rem;
  margin-bottom: 20px;
  color: #666;
}

.category-tab{
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 50px; /* 둥근 테두리 */
  padding: 10px;
  width: 100%;
  max-width : 600px;
  height: 20px;
  margin: 0 auto; /* 가운데 정렬 */

}

/* 카테고리 탭 버튼 스타일 */
.category-tab button {
  border: none;
  background-color: transparent;
  cursor: pointer;
  padding: 10px 30px;
  margin: 0;
  font-size: 1rem;
  color: #333;
  position: relative;
  transition: color 0.3s ease;
}

/* 버튼 사이 구분선 추가 */
.category-tab button:not(:last-child)::after {
  content: "";
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 1px;
  height: 20px;
  background-color: #ddd;
}

/* 클릭된 탭에 대한 스타일 */
.category-tab button.active {
  color: #f28c28; /* 주황색 */
  font-weight: bold;
}

.board-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding: 10px 0;
  border-bottom: 2px solid #000; /* 하단 구분선 */
  width: 90%; /* 너비를 90%로 설정 */
  margin: 0 auto; /* 중앙 정렬 */
}

.write {
  background-color: transparent;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  color: #333;
  transition: color 0.3s ease;
  padding: 5px 10px;
  margin-bottom: 10px;
}

.write:hover {
  color: #f28c28;
}

.write.active {
  color: #f28c28;
  font-weight: bold;
}

.sort-options {
  display: flex;
  gap: 20px;
}

.sort-options span {
  cursor: pointer;
  font-size: 1rem;
  color: #333;
}

.sort-options span:hover {
  color: #f28c28; /* 주황색 */
}

.sort-options span.active {
  color: #f28c28; /* 주황색 */
  font-weight: bold;
}

.board-table {
  width: 90%;
  margin: 0 auto;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.board-table th, .board-table td {
  border: none;
  border-bottom: 1px solid #ddd; /* 가로선만 남김 */
  padding: 10px;
  text-align: center;
  word-wrap: break-word;
}

.search-bar {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.search-wrapper {
  display: flex;
  align-items: center;
  position: relative;
}

.search-bar input {
  padding: 10px;
  padding-right: 40px;
  width: 300px;
  max-width: 100%;
  border-radius: 30px;
  border: 1px solid #ddd;
  font-size: 1rem;
  box-sizing: border-box;
}

.search-button {
  position: absolute;
  right: 10px;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #f28c28;
  font-size: 1.2rem;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px; /* 버튼 사이의 간격을 넓게 설정 */
}

.pagination button,
.pagination span {
  padding: 10px 18px; /* 버튼과 페이지 번호에 충분한 여백을 줌 */
  border: none;
  background-color: transparent;
  font-size: 1rem;
  color: #333;
  cursor: pointer;
  border-radius: 30px; /* 둥근 모서리 */
  transition: background-color 0.3s ease, color 0.3s ease;
}

.pagination button:disabled {
  color: #ccc; /* 비활성화된 버튼 색상 */
  cursor: not-allowed;
}

.pagination span.active {
  background-color: #f28c28; /* 주황색 배경 */
  color: white;
}

.pagination span:hover,
.pagination button:hover {
  background-color: #f28c28; /* 마우스 오버 시 배경색 */
  color: white;
}

.pagination .dots {
  cursor: default;
  pointer-events: none;
  color: #ccc;
}

</style>