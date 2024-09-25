<!--
 담당자: 김호영
 시작 일자: 2024.09.10
 설명 : admin 대시보드 페이지 기능 구현 및 디자인 개발
 ---------------------
 2024.09.10 김호영 | admin 초기 설정
 2024.09.25 김호영 | 대시보드 디자인 구현
 -->


 <template>
  <div class="dashboard">

    <!-- 맨 위 상자 영역 -->
    <div class="top-section">
      <div class="dashboard-cards">

        <div class="top-box">
          <h6>
            <span class="left-text">전체 사용자 수 :</span> 
            <span class="member-count">{{ totalMembersCount }} 명</span> <!-- 전체 사용자 수 출력 -->
          </h6>
          <div class="yellow-line"></div>
        </div>

        <div class="top-box">
          <h6>
            <span class="left-text">전체 결제 금액 :</span> 
            <span class="payment-amount">{{ formattedPaymentAmount }} 원</span> <!-- 결제 금액 출력 -->
          </h6>
          <div class="yellow-line"></div>
        </div>

        <div class="top-box">
          <h6>
            <span class="left-text">오늘 방문자 수 :</span> 
            <span class="visitor-count">{{ todayVisitorCount }} 명</span> <!-- 방문자 수 출력 -->
          </h6>
          <div class="yellow-line"></div>
        </div>

      </div>
    </div>

    <!-- 중간 상자 영역 -->
    <div class="middle-section">
      <div class="middle-boxes">

        <div class="middle-box">
          사용자 수 비교 그래프
        </div>

        <div class="middle-box">
          결제 비교 그래프
        </div>

        <div class="middle-box">
          방문자 수 비교 그래프
        </div>

      </div>
    </div>

    <!-- 하단 상자 영역 -->
    <div class="bottom-section">
      <div class="bottom-boxes">

        <div class="bottom-box-container">
          <div class="box-title">공지사항 게시판</div>
          <div class="underline"></div>
          <div class="bottom-box">
            공지사항 게시판
          </div>
        </div>

        <div class="bottom-box-container">
          <div class="box-title">1:1 문의 게시판</div>
          <div class="underline"></div>
          <div class="bottom-box">
            1:1 문의 게시판
          </div>
        </div>

        <div class="bottom-box-container">
          <div class="box-title">신고 목록 게시판</div>
          <div class="underline"></div>
          <div class="bottom-box">
            신고 목록 게시판
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
import axios from 'axios';  // axios 추가
export default {
  data() {
    return {
      members: [],  // DB에서 불러올 회원 정보가 저장될 배열
      totalPayment: 0,  // 전체 결제 금액
      todayVisitorCount: 0,  // 오늘 방문자 수
    };
  },
  computed: {
    // 전체 사용자 수 계산
    totalMembersCount() {
      return this.members.length;
    },
    // 쉼표를 추가한 결제 금액 계산
    formattedPaymentAmount() {
      return this.totalPayment ? this.totalPayment.toLocaleString() : '0';  // totalPayment 값이 존재할 경우에만 toLocaleString() 적용
    },
  },
  methods: {
    // API를 통해 모든 회원 정보 불러오기
    async fetchMembers() {
      try {
        const token = localStorage.getItem('jwt');  // 저장된 JWT 토큰 가져오기
        if (!token) {
          console.error('JWT 토큰이 없습니다.');
          return;
        }
        const response = await axios.get('/api/members', {
          headers: {
            Authorization: `Bearer ${token}`  // 토큰을 Authorization 헤더에 포함
          }
        });

        // 응답 데이터가 배열인지 확인
        if (Array.isArray(response.data)) {
          this.members = response.data;
        } else {
          console.error('API 응답이 배열이 아닙니다. 응답:', response.data);
        }

        console.log('회원 정보:', this.members);  // 회원 정보 콘솔에 출력
      } catch (error) {
        console.error("회원 정보를 불러오는 중 오류 발생:", error);
      }
    },
      // 전체 결제 금액을 불러오는 메서드
      async fetchTotalPayment() {
        try {
          const token = localStorage.getItem('jwt');
          const paymentResponse = await axios.get('/api/payments', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          // 배열의 모든 amount 값을 더해서 totalPayment에 저장
          if (paymentResponse.data.length > 0) {
            this.totalPayment = paymentResponse.data.reduce((sum, payment) => sum + payment.amount, 0);  // amount 값 합산
            console.log('불러온 총 금액:', this.totalPayment);
          } else {
            this.totalPayment = 0;  // 데이터가 없으면 0으로 설정
            console.log('결제 데이터가 없습니다.');
          }
        } catch (error) {
          console.error("결제 금액 데이터를 불러오는 중 오류 발생:", error);
        }
      },
  
    // 오늘 방문자 수를 불러오는 메서드
    async fetchTodayVisitors() {
      try {
        const token = localStorage.getItem('jwt');
        const visitorResponse = await axios.get('/api/visitors/today', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        this.todayVisitorCount = visitorResponse.data.total;  // 오늘 방문자 수 설정
      } catch (error) {
        console.error("방문자 데이터를 불러오는 중 오류 발생:", error);
      }
    },
  },
  created() {
    // 컴포넌트가 로드될 때 API 호출
    this.fetchMembers();
    this.fetchTotalPayment();  // fetchAdditionalData 제거 후 fetchTotalPayment 호출
    this.fetchTodayVisitors();
  }
}
</script>

<style scoped>
.dashboard {
  margin: 20px;
}

/* 맨 위 상자 스타일 */
.top-section {
  padding: 20px;
  border-radius: 10px;
}

.dashboard-cards {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.top-box {
  width: 30%;
  border: 1px solid #f1f1f1;
  border-radius: 3px;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  position: relative;
}

.top-box h6 {
  display: flex;
  justify-content: space-between; /* 좌우 정렬 */
  align-items: center; /* 수직 중앙 정렬 */
  margin-left: 15px;
  margin-right: 14px;
  font-size: 11px;
  color: #2e2e2e;
}

/* 왼쪽 텍스트 스타일 (기본 유지) */
.left-text {
  font-size: 11px;
  color: #2e2e2e;
}

/* 오른쪽 숫자 크기만 키우기 */
.member-count, .payment-amount, .visitor-count {
  font-size: 20px; /* 숫자 크기 키우기 */
  font-weight: bold;
  color: #333;
}

.yellow-line {
  content: '';
  position: absolute;
  left: 15px;
  bottom: 7px;
  width: calc(100% - 30px);
  height: 4px;
  background-color: orange;
  border-radius: 80px;
}

/* 중간 상자 스타일 */
.middle-section {
  padding: 20px;
  border-radius: 10px;
}

.middle-boxes {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.middle-box {
  width: 30%;
  height: 200px;
  border: 1px solid #f1f1f1;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.1);
  position: relative;
}

/* 하단 상자 스타일 */
.bottom-section {
  padding: 30px;
  margin-top: 30px;
  border-radius: 10px;
}

.bottom-boxes {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.bottom-box-container {
  position: relative;
  width: 30%;
}

.bottom-box {
  height: 260px;
  border: 1px solid #f1f1f1;
  border-radius: 3px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.1);
  position: relative;
  margin-top:10px;
}

/* 제목과 밑줄을 상자 위로 배치 */
.box-title {
  position: absolute;
  top: -30px;
  left: 0;
  width: 100%;
  text-align: left;
  font-size: 14px;
  font-weight: bold;
}

.underline {
  position: absolute;
  top: -10px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: black;
}
</style>