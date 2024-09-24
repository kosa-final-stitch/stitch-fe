<!--
 담당자: 김호영
 시작 일자: 2024.09.10
 설명 : admin 1:1문의 페이지 기능 구현 및 디자인 개발
 ---------------------
 2024.09.10 김호영 | admin 초기 설정
 2024.09.18 김호영 | 1:1문의 페이지 초기 디자인 및 구현
 2024.09.19 김호영 | 1:1 문의 페이지 완.
 2024.09.24 김호영 | 문의사항 백엔드 연동. 
 -->
 <template>
  <div class="direct-info-page">
    <!-- 상단 검색창 -->
    <div class="search-bar">
      <div class="search-wrapper search-container">
        <!-- 카테고리 선택 -->
        <div class="category-container">
          <select v-model="selectedCategory" class="search-category">
            <option value="all">전체</option>
            <option value="answered">답변 완료</option>
            <option value="unanswered">미답변</option>
          </select>
          <font-awesome-icon 
            :icon="isDropdownOpen ? ['fas', 'angle-up'] : ['fas', 'angle-down']" class="angle-dropdown-icon" />
        </div>

        <!-- 검색 icon + 검색창 -->
        <div class="search-input-container">
          <font-awesome-icon :icon="['fas', 'magnifying-glass']" class="search-icon" />
          <input type="text" v-model="searchQuery" placeholder="Search" class="search-input" />
        </div>
      </div>
    </div>

    <!-- 게시글 목록 테이블 -->
    <table class="direct-list-table">
      <thead>
        <tr>
          <th>No.</th>
          <th>질문자</th>
          <th>문의 유형</th>
          <th>문의 제목</th>
          <th>문의 내용</th>
          <th>문의 등록일</th>
          <th>답변 등록일</th>
          <th>답변자 이름</th>
          <th>문의 상태</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="filteredDirects.length === 0">
          <td colspan="7">문의사항이 없습니다.</td>
        </tr>
        <tr v-for="(direct, index) in paginatedDirects" :key="direct.inquiryId">
          <td>{{ (currentPage - 1) * directsPerPage + index + 1 }}</td>
          <td>{{ direct.memberName }}</td> <!-- 질문자 이름 -->
          <td>{{ direct.category }}</td> <!-- 문의 유형 -->
          <td>{{ direct.title }}</td> <!-- 문의 제목 -->
          <td>{{ direct.content.slice(0, 15) }}...</td> <!-- 문의 내용 -->
          <td>{{ formatDate(direct.regDate) }}</td> <!-- 문의 등록일 -->
          <td>{{ direct.ansDate ? formatDate(direct.ansDate) : '-' }}</td> <!-- 답변 등록일 -->
          <td>{{ direct.adminName ? direct.adminName : '-' }}</td> <!-- 답변자 이름 -->
          <td>{{ direct.status === 'answered' ? '답변완료' : '미답변' }}</td> <!-- 문의 상태 -->
          <td>
            <!-- 답변 작성하기 버튼 -->
            <button v-if="direct.status !== 'answered'" class="direct-write-btn" @click="openDirectAnswerModal(direct)">
              답변하기
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- 페이지네이션 추가 -->
    <div class="pagination">
      <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1">이전</button>
      <span v-for="page in totalPages" :key="page">
        <button @click="goToPage(page)" :class="{ active: currentPage === page }">{{ page }}</button>
      </span>
      <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages">다음</button>
    </div>

    <!-- 답변 작성 모달 -->
    <div v-if="isDirectAnswerModalOpen" class="direct-answer-modal-overlay">
      <div class="direct-answer-modal-content">
        <h3>1:1 문의 답변 작성</h3>
          <div class="direct-answer-info">
            <div class="info-item">
              <label for="title">제목:</label>
              <input id="title" type="text" v-model="selectedDirect.title" class="info-input" readonly />
            </div>
            <div class="info-item">
              <label for="member_id">질문자:</label>
              <input id="member_id" type="text" v-model="selectedDirect.memberName" class="info-input" readonly />
            </div>
            <div class="info-item">
              <label for="content">내용:</label>
              <textarea id="content" v-model="selectedDirect.content" class="info-textarea" rows="5" readonly></textarea>
            </div>
          </div>
        <form @submit.prevent="submitDirectAnswer">
          <div class="form-group">
            <label for="answerContent" >답변 내용</label>
            <textarea v-model="answerContent" placeholder="내용을 입력하세요" rows="5" class="input-field" required></textarea>
          </div>
          <div class="modal-buttons">
            <button type="submit" class="btn-primary">답변 제출</button>
            <button type="button" class="btn-secondary" @click="closeDirectAnswerModal">취소</button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- 답변 작성 완료 모달 -->
  <div v-if="isChangeSuccessModalOpen" class="modal-success-overlay">
    <div class="modal-success-content">
      <div class="modal-icon-container">
        <font-awesome-icon :icon="['fas', 'circle-check']" class="modal-success-icon" />
      </div>
      <p>답변 작성이 완료 되었습니다.</p>
    </div>
  </div>

  
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      searchQuery: '',
      selectedCategory: 'all',
      currentPage: 1,
      directsPerPage: 10,
      directmentsData: [], // 문의사항 데이터를 저장할 배열
      isDirectAnswerModalOpen: false, // 답변 모달 열림 여부
      selectedDirect: null, // 선택된 문의
      answerContent: '', // 답변 내용
      isChangeSuccessModalOpen: false,
    };
  },
  mounted() {
    this.fetchInquiries(); // 페이지 로드 시 문의사항 데이터 가져오기
  },
  computed: {
    filteredDirects() {
      return this.directmentsData.filter(direct => {
        const matchesCategory =
          this.selectedCategory === 'all' ||
          (this.selectedCategory === 'answered' && direct.status === 'answered') ||
          (this.selectedCategory === 'unanswered' && direct.status === 'unanswered');
        const matchesQuery = direct.title.includes(this.searchQuery) || direct.content.includes(this.searchQuery);
        return matchesCategory && matchesQuery;
      });
    },
    paginatedDirects() {
      const start = (this.currentPage - 1) * this.directsPerPage;
      return this.filteredDirects.slice(start, start + this.directsPerPage);
    },
    totalPages() {
      return Math.ceil(this.filteredDirects.length / this.directsPerPage);
    },
  },
  methods: {
    formatDate(date) {
      const d = new Date(date);
      return d.toISOString().replace('T', ' ').substring(0, 10);
    },
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    async fetchInquiries() {
      try {
        const token = localStorage.getItem('jwt'); // JWT 토큰 확인
        const response = await axios.get("/api/member/inquiry", {
          headers: {
            Authorization: `Bearer ${token}`, // JWT 토큰을 헤더에 추가
          },
        });
        this.directmentsData = response.data;
      } catch (error) {
        console.error('문의사항 데이터를 불러오는 중 오류 발생:', error);
      }
    },
    openDirectAnswerModal(direct) {
      this.selectedDirect = direct;
      this.isDirectAnswerModalOpen = true;
    },
    closeDirectAnswerModal() {
      this.isDirectAnswerModalOpen = false;
      this.answerContent = '';
    },
    // 답변 async 추가
    async submitDirectAnswer() {
      if (!this.selectedDirect) return;

      try {
        const token = localStorage.getItem('jwt');

      // 관리자 답변 API 호출
      await axios.post(`/api/member/inquiry/${this.selectedDirect.inquiryId}/answer`, 
      {
        answer: this.answerContent, // 답변 내용
      },
      {
      headers: {
        Authorization: `Bearer ${token}`, // JWT 토큰을 헤더에 추가
      },
    });

        // 답변 저장 로직 (백엔드 연동 부분이 없으므로 프론트엔드에서 임시 저장)
        this.selectedDirect.ansdate = new Date().toISOString().split('T')[0];
        this.selectedDirect.status = 'answered';
        this.selectedDirect.answer = this.answerContent;

        // directmentsData에서 해당 문의를 찾아서 업데이트
        const directIndex = this.directmentsData.findIndex(
          (direct) => direct.direct_id === this.selectedDirect.direct_id);
        if (directIndex !== -1) {
          // 데이터 갱신
          this.directmentsData.splice(directIndex, 1, { ...this.selectedDirect });
        }

        // 모달 닫기 및 초기화
        this.closeDirectAnswerModal();

        // 조치 완료 후 변경 완료 모달을 표시
        this.isChangeSuccessModalOpen = true;

        // 일정 시간 후 변경 완료 모달을 자동으로 닫기
        setTimeout(() => {
          this.isChangeSuccessModalOpen = false;
          console.log("성공 모달 닫힘");
        }, 1000); 
      } catch (error) {
        console.error('답변 작성 중 오류 발생:', error);
      }
    },
  },
};
</script>

<style scoped>
/* 답변 작성 모달 스타일 */
.direct-answer-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6); /* 배경을 어둡게 */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
}

.direct-answer-modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  text-align: center; /* 텍스트 중앙 정렬 */
}

.direct-answer-info .info-item {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 10px;
}
.input-field {
  width: 100%;
  padding: 10px;
  margin-bottom: 20px; /* 마진 추가 */
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box; /* 필드가 컨테이너에 딱 맞게 조정되도록 설정 */
}

.direct-answer-modal-content h3 {
  font-size: 1.5rem;
  margin-bottom: 50px;
  text-align: center; /* 제목 중앙 정렬 */
}

.direct-write-btn {
  background-color: #f8a060;
  color: white;
  padding: 8px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 12px;
}

.direct-write-btn:hover {
  background-color: #fb822c;
}

.direct-answer-modal-content .modal-buttons {
  display: flex;
  justify-content: space-between;
}

.direct-answer-modal-content .btn-secondary {
  background-color: #ccc;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.form-group {
  text-align: left;
  margin-bottom: 20px; /* 마진 추가 */
}
.form-group label {
  margin-bottom: 20px; /* 마진 추가 */
  display: block; /* label이 블록 요소로 처리되어 아래 요소와 간격이 생기도록 설정 */
}

.info-item label {
  width: 80px; /* 레이블 넓이 설정 */
  text-align: left;
  margin-right: 10px;
}

.info-input {
  width: 100%;
  padding: 8px;
  background-color: #e0e0e0;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.info-textarea {
  width: 100%;
  padding: 8px;
  background-color: #e0e0e0;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: none;
}

/* 답변 내용 입력 필드 */
.input-field {
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
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
    gap: 30px;
    width: 320px;
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
.direct-info-page {
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
.direct-list-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 50px;
}


/* 테이블 헤더 스타일 */
.direct-list-table th {
  font-weight: bold;
  font-size: 12px; 
  padding: 0px 10px 15px 20px; /* 상, 좌, 우, 하 padding 설정 */
  text-align: center;
  border-bottom: 1px solid #575757;
}

/* 테이블 데이터 스타일 */
.direct-list-table td {
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
  .direct-list-table th {
    font-size: 10px; 
    padding: 0px 10px 12px 15px; /* 상, 좌, 우, 하 padding 설정 */
  }
  /* 테이블 데이터 스타일 */
  .direct-list-table td {
    font-size: 10px; /* td에 원하는 크기 설정 */
  }
}


@media (max-width: 768px) {
  /* 테이블 헤더 스타일 */
  .direct-list-table th {
    font-size: 8px; 
    padding: 0px 8px 12px 15px; /* 상, 좌, 우, 하 padding 설정 */
  }
  /* 테이블 데이터 스타일 */
  .direct-list-table td {
    font-size: 8px; /* td에 원하는 크기 설정 */
  }
}

@media (max-width: 480px) {
  /* 테이블 헤더 스타일 */
  .direct-list-table th {
    font-size: 6px; 
    padding: 0px 6px 10px 12px; /* 상, 좌, 우, 하 padding 설정 */
  }
  /* 테이블 데이터 스타일 */
  .direct-list-table td {
    font-size: 6px; /* td에 원하는 크기 설정 */
  }
  
}
</style>