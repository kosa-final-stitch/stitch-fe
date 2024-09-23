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
 -->
 <template>
  <header class="member-header">
    <nav class="nav-menu">
      <div class="left-side">
        <ul class="nav-items">
          <!-- 마이페이지 버튼: 로그인 상태일 때만 표시 -->
          <li v-if="isAuthenticated && !isMyPage">
            <router-link to="/mypage">마이페이지</router-link>
          </li>

          <!-- 관리자 페이지 버튼: 관리자 권한이 있을 때만 표시 -->
          <li v-if="isAdmin">
            <router-link to="/admin">관리자 페이지</router-link>
          </li>

          <!-- 로그인 버튼: 비로그인 상태일 때만 표시 -->
          <li v-else-if="!isAuthenticated && !isMyPage">
            <router-link to="/login">로그인</router-link>
          </li>

          <!-- 로그아웃 버튼: 로그인 상태일 때만 표시 -->
          <li v-if="isAuthenticated">
            <a @click="confirmLogout" class="logout-link">로그아웃</a>
          </li>

          <!-- 회원가입 버튼: 비로그인 상태일 때만 표시 -->
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

    <search-bar />
  </header>
</template>

<script>
import axios from 'axios';
import { useMemberStore } from "@/store/member-store";  // Pinia 스토어 가져오기
import SearchBar from "./SearchBar.vue";  // 검색바 컴포넌트 가져오기

export default {
  components: {
    SearchBar,  // 검색바 컴포넌트 등록
  },
  data() {
    return {
      searchText: "",  // 검색창에 입력된 텍스트 상태
      isDropdownVisible: false,  // 드롭다운 메뉴의 표시 상태
    };
  },
  computed: {
    // 사용자 인증 여부 확인
    isAuthenticated() {
      const store = useMemberStore();  // Pinia의 member-store 사용
      return store.isAuthenticated;  // 인증 상태 반환
    },
    // 관리자 권한 여부 확인
    isAdmin() {
      const store = useMemberStore();
      console.log("Pinia에서 가져온 관리자 상태:", store.isAdmin);  // 관리자 상태 로그 출력
      return store.authority && store.authority.includes('ROLE_ADMIN');  // 관리자 권한 확인 후 반환
    },
  },
  methods: {
    // 사용자 정보를 백엔드에서 가져오는 함수
    async fetchUserInfo() {
      try {
        const response = await axios.get('/api/member/info');  // API로 사용자 정보 요청
        console.log("백엔드에서 가져온 사용자 정보:", response.data);
        const memberStore = useMemberStore();

        if (response.status === 200 && response.data) {
          // Pinia 상태에 사용자 정보 설정
          memberStore.setMember(response.data);
        }
      } catch (error) {
        console.error("사용자 정보를 가져오는 중 오류 발생:", error);  // 오류 처리
      }
    },
    // 홈으로 이동하는 함수
    goHome() {
      this.$router.push("/");  // 홈 페이지로 리다이렉트
    },
    // 로그아웃 확인 후 실행
    confirmLogout() {
      if (confirm("정말 로그아웃 하시겠습니까?")) {
        this.logout();  // 로그아웃 실행
      }
    },
    // 로그아웃 처리 함수
    logout() {
      const store = useMemberStore();
      store.logout();  // Pinia 스토어에서 로그아웃 처리
      localStorage.removeItem('jwt');  // 로컬스토리지에서 JWT 토큰 제거
      alert("로그아웃되었습니다.");  // 로그아웃 메시지 출력
      this.$router.push("/");  // 메인 페이지로 리다이렉트
    },
    // 드롭다운 메뉴 보이기
    showDropdown() {
      this.isDropdownVisible = true;  // 드롭다운 메뉴 표시
      document.body.classList.add("blurred");  // 배경 블러 효과 적용
    },
    // 드롭다운 메뉴 숨기기
    hideDropdown() {
      this.isDropdownVisible = false;  // 드롭다운 메뉴 숨기기
      document.body.classList.remove("blurred");  // 배경 블러 효과 제거
    },
  },
  created() {
    this.fetchUserInfo();  // 컴포넌트가 생성될 때 사용자 정보를 가져옴
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

/* 반응형 처리를 위한 추가 */
@media (max-width: 800px) {
  .nav-items {
    gap: 15px; /* 화면이 좁아질 때 항목 간 간격도 줄이기 */
  }
  .nav-items li a {
    font-size: 14px; /* 화면이 작아질 때 글씨 크기를 줄이기 */
  }
}
@media (max-width: 400px) {
  .nav-items {
    gap: 15px; /* 더 좁아지면 항목 간 간격도 더 줄이기 */
  }
  .nav-items li a {
    font-size: 8px; /* 더 좁아지면 글씨 크기를 더 줄이기 */
  }
}
</style>