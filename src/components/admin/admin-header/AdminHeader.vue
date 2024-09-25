<!--
 담당자: 김호영
 시작 일자: 2024.09.10
 설명 : admin 헤더 기능 구현 및 디자인 개발
 ---------------------
 2024.09.10 김호영 | 헤더 초기 설정
 2024.09.11 김호영 | 초기 헤더 완료.
 2024.09.20 김호영 | 관리자 정보 백앤드 연동.
 -->

 <template>
  <div class="header-container">
    <div class="page-title">{{ currentPage }}</div> <!-- 선택된 페이지 이름 -->
      <span class="admin-name">
        <span class="admin-name-highlight">{{ adminName }} </span> 님 환영합니다. <!-- 로그인된 관리자 이메일 -->
      </span> 
  </div>
</template>

<script>
  import { useMemberStore } from '@/store/member-store'; // Pinia 스토어로 로그인 정보 가져오기
  
  export default {
    data() {
      return {
        currentPage: '대시보드', // 기본 페이지명
      };
    },
    computed: {
      adminName() {
        const store = useMemberStore();
        return store.member?.name || 'admin_name'; // 로그인된 관리자의 이름 출력
      },
    },
    watch: {
      // 라우트가 변경될 때 currentPage를 업데이트함
      '$route'(to) {
        this.updateCurrentPage(to);
      },
    },
    mounted() {
      this.updateCurrentPage(this.$route); // 초기 로딩 시 currentPage 설정
    },
    methods: {
      updateCurrentPage(route) {
        // 라우트에 따라 페이지명을 동적으로 변경
        const routeMap = {
          '/admin/dashboard': '대시보드',
          '/admin/user-info': '사용자 정보',
          '/admin/post-management': '게시판 글 관리',
          '/admin/review-management': '수강평 관리',
          '/admin/report-inquiry': '신고 문의 관리',
          '/admin/direct-inquiry': '1:1 문의',
          '/admin/announcement': '공지사항 관리',
          '/admin/pay-management': '결제정보 관리',
        };
        this.currentPage = routeMap[route.path] || '대시보드';
      },
    },
  };
</script>

<style scoped>
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: rgb(255, 255, 255);
  z-index: 900;
  border-bottom: 1.3px solid #000000;
  /* box-shadow: -2px 6px 10px -4px rgba(0, 0, 0, 0.1); */
  height: 50px;
  
}

.page-title {
  margin: 0;
  font-size: 17px;
  color: rgb(71, 71, 71);
  font-weight: 600;
  margin-left: 15px; 
}

.admin-name {
  margin-right: 15px;
  color: rgb(58, 58, 58);
}

.admin-name-highlight {
  color: #fe852e; 
  font-weight: bold;
}

/* 반응형 디자인 */
@media (max-width: 1024px) {
  .page-title {
    font-size: 14px;
    margin-left: 10px; 
  }
  .admin-name {
    font-size: 14px;
    margin-right: 10px;
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 12px;
    margin-left: 8px; 
  }
  .admin-name {
    font-size: 12px;
    margin-right: 8px;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 10px;
  }
  .admin-name {
    font-size: 10px;
  }
}
</style>