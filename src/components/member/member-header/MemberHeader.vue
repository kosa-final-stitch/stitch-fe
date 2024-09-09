<template>
  <header class="member-header">
    <nav class="nav-menu">
      <div class="left-side">
        <ul class="nav-items">
          <li v-if="isAuthenticated && !isMyPage">
            <a href="/mypage">마이페이지</a>
          </li>
          <li v-else-if="!isAuthenticated && !isMyPage">
            <a href="/login">로그인</a>
          </li>
          <li v-if="isAuthenticated">
            <a @click="confirmLogout" class="logout-link">로그아웃</a>
          </li>
          <li v-else>
            <a href="/signup">회원가입</a>
          </li>
        </ul>
      </div>

      <div class="right-side">
        <ul class="nav-items">
          <li class="nav-item" @mouseover="showDropdown" @mouseout="hideDropdown">
            <div class="nav-menu">
              <a>문의하기</a>
              <a>교육과정 정보</a>
              <a>게시판</a>
            </div>
            <div v-show="isDropdownVisible" class="dropdown-container" @mouseover="showDropdown" @mouseout="hideDropdown">
              <div class="dropdown-section">
                <h4>문의하기</h4>
                <ul>
                  <li><a href="/inquiry">1:1 문의 하러가기</a></li>
                </ul>
              </div>
              <div class="dropdown-section">
                <h4>교육과정 정보</h4>
                <ul>
                  <li><a href="/course/AcademyInfoList">학원 정보</a></li>
                  <li><a href="/course/CourseInfoList">교육과정 정보</a></li>
                </ul>
              </div>
              <div class="dropdown-section">
                <h4>게시판</h4>
                <ul>
                  <li><a href="/board/InfoShareBoard">정보 공유</a></li>
                  <li><a href="/board/FCommunityBoard">자유 게시판</a></li>
                  <li><a href="/board/QnABoard">Q&A</a></li>
                </ul>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </nav>

    <div class="logo-container">
      <img @click="goHome" src="@/assets/full-logo.jpg" alt="Stitch 로고" class="logo" />
    </div>

    <div class="search-container">
      <input type="text" v-model="searchText" placeholder="과정명, 강사이름 검색" class="search-input" @keyup.enter="handleSearch" />
      <button class="clear-btn" @click="clearSearch">X</button>
    </div>
  </header>
</template>

<script>
import { useMemberStore } from '@/store/member-store';

export default {
  data() {
    return {
      searchText: '', // 검색창에 입력된 텍스트를 관리하는 변수
      isDropdownVisible: false, // 전체 드롭다운 상태
    };
  },
  computed: {
    isAuthenticated() {
      const store = useMemberStore();
      return store.isAuthenticated;
    },
    isMyPage() {
      return this.$route && this.$route.path === '/mypage';
    },
  },
  methods: {
    goHome() {
      this.$router.push('/');
    },
    clearSearch() {
      this.searchText = '';
    },
    handleSearch() {
      if (this.searchText) {
        this.$router.push(`/search?query=${this.searchText}`);
      }
    },
    confirmLogout() {
      if (confirm('정말 로그아웃 하시겠습니까?')) {
        this.logout();
      }
    },
    logout() {
      const store = useMemberStore();
      store.logout();
      alert('로그아웃되었습니다.');
    },
    showDropdown() {
      this.isDropdownVisible = true;
    },
    hideDropdown() {
      this.isDropdownVisible = false;
    },
  },
};
</script>

<style scoped>
.member-header {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
  background-color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
}

.nav-menu {
  width: 95%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 0px;
  margin-right: 50px;
}

.left-side, .right-side {
  display: flex;
  flex-wrap: nowrap;
}

.nav-items {
  list-style: none;
  display: flex;
  gap: 30px;
  font-size: 18px;
  margin: 0;
  flex-wrap: nowrap;
}

.nav-item {
  list-style: none;
  cursor: pointer;
}

.nav-items li a,
.nav-item li a {
  text-decoration: none;
  color: rgb(61, 61, 61);
  font-weight: 500;
  white-space: nowrap;
  transition: all 0.1s ease;
}

.nav-items li a:hover,
.nav-item li a:hover {
  color: #F8A060;
}

.dropdown-container {
  position: absolute;
  top: 44px;
  left: 0;
  right: 0;
  background-color: white;
  box-shadow: 0 12px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  display: flex;
  justify-content: space-around;
  z-index: 999;
}

.dropdown-section {
  flex-grow: 1;
  margin: 0 50px;
  text-align: right; /* 텍스트 오른쪽 정렬 */
}

.dropdown-section h4 {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
}

.dropdown-section ul {
  list-style: none;
  padding: 0;
  text-align: right; /* 리스트도 오른쪽 정렬 */
}

.dropdown-section li {
  margin-bottom: 10px;
}

.dropdown-section li a {
  color: rgb(61, 61, 61);
  text-decoration: none;
}

.dropdown-section li a:hover {
  color: #F8A060;
}

.logo-container {
  margin-bottom: 15px;
  cursor: pointer;
}

.logo {
  max-width: 150px;
}

.search-container {
  display: flex;
  align-items: center;
  border: 1.5px solid #ddd;
  border-radius: 10px;
  padding: 5px 10px;
  width: 50%;
  height: 40px;
  max-width: 1000px;
}

.search-input {
  border: none;
  outline: none;
  flex-grow: 1;
  font-size: 18px;
  padding: 5px;
}

.clear-btn {
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 16px;
  color: #888;
  padding: 5px;
}

.clear-btn:hover {
  color: #333;
}
</style>