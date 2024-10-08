<!--
 담당자: 김호영
 시작 일자: 2024.09.10
 설명 : admin 신고 문의 페이지 기능 구현 및 디자인 개발
 ---------------------
 2024.09.10 김호영 | admin 초기 설정
 2024.09.19 김호영 | 신고 문의 페이지 기능 및 디자인 구현
 2024.09.29 김호영 | 신고 정보 백엔드에서 데이터 갖고오기
 -->

 <template>
  <div class="report-info-page">
    <!-- 상단 검색창 -->
    <div class="search-bar">
      <div class="search-wrapper search-container">
        <!-- 카테고리 선택 -->
        <div class="category-container">
          <select v-model="selectedCategory" class="search-category">
            <option value="all">전체</option>
            <option value="comment">댓글</option>
            <option value="post">게시글</option>
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
    <table class="report-list-table">
      <thead>
        <tr>
          <th>No.</th>
          <th>신고자</th>
          <th>카테고리</th>
          <th>게시글 번호</th>
          <th>댓글 번호</th>
          <th>신고 유형</th>
          <th>신고 사유</th>
          <th>신고 일자</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="filteredReports.length === 0">
          <td colspan="8">신고문의가 없습니다.</td>
        </tr>
        <tr v-for="(report, index) in paginatedReports" :key="report.reportId">
          <td>{{ (currentPage - 1) * reportsPerPage + index + 1 }}</td>
          <td>{{ report.nickname }}</td>
          <td>{{ getCategory(report) }}</td> <!-- 카테고리 결정 -->
          <td>{{ report.boardId }}</td>
          <td>{{ report.commentId || '-' }}</td>
          <td>{{  report.type || '-' }}</td>
          <td>{{ report.reason }}</td>
          <td>{{ formatDate(report.regdate) }}</td>
          <td>
            <button v-if="report.status !== 'answered'" class="report-write-btn" @click="openReportAnswerModal(report)">
              확인하기
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

    <!-- 신고 확인 모달 -->
    <div v-if="isReportAnswerModalOpen" class="report-answer-modal-overlay">
      <div class="report-answer-modal-content">
        <h3>신고 문의 확인</h3>
        <div class="report-answer-info">
          <strong>신고 관리</strong>
          <div class="info-item">
            <label for="reason">신고 사유</label>
            <input id="reason" type="text" v-model="selectedReport.reason" class="info-input" readonly />
          </div>
          <div class="info-item">
            <label for="reason">신고 유형</label>
            <input id="reason" type="text" v-model="selectedReport.type" class="info-input" readonly />
          </div>
          <div class="info-item">
            <label for="nickname">신고자:</label>
            <input id="nickname" type="text" v-model="selectedReport.nickname" class="info-input" readonly />
          </div>
          <div class="info-item">
            <label for="content">신고 내용:</label>
            <textarea id="content" v-model="selectedReport.content" class="info-textarea" rows="5" readonly></textarea>
          </div>
        </div>
          <form @submit.prevent="submitReportAnswer">
            <div class="report-answer-info">
              <strong>해당 게시글/댓글 내용</strong>

              <!-- 작성 유형 (POST or COMMENT) -->
              <div class="info-item">
                <label for="postOrComment">작성 유형</label>
                <input id="postOrComment" type="text" :value="getPostOrCommentType(selectedReport.postOrComment)" class="info-input" readonly />
              </div>

              <!-- 게시글/댓글 번호 -->
              <div class="info-item">
                <label for="number">게시글/댓글 번호</label>
                <input id="number" type="text" :value="selectedReport.postOrComment === 'POST' ? selectedReport.boardId : selectedReport.commentId || '-'" class="info-input" readonly />
              </div>

              <!-- 작성자 정보 -->
              <div class="info-item">
                <label for="writerId">작성자:</label>
                <input id="writerId" type="text" :value="selectedReport.writerId || '-'" class="info-input" readonly />
              </div>

              <!-- 게시글일 경우 제목 표시 -->
              <div class="info-item" v-if="selectedReport.title !== '-'">
                <label for="title">제목:</label>
                <input id="title" type="text" v-model="selectedReport.title" class="info-input" readonly />
              </div>

              <!-- 내용 (게시글 또는 댓글) -->
              <div class="info-item">
                <label for="postContent">내용:</label>
                <textarea id="postContent" v-model="selectedReport.postContent" class="info-textarea" rows="5" readonly></textarea>
              </div>
              
            </div>
              <div class="modal-buttons">
                <button type="button" class="btn-secondary" @click="closeReportAnswerModal">확인 완료</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- 확인 완료 모달 -->
    <div v-if="isChangeSuccessModalOpen" class="modal-success-overlay">
      <div class="modal-success-content">
        <div class="modal-icon-container">
          <font-awesome-icon :icon="['fas', 'circle-check']" class="modal-success-icon" />
        </div>
        <p>확인이 완료되었습니다</p>
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
      reportsPerPage: 10,
      reportsData: [], // 데이터를 저장할 배열
      isReportAnswerModalOpen: false, // 신고 모달 열림 여부
      selectedReport: null, // 선택된 신고
      answerContent: '', // 신고 내용
      isChangeSuccessModalOpen: false, // 변경 완료 모달 상태 추가
    };
  },
  mounted() {
    this.fetchReports();
  },
  computed: {
    filteredReports() {
      return this.reportsData.filter(report => {
        const matchesCategory =
          this.selectedCategory === 'all' ||
          (this.selectedCategory === 'post' && report.postOrComment === 'POST') ||
          (this.selectedCategory === 'comment' && report.postOrComment === 'COMMENT');
        const matchesQuery = 
          (report.content || '').includes(this.searchQuery) ||             // 신고 내용
          String(report.reason || '').includes(this.searchQuery) ||        // 신고 사유
          String(report.nickname || '').includes(this.searchQuery) ||      // 신고자
          String(this.getCategory(report)).includes(this.searchQuery) ||   // 카테고리
          String(report.boardId || '').includes(this.searchQuery) ||       // 게시글 번호
          String(report.commentId || '').includes(this.searchQuery) ||     // 댓글 번호
          String(report.type || '').includes(this.searchQuery) ||          // 신고 유형
          String(report.regdate || '').includes(this.searchQuery);         // 신고 일자
          return matchesCategory && matchesQuery;
      });
    },
    paginatedReports() {
      const start = (this.currentPage - 1) * this.reportsPerPage;
      return this.filteredReports.slice(start, start + this.reportsPerPage);
    },
    totalPages() {
      return Math.ceil(this.filteredReports.length / this.reportsPerPage);
    },
  },
  methods: {
    async fetchReports() {
      try {
        const token = localStorage.getItem('token'); // JWT 토큰이 로컬 스토리지에 저장되어 있다고 가정
        const response = await axios.get('/api/member/report', {
          headers: {
            Authorization: `Bearer ${token}` // 토큰을 Authorization 헤더에 포함
          }
        });
        console.log('Fetched Reports:', response.data); // 데이터를 로그로 확인
        this.reportsData = response.data; // 가져온 데이터를 reportsData에 저장
      } catch (error) {
        console.error('신고 데이터를 가져오는 중 오류 발생:', error);
        // 에러 처리 로직 추가 가능
      }
    },
    getPostOrCommentType(postOrComment) {
      if (postOrComment === 'POST') {
        return '게시글';
      } else if (postOrComment === 'COMMENT') {
        return '댓글';
      } else {
        return '-'; // 값이 없거나 오류가 있을 경우
      }
    },
    formatDate(date) {
      const d = new Date(date);
      return d.toISOString().replace('T', ' ').substring(0, 10);
    },
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    async openReportAnswerModal(report) {
      try {
        // 서버에서 작성자, 게시글/댓글 정보 가져오기
        const writerId = await this.getWriterId(report);
        console.log('Writer ID:', writerId);  // 확인

        // 게시글 또는 댓글 내용을 가져옴
        const postContentResponse = await this.getPostContent(report);
        console.log('Post Content Response:', postContentResponse); // 전체 응답 확인


        // 'postContentResponse' 객체에서 'content' 키를 가져온다.
        // 1. 먼저 'content' 키(소문자)가 있는지 확인
        // 2. 없으면 'CONTENT' 키(대문자)가 있는지 확인
        // 3. 둘 다 없으면 기본값 '-' 반영
        const postContent = postContentResponse.content || postContentResponse.CONTENT || '-';

        // 'postTitle'은 게시글인 경우에만 사용
        // 'report.postOrComment'가 'POST'인지 확인
        const postTitle = report.postOrComment === 'POST'
          ? (
              // 1. 'title'(소문자)가 있는지 확인
              postContentResponse.title ||
              // 2. 없으면 'TITLE'(대문자)가 있는지 확인
              postContentResponse.TITLE ||
              // 3. 둘 다 없으면 기본값 '-'
              '-'
            )
          // 댓글인 경우 제목은 '-'
          : '-';


        console.log('Post Content:', postContent);  // 확인
        console.log('Post Title:', postTitle);      // 제목 확인

        this.selectedReport = {
          ...report,
          writerId: writerId || '-', // 작성자 정보 없으면 '-'
          title: postTitle, // 게시글 제목
          postContent: postContent || '-', // 게시글 또는 댓글 내용
        };
        this.isReportAnswerModalOpen = true;
      } catch (error) {
        console.error('게시글/댓글 정보 로드 실패:', error);
      }
    },
    async getWriterId(report) {
      try {
        const response = await axios.get(`/api/member/report/${report.reportId}/writer`);
        console.log('Writer Response:', response.data);  // 확인
        return response.data;
      } catch (error) {
        console.error('작성자 정보 로드 실패:', error);
        return '-';
      }
    },

    async getPostContent(report) {
      try {
        const response = await axios.get(`/api/member/report/${report.reportId}/content`);
        console.log('Content Response:', response.data);  // 응답 데이터 확인

        // response.data가 Map<String, String> 형태라면
        return response.data;
      } catch (error) {
        console.error('게시글/댓글 내용 로드 실패:', error);
        return '-';  // 에러 발생 시 대체값
      }
    },
    closeReportAnswerModal() {
      this.isReportAnswerModalOpen = false;
      this.answerContent = '';
    },
    async submitReportAnswer() {
      if (!this.selectedReport) return;

      try {
        // 서버로 상태 업데이트 전송
        const token = localStorage.getItem('token');
        const response = await axios.post(`/api/member/report/${this.selectedReport.reportId}/answer`, {
          status: 'answered',
          answer: this.answerContent
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('Response:', response.data); // 서버 응답 확인

        // 상태를 변경해서 UI에서 확인 완료로 표시되도록 변경
        this.selectedReport.ansdate = new Date().toISOString().split('T')[0];
        this.selectedReport.status = 'answered';
        this.selectedReport.answer = this.answerContent;

        // reportsData에서 해당 report를 찾아서 업데이트
        const reportIndex = this.reportsData.findIndex(report => report.reportId === this.selectedReport.reportId);
        if (reportIndex !== -1) {
          this.reportsData.splice(reportIndex, 1, { ...this.selectedReport });
        }

      // UI 업데이트 후 모달 닫기
      this.closeReportAnswerModal();

      // 조치 완료 후 변경 완료 모달을 표시
      this.isChangeSuccessModalOpen = true;

      // 일정 시간 후 변경 완료 모달을 자동으로 닫기
      setTimeout(() => {
        this.isChangeSuccessModalOpen = false;
      }, 1500);
    } catch (error) {
        console.error('신고 처리 실패:', error);
    }
  },
  
    // 카테고리 처리 로직
    getCategory(report) {
      if (report.postOrComment === 'POST') {
        return '게시글';
      } else if (report.postOrComment === 'COMMENT') {
        return '댓글';
      } else {
        return '-';
      }
    }
  
  },
};
</script>

<style scoped>
/* 신고 확인 모달 스타일 */
.report-answer-modal-overlay {
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

.report-answer-modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  text-align: center; /* 텍스트 중앙 정렬 */
}

.report-answer-info .info-item {
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

.report-answer-modal-content h3 {
  font-size: 1.5rem;
  margin-bottom: 50px;
  text-align: center; /* 제목 중앙 정렬 */
}

.report-write-btn {
  background-color: #f8a060;
  color: white;
  padding: 8px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 12px;
}

.report-write-btn:hover {
  background-color: #fb822c;
}

.report-answer-modal-content .modal-buttons {
  display: flex;

}

.report-answer-modal-content .btn-secondary {
  background-color: #ffa15e;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.report-answer-info strong {
  display: block;
  text-align: left; /* 글씨를 왼쪽에 붙여줌 */
  margin-bottom: 20px; /* 밑에 마진을 적용 */
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
  width: 120px; /* 레이블 넓이 설정 */
  text-align: left;
  margin-right: 11px;
  font-size: 11px;
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

/* 신고 내용 필드 */
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
  margin-top: 40px;
}

.modal-buttons button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
  width: 160px;
}


.modal-buttons button:last-child:hover {
  background-color: #fb822c; /* 호버 시 더 짙은 회색 */
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
.report-info-page {
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
.report-list-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 50px;
}


/* 테이블 헤더 스타일 */
.report-list-table th {
  font-weight: bold;
  font-size: 12px; 
  padding: 0px 10px 15px 20px; /* 상, 좌, 우, 하 padding 설정 */
  text-align: center;
  border-bottom: 1px solid #575757;
}

/* 테이블 데이터 스타일 */
.report-list-table td {
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
  .report-list-table th {
    font-size: 10px; 
    padding: 0px 10px 12px 15px; /* 상, 좌, 우, 하 padding 설정 */
  }
  /* 테이블 데이터 스타일 */
  .report-list-table td {
    font-size: 10px; /* td에 원하는 크기 설정 */
  }
}


@media (max-width: 768px) {
  /* 테이블 헤더 스타일 */
  .report-list-table th {
    font-size: 8px; 
    padding: 0px 8px 12px 15px; /* 상, 좌, 우, 하 padding 설정 */
  }
  /* 테이블 데이터 스타일 */
  .report-list-table td {
    font-size: 8px; /* td에 원하는 크기 설정 */
  }
}

@media (max-width: 480px) {
  /* 테이블 헤더 스타일 */
  .report-list-table th {
    font-size: 6px; 
    padding: 0px 6px 10px 12px; /* 상, 좌, 우, 하 padding 설정 */
  }
  /* 테이블 데이터 스타일 */
  .report-list-table td {
    font-size: 6px; /* td에 원하는 크기 설정 */
  }
  
}
</style>