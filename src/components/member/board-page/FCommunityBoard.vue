<!--
  작성자 : 박주희 

  2024-10-01 김호영 : 공지사항 상단 배치 기능 구현 
  
  -->

<template>
  <div class="board-container">
    <h1 class="board-title">자유 게시판</h1>
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
        <span :class="{ active: activeSort === 'recent' }" @click="setActiveSort('recent')"> 최근순 </span>
        <span :class="{ active: activeSort === 'popular' }" @click="setActiveSort('popular')"> 인기순 </span>
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
          <tr v-for="(item, index) in paginatedData" :key="index" :class="{'notice-row': item.isPinned}">
            <td>{{ index + 1 }}</td>
            <td @click="goToPostDetail(item.boardId)" class="clickable" 
            :style="{ color: item.isPinned ? '#007bff' : 'black', textAlign: 'left' }">
              <span v-if="item.isPinned"> (공지) </span>{{ item.title }}
            </td>
            <td>{{ item.adminName ||item.nickname || '알 수 없음' }}</td>
            <td>{{ formatDate(item.regdate) }}</td>
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
        <input type="text" v-model="searchKeyword" placeholder="검색어를 입력하세요..." @keyup.enter="searchPosts" />
        <button class="search-button" @click="searchPosts">
          <i class="fas fa-search"></i>
        </button>
      </div>
    </div>

    <div class="pagination">
      <button @click="previousPage" :disabled="currentPage === 1">&larr; Previous</button>
      <span :class="{ active: true }">{{ currentPage }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">Next &rarr;</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
// import PostDetail from './PostDetail.vue';  // 자식 컴포넌트를 import

export default {
  name: "BoardMain",
  components: {
  },
  data() {
    return {
      categories: ["전체", "취업정보", "시험정보", "공부방법", "기업정보", "국비정보"],
      activeTab: 0, // 현재 선택된 탭을 관리하는 변수
      activeSort: "recent",
      items: [],
      currentPage: 1,
      itemsPerPage: 10, // 한 페이지에 10개 항목
      selectedBoardId: null, // 선택된 게시글의 boardId를 저장
      searchKeyword: "", // 검색어 관리
    };
  },
  computed: {
    //공지사항만 따로 분리,
    pinnedNotices() {
      return this.items.filter(item => item.isPinned);
    },

    filteredItems() {
      const selectedCategory = this.categories[this.activeTab];
      let filtered = [];

      if (selectedCategory === "전체") {
        filtered = this.items;
      } else {
        filtered = this.items.filter((item) => item.category === selectedCategory);
      }
      
      // 검색어로 필터링
      if (this.searchKeyword) {
        filtered = filtered.filter((item) => item.title.includes(this.searchKeyword));
      }

      // 공지사항 상태에 따라 필터링 (비공개 상태의 공지사항은 제외)
      filtered = filtered.filter(item => item.status !== 'private');

      // 정렬 기준에 따라 정렬 (공지사항을 먼저 상단에 고정)
      const pinnedItems = filtered.filter(item => item.isPinned);
      const unpinnedItems = filtered.filter(item => !item.isPinned);

      if (this.activeSort === "popular") {
        // 게시글을 조회수 내림차순으로 정렬
        unpinnedItems.sort((a, b) => b.views - a.views);
      } else if (this.activeSort === "recent") {
        // 게시글을 최신순으로 정렬
        unpinnedItems.sort((a, b) => new Date(b.regdate) - new Date(a.regdate));
      }

      // 공지사항을 상단에 고정한 후 게시글을 이어 붙임
      return [...pinnedItems, ...unpinnedItems];
    },

    // 페이지네이션
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
      if (!date) return "날짜 없음"; // date가 없을 경우 처리

      // date가 문자열일 때 처리
      try {
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
          return "유효하지 않은 날짜"; // 유효하지 않은 날짜일 경우 처리
        }
        return parsedDate.toLocaleDateString(); // 날짜만 표시
      } catch (error) {
        return "날짜 없음"; // 변환 중 오류가 발생하면 기본값 반환
      }
    },

    // 게시글 목록을 불러오는 메서드 정의
    async fetchPosts() {
    try {
      // 공지사항 먼저 불러오기
      const noticeResponse = await axios.get("/api/notices");
      console.log("공지사항 데이터:", noticeResponse.data); // 여기에 작성자 정보가 포함되어 있는지 확인
      const notices = noticeResponse.data.map(notice => {
        return {
          ...notice,
          isPinned: true // 공지사항을 고정할 수 있도록 설정
        };
      });
      

      // 게시글 불러오기
      const postResponse = await axios.get("/api/board/community/all");
      const posts = postResponse.data.map(post => {
        return {
          ...post,
          isPinned: false // 일반 게시글은 고정하지 않음
        };
      });

      // 공지사항과 게시글을 합침
      this.items = [...notices, ...posts];


      // 공지사항 상단에 배치하려고 먼저 분리 후 정렬
      const pinnedItems = this.items.filter(item => item.isPinned);
      const unpinnedItems = this.items.filter(item => !item.isPinned);

      // 공지사항 그대로 상단에 배치, 최신순으로 정렬
      pinnedItems.sort((a, b) => new Date(b.regdate) - new Date(a.regdate)); // 공지사항 최신순 정렬
      unpinnedItems.sort((a, b) => new Date(b.regdate) - new Date(a.regdate)); // 게시글 최신순 정렬


      this.items = [...pinnedItems, ...unpinnedItems];

    } catch (error) {
      console.error("Error fetching posts or notices:", error);
    }
  
  },
    searchPosts() {
      if (!this.searchKeyword) {
        this.filteredItems = this.items; // 검색어가 없으면 전체 목록을 보여줌
      } else {
        this.filteredItems = this.items.filter((item) => item.title.includes(this.searchKeyword));
      }
      this.currentPage = 1; // 검색 후 첫 번째 페이지로 이동
    },
    goToPostForm() {
      this.$router.push("/board/PostForm"); // Vue Router를 사용하여 페이지 이동
    },
    goToPostDetail(boardId) {
      console.log("Board ID:", boardId); // boardId 값이 제대로 들어오는지 확인
      if (!boardId) {
        console.error("Board ID is null or undefined");
        return;
      }
      this.$router.push({ name: "PostDetail", params: { boardId } }); // 라우터를 통해 페이지 이동
    },
    goToNoticeDetail(noticeId) {
      this.$router.push({ name: "NoticeDetail", params: { noticeId } });
    },
    setActiveSort(sortType) {
      this.activeSort = sortType;
      
      // 정렬 기준에 따라 공지사항과 게시글을 다시 정렬
      const pinnedItems = this.items.filter(item => item.isPinned);
      const unpinnedItems = this.items.filter(item => !item.isPinned);

      // 공지사항은 최신순으로 고정 (정렬 변경 시 영향 받지 않음)
      pinnedItems.sort((a, b) => new Date(b.regdate) - new Date(a.regdate));

      if (sortType === "recent") {
        // 게시글을 최신순으로 정렬
        unpinnedItems.sort((a, b) => new Date(b.regdate) - new Date(a.regdate));
      } else if (sortType === "popular") {
        // 게시글을 조회수 순으로 정렬
        unpinnedItems.sort((a, b) => b.views - a.views);
      }

      // 공지사항 상단 고정 후 게시글을 이어 붙임
      this.items = [...pinnedItems, ...unpinnedItems];
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

.category-tab {
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 50px; /* 둥근 테두리 */
  padding: 10px;
  width: 100%;
  max-width: 700px;
  height: 20px;
  margin: 0 auto; /* 가운데 정렬 */
}

/* 카테고리 탭 버튼 스타일 */
.category-tab button {
  border: none;
  background-color: transparent;
  cursor: pointer;
  padding: 10px 25px;
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

.board-table th,
.board-table td {
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
  transition:
    background-color 0.3s ease,
    color 0.3s ease;
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


/* 공지사항 행 전체에 배경색 적용 */
.notice-row {
  background-color: #f8f8f8; /* 공지사항 행 전체 배경색 */
}

/* 공지사항 제목에만 밑줄 및 파란색 적용 */
.notice-row .clickable {
  text-decoration: underline; /* 공지사항에만 밑줄 추가 */
  color: blue; /* 공지사항 제목은 파란색 */
  font-weight: 600;
}

/* 일반 게시글 제목에 밑줄 없음 */
.clickable {
  cursor: pointer;
  color: #333; /* 일반 게시글 제목은 검정색 */
  text-decoration: none; /* 일반 게시글에 밑줄 없음 */
}
</style>
