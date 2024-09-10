<!--
 담당자: 김호영
 시작 일자: 2024.09.10
 설명 : AdminSidebar 구현
 ---------------------
 2024.09.10 김호영 | template 초기 설정 및 디자인, 라우터 연결

 -->

<template>
  <div class="sidebar">
    <div class="logo-container">
      <img src="@/assets/full-logo.jpg" alt="Stitch 로고" class="logo" />
    </div>

    <div class="menu">
      <button class="menu-item" :class="{ active: isActive('/dashboard') }" @click="navigateTo('/dashboard')">대시보드</button>
      <button class="menu-item" :class="{ active: isActive('/user-info') }" @click="navigateTo('/user-info')">사용자 정보</button>
      <button class="menu-item" :class="{ active: isActive('/post-management') }" @click="navigateTo('/post-management')">게시판 글 관리</button>
      <button class="menu-item" :class="{ active: isActive('/review-management') }" @click="navigateTo('/review-management')">수강평 관리</button>
      <button class="menu-item" :class="{ active: isActive('/report-management') }" @click="navigateTo('/report-management')">신고 문의 관리</button>
      <button class="menu-item" :class="{ active: isActive('/inquiry') }" @click="navigateTo('/inquiry')">1:1 문의</button>
      <button class="menu-item" :class="{ active: isActive('/notice-management') }" @click="navigateTo('/notice-management')">공지사항 관리</button>

      <div class="logout-container">
        <button class="logout-btn" @click="logout">로그아웃</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminSidebar',
  methods: {
    navigateTo(route) {
      this.$router.push(route);
    },
    isActive(route) {
      return this.$route.path === route;
    },
    logout() {
      this.$router.push('/login');
    }
  }
};
</script>

<style scoped>
.sidebar {
  width: 250px; /* 전체 너비 */
  height: 100vh; /* 전체 높이 */
  background-color: #ffffff;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: width 0.3s ease; /* 사이드바 크기 변화를 부드럽게 */
}

.logo-container {
  margin-bottom: 45px;
}

.logo {
  width: 130px;
  height: auto;
}

.menu {
  flex-grow: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 15px;
  
}

.menu-item {
  width: 100%;
  padding: 12px;
  background-color: white;
  border: none;
  border-radius: 12px;
  text-align: center;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  box-shadow: 0px 4px 4px 1px rgba(0, 0, 0, 0.1);
}


.menu-item:hover {
  background-color: #ffe5d1;
}

.menu-item.active {
  background-color: #ffa15e;
  color: white;
}

.logout-container {
  margin-top: 400px;
}

.logout-btn {
  width: 100%;
  padding: 12px;
  background-color: #555;
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  box-shadow: 0px 4px 4px 1px rgb(202, 202, 202) /* 그림자 추가 */
}

.logout-btn:hover {
  background-color: #333;
}

/* 반응형 디자인 */
@media (max-width: 1024px) {
  .sidebar {
    width: 250px; /* 전체 너비 유지 */
    padding: 15px;
  }

  .menu-item {
    padding: 10px;
    font-size: 14px;
  }

  .logo {
    width: 100px;
  }
}

@media (max-width: 768px) {
  .sidebar {
    width: 200px; /* 전체 너비 유지 */
    padding: 10px;
  }

  .menu-item {
    padding: 8px;
    font-size: 12px;
  }

  .logo {
    width: 80px;
  }

  .logout-btn {
    padding: 8px;
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .sidebar {
    width: 200px; /* 전체 너비 유지 */
    padding: 5px;
  }

  .menu-item {
    padding: 6px;
    font-size: 10px;
  }

  .logo {
    width: 60px;
  }

  .logout-btn {
    padding: 6px;
    font-size: 10px;
  }
}
</style>