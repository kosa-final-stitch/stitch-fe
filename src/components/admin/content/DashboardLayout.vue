<!--
 담당자: 김호영
 시작 일자: 2024.09.10
 설명 : admin 대시보드 페이지 기능 구현 및 디자인 개발
 ---------------------
 2024.09.10 김호영 | admin 초기 설정
 2024.09.25 김호영 | 대시보드 디자인 구현
 2024.09.26 김호영 | 대시보드 그래프 구현 및 데이터 연동 (방문자 수 주석)
 -->


 <template>
  <div class="dashboard">

    <!-- 맨 위 상자 영역 -->
    <div class="top-section">
      <div class="dashboard-cards">

        <div class="top-box">
          <h6>
            <span class="left-text">전체 가입자 수 :</span> 
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

        <!-- <div class="top-box">
          <h6>
            <span class="left-text">오늘 방문자 수 :</span> 
            <span class="visitor-count">{{ todayVisitorCount }} 명</span> 
          </h6>
          <div class="yellow-line"></div>
        </div> -->

      </div>
    </div>

    <!-- 중간 상자 영역 -->
    <div class="middle-section">
      <div class="middle-boxes">
      
        <div class="middle-box">
          <canvas id="userComparisonChart"></canvas> <!-- 월별 가입자 수 그래프-->
        </div>

        <div class="middle-box">
          <canvas id="paymentComparisonChart"></canvas> <!-- 월별 결제 금액 그래프 -->
        </div>

        <!-- <div class="middle-box">
          방문자 수 비교 그래프
        </div> -->

      </div>
    </div>

    <!-- 하단 상자 영역 -->
    <div class="bottom-section">
      <div class="bottom-boxes">

        <div class="bottom-box-container">
          <div class="box-title">공지사항 게시판</div>
          <div class="underline"></div>
          <div class="bottom-box">
            <ul class="notice-list">
              <li v-if="latestNotices.length === 0" class="no-posts-message">게시글이 없습니다.</li>
              <li 
                v-for="notice in latestNotices" 
                :key="notice.id" 
                class="notice-box" 
                @click="navigateTo('admin/announcement')"
              >
                <div class="notice-content">
                  <strong>{{ notice.title }}</strong>
                  <p>내용 : {{ notice.content.slice(0, 30) }}</p>
                </div>
                <small class="notice-date">작성일 : {{ formatDate(notice.regdate) }}</small>
              </li>
            </ul>
          </div>
        </div>

        <div class="bottom-box-container">
          <div class="box-title">1:1 문의 게시판</div>
          <div class="underline"></div>
          <div class="bottom-box">
            <ul class="direct-list">
              <li v-if="latestNotices.length === 0" class="no-posts-message">게시글이 없습니다.</li>
              <li 
                v-for="direct in latestDirects" 
                :key="direct.inquiryId" 
                class="notice-box" 
                @click="navigateTo('admin/direct-inquiry')"
              >
                <div class="notice-content">
                    <strong>{{ direct.title }}</strong>
                    <p>내용 : {{ direct.content.slice(0, 30) }}</p>
                  </div>
                  <small class="notice-date">문의일 : {{ formatDate(direct.regDate) }}</small>
              </li>
            </ul>
          </div>
        </div>

        <div class="bottom-box-container">
          <div class="box-title">신고 목록 게시판</div>
          <div class="underline"></div>
          <div class="bottom-box">
            <ul class="report-list">
              <li v-if="latestReports.length === 0" class="no-posts-message">게시물이 없습니다.</li>
              <li 
                v-for="report in latestReports" 
                :key="report.reportId" 
                class="notice-box" 
                @click="navigateTo('admin/report-inquiry')"
              >
                <div class="notice-content">
                    <strong>신고 제목 : {{ report.reason }}</strong>
                    <p>신고 항목 : {{ getCategory(report) }}</p>
                  </div>
                  <small class="notice-date">신고일 : {{ formatDate(report.regdate) }}</small>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
import axios from 'axios';  // axios 추가
import { Chart, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale } from 'chart.js'; // 필요한 Chart.js 구성 요소 추가

Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale);

export default {
  data() {
    return {
      members: [],  // DB에서 불러올 회원 정보가 저장될 배열
      totalPayment: 0,  // 전체 결제 금액
      todayVisitorCount: 0,  // 오늘 방문자 수
      latestNotices: [], // 공지사항을 저장할 배열
      latestDirects: [], // 1:1 문의를 저장할 배열
      latestReports: [], // 신고 문의를 저장할 배열
      hasReportError: false // 에러 발생 여부를 확인하는 변수 추가
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
          // 월별 사용자 수 초기화 (1월부터 12월까지)
          const monthlyUserCounts = Array(12).fill(0);

          // 각 회원의 등록 날짜를 기반으로 월별 카운트 계산
          this.members.forEach(member => {
            const regDate = new Date(member.signupdate); // 회원 등록일
            const month = regDate.getMonth(); // 월을 0부터 11까지 반환
            monthlyUserCounts[month] += 1;  // 해당 월의 사용자 수 증가
          });

          // 그래프 데이터 업데이트
          this.createUserComparisonChart(monthlyUserCounts);

        } else {
          console.error('API 응답이 배열이 아닙니다. 응답:', response.data);
        }

        console.log('회원 정보:', this.members);  // 회원 정보 콘솔에 출력
      } catch (error) {
        console.error("회원 정보를 불러오는 중 오류 발생:", error);
      }
    },

    // 사용자수 비교 그래프 생성
    createUserComparisonChart(data) {
      const ctx = document.getElementById('userComparisonChart').getContext('2d');

      // 그라데이션 배경 추가
      const gradient = ctx.createLinearGradient(0, 0, 0, 400);
      gradient.addColorStop(0, 'rgba(75, 192, 192, 0.5)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

      new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],  // 월별 라벨
          datasets: [{
            label: '월별 가입자 수',
            data: data, // 월별 사용자 수 데이터
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: gradient, // 그라데이션 배경
            borderWidth: 2,  // 라인 두께
            pointBackgroundColor: 'rgba(75, 192, 192, 1)', // 포인트 색상
            pointBorderColor: '#fff',  // 포인트 외곽선 색상
            pointHoverRadius: 7,  // 포인트 호버 크기
            pointRadius: 5,  // 포인트 기본 크기
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(75, 192, 192, 1)',
            tension: 0.4 // 라인 곡선 정도 (부드러운 라인)
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
            },
            tooltip: {
              enabled: true,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              titleColor: '#fff',
              bodyColor: '#fff',
              titleFont: {
                family: "'Arial', sans-serif",
                size: 16
              },
              bodyFont: {
                family: "'Arial', sans-serif",
                size: 14
              },
              borderWidth: 1,
              borderColor: '#333',
              padding: 10,
              cornerRadius: 4,
              caretPadding: 10
            }
          },
          scales: {
              y: {
                beginAtZero: true,
                grid: {
                  color: 'rgba(200, 200, 200, 0.2)'
                },
                ticks: {
                  stepSize: 1, // 1
                  callback: function(value) {
                    return value.toLocaleString() + ' 명';  // 금액 형식으로 y축 표시
                  },
                  color: '#333',  // y축 글자 색상
                  font: {
                    size: 12  // y축 폰트 크기
                  }
                },
              x: {
                grid: {
                  display: false
                },
                ticks: {
                  color: '#333',  // x축 글자 색상
                  font: {
                    size: 12  // x축 폰트 크기
                  }
                }
              }
            }
          }
        }
      });
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
        // 월별 결제 금액 초기화 (1월부터 12월까지)
        const monthlyPaymentSums = Array(12).fill(0);

        // 각 결제의 날짜를 기반으로 월별 금액 합산
        paymentResponse.data.forEach(payment => {
          const paymentDate = new Date(payment.payDate); // 결제 날짜
          const month = paymentDate.getMonth(); // 월을 0부터 11까지 반환
          monthlyPaymentSums[month] += payment.amount; // 해당 월의 결제
  
        });
        // 배열의 모든 amount 값을 더해서 totalPayment에 저장
        if (paymentResponse.data.length > 0) {
          this.totalPayment = paymentResponse.data.reduce((sum, payment) => sum + payment.amount, 0);  // amount 값 합산
          console.log('불러온 총 금액:', this.totalPayment);
          

          // 그래프 업데이트
          this.createPaymentComparisonChart(monthlyPaymentSums);

        } else {
          this.totalPayment = 0;  // 데이터가 없으면 0으로 설정
          console.log('결제 데이터가 없습니다.');
        }
      } catch (error) {
        console.error("결제 금액 데이터를 불러오는 중 오류 발생:", error);
      }
      
    },

    // 월별 결제 금액 그래프 생성
    createPaymentComparisonChart(data) {
      const ctx = document.getElementById('paymentComparisonChart').getContext('2d');
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
          datasets: [{
            label: '월별 결제 금액',
            data: data,
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderWidth: 2,
            pointBackgroundColor: 'rgba(54, 162, 235, 1)',
            pointBorderColor: '#fff',
            pointHoverRadius: 7,
            pointRadius: 5,
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(54, 162, 235, 1)',
            tension: 0.4  // 부드러운 곡선
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 100000,  // 예시: 1만 단위로 y축 눈금 설정
                callback: function(value) {
                  return value.toLocaleString() + ' 원';  // 금액 형식으로 y축 표시
                }
              }
            },
            x: {
              ticks: {
                color: '#333',
                font: {
                  size: 12
                }
              }
            }
          }
        }
      });
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

    // 공지시항 데이터를 API로 가져오느 메서드
    async fetchNotices() {
      try {
        const token = localStorage.getItem('jwt');
        const response = await axios.get('/api/notices', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (Array.isArray(response.data)) {
          this.latestNotices = response.data.slice(0, 3); // 최신 3개의 공지사항만 저장
        }
      } catch (error) {
        console.error("공지사항 데이터를 불러오는 중 오류 발생:", error);
      }
    },

    // 1:1문의 데이터를 API로 가져오느 메서드
    async fetchDirects() {
      try {
        const token = localStorage.getItem('jwt');
        const response = await axios.get('/api/member/inquiry', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (Array.isArray(response.data)) {
          this.latestDirects = response.data.slice(0, 3); // 최신 3개의 문의만 저장
        }
      } catch (error) {
        console.error("문의사항 데이터를 불러오는 중 오류 발생:", error);
      }
    },

    // 신고 문의 데이터를 API로 가져오느 메서드
    async fetchReports() {
      try {
        const token = localStorage.getItem('jwt');
        const response = await axios.get('/api/member/report', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (Array.isArray(response.data)) {
          this.latestReports = response.data.slice(0, 3); // 최신 3개의 신고만 저장
          this.hasReportError = false; // 에러가 없음을 표시
        }
      } catch (error) {
        console.error("신고 문의 데이터를 불러오는 중 오류 발생:", error);
        this.latestReports = []; // 에러가 나도 빈 배열로 설정
        this.hasReportError = true; // 에러가 발생했음을 표시
      }
    },
    // 카테고리 처리 로직 추가
    getCategory(report) {
      if (report.postOrComment === 'POST') {
        return '게시글';
      } else if (report.postOrComment === 'COMMENT') {
        return '댓글';
      } else {
        return '-';
      }
    },

    formatDate(date) {
      const d = new Date(date);
      return d.toISOString().substring(0, 10); // YYYY-MM-DD 형식으로 변환
    },

    navigateTo(route) {
    this.$router.push(`/${route}`);  // 앞에 / 추가
  },


  },

  // mounted 훅은 methods 외부에 있어야 함  //this.fetchTodayVisitors(); <-- 방문자 수 
  mounted() {
    this.fetchMembers(); // 총 가입자 수
    this.fetchTotalPayment(); // 총 결제 금액
    this.fetchNotices(); // 공지사항 데이터
    this.fetchDirects(); // 1:1 문의사항 데이터
    this.fetchReports(); // 신고 문의 데이터



    
    
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
  justify-content: space-around;
  gap: 20px;
}

.top-box {
  width: 45%;
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
  font-size: 13px;
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
  justify-content: space-around;
  gap: 20px;
}

.middle-box {
  width: 45%;
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
  gap: 20px;
}

.bottom-box-container {
  position: relative;
  flex: 1; /* 너비를 균등하게 분배 */
  /* 기존의 width: 30%;는 제거합니다. */
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


/* 데이터 불러오는 리스트 스타일 */
div.bottom-box ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
  width: 90%; /* 리스트 아이템의 너비를 동일하게 설정 */
}

div.bottom-box li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  margin-bottom: 10px;
  background-color: #fff;
  border-radius: 5px;
  cursor: pointer;
  transition: box-shadow 0.3s ease, padding 0.3s ease, margin 0.3s ease;
  max-height: 60px;
  overflow: hidden;
}

div.bottom-box li:hover {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

/* 공지사항 제목과 내용 왼쪽 정렬 */
div.bottom-box .notice-content {
  flex-grow: 1;
  text-align: left; /* 왼쪽 정렬 */
}

div.bottom-box .notice-content strong {
  display: block;
  font-size: 13px; /* 작은 크기 */
  margin-bottom: 5px;
  color: #333;
}

div.bottom-box .notice-content p {
  font-size: 11px; /* 내용 글자 크기 */
  color: #666;
  margin: 0; /* 기본 여백 제거 */
}

/* 작성일 오른쪽 정렬 */
div.bottom-box .notice-date {
  font-size: 12px;
  color: #999;
  text-align: right;
  flex-shrink: 0;
  margin-left: 15px;
}

/* 반응형 조정: 화면 크기가 600px 이하일 때 */
@media (max-width: 600px) {
  div.bottom-box li {
    flex-direction: column;
    align-items: flex-start;
    padding: 10px; /* 패딩 줄임 */
    margin-bottom: 8px; /* 마진 줄임 */
  }

  div.bottom-box .notice-content strong {
    font-size: 10px; /* 제목 폰트 크기 줄임 */
    margin-bottom: 3px; /* 제목 아래 여백 줄임 */
  }

  div.bottom-box .notice-content p {
    font-size: 8px; /* 내용 폰트 크기 줄임 */
  }

  div.bottom-box .notice-date {
    font-size: 7px; /* 작성일 폰트 크기 줄임 */
    margin-left: 0;
    margin-top: 8px; /* 작성일 위에 약간의 여백 추가 */
    align-self: flex-end;
  }
}

/* 더 작은 화면 (400px 이하)에서 폰트 및 패딩 더 줄임 */
@media (max-width: 400px) {
  div.bottom-box li {
    padding: 8px; /* 더 작은 패딩 */
    margin-bottom: 6px; /* 더 작은 마진 */
  }

  div.bottom-box .notice-content strong {
    font-size: 8px; /* 제목 폰트 크기 더 줄임 */
  }

  div.bottom-box .notice-content p {
    font-size: 7px; /* 내용 폰트 크기 더 줄임 */
  }

  div.bottom-box .notice-date {
    font-size: 7px; /* 작성일 폰트 크기 더 줄임 */
    margin-top: 5px; /* 여백 조금 더 줄임 */
  }
}

.no-posts-message {
  text-align: center;
  color: #999;
  font-size: 14px;
  margin: 10px 0;
}

.error-message {
  text-align: center;
  color: #999;
  font-size: 14px;
  margin: 10px 0;

}
</style>