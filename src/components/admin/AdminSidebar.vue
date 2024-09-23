<!--
 담당자: 김호영
 시작 일자: 2024.09.10
 설명 : adminSidebar 구현
 ---------------------
 2024.09.10 김호영 | template 초기 설정 및 디자인, 라우터 연결
 2024.09.12 김호영 | 초기 sidebar 완.
 2024.09.23 김호영 | 로그아웃 버튼 -> 사용자 페이지 이동으로 변경.

 -->

 <template>
  <div class="sidebar">
    <div @click="goHome" class="logo-container">
      <img src="@/assets/full-logo.jpg" alt="Stitch 로고" class="logo" />
    </div>

    <div class="menu-container">
      <div class="menu">
        <button class="menu-item" :class="{ active: isActive('admin/dashboard') }" @click="navigateTo('admin/dashboard')">대시보드</button>
      <button class="menu-item" :class="{ active: isActive('admin/user-info') }" @click="navigateTo('admin/user-info')">사용자 정보</button>
      <button class="menu-item" :class="{ active: isActive('admin/post-management') }" @click="navigateTo('admin/post-management')">게시판 글 관리</button>
      <button class="menu-item" :class="{ active: isActive('admin/review-management') }" @click="navigateTo('admin/review-management')">수강평 관리</button>
      <button class="menu-item" :class="{ active: isActive('admin/report-inquiry') }" @click="navigateTo('admin/report-inquiry')">신고 문의 관리</button>
      <button class="menu-item" :class="{ active: isActive('admin/direct-inquiry') }" @click="navigateTo('admin/direct-inquiry')">1:1 문의</button>
      <button class="menu-item" :class="{ active: isActive('admin/announcement') }" @click="navigateTo('admin/announcement')">공지사항 관리</button>
      <button class="menu-item" :class="{ active: isActive('admin/pay-management') }" @click="navigateTo('admin/pay-management')">결제정보 관리</button>
      </div>

      <div class="main-home-container">
        <button class="main-home-btn" @click="goMainHome">홈으로 이동</button>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'adminSidebar',
  methods: {
  navigateTo(route) {
    this.$router.push(`/${route}`);  // 앞에 / 추가
  },
  isActive(route) {
    return this.$route.path === `/${route}`;  // 앞에 / 추가
  },
   goMainHome() {
      if (confirm('홈으로 이동하시겠습니까?')) {
        this.$router.push('/'); 
      }
    },
    goHome() {
      this.$router.push('/admin');
    },
  }
};
</script>

<style scoped>
.sidebar {
  background-color: #ffffff;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: width 0.3s ease; /* 사이드바 크기 변화를 부드럽게 */
  z-index: 1000;  /* 모든 요소보다 위에 표시되도록 높은 값 설정 */
}

.logo-container {
  margin-bottom: 45px;
}

.logo {
  width: 130px;
  height: auto;
  cursor: pointer;
}

.menu-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* 상단 메뉴와 하단 로그아웃 버튼 사이 간격 조정 */
  height: 80%; /* 부모의 전체 높이 차지 */
  width:100%;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.menu-item {
  width: 100%;
  padding: 9px;
  background-color: white;
  border: none;
  border-radius: 8px;
  text-align: center;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  box-shadow: 0px 4px 4px 1px rgba(0, 0, 0, 0.1);
  color: rgb(71, 71, 71);
}

.menu-item:hover {
  background-color: #ffe5d1;
}

.menu-item.active {
  background-color: #ffa15e;
  color: white;
  font-weight: bold;
  font-size: 13px;
  position: relative;
  
}

.menu-item.active::before {
  content: '';
  position: absolute;
  left: 7px;  /* 도형을 왼쪽으로 이동 */
  top: 50%;     /* 중앙 정렬 */
  transform: translateY(-50%);
  width: 7px;  /* 도형의 너비 */
  height: 22px; /* 도형의 높이 */
  background-color: rgb(246, 246, 246);
  border-radius: 80px;  /* 모서리를 둥글게 */
}

.main-home-container {
  margin-bottom: 20px; /* 바닥에서 약간 띄움 */
}

.main-home-btn {
  width: 100%;
  padding: 9px;
  background-color: #555;
  color: white;
  border: none;
  border-radius: 9px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  box-shadow: 0px 4px 4px 1px rgb(202, 202, 202); /* 그림자 추가 */
}

.main-home-btn:hover {
  background-color: #333;
}

/* 반응형 디자인 */
@media (max-width: 1024px) {
  .sidebar {
    width: 250px;
    padding: 15px;
  }

  .menu-item {
    padding: 10px;
    font-size: 11px;
  }

  .menu-item.active {
    font-size: 12px;
  }

  .logo {
    width: 100px;
  }

  .main-home-btn {
    font-size: 11px;
  }
}

@media (max-width: 768px) {
  .sidebar {
    width: 200px;
    padding: 10px;
  }

  .menu-item {
    padding: 8px;
    font-size: 10px;
  }

  .menu-item.active {
    font-size: 12px;
  }

  .logo {
    width: 80px;
  }

  .main-home-btn {
    padding: 8px;
    font-size: 10px;
  }
}

@media (max-width: 480px) {
  .sidebar {
    width: 200px;
    padding: 5px;
  }

  .menu-item {
    padding: 6px;
    font-size: 9px;
  }

  .menu-item.active {
    font-size: 11px;
  }

  .logo {
    width: 60px;
  }

  .main-home-btn {
    padding: 6px;
    font-size: 9px;
  }
}
</style>