<!--
 담당자: 김호영
 시작 일자: 2024.09.10
 설명 : admin 공지사항 페이지 기능 구현 및 디자인 개발
 ---------------------
 2024.09.10 김호영 | admin 초기 설정
 2024.09.17 김호영 | 공지사항 페이지 초기 디자인 및 구현 
 2024.09.18 김호영 | 작성 기능 완.
 -->

 <template>
  <div class="notice-info-page">
    <!-- 상단 검색창 -->
    <div class="search-bar">
      <div class="search-wrapper search-container">
        <!-- 카테고리 선택 -->
        <div class="category-container">
          <select v-model="selectedCategory" class="search-category"
            @focus="isDropdownOpen = true"
            @blur="isDropdownOpen = false"
            @change="isDropdownOpen = false">
            <option value="all">전체</option>
            <option value="public">공개</option>
            <option value="private">비공개</option>
          </select>
          <font-awesome-icon 
            :icon="isDropdownOpen ? ['fas', 'angle-up'] : ['fas', 'angle-down']" 
            class="angle-dropdown-icon" 
          />
        </div>

        <!-- 검색 icon + 검색창 -->
         <div class="search-input-container">
          <font-awesome-icon :icon="['fas', 'magnifying-glass']" class="search-icon" />
          <input type="text" v-model="searchQuery" placeholder="Search" class="search-input" />
        </div>
        <!-- 공지사항 작성하기 버튼 추가 -->
        <button class="create-notice-btn" @click="openCreateModal">작성하기</button> 
      </div>
    </div>

    <!-- 게시글 목록 테이블 -->
    <table class="notice-list-table">
      <thead>
        <tr>
          <th>No.</th>
          <th>제목</th>
          <th>내용</th>
          <th>작성일자</th>
          <th>수정일자</th>
          <th>상태</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(notice, index) in paginatedNotices" :key="notice.notice_id">
          <td>{{ (currentPage - 1) * noticesPerPage + index + 1 }}</td>
          <td>{{ notice.title }}</td>
          <td>{{ notice.content.slice(0, 15) }}...</td>
          <td>{{ formatDate(notice.regdate) }}</td>
          <td>{{ notice.editdate ? formatDate(notice.editdate) : '-' }}</td>
          <td>{{ notice.status === 'public' ? '공개' : '비공개' }}</td>
          <td>
            <div class="dropdown-container" @click.stop="toggleDropdown(index)">
              <font-awesome-icon :icon="['fas', 'bars']" class="icon-bars" />
              <div v-if="openDropdownIndex === index" class="dropdown-menu">
                <ul>
                  <li @click="handleItemClick(notice, 'public')">
                    <font-awesome-icon :icon="['fas', 'unlock']" class="modal-icon" /> 공개
                  </li>
                  <li @click="handleItemClick(notice, 'private')">
                    <font-awesome-icon :icon="['fas', 'lock']" class="modal-icon" /> 비공개
                  </li>
                </ul>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- 변경 확인 모달 -->
    <div v-if="isChangeModalOpen" class="modal-overlay">
      <div class="modal-content">
        <h3>상태를 "{{ noticeToChange?.newStatus === 'public' ? '공개' : '비공개' }}"로 변경하시겠습니까?</h3>
        <p>선택하신 공지 제목: {{ noticeToChange?.title }}</p>
        <div class="modal-buttons">
          <button @click="changeNotice">확인</button>
          <button @click="cancelChange">취소</button>
        </div>
      </div>
    </div>

    <!-- 변경 완료 모달 -->
    <div v-if="isChangeSuccessModalOpen" class="modal-success-overlay">
      <div class="modal-success-content">
        <div class="modal-icon-container">
          <font-awesome-icon :icon="['fas', 'circle-check']" class="modal-success-icon" />
        </div>
        <p>변경이 완료되었습니다</p>
      </div>
    </div>

    <!-- 페이지네이션 -->
    <div class="pagination">
      <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1">이전</button>
      <span v-for="page in totalPages" :key="page">
        <button @click="goToPage(page)" :class="{ active: currentPage === page }">{{ page }}</button>
      </span>
      <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages">다음</button>
    </div>


    <!-- 공지사항 작성 모달 -->
    <div v-if="isCreateModalOpen" class="create-notice-modal-overlay">
      <div class="create-notice-modal-content">
        <h3>공지사항 작성</h3>
        <form @submit.prevent="createNotice">
          <div class="form-group">
            <input type="text" v-model="newNotice.title" placeholder="제목" class="input-field" required />
          </div>
          <div class="form-group">
            <textarea v-model="newNotice.content" placeholder="내용" rows="5" class="input-field" required></textarea>
          </div>
          <div class="modal-buttons">
            <button type="submit" class="btn-primary">작성</button>
            <button type="button" class="btn-secondary" @click="closeCreateModal">취소</button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

export default {
  components: {
    FontAwesomeIcon,
  },
  data() {
    return {
      searchQuery: '',
      selectedCategory: 'all',
      currentPage: 1,
      noticesPerPage: 10,
      isDropdownOpen: false,
      openDropdownIndex: null,
      isChangeModalOpen: false,
      isChangeSuccessModalOpen: false,
      isCreateModalOpen: false, // 작성 모달 상태
      noticeToChange: null,
      noticementsData: [], // 공지사항 데이터를 저장할 배열
      newNotice: { title: '', content: '', status: 'public' }, // 새 공지사항 데이터 초기화
    };
  },
  computed: {
    filteredNotices() {
      return this.noticementsData.filter(notice => {
        const matchesCategory =
          this.selectedCategory === 'all' ||
          this.selectedCategory === notice.status;
        const matchesQuery =
          notice.title.includes(this.searchQuery) ||
          notice.content.includes(this.searchQuery);
        return matchesCategory && matchesQuery;
      });
    },
    paginatedNotices() {
      const start = (this.currentPage - 1) * this.noticesPerPage;
      return this.filteredNotices.slice(start, start + this.noticesPerPage);
    },
    totalPages() {
      return Math.ceil(this.filteredNotices.length / this.noticesPerPage);
    },
  },
  methods: {
    formatDate(date) {
      const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
      return new Date(date).toLocaleDateString(undefined, options);
    },
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    toggleDropdown(index) {
      this.openDropdownIndex = this.openDropdownIndex === index ? null : index;
    },
    handleItemClick(notice, status) {
      this.noticeToChange = { ...notice, newStatus: status };
      this.isChangeModalOpen = true;
    },
    changeNotice() {
      if (!this.noticeToChange) return;

      // 상태 업데이트
      this.noticeToChange.status = this.noticeToChange.newStatus;

      const index = this.noticementsData.findIndex(
        (notice) => notice.notice_id === this.noticeToChange.notice_id
      );
      if (index !== -1) {
        this.noticementsData[index].status = this.noticeToChange.status;
      }

      // 모달 닫기 및 성공 모달 표시
      this.isChangeModalOpen = false;
      this.isChangeSuccessModalOpen = true;
      setTimeout(() => {
        this.isChangeSuccessModalOpen = false;
      }, 1500);
    },
    cancelChange() {
      this.isChangeModalOpen = false;
      this.noticeToChange = null;
    },
    openCreateModal() {
      this.isCreateModalOpen = true;
    },
    closeCreateModal() {
      this.isCreateModalOpen = false;
    },
    createNotice() {
      const newNoticeId = this.noticementsData.length + 1; // 임시로 ID 생성
      const today = new Date().toISOString().split('T')[0]; // 오늘 날짜 생성

      const newNotice = {
        notice_id: newNoticeId,
        member_id: 103, // 임시 member_id
        title: this.newNotice.title,
        content: this.newNotice.content,
        regdate: today, // 등록일자
        editdate: null,
        status: 'public', // 상태 기본값
      };

      this.noticementsData.push(newNotice); // 배열에 새 공지사항 추가

      // 모달 닫기 및 초기화
      this.closeCreateModal();
      this.newNotice = { title: '', content: '', status: 'public' };
    },
  },
  mounted() {
    this.noticementsData = [
      {
        notice_id: 1,
        member_id: 101,
        title: '공지사항 1',
        content: '공지사항 내용 1',
        regdate: '2024-09-10',
        editdate: '2024-09-12',
        status: 'public',
      },
      {
        notice_id: 2,
        member_id: 102,
        title: '공지사항 2',
        content: '공지사항 내용 2',
        regdate: '2024-09-11',
        editdate: null,
        status: 'private',
      },
    ];
  },
};
</script>

<style scoped>
/* 공지사항 작성 버튼 */
.create-notice-btn {
  background-color: #F8A060;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-left: auto; /* 오른쪽 끝으로 이동 */
  font-size: 14px; /* 글씨 크기 */
  height: 40px; /* 버튼 높이 */
  line-height: 20px; /* 텍스트와 높이 간격 */
  white-space: nowrap; /* 글자가 두 줄로 넘어가지 않게 함 */
  width: auto; /* 버튼 너비를 내용에 맞게 조정 */
  transition: background-color 0.3s ease; /* 애니메이션 추가 */
}

.create-notice-btn:hover {
  background-color: #fb822c;
}

/* 공지사항 작성 모달 오버레이 */
.create-notice-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6); /* 배경을 어둡게 */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001; /* 위에 배치 */
}


/* 공지사항 작성 모달 콘텐츠 */
.create-notice-modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  z-index: 1002;
}

.create-notice-modal-content h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.create-notice-modal-content .form-group {
  margin-bottom: 15px;
}

.create-notice-modal-content label {
  display: block;
  font-size: 14px;
  margin-bottom: 5px;
}

.create-notice-modal-content input[type="text"],
.create-notice-modal-content textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}

.create-notice-modal-content .modal-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.create-notice-modal-content .btn-secondary {
  background-color: #ccc;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.create-notice-modal-content .btn-secondary:hover {
  background-color: #b3b3b3;
}
/* 입력 필드 스타일 */
.input-field {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box; /* 필드가 컨테이너에 딱 맞게 조정되도록 설정 */
}


/* 드롭다운 스타일 */
.dropdown-container {
  position: relative;
  display: inline-block;
}

.icon-bars {
  cursor: pointer;
  color: #ababab;
}

/* 드롭다운 메뉴 */

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  border: 1.2px solid #ddd;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  min-width: 100px; /* 드롭다운의 최소 넓이 설정 */
  max-width: 140px; /* 드롭다운의 최대 넓이 설정 */
  width: auto; /* 내용에 따라 자동으로 조절 */
  margin-right: 10px;
}

.dropdown-menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.dropdown-menu li {
  display: flex;
  align-items: center;
  padding: 11px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.dropdown-menu li:hover {
  background-color: #efefef;
}

.modal-icon {
  color: #7b7b7b;
  margin-right: 10px;
  flex-shrink: 0; /* 아이콘이 항상 같은 크기로 고정되도록 */
}

/*state 모달 */

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6); /* 배경을 어둡게 */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001; /* 위에 배치 */
}

/* 모달 콘텐츠 스타일 */
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 380px;
  text-align: center;
}
.modal-content p {
  font-size: 14px;
  color: #7b7b7b;
  margin-bottom: 40px;
}

.modal-buttons {
  display: flex;
  justify-content: space-around;
  margin-top: 15px;
}

.modal-buttons button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
  width: 160px;
}

.modal-buttons button:first-child {
  background-color: #f56565;
  color: white;
}

.modal-buttons button:first-child:hover {
  background-color: #ec2727;
  color:white;
}

.modal-buttons button:last-child:hover {
  background-color: #b3b3b3; /* 호버 시 더 짙은 회색 */
}


/* 성공 모달 */
.modal-success-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001; /* 위에 배치 */
}

.modal-success-content {
  display: flex;
    align-items: center;
    background-color: white;
    padding: 15px 25px;
    border-radius: 7px;
    box-shadow: 0px 1px 9px 3px rgba(0, 0, 0, 0.09);
    gap: 45px;
    width: 300px;
}

.modal-success-icon {
  color: #4F8CFF; /* 체크 아이콘 색상 */
  font-size: 30px;
  margin-right: 20px;
}

.modal-success-content p {
  margin: 0;
  font-size: 16px;
  color: #333;
}


/* 전체 레이아웃 스타일 */
.notice-info-page {
  padding: 5px;
  position: relative; /* 페이지네이션을 하단에 고정시키기 위한 설정 */
  min-height: 100%; /* 컨테이너가 content-area와 동일한 높이를 가지도록 설정 */
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
}

.pagination button:hover:not(.active):not(:disabled) {
  background-color: #ffe5d1;
}

/* 창 스타일------------------------------------------------------------------ */
.category-container {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.search-category {
  appearance: none; /* 기본 브라우저 스타일 제거 */
  margin-right: 20px;
  background-color: #ffffff; /* 배경색 */
  border: 1px solid #ccc; /* 경계선 */
  border-radius: 5px; /* 둥근 모서리 */
  padding: 8px 30px 8px 10px; /* 좌우 패딩 수정 (왼쪽 10px, 오른쪽 20px) */
  font-size: 12px; /* 폰트 크기 */
  font-weight: 500;
  color: #7b7b7b; /* 글자 색상 */
  cursor: pointer; /* 마우스 포인터 변경 */
  outline: none; /* 포커스 아웃라인 제거 */
  height: 100%; /* 높이 조절 */
  text-align: left; /* 텍스트 정렬을 왼쪽으로 */
}

.angle-dropdown-icon {
  position: absolute;
  right: 30px; /* 아이콘을 오른쪽에 배치 */
  font-size: 14px;
  color: #7b7b7b;
}


.search-bar {
  margin-bottom: 20px;
}

.search-wrapper {
  display: flex; /* 검색창이랑 카테고리 가로로 배치 */
  align-items: center;
  justify-content: space-between; /* 버튼을 오른쪽 끝으로 이동 */
  width: 100%; /* 부모 요소의 너비를 100%로 설정 */
}


.search-wrapper input {
  width: 100%;
  padding: 10px 10px 10px 35px; /* 아이콘과 텍스트 간 여백을 위한 padding */
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 5px;
  transition: border-color 0.3s;
  margin-right: 30%;
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
.search-input-container {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}

.search-icon {
  position: absolute;
  left: 10px; /* 아이콘의 왼쪽 위치 */
  top: 50%;
  transform: translateY(-50%); /* 아이콘을 수직 중앙으로 */
  font-size: 16px; /* 아이콘 크기 설정 */
  color: #8f8f8f; /* 아이콘 색상 */
}



/* 게시글 목록 테이블 스타일 ---------------------------------------------------------*/
.notice-list-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 50px;
}


/* 테이블 헤더 스타일 */
.notice-list-table th {
  font-weight: bold;
  font-size: 12px; 
  padding: 0px 10px 15px 20px; /* 상, 좌, 우, 하 padding 설정 */
  text-align: center;
  border-bottom: 1px solid #575757;
}

/* 테이블 데이터 스타일 */
.notice-list-table td {
  font-size: 12px; /* td에 원하는 크기 설정 */
  padding: 18px 10px 15px 20px; /* 상, 좌, 우, 하 padding 설정 */
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
  .notice-list-table th {
    font-size: 10px; 
    padding: 0px 10px 12px 15px; /* 상, 좌, 우, 하 padding 설정 */
  }
  /* 테이블 데이터 스타일 */
  .notice-list-table td {
    font-size: 10px; /* td에 원하는 크기 설정 */
  }
}


@media (max-width: 768px) {
  /* 테이블 헤더 스타일 */
  .notice-list-table th {
    font-size: 8px; 
    padding: 0px 8px 12px 15px; /* 상, 좌, 우, 하 padding 설정 */
  }
  /* 테이블 데이터 스타일 */
  .notice-list-table td {
    font-size: 8px; /* td에 원하는 크기 설정 */
  }
}

@media (max-width: 480px) {
  /* 테이블 헤더 스타일 */
  .notice-list-table th {
    font-size: 6px; 
    padding: 0px 6px 10px 12px; /* 상, 좌, 우, 하 padding 설정 */
  }
  /* 테이블 데이터 스타일 */
  .notice-list-table td {
    font-size: 6px; /* td에 원하는 크기 설정 */
  }
  
}
</style>