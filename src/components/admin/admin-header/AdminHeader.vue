<!--
 담당자: 김호영
 시작 일자: 2024.09.10
 설명 : admin 헤더 기능 구현 및 디자인 개발
 ---------------------
 2024.09.10 김호영 | 헤더 초기 설정

 -->

 <template>
    <div class="header-container">
      <h3>{{ currentPage }}</h3> <!-- 선택된 페이지 이름 -->
      <span class="admin-name">{{ adminName }}</span> <!-- 로그인된 관리자 이름 -->
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
        return store.adminName || 'admin_name'; // 로그인된 관리자의 이름 출력
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
    background-color: white;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    height: 60px;
  }
  
  h3 {
    margin: 0;
  }
  
  .admin-name {
    font-weight: bold;
  }
  </style>