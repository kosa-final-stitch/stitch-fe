<!--
 담당자: 김호영
 시작 일자: 2024.09.10
 설명 : admin 사용자 정보 페이지 기능 구현 및 디자인 개발
 ---------------------
 2024.09.10 김호영 | admin 초기 설정
 2024.09.12 김호영 | 사용자 정보 페이지 디자인 구현
 -->

 <template>
  <div class="user-info-page">
    <!-- 상단 검색창 -->
    <div class="search-bar">
      <div class="search-wrapper search-container">
        <!-- 검색 아이콘을 input 안에 추가 -->
        <font-awesome-icon :icon="['fas', 'magnifying-glass']" class="search-icon" />
        <input type="text" v-model="searchQuery" placeholder="Search" class="search-input" />
      </div>
    </div>

    <!-- 사용자 목록 테이블 -->
    <table class="user-list-table">
      <thead>
        <tr>
          <th><input type="checkbox" /></th>
          <th>사용자 이메일</th>
          <th>이름</th>
          <th>닉네임</th>
          <th>주소</th>
          <th>성별</th>
          <th>생년월일</th>
          <th>전화번호</th>
          <th>최종 수정일자</th>
          <th>등록일자</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in paginatedUsers" :key="user.email">
          <td><input type="checkbox" /></td>
          <td>{{ user.email }}</td>
          <td>{{ user.name }}</td>
          <td>{{ user.nickname }}</td>
          <td>{{ user.address }}</td>
          <td>{{ user.gender }}</td>
          <td>{{ user.birth }}</td>
          <td>{{ user.phone }}</td>
          <td>{{ user.signupdate }}</td>
          <td>{{ user.editdate }}</td>
          <td>
            <font-awesome-icon :icon="['fas', 'bars']" class="icon-bars" /> <!-- 아이콘 추가 -->
          </td>
        </tr>
      </tbody>
    </table>

    <!-- 페이지네이션 -->
    <div class="pagination">
      <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1">Previous</button>
      <span v-for="page in totalPages" :key="page">
        <button @click="goToPage(page)" :class="{ active: currentPage === page }">{{ page }}</button>
      </span>
      <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages">Next</button>
    </div>
  </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'; // Font Awesome 아이콘 불러오기

export default {
  components: {
    FontAwesomeIcon, // Font Awesome 컴포넌트 등록
  },
  data() {
    return {
      searchQuery: '',
      currentPage: 1,
      usersPerPage: 10,
      users: [
        {
          email: 'test@test.com',
          name: '김호영',
          nickname: '닉네임',
          address: '서울특별시',
          gender: '남',
          birth: '2024-09-12',
          phone: '010-9330-0253',
          signupdate: '2024-09-10',
          editdate: '2024-09-11',
        },
        {
          email: 'test@test.com',
          name: '이호영',
          nickname: '별명',
          address: '제주도',
          gender: '여',
          birth: '2024-09-12',
          phone: '010-9330-0253',
          signupdate: '2024-09-10',
          editdate: '2024-09-11',
        },
        {
          email: 'test@test.com',
          name: '이호영',
          nickname: '별명',
          address: '제주도',
          gender: '여',
          birth: '2024-09-12',
          phone: '010-9330-0253',
          signupdate: '2024-09-10',
          editdate: '2024-09-11',
        },
        {
          email: 'test@test.com',
          name: '이호영',
          nickname: '별명',
          address: '제주도',
          gender: '여',
          birth: '2024-09-12',
          phone: '010-9330-0253',
          signupdate: '2024-09-10',
          editdate: '2024-09-11',
        },
        {
          email: 'test@test.com',
          name: '이호영',
          nickname: '별명',
          address: '제주도',
          gender: '여',
          birth: '2024-09-12',
          phone: '010-9330-0253',
          signupdate: '2024-09-10',
          editdate: '2024-09-11',
        },
        {
          email: 'test@test.com',
          name: '이호영',
          nickname: '별명',
          address: '제주도',
          gender: '여',
          birth: '2024-09-12',
          phone: '010-9330-0253',
          signupdate: '2024-09-10',
          editdate: '2024-09-11',
        },
        {
          email: 'test@test.com',
          name: '이호영',
          nickname: '별명',
          address: '제주도',
          gender: '여',
          birth: '2024-09-12',
          phone: '010-9330-0253',
          signupdate: '2024-09-10',
          editdate: '2024-09-11',
        },
        {
          email: 'test@test.com',
          name: '이호영',
          nickname: '별명',
          address: '제주도',
          gender: '여',
          birth: '2024-09-12',
          phone: '010-9330-0253',
          signupdate: '2024-09-10',
          editdate: '2024-09-11',
        },
        {
          email: 'test@test.com',
          name: '이호영',
          nickname: '별명',
          address: '제주도',
          gender: '여',
          birth: '2024-09-12',
          phone: '010-9330-0253',
          signupdate: '2024-09-10',
          editdate: '2024-09-11',
        },
        {
          email: 'test@test.com',
          name: '이호영',
          nickname: '별명',
          address: '제주도',
          gender: '여',
          birth: '2024-09-12',
          phone: '010-9330-0253',
          signupdate: '2024-09-10',
          editdate: '2024-09-11',
        },
        {
          email: 'test@test.com',
          name: '이호영',
          nickname: '별명',
          address: '제주도',
          gender: '여',
          birth: '2024-09-12',
          phone: '010-9330-0253',
          signupdate: '2024-09-10',
          editdate: '2024-09-11',
        },
        {
          email: 'test@test.com',
          name: '이호영',
          nickname: '별명',
          address: '제주도',
          gender: '여',
          birth: '2024-09-12',
          phone: '010-9330-0253',
          signupdate: '2024-09-10',
          editdate: '2024-09-11',
        },
        {
          email: 'test@test.com',
          name: '이호영',
          nickname: '별명',
          address: '제주도',
          gender: '여',
          birth: '2024-09-12',
          phone: '010-9330-0253',
          signupdate: '2024-09-10',
          editdate: '2024-09-11',
        },
        {
          email: 'test@test.com',
          name: '이호영',
          nickname: '별명',
          address: '제주도',
          gender: '여',
          birth: '2024-09-12',
          phone: '010-9330-0253',
          signupdate: '2024-09-10',
          editdate: '2024-09-11',
        },
        {
          email: 'test@test.com',
          name: '20호영',
          nickname: '별명',
          address: '제주도',
          gender: '여',
          birth: '2024-09-12',
          phone: '010-9330-0253',
          signupdate: '2024-09-10',
          editdate: '2024-09-11',
        }
        // 다른 유저들 추가
      ],
    };
  },
  computed: {
    // 필터된 사용자 목록
    filteredUsers() {
      return this.users.filter((user) => {
        return (
          user.email.includes(this.searchQuery) ||
          user.name.includes(this.searchQuery) ||
          user.nickname.includes(this.searchQuery)
        );
      });
    },
    // 현재 페이지에 표시할 사용자들
    paginatedUsers() {
      const start = (this.currentPage - 1) * this.usersPerPage;
      const end = start + this.usersPerPage;
      return this.filteredUsers.slice(start, end);
    },
    // 전체 페이지 수
    totalPages() {
      return Math.ceil(this.filteredUsers.length / this.usersPerPage);
    },
  },
  methods: {
    // 페이지 이동 메서드
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
  },
};
</script>

<style scoped>
/* 전체 레이아웃 스타일 */
.user-info-page {
  padding: 5px;
  position: relative; /* 페이지네이션을 하단에 고정시키기 위한 설정 */
  min-height: 100%; /* 컨테이너가 content-area와 동일한 높이를 가지도록 설정 */
  box-sizing: border-box; /* padding과 border를 포함한 높이 계산 */
}

/* content-area와 동일한 높이와 레이아웃으로 설정 */
.content-area {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  min-height: 100%; /* content-area의 높이 100% */
  box-sizing: border-box; /* padding과 border를 포함한 높이 계산 */
}

/* 페이지네이션 스타일 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute; /* 부모 요소의 하단에 고정 */
  bottom: 10px; /* 부모 요소의 아래쪽에서 10px 떨어짐 */
  left: 0;
  right: 0;
  /*padding-bottom: 60px; /* 아래쪽에 추가적인 여백 */
}

.pagination button {
  padding: 10px 15px;
  margin: 0 5px;
  border: none;
  background-color: #f4f4f4;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.pagination button.active {
  background-color: #ffa15e;
  color: white;
}

.pagination button:disabled {
  background-color: #ddd;
  cursor: not-allowed;
}

.pagination button:hover:not(.active):not(:disabled) {
  background-color: #ffe5d1;
}

/* 검색창 스타일 */
.search-bar {
  margin-bottom: 20px;
}

.search-wrapper {
  position: relative;
  width: 30%; /* 검색창의 너비 */
}

.search-wrapper input {
  width: 100%;
  padding: 10px 10px 10px 35px; /* 아이콘과 텍스트 간 여백을 위한 padding */
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 5px;
  transition: border-color 0.3s;
}

/* 검색창에 포커스가 들어올 때 */
.search-input:focus {
  outline: none; /* 기본 아웃라인 제거 */
  border-color: #F8A060; /* 포커스 시 테두리 색상 변경 */
}

.search-input:focus + .clear-btn {
  /* clear-btn이 있을 경우 추가적인 스타일을 변경 */
  display: block; /* clear 버튼을 보이게 만듦 */
}

.search-container:focus-within {
  border-color: #F8A060; /* 검색창에 포커스가 있을 때 컨테이너 테두리 색상 변경 */
}

/* 검색 아이콘 스타일 */
.search-icon {
  position: absolute;
  left: 10px; /* 아이콘의 왼쪽 위치 */
  top: 50%;
  transform: translateY(-50%); /* 아이콘을 수직 중앙으로 */
  font-size: 16px; /* 아이콘 크기 설정 */
  color: #8f8f8f; /* 아이콘 색상 */
}



/* 사용자 목록 테이블 스타일 */
.user-list-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 50px;
}

/* 테이블 헤더 스타일 */
.user-list-table th {
  font-weight: bold;
  font-size: 12px; 
  padding: 0px 10px 15px 20px; /* 상, 좌, 우, 하 padding 설정 */
  text-align: center;
  border-bottom: 1px solid #575757;
}

/* 테이블 데이터 스타일 */
.user-list-table td {
  font-size: 12px; /* td에 원하는 크기 설정 */
  padding: 10px 10px 15px 20px; /* 상, 좌, 우, 하 padding 설정 */
  text-align: center;
}

.icon-bars {
  color: #ababab; /* 아이콘 색상 변경 */
  font-size: 15px;
  font-weight:300;
}



/* 반응형 디자인 */
@media (max-width: 1024px) {
  /* 테이블 헤더 스타일 */
  .user-list-table th {
    font-size: 10px; 
    padding: 0px 10px 12px 15px; /* 상, 좌, 우, 하 padding 설정 */
  }
  /* 테이블 데이터 스타일 */
  .user-list-table td {
    font-size: 10px; /* td에 원하는 크기 설정 */
  }
}


@media (max-width: 768px) {
  /* 테이블 헤더 스타일 */
  .user-list-table th {
    font-size: 8px; 
    padding: 0px 8px 12px 15px; /* 상, 좌, 우, 하 padding 설정 */
  }
  /* 테이블 데이터 스타일 */
  .user-list-table td {
    font-size: 8px; /* td에 원하는 크기 설정 */
  }
}

@media (max-width: 480px) {
  /* 테이블 헤더 스타일 */
  .user-list-table th {
    font-size: 6px; 
    padding: 0px 6px 10px 12px; /* 상, 좌, 우, 하 padding 설정 */
  }
  /* 테이블 데이터 스타일 */
  .user-list-table td {
    font-size: 6px; /* td에 원하는 크기 설정 */
  }
  
}
</style>