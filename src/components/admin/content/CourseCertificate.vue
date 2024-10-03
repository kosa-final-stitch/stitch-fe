<!--
 담당자: 김호영
 시작 일자: 2024.09.29
 설명 : admin 수강인증 확인 페이지 기능 구현 및 디자인 개발
 ---------------------

 2024.09.29 김호영 | 수강인증 확인 페이지 구현.
 2024.10.03 김호영 | S3 연동 및 이미지 파일 표시.
 -->

 <template>
  <div class="certificate-info-page">
    <!-- 상단 검색창 -->
    <div class="search-bar">
      <div class="search-wrapper search-container">
        <!-- 카테고리 선택 -->
        <div class="category-container">
          <select v-model="selectedCategory" class="search-category">
            <option value="all">전체</option>
            <option value="completed">수료 완료</option>
            <option value="in-progress">처리중</option>
            <option value="rejected">수료 불가</option>
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

    <!-- 수료 신청 목록 테이블 -->
    <table class="certificate-list-table">
      <thead>
        <tr>
          <th>No.</th>
          <th>수료신청 ID</th>
          <th>신청자 닉네임</th>
          <th>교육 과정 ID</th>
          <th>교육 과정명</th>
          <th>교육 학원명</th>
          <th>수료일</th>
          <th>수료 여부</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="filteredCertificates.length === 0">
          <td colspan="9">수료 신청 내역이 없습니다.</td>
        </tr>
        <tr v-for="(certificate, index) in paginatedCertificates" :key="certificate.certificateId">
          <td>{{ (currentPage - 1) * certificatesPerPage + index + 1 }}</td>
          <td>{{ certificate.certificateId }}</td>
          <td>{{ certificate.nickname }}</td>
          <td>{{ certificate.courseId }}</td>
          <td>{{ certificate.courseName }}</td>
          <td>{{ certificate.academyName }}</td>
          <td>{{ formatDate(certificate.completionDate) }}</td>
          <td>{{ certificate.status }}</td>
          <td>
          <button v-if="certificate.status !== 'completed'" class="certificate-write-btn" @click="openCertificateAnswerModal(certificate)">
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

    <!-- 수료 확인 모달 -->
    <div v-if="isCertificateAnswerModalOpen" class="certificate-answer-modal-overlay">
      <div class="certificate-answer-modal-content">
        <h3>수료 확인</h3>
        <div class="certificate-answer-info">
          <strong>수료 관리</strong>

          <!-- 교육 과정명 -->
          <div class="info-item">
            <label for="courseName">교육 과정명</label>
            <input id="courseName" type="text" v-model="selectedCertificate.courseName" class="info-input" readonly />
          </div>

          <!-- 학원명 -->
          <div class="info-item">
            <label for="academyName">학원명</label>
            <input id="academyName" type="text" v-model="selectedCertificate.academyName" class="info-input" readonly />
          </div>

          <!-- 수료일 -->
          <div class="info-item">
            <label for="completionDate">수료일</label>
            <input id="completionDate" type="text" :value="formatDate(selectedCertificate.completionDate)" class="info-input" readonly />
          </div>

          <!-- 신청자 ID -->
          <div class="info-item">
            <label for="nickname">신청자 닉네임</label>
            <input id="nickname" type="text" v-model="selectedCertificate.nickname" class="info-input" readonly />
          </div>

          <!-- 신청자 ID -->
          <div class="info-item">
            <label for="memberId">신청자 ID</label>
            <input id="memberId" type="text" v-model="selectedCertificate.memberId" class="info-input" readonly />
          </div>

          <!-- 수료증 사진 -->
          <div class="info-item">
            <label for="fileUrl">수료증 사진</label>
            <div class="certificate-image-container">
              <img v-if="imageUrl" :src="imageUrl" alt="수료증 사진" class="certificate-image" />
            </div>
          </div>
        </div>

        <!-- 수료 상태 변경 -->
        <form @submit.prevent="submitCertificateAnswer">
          <div class="certificate-answer-info">
            <strong>수료 상태 변경</strong>
            <div class="info-item">
              <label for="status">수료 여부</label>
              <input id="status" type="text" v-model="selectedCertificate.status" class="info-input" />
            </div>
          </div>
          <div class="modal-buttons">
            <!-- 수료 완료 버튼 -->
            <button type="submit" class="btn-primary" @click="submitCertificateAnswer('completed')">수료 확인</button>
            
            <!-- 수료 불가 버튼 -->
            <button type="button" class="btn-danger" @click="submitCertificateAnswer('rejected')">수료 불가</button>
            
            <!-- 취소 버튼 -->
            <button type="button" class="btn-secondary" @click="closeCertificateAnswerModal">취소</button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- 조치 완료 모달 -->
  <div v-if="isChangeSuccessModalOpen" class="modal-success-overlay">
    <div class="modal-success-content">
      <div class="modal-icon-container">
        <font-awesome-icon :icon="['fas', 'circle-check']" class="modal-success-icon" />
      </div>
      <p>수료처리가 완료되었습니다</p>
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
      certificatesPerPage: 10,
      certificatesData: [], // 데이터를 저장할 배열
      isCertificateAnswerModalOpen: false, // 수료 모달 열림 여부
      selectedCertificate: null, // 선택된 수료 인증
      isChangeSuccessModalOpen: false, // 변경 완료 모달 상태 추가
      imageUrl: '', // 이미지 URL을 저장할 변수
    };
  },
  mounted() {
    this.fetchCertificates();
  },
  computed: {
    filteredCertificates() {
      return this.certificatesData.filter(certificate => {
        const matchesCategory =
          this.selectedCategory === 'all' ||
          (this.selectedCategory === 'completed' && certificate.status === '수료 완료') ||
          (this.selectedCategory === 'in-progress' && certificate.status === '처리중') ||
          (this.selectedCategory === 'rejected' && certificate.status === '수료 불가');
        const matchesQuery = 
          certificate.courseName.includes(this.searchQuery) ||
          certificate.academyName.includes(this.searchQuery) ||
          String(certificate.memberId).includes(this.searchQuery) ||
          String(certificate.courseId).includes(this.searchQuery);
        return matchesCategory && matchesQuery;
      });
    },
    paginatedCertificates() {
      const start = (this.currentPage - 1) * this.certificatesPerPage;
      return this.filteredCertificates.slice(start, start + this.certificatesPerPage);
    },
    totalPages() {
      return Math.ceil(this.filteredCertificates.length / this.certificatesPerPage);
    },
  },
  methods: {
    async fetchCertificates() {
      try {
        const token = localStorage.getItem('token'); // JWT 토큰이 로컬 스토리지에 저장되어 있다고 가정
        const response = await axios.get('/api/certificate/all', {
          headers: {
            Authorization: `Bearer ${token}` // 토큰을 Authorization 헤더에 포함
          }
        });
        this.certificatesData = response.data; // 가져온 데이터를 certificatesData에 저장
      } catch (error) {
        console.error('수료 데이터를 가져오는 중 오류 발생:', error);
      }
    },

    formatDate(dateString) {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // 월을 2자리로 변환
      const day = String(date.getDate()).padStart(2, '0'); // 일을 2자리로 변환

      // 원하는 형식으로 직접 반환 (점 없이)
      return `${year}-${month}-${day}`;  // 예: 2024-10-03
    },
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    async openCertificateAnswerModal(certificate) {
      this.selectedCertificate = {
        ...certificate,
      };
      this.isCertificateAnswerModalOpen = true;

      // certificate 객체와 filename 값 로그로 출력
      console.log('Certificate data:', certificate);
      console.log('Certificate filename:', certificate.filename);

      // S3에서 이미지 URL을 가져와서 설정
      this.imageUrl = await this.getS3ImageUrl(certificate.filename);
    },
    // 수료 상태 변경 처리 메서드
    async submitCertificateAnswer(status) {
    if (!this.selectedCertificate) return;

    // status가 제대로 설정되었는지 로그로 확인
    console.log('Current Status:', status);

      // 상태를 변경 (수료 완료 또는 수료 불가)
      if (status === 'completed') {
        this.selectedCertificate.status = '수료 완료';
      } else if (status === 'rejected') {
        this.selectedCertificate.status = '수료 불가';
      }

    try {
      // 서버로 수료 상태 업데이트 요청 전송
      const token = localStorage.getItem('token');
      // 로그로 certificateId와 status 확인
      console.log('certificateId:', this.selectedCertificate.certificateId);
      console.log('status:', this.selectedCertificate.status);

      const response = await axios.post('/api/certificate/updateStatus', {
        certificateId: this.selectedCertificate.certificateId,
        status: this.selectedCertificate.status
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log(response.data); // 성공 메시지 출력

      // certificatesData에서 해당 certificate를 찾아서 업데이트
      const certificateIndex = this.certificatesData.findIndex(certificate => certificate.certificateId === this.selectedCertificate.certificateId);
      if (certificateIndex !== -1) {
        this.certificatesData.splice(certificateIndex, 1, { ...this.selectedCertificate });
      }

      // UI 업데이트 후 모달 닫기
      this.closeCertificateAnswerModal();

      // 조치 완료 후 변경 완료 모달을 표시
      this.isChangeSuccessModalOpen = true;

      // 일정 시간 후 변경 완료 모달을 자동으로 닫기
      setTimeout(() => {
        this.isChangeSuccessModalOpen = false;
      }, 1500);

    } catch (error) {
      console.error('수료 상태 업데이트 실패:', error);
    }
    },

    // 이미지 불러오기 
    async getS3ImageUrl(filename) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/certificate/signed-url', {
          params: { filename },  // filename 파라미터를 전달
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        return response.data;  // S3 서명된 URL 반환
      } catch (error) {
        console.error('이미지 URL을 가져오는 중 오류 발생:', error);
        return '';  // 오류 시 빈 문자열 반환
      }
    },
    closeCertificateAnswerModal() {
      this.isCertificateAnswerModalOpen = false;  // 모달 닫기
      this.selectedCertificate = null;            // 선택된 인증서 초기화
      this.imageUrl = '';                         // 이미지 URL 초기화
    }
  }
};
</script>
  
  <style scoped>
/* 수료 확인 모달 스타일 */
.certificate-answer-modal-overlay {
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

.certificate-answer-modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 90%; /* 너비를 90%로 설정하여 작은 화면에서도 적절히 보이도록 */
  max-width: 400px; /* 최대 너비 제한 */
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  text-align: center;
}

/* Chrome, Safari, Opera에서 스크롤바 숨기기 */
.certificate-answer-modal-content::-webkit-scrollbar {
  display: none;
}

.certificate-answer-info .info-item {
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

.certificate-answer-modal-content h3 {
  font-size: 1.5rem;
  margin-bottom: 50px;
  text-align: center; /* 제목 중앙 정렬 */
}

.certificate-write-btn {
  background-color: #f8a060;
  color: white;
  padding: 8px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 12px;
}

.certificate-write-btn:hover {
  background-color: #fb822c;
}

.certificate-answer-modal-content .modal-buttons {
  display: flex;
  justify-content: space-between;

}

.certificate-answer-modal-content .btn-secondary {
  background-color: #ccc;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  outline: none; /* 포커스 아웃라인 제거 */
}

/* 수료 불가 버튼 스타일 */
.btn-danger {
  background-color: #dc3545;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.btn-danger:hover {
  background-color: #c82333;
}

.certificate-answer-info strong {
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
  justify-content: space-between; /* 버튼 간격을 좌우로 동일하게 */
  margin-top: 40px;
  gap: 15px; /* 버튼 간 간격을 벌려줌 */
  

}

.modal-buttons button {
  padding: 8px 15px; /* 버튼 크기를 줄임 (상하 8px, 좌우 15px) */
  width: 120px; /* 버튼의 너비를 줄임 */
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.modal-buttons button:first-child {
  background-color: #f39c5e;
  color: white;
  outline: none; /* 포커스 아웃라인 제거 */
  border: none; /* 버튼의 기본 테두리 제거 */
}

.modal-buttons button:first-child:focus,
.modal-buttons button:first-child:active {
  outline: none; /* 포커스 시 테두리 제거 */
  box-shadow: none; /* 그림자도 제거 가능 */
  border: none; /* 버튼 테두리 제거 */
}


.modal-buttons button:first-child:hover {
  background-color: #f08c44;
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
.certificate-info-page {
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
.certificate-list-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 50px;
}


/* 테이블 헤더 스타일 */
.certificate-list-table th {
  font-weight: bold;
  font-size: 12px; 
  padding: 0px 10px 15px 20px; /* 상, 좌, 우, 하 padding 설정 */
  text-align: center;
  border-bottom: 1px solid #575757;
}

/* 테이블 데이터 스타일 */
.certificate-list-table td {
  font-size: 12px; /* td에 원하는 크기 설정 */
  padding: 18px 10px 15px 20px; /* 상, 좌, 우, 하 padding 설정 */
  text-align: center;
}

.icon-bars {
  color: #ababab; /* 아이콘 색상 변경 */
  font-size: 15px;
  font-weight:300;
}

/* 수료증 사진 스타일 */
.certificate-image-container {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.certificate-image {
  max-width: 100%;
  height: auto;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 5px;
}


/* 반응형 디자인 */
@media (max-width: 1024px) {
  /* 테이블 헤더 스타일 */
  .certificate-list-table th {
    font-size: 10px; 
    padding: 0px 10px 12px 15px; /* 상, 좌, 우, 하 padding 설정 */
  }
  /* 테이블 데이터 스타일 */
  .certificate-list-table td {
    font-size: 10px; /* td에 원하는 크기 설정 */
  }
}


@media (max-width: 768px) {
  /* 테이블 헤더 스타일 */
  .certificate-list-table th {
    font-size: 8px; 
    padding: 0px 8px 12px 15px; /* 상, 좌, 우, 하 padding 설정 */
  }
  /* 테이블 데이터 스타일 */
  .certificate-list-table td {
    font-size: 8px; /* td에 원하는 크기 설정 */
  }
}

@media (max-width: 480px) {
  /* 테이블 헤더 스타일 */
  .certificate-list-table th {
    font-size: 6px; 
    padding: 0px 6px 10px 12px; /* 상, 좌, 우, 하 padding 설정 */
  }
  /* 테이블 데이터 스타일 */
  .certificate-list-table td {
    font-size: 6px; /* td에 원하는 크기 설정 */
  }
  
}
</style>