<!-- 
 담당자: 김호영 
 시작 일자: 2024.09.06
 설명 : 헤더 컴포넌트 설정
 ---------------------
 2024.09.06 김호영 | 기능 담을 디자인 구현, 각 페이지 연결, 로그인 정보 위해 pinia 설정 
 2024.09.09 김호영 | 헤더 완.
 -->

 <template>
  <header class="member-header">
    <nav class="nav-menu">
      <div class="left-side">
        <ul class="nav-items">
          <!-- 로그인 상태에 따라 마이페이지와 로그아웃 표시 -->
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
          <li><a href="/info">문의하기</a></li>
          <li><a href="/courses">교육과정 정보</a></li>
          <li><a href="/board">게시판</a></li>
        </ul>
      </div>
    </nav>

    <div class="logo-container">
      <img @click="goHome" src="@/assets/full-logo.jpg" alt="Stitch 로고" class="logo" />
    </div>

    <div class="search-container">
      <input type="text" v-model="searchText" placeholder="과정명, 강사이름 검색" class="search-input" />
      <button class="clear-btn" @click="clearSearch">X</button>
    </div>
  </header>
</template>

<script>
// Pinia의 store를 가져와서 사용
import { useMemberStore } from '@/store/member-store';

export default {
  data() {
    return {
      searchText: '', // 검색창에 입력된 텍스트를 관리하는 변수
    };
  },
  computed: {
    // Pinia store에서 사용자 정보 가져오기
    isAuthenticated() {
      const store = useMemberStore();
      return store.isAuthenticated; // 로그인 상태를 확인
    },
    isMyPage() {
      return this.$route.path === '/mypage'; // 현재 경로가 '/mypage'인 경우 true
    },
  },
  methods: {
    goHome() {
      this.$router.push('/'); // 홈으로 이동
    },
    clearSearch() {
      this.searchText = ''; // 버튼 클릭 시 검색창을 비움
    },

    confirmLogout() {
      // 로그아웃 여부를 묻는 confirm 창
      if (confirm('정말 로그아웃 하시겠습니까?')) {
        this.logout();
      } else {
        // 암것도 하지마
      } 
    },

    logout() {
      const store = useMemberStore();
      store.logout(); // 로그아웃 처리
      alert('로그아웃되었습니다.'); // 로그아웃 알림 출력
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
    height: 180px; /* 헤더 높이 명시 */
  }

.nav-menu {
  width: 95%;
  display: flex;
  justify-content: space-between; /* 왼쪽과 오른쪽으로 배치 */
  margin-bottom: 0px;
}

.left-side, .right-side {
  display: flex;
}

.nav-items {
  list-style: none;
  display: flex;
  gap: 30px;
  font-size: 18px;

  margin: 0; /* 혹시 기본 마진이 있을 수 있으니 0으로 설정 */
}

.right-side {
  display: flex;
  margin-right: 40px; /* 오른쪽 여백 추가 */
}

.nav-items li a {
  text-decoration: none;
  color: rgb(61, 61, 61);
  font-weight: 500;
}

.nav-items li a:hover {
  color: #F8A060;
}

/* 로그아웃 링크에 마우스 커서 추가 */
.logout-link {
  cursor: pointer; /* 마우스 커서가 포인터로 변경됨 */
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
  transition: width 0.3s ease; /* 검색창 크기 변경 시 부드럽게 처리 */
  
}

.search-input {
  border: none;
  outline: none;
  flex-grow: 1;
  font-size: 14px;
  padding: 5px;
}

/* 검색창의 input에 포커스가 들어올 때 search-container의 스타일을 변경 */
.search-input:focus + .clear-btn, /* 추가적으로 clear-btn의 스타일을 변경하고 싶으면 사용 */
.search-input:focus {
outline: none; /* 기본 아웃라인 제거 */
}

.search-input:focus {
border-color: #F8A060; /* 포커스 시 테두리 색상 변경 */
}

.search-container:focus-within {
border-color: #F8A060; /* 검색창에 포커스가 있을 때 테두리 색상 변경 */
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
    font-size: 10px; /* 화면이 좁아질 때 입력창의 글씨 크기를 줄이기 */
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
