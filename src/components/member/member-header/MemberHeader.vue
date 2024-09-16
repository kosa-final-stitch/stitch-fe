<!-- 
 담당자: 김호영 
 시작 일자: 2024.09.06
 설명 : 헤더 컴포넌트 설정
 ---------------------
 2024.09.06 김호영 | 기능 담을 디자인 구현, 각 페이지 연결, 로그인 정보 위해 pinia 설정 
 2024.09.09 김호영 | 헤더 완.
 2024.09.10 김호영 | git 해결
 2024.09.11 김호영 | 마이페이지 버튼 출력 수정.
 2024.09.12 박요한 | 학원 정보, 교육 정보 네비 경로 수정.
 2024.09.13 박요한 | a 태그 router-link로 수정, router에 맞춰서 경로 수정.
 2024.09.16 박요한 | 로그아웃 시 localStorage JWT 토큰 제거
 -->
<template>
  <header class="member-header">
    <nav class="nav-menu">
      <div class="left-side">
        <ul class="nav-items">
          <li v-if="isAuthenticated && !isMyPage">
            <router-link to="/mypage">마이페이지</router-link>
          </li>
          <li v-else-if="!isAuthenticated && !isMyPage">
            <router-link to="/login">로그인</router-link>
          </li>
          <li v-if="isAuthenticated">
            <a @click="confirmLogout" class="logout-link">로그아웃</a>
          </li>
          <li v-else>
            <router-link to="/signup">회원가입</router-link>
          </li>
        </ul>
      </div>

      <div class="right-side">
        <ul class="nav-items">
          <li class="nav-item" @mouseover="showDropdown" @mouseout="hideDropdown">
            <div class="nav-menu">
              <div>문의하기</div>
              <div>교육과정 정보</div>
              <div>게시판</div>
            </div>
            <div :class="{ 'dropdown-container': true, show: isDropdownVisible }">
              <div class="dropdown-section">
                <h3>문의하기</h3>
                <ul>
                  <li><router-link to="/inquiry">1:1 문의 하러가기</router-link></li>
                </ul>
              </div>
              <div class="dropdown-section">
                <h3>교육과정 정보</h3>
                <ul>
                  <li><router-link to="/academies/academy">학원 정보</router-link></li>
                  <li><router-link to="/academies/courses">교육과정 정보</router-link></li>
                </ul>
              </div>
              <div class="dropdown-section">
                <h3>게시판</h3>
                <ul>
                  <li><router-link to="/board/info-share">정보 공유</router-link></li>
                  <li><router-link to="/board/free-community">자유 게시판</router-link></li>
                  <li><router-link to="/board/qna">Q&A</router-link></li>
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
      <input
        type="text"
        v-model="searchText"
        placeholder="과정명, 강사이름 검색"
        class="search-input"
        @keyup.enter="handleSearch"
      />
      <button class="clear-btn" @click="clearSearch">X</button>
    </div>
  </header>
</template>

<script>
import { useMemberStore } from "@/store/member-store";

export default {
  data() {
    return {
      searchText: "", // 검색창에 입력된 텍스트를 관리하는 변수
      isDropdownVisible: false, // 드롭다운 상태
    };
  },
  computed: {
    isAuthenticated() {
      const store = useMemberStore();
      return store.isAuthenticated;
    },
    isMyPage() {
      return this.$route && this.$route.path.startsWith("/mypage");
    },
  },
  methods: {
    goHome() {
      this.$router.push("/");
    },
    clearSearch() {
      this.searchText = "";
    },
    handleSearch() {
      if (this.searchText) {
        this.$router.push(`/search?query=${this.searchText}`);
      }
    },
    confirmLogout() {
      if (confirm("정말 로그아웃 하시겠습니까?")) {
        this.logout();
      }
    },
    logout() {
      const store = useMemberStore();
      store.logout(); // Pinia 스토어의 로그아웃 메서드 호출
      localStorage.removeItem("jwt"); // localStorage에서 JWT 토큰 제거
      alert("로그아웃되었습니다.");
      this.$router.push("/"); // 메인 페이지로 리다이렉트
    },
    showDropdown() {
      this.isDropdownVisible = true;
      document.body.classList.add("blurred"); // 블러 효과 적용
    },
    hideDropdown() {
      this.isDropdownVisible = false;
      document.body.classList.remove("blurred"); // 블러 효과 제거
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
.logout-link {
  cursor: pointer;
}

.nav-menu {
  width: 95%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 0px;
  margin-right: 50px;
}

.left-side,
.right-side {
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
  color: #f8a060;
}

/* 드롭다운 애니메이션 */
.dropdown-container {
  position: absolute;
  top: 44px;
  left: 0;
  right: 0;
  background-color: white;
  box-shadow: 0 12px 8px rgba(0, 0, 0, 0.1);

  display: flex;
  justify-content: space-around;
  z-index: 999;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.5s ease; /* 부드러운 애니메이션 */
}

.dropdown-container.show {
  max-height: 400px; /* 드롭다운 최대 높이 */
}

.dropdown-section {
  flex-grow: 1;
  margin: 20px 80px 20px 0px;
  text-align: right; /* 텍스트 오른쪽 정렬 */
}

.dropdown-section h3 {
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
  font-size: 14px;
}

.dropdown-section li a:hover {
  color: #f8a060;
}

/* 배경 블러 효과 */
.blurred {
  backdrop-filter: blur(5px); /* 블러 효과 */
  transition: backdrop-filter 0.3s ease; /* 부드러운 전환 */
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
/* 검색창의 input에 포커스가 들어올 때 search-container의 스타일을 변경 */
.search-input:focus + .clear-btn, /* 추가적으로 clear-btn의 스타일을 변경하고 싶으면 사용 */
.search-input:focus {
  outline: none; /* 기본 아웃라인 제거 */
}
.search-input:focus {
  border-color: #f8a060; /* 포커스 시 테두리 색상 변경 */
}
.search-container:focus-within {
  border-color: #f8a060; /* 검색창에 포커스가 있을 때 테두리 색상 변경 */
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

/* 반응형 처리를 위한 추가 */
@media (max-width: 800px) {
  .search-container {
    width: 80%; /* 화면이 좁아지면 검색창을 80%로 설정 */
  }
  .nav-items {
    gap: 15px; /* 화면이 좁아질 때 항목 간 간격도 줄이기 */
  }
  .nav-items li a {
    font-size: 14px; /* 화면이 작아질 때 글씨 크기를 줄이기 */
  }
}
.search-input {
  font-size: 15px;
}
.search-input::placeholder {
  font-size: 12px; /* 화면이 좁아질 때 placeholder 크기 줄이기 */
}
@media (max-width: 400px) {
  .search-container {
    width: 80%; /* 화면이 더 좁아지면 검색창을 100%로 설정 */
  }
  .nav-items {
    gap: 15px; /* 더 좁아지면 항목 간 간격도 더 줄이기 */
  }
  .nav-items li a {
    font-size: 8px; /* 더 좁아지면 글씨 크기를 더 줄이기 */
  }
  .search-input {
    font-size: 10px; /* 더 좁아지면 입력창의 글씨 크기를 더 줄이기 */
  }
  .search-input::placeholder {
    font-size: 10px; /* 더 좁아지면 placeholder 크기를 더 줄이기 */
  }
}
</style>
