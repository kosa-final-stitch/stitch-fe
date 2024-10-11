<!--
 담당자: 김호영
 시작 일자: 2024.09.13
 설명 : admin 결제 관리 페이지 기능 구현 및 디자인 개발
 ---------------------
 2024.09.13 김호영 | 초기 설정
 2024.09.12 김호영 | 결제 정보 페이지 디자인 구현
 2024.09.17 김호영 | 결제 정보 페이지 완
 2024.10.01 김호영 | 결제 정보 페이지 최종 완.
 -->
 <template>
  <div class="pay-info-page">
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
            <option value="completed">처리 완료</option>
            <option value="pending">미처리</option>
            <option value="card">카드</option>
            <option value="account">계좌이체</option>
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
      </div>
    </div>

    <!-- 게시글 목록 테이블 -->
    <table class="pay-list-table">
      <thead>
        <tr>
          <th>No.</th>
          <th>결제일</th>
          <th>사용자ID</th>
          <th>사용자명</th>
          <th>결제 항목</th>
          <th>결제 금액</th>
          <th>결제 수단</th>
          <th>결제 확정일</th>
          <th>상태</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(pay, index) in paginatedPays" :key="pay.paymentId">
          <td>{{  (currentPage -1) * paysPerPage + index + 1 }}</td>
          <td>{{ formatDate(pay.payDate) }}</td>
          <td>{{ pay.memberId || '-' }}</td>
          <td>{{ pay.memberName || '-' }}</td> 
          <td>{{ pay.category }}</td> <!-- 결제 항목 -->
          <td>{{ formatAmount(pay.amount) }} 원</td> <!-- 결제 금액 -->
          <td>{{ pay.method === 'card' ? '카드' : '계좌이체' }}</td>
          <td>{{ pay.editDate ? formatDate(pay.editDate) : '-' }}</td>
          <td>{{ pay.status === 'pending' ? '미처리' : '처리 완료' }}</td>

          <td>
            <div class="dropdown-container" @click.stop="toggleDropdown(index)">
              <font-awesome-icon :icon="['fas', 'bars']" class="icon-bars" />
              <div v-if="openDropdownIndex === index" class="dropdown-menu">
                <ul>
                  <li @click="handleItemClick(pay, 'change')">
                    <font-awesome-icon :icon="['fas', 'check']" class="modal-icon" /> 처리 완료
                  </li>
                  <!--li @click="handleItemClick(pay, 'item3')">
                    <font-awesome-icon :icon="['fas', 'question']" class="modal-icon" /> 항목
                  </li-->
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
        <h3>상태를 "처리 완료"로 변경하시겠습니까?</h3>
        <p>선택하신 사용자 이름 : {{ payToChange?.memberName }}</p>
        <div class="modal-buttons">
          <button @click="changePay">확인</button>
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
  </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import axios from 'axios';

export default {
  components: {
    FontAwesomeIcon, // Font Awesome 컴포넌트 등록
  },
  data() {
    return {
      searchQuery: '',
      selectedCategory: 'all',
      currentPage: 1,
      paysPerPage: 12,
      isDropdownOpen: false,
      openDropdownIndex: null,
      isChangeModalOpen: false,
      isChangeSuccessModalOpen: false,
      payToChange: null,
      paymentsData: [], //결제 정보를 저장할 배열
    };
  },
  computed: {
    // 선택된 카테고리에 따라 게시글 필터링
    filteredPays() {
      return this.paymentsData.filter(pay => {
        const matchesCategory =
          this.selectedCategory === 'all' ||
          (this.selectedCategory === 'completed' && pay.status === 'completed') ||
          (this.selectedCategory === 'pending' && pay.status === 'pending') ||
          (this.selectedCategory === pay.method);
          const matchesQuery =
          (pay.email || '-').includes(this.searchQuery) ||
          (pay.name || '-').includes(this.searchQuery);
          return matchesCategory && matchesQuery;
      });
    },
    // 현재 페이지에 표시할 게시글
    paginatedPays() {
      const start = (this.currentPage - 1) * this.paysPerPage;
      return this.filteredPays.slice(start, start + this.paysPerPage);
    },
    // 전체 페이지 수
    totalPages() {
      return Math.ceil(this.filteredPays.length / this.paysPerPage);
    },
  },
  methods: {

    // 결제 금액 형식 메서드
    formatAmount(value) {
      if (!value) return '0'; // 값이 없으면 0 반환
      return value.toLocaleString(); // 세 자리마다 쉼표 추가
    },
    // 날짜 형식 메서드
    formatDate(date) {
      if (!date) {
        return '-'; // 날짜 값이 없을 경우 기본값으로 '-' 반환
      }

      const d = new Date(date);
      if (isNaN(d.getTime())) {
        return '-'; // 유효하지 않은 날짜일 경우 기본값으로 '-' 반환
      }
      
      return d.toISOString().replace('T', ' ').substring(0, 10);
    },
    // 페이지 이동 메서드
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    // 드롭다운 토글
    toggleDropdown(index) {
      this.openDropdownIndex = this.openDropdownIndex === index ? null : index;
    },
    // 결제 상태 변경 확인 모달 열기
    handleItemClick(pay, action) {
      if (action === 'change') {
        this.confirmChangePay(pay);
      }
    },
    confirmChangePay(pay) {
      this.payToChange = pay;
      this.isChangeModalOpen = true;
    },
    async changePay() {
      if (!this.payToChange) return;

    // 상태를 'completed'로 변경하면서 Vue가 반응하도록 처리
    Object.assign(this.payToChange, { status: 'completed' });

        try {
        // 서버로 상태 업데이트 API 요청
        await axios.post('https://stitchkosa.store/api/update-payment-status', { 
          paymentId: this.payToChange.paymentId, 
          status: 'completed' });
        
        // 성공 처리
        this.isChangeModalOpen = false;
        this.isChangeSuccessModalOpen = true;

        setTimeout(() => {
          this.isChangeSuccessModalOpen = false;
        }, 1500);

      } catch (error) {
        console.error('Error updating payment status', error);
      }
    },

    // 변경 취소
    cancelChange() {
      this.isChangeModalOpen = false;
      this.payToChange = null;
    },
  },
  mounted() {
  // 서버로부터 결제 데이터를 불러오는 로직
  axios.get('https://stitchkosa.store/api/payments')
  .then(response => {
    console.log('결제 데이터:', response.data); // 데이터 확인
    this.paymentsData = response.data;
  })
  .catch(error => {
    console.error('결제 데이터를 불러오는 중 오류 발생:', error);
  });
},
};
</script>

<style scoped>
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
.pay-info-page {
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
  width: 60%; /* 검색창 + 카테고리 창의 너비 */
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
.pay-list-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 50px;
}


/* 테이블 헤더 스타일 */
.pay-list-table th {
  font-weight: bold;
  font-size: 12px; 
  padding: 0px 10px 15px 20px; /* 상, 좌, 우, 하 padding 설정 */
  text-align: center;
  border-bottom: 1px solid #575757;
}

/* 테이블 데이터 스타일 */
.pay-list-table td {
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
  .pay-list-table th {
    font-size: 10px; 
    padding: 0px 10px 12px 15px; /* 상, 좌, 우, 하 padding 설정 */
  }
  /* 테이블 데이터 스타일 */
  .pay-list-table td {
    font-size: 10px; /* td에 원하는 크기 설정 */
  }
}


@media (max-width: 768px) {
  /* 테이블 헤더 스타일 */
  .pay-list-table th {
    font-size: 8px; 
    padding: 0px 8px 12px 15px; /* 상, 좌, 우, 하 padding 설정 */
  }
  /* 테이블 데이터 스타일 */
  .pay-list-table td {
    font-size: 8px; /* td에 원하는 크기 설정 */
  }
}

@media (max-width: 480px) {
  /* 테이블 헤더 스타일 */
  .pay-list-table th {
    font-size: 6px; 
    padding: 0px 6px 10px 12px; /* 상, 좌, 우, 하 padding 설정 */
  }
  /* 테이블 데이터 스타일 */
  .pay-list-table td {
    font-size: 6px; /* td에 원하는 크기 설정 */
  }
  
}
</style>