<!--
 담당자: 김호영
 시작 일자: 2024.09.10
 설명 : adminSidebar 구현
 ---------------------
 2024.09.10 김호영 | template 초기 설정 및 디자인, 라우터 연결

 -->

 <template>
  <div class="sidebar">
    <div class="logo-container">
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
      </div>

      <div class="logout-container">
        <button class="logout-btn" @click="logout">로그아웃</button>
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
  logout() {
    this.$router.push('/login');
  }
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
}

.logo-container {
  margin-bottom: 45px;
}

.logo {
  width: 130px;
  height: auto;
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
}

.menu-item:hover {
  background-color: #ffe5d1;
}

.menu-item.active {
  background-color: #ffa15e;
  color: white;
}

.logout-container {
  margin-bottom: 20px; /* 바닥에서 약간 띄움 */
}

.logout-btn {
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

.logout-btn:hover {
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
    font-size: 14px;
  }

  .logo {
    width: 100px;
  }
}

@media (max-width: 768px) {
  .sidebar {
    width: 200px;
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
    width: 200px;
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