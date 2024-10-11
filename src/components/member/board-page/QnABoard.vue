<!--작성자 : 박주희 -->

<template>
  <div class="board-container">
    <h1 class="board-title">QNA 게시판</h1>
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
          <td @click="goToPostDetail(item.boardId)" class="clickable">{{ item.title }}</td>
          <td>{{ item.nickname }}</td>
          <td>{{formatDate(item.regdate) }}</td>
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
        <input type="text" v-model="searchKeyword" placeholder="검색어를 입력하세요..." @keyup.enter="searchPosts"/>
        <button class="search-button" @click="searchPosts">
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
import axios from 'axios';
// import PostDetail from './PostDetail.vue';  // 자식 컴포넌트를 import

export default {
  name: "BoardMain",
  components: {
  },
  data() {
    return {
      categories: ["전체","취업정보", "시험정보", "공부방법", "기업정보", "국비정보"],
      activeTab: 0, // 현재 선택된 탭을 관리하는 변수
      activeSort: 'recent',
      items: [],
      currentPage: 1,
      itemsPerPage: 10, // 한 페이지에 10개 항목
      selectedBoardId: null,  // 선택된 게시글의 boardId를 저장
      searchKeyword: '' // 검색어 관리
    };
  },
  computed: {
    filteredItems() {
      const selectedCategory = this.categories[this.activeTab];
      let filtered = [];
      if (selectedCategory === "전체") {
        filtered = this.items;
      } else {
        filtered = this.items.filter(item => item.category === selectedCategory);      }
      // 검색어로 필터링
      if (this.searchKeyword) {
        filtered = filtered.filter(item => item.title.includes(this.searchKeyword));
      }
      // 정렬 기준에 따라 정렬
      if (this.activeSort === 'popular') {
        filtered.sort((a, b) => b.views - a.views); // 조회수 내림차순으로 정렬
      } else if (this.activeSort === 'recent') {
        filtered.sort((a, b) => new Date(b.regdate) - new Date(a.regdate)); // 최신순 정렬
      }

      return filtered;
    },
    paginatedData() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredItems.slice(start, end); // 필터링된 데이터의 일부만 반환
    },
    totalPages() {
      return Math.ceil(this.filteredItems.length / this.itemsPerPage); // 필터링된 데이터 기준으로 총 페이지 계산
    },
    emptyRows() {
      const rows = this.itemsPerPage - this.paginatedData.length;
      return rows > 0 ? rows : 0; // 남은 빈 줄 계산
    },
  },
  methods: {
    formatDate(date) {
      if (!date) return '날짜 없음'; // date가 없을 경우 처리

      // date가 문자열일 때 처리
      try {
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
          return '유효하지 않은 날짜'; // 유효하지 않은 날짜일 경우 처리
        }
        return parsedDate.toLocaleDateString(); // 날짜만 표시
      } catch (error) {
        return '날짜 없음'; // 변환 중 오류가 발생하면 기본값 반환
      }
    },

    // 게시글 목록을 불러오는 메서드 정의
    fetchPosts() {
      axios.get('https://stitchkosa.store/api/board/community/all')
          .then(response => {
            this.items = response.data; // 받아온 데이터를 items 배열에 저장
            console.log('Fetched items:', this.items); // 데이터 확인
            if (this.items.length > 0) {
              console.log('First item boardId:', this.items[0].boardId); // 첫 번째 항목의 boardId 확인
            }
          })
          .catch(error => {
            console.error("Error fetching posts:", error);
          });
    },
    searchPosts() {
      if (!this.searchKeyword) {
        this.filteredItems = this.items; // 검색어가 없으면 전체 목록을 보여줌
      } else {
        this.filteredItems = this.items.filter(item =>
            item.title.includes(this.searchKeyword)
        );
      }
      this.currentPage = 1; // 검색 후 첫 번째 페이지로 이동
    },
    goToPostForm() {
      this.$router.push('/board/PostForm'); // Vue Router를 사용하여 페이지 이동
    },
    goToPostDetail(boardId) {
      console.log('Board ID:', boardId);  // boardId 값이 제대로 들어오는지 확인
      if (!boardId) {
        console.error('Board ID is null or undefined');
        return;
      }
      this.$router.push({ name: 'PostDetail', params: { boardId } }); // 라우터를 통해 페이지 이동
    },
    setActiveSort(sortType) {
      this.activeSort = sortType;
      // 정렬 로직을 추가할 수 있음
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
  mounted() {
    this.fetchPosts(); // 컴포넌트가 마운트될 때 게시글 목록을 가져옴
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
  max-width : 700px;
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

.clickable {
  cursor: pointer;
  color: #007bff;
  text-decoration: underline;
}


</style>