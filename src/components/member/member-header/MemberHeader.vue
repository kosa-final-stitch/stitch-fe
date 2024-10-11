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
 2024.09.16 박요한 | 로그아웃 시 localStorage JWT 토큰 제거.
 2024.09.19 박요한 | 검색창 컴포넌트 분리.
 2024.09.21 김호영 | 관리자 페이지 이동 버튼 추가
 2024.09.22 박요한 | 문의하기 모달 추가. + 로그인 상태만 열림.
 2024.09.23 김호영 | 관리자 로그인시 관리자 페이지 이동 상태 추가.
 2024.09.24 박요한 | fetchUserInfo 로그인된 경우만 실행.
 2024.09.26 김호영 | 헤더 디자인 수정
 -->
<template>
  <header class="member-header">
    <div class="header-container">
      <!-- 왼쪽에 로고가 들어가는 부분 -->
      <div class="logo-container">
        <img @click="goHome" src="@/assets/full-logo.jpg" alt="Stitch 로고" class="logo" />
      </div>

      <!-- 네비게이션 메뉴와 검색창 -->
      <nav class="nav-menu">
        <div class="left-side">
          <ul class="nav-items">
            <li class="nav-item" @mouseover="showDropdown" @mouseout="hideDropdown">
              <div class="nav-menu" style="font-weight: 600; color: #3d4046">
                <div>문의하기</div>
                <div>교육과정 정보</div>
                <div>게시판</div>
              </div>
              <div :class="{ 'dropdown-container': true, show: isDropdownVisible }">
                <div class="dropdown-section">
                  <h3>문의하기</h3>
                  <ul>
                    <li><a @click="handleInquiryClick">1:1 문의 하러가기</a></li>
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

      <!-- Search bar와 간격을 위해 container 적용 -->
      <div class="search-bar-container">
        <search-bar />
      </div>

      <!-- 오른쪽 로그인 및 회원가입 메뉴 -->
      <div class="right-container">
        <div class="auth-section">
          <ul class="nav-items">
            <li v-if="isAuthenticated">
              <router-link to="/mypage">마이페이지</router-link>
            </li>
            <li v-if="isAdmin">
              <router-link to="/admin">관리자 페이지</router-link>
            </li>
            <li v-else-if="!isAuthenticated">
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
      </div>
    </div>

    <!-- 문의하기 모달 -->
    <inquiry-modal v-if="inquiryModalVisible" @close="inquiryModalVisible = false" />
  </header>
</template>

<script>
import axios from "axios";
import { useMemberStore } from "@/store/member-store"; // Pinia 스토어 가져오기
import SearchBar from "./SearchBar.vue"; // 검색바 컴포넌트 가져오기
import InquiryModal from "../InquiryModal.vue"; // 문의하기 모달 가져오기

export default {
  components: { SearchBar, InquiryModal },
  data() {
    return {
      searchText: "", // 검색창에 입력된 텍스트 상태
      isDropdownVisible: false, // 드롭다운 메뉴의 표시 상태
      inquiryModalVisible: false, // 모달 가시성 제어 변수
    };
  },
  computed: {
    // 사용자 인증 여부 확인
    isAuthenticated() {
      const store = useMemberStore(); // Pinia의 member-store 사용
      console.log("Pinia에서 가져온 인증 상태:", store.isAuthenticated); // 관리자 상태 로그 출력
      return store.isAuthenticated; // 인증 상태 반환
    },
    // 관리자 권한 여부 확인
    isAdmin() {
      const store = useMemberStore();
      return store.authority && store.authority.some((auth) => auth.authority === "ROLE_ADMIN");
    },
  },
  methods: {
    // 사용자 정보를 백엔드에서 가져오는 함수
    async fetchUserInfo() {
      try {
        const response = await axios.get("https://stitchkosa.store/api/member/info"); // API로 사용자 정보 요청
        console.log("백엔드에서 가져온 사용자 정보:", response.data);
        const memberStore = useMemberStore();

        if (response.status === 200 && response.data) {
          // Pinia 상태에 사용자 정보 설정
          memberStore.setMember(response.data);
        }
      } catch (error) {
        console.error("사용자 정보를 가져오는 중 오류 발생:", error); // 오류 처리
      }
    },
    // 홈으로 이동하는 함수
    goHome() {
      this.$router.push("/"); // 홈 페이지로 리다이렉트
    },
    // 로그아웃 확인 후 실행
    confirmLogout() {
      if (confirm("정말 로그아웃 하시겠습니까?")) {
        this.logout(); // 로그아웃 실행
      }
    },
    // 로그아웃 처리 함수
    logout() {
      const store = useMemberStore();
      store.logout(); // Pinia 스토어에서 로그아웃 처리
      localStorage.removeItem("jwt"); // 로컬스토리지에서 JWT 토큰 제거
      alert("로그아웃되었습니다."); // 로그아웃 메시지 출력
      this.$router.push("/"); // 메인 페이지로 리다이렉트
    },
    // 드롭다운 메뉴 보이기
    showDropdown() {
      this.isDropdownVisible = true; // 드롭다운 메뉴 표시
      document.body.classList.add("blurred"); // 배경 블러 효과 적용
    },
    // 드롭다운 메뉴 숨기기
    hideDropdown() {
      this.isDropdownVisible = false; // 드롭다운 메뉴 숨기기
      document.body.classList.remove("blurred"); // 배경 블러 효과 제거
    },
    openInquiryModal() {
      this.inquiryModalVisible = true; // 모달 열기
    },
    handleInquiryClick() {
      // 로그인 상태 확인 후 모달을 열거나 로그인 페이지로 리다이렉트
      if (this.isAuthenticated) {
        this.openInquiryModal();
      } else {
        alert("로그인이 필요합니다.");
        this.$router.push("/login");
      }
    },
  },
  created() {
    if (this.isAuthenticated) {
      this.fetchUserInfo(); // 로그인된 경우에만 사용자 정보를 가져옴
    }
  },
};
</script>

<style scoped>
.member-header {
  width: 100%;
  display: flex;
  align-items: center;
  background-color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  padding: 15px 0;
}

.header-container {
  display: flex;
  justify-content: center; /* 전체 컨테이너를 중앙 정렬 */
  align-items: center;
  width: 100%;
  max-width: 1200px; /* 화면에서 최대 너비 설정 */
  padding: 0 20px;
  margin: 0 auto; /* 가로축 중앙 정렬 */
}

.logo-container {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.logo {
  max-width: 110px;
}

.right-container {
  display: flex;
  flex-direction: column; /* 세로로 배치 */
  align-items: flex-end; /* 오른쪽 정렬 */
}

.auth-section {
  display: flex;
  justify-content: flex-end;
}

.nav-items {
  list-style: none;
  display: flex;
  gap: 15px;
  font-size: 15px;
  margin: 0;
}

.nav-item {
  cursor: pointer;
  margin-right: 0; /* 오른쪽 여백 제거 */
  padding: 0 20px; /* 좌우 패딩 추가로 일정 간격 유지 */
}

.nav-items li a {
  text-decoration: none;
  color: rgb(61, 61, 61);
}

.logout-link {
  cursor: pointer;
}

.nav-menu {
  display: flex;
  justify-content: space-around;
  flex-direction: row;
  align-items: center;
  min-width: 250px;
  padding: 0 10px;
  margin: 0;
}

.nav-items {
  flex-direction: row; /* 가로로 배치 */
  list-style: none;
  gap: 30px; /* 항목들 사이의 간격 조정 */
  padding: 0;
}

.nav-item {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 10px; /* 좌우 패딩을 줄여서 항목 간 간격 축소 */
  font-size: 15px; /* 글자 크기를 조금 줄여서 크기 조정 */
  cursor: pointer;
}

.left-side,
.right-side {
  display: flex;
  justify-content: center; /* 가운데 정렬 */
  align-items: center; /* 세로 가운데 정렬 */
  padding: 0; /* 내부 패딩을 제거 */
  margin: 0; /* 외부 여백 제거 */
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
  top: 85px;
  left: 0;
  right: 0;
  background-color: white;
  box-shadow: 0 4px 11px -3px rgba(0, 0, 0, 0.1);

  display: flex;
  justify-content: space-around;
  z-index: 999;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.5s ease; /* 부드러운 애니메이션 */
  padding: 0px 400px 10px 100px;
}

.dropdown-container.show {
  max-height: 400px; /* 드롭다운 최대 높이 */
}

.dropdown-section {
  flex-grow: 1;
  margin: 10px 50px 10px 5px; /* 좌우 및 상하 마진을 줄임 */
  text-align: right; /* 텍스트 오른쪽 정렬 */
}

.dropdown-section h3 {
  font-size: 15px; /* 제목 폰트 크기를 약간 줄임 */
  font-weight: bold;
  margin-bottom: 8px; /* 제목 아래 마진을 줄임 */
}

.dropdown-section ul {
  list-style: none;
  padding: 0;
  text-align: right; /* 리스트도 오른쪽 정렬 */
}

.dropdown-section li {
  margin-bottom: 8px; /* 리스트 항목 간의 마진을 줄임 */
}

.dropdown-section li a {
  color: rgb(61, 61, 61);
  text-decoration: none;
  font-size: 13px; /* 링크 텍스트 크기를 줄임 */
}

.dropdown-section li a:hover {
  color: #f8a060;
}

/* 반응형 처리 */
@media (max-width: 800px) {
  .nav-items {
    gap: 10px;
  }

  .header-container {
    flex-direction: column;
  }

  .header-top {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-bottom {
    justify-content: flex-start;
  }

  .dropdown-container {
    position: absolute;
    top: 170px;
    left: 0;
    right: 0;
    background-color: white;
    box-shadow: 0 4px 11px -3px rgba(0, 0, 0, 0.1);

    display: flex;
    justify-content: space-around;
    z-index: 999;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.5s ease; /* 부드러운 애니메이션 */
    padding: 0px 400px 10px 100px;
  }
}

.search-bar-container {
  flex: 1;
  margin: 0px 50px 0 20px;
  display: flex;
  justify-content: center;
}

.search-bar {
  width: 100%; /* 검색창 너비를 100%로 설정하여 container 내에서 최대한 차지 */
}
</style>
