<!-- 
 2024.10.1. 박요한 | 백에서 데이터 가져오기
-->
<template>
  <!-- 메인 컨테이너 -->
  <div class="post-management">
    <h1>후원 관리</h1>
    <!-- 후원 내역이 없을 때 안내 문구 -->
    <div v-if="donations.length === 0">
      <p>후원한 내역이 없습니다.</p>
    </div>

    <div v-else>
      <p>회원님께서 후원해주신 내역입니다.</p>

      <!-- 정보공유 게시판 테이블 -->
      <table>
        <!-- 테이블 헤더 -->
        <thead>
          <tr>
            <th></th>
            <th>번호</th>
            <th>후원 날짜</th>
            <th>후원 금액 (원)</th>
            <th>후원 방식</th>
            <th>상태</th>
          </tr>
        </thead>
        <!-- 테이블 바디 -->
        <tbody>
          <tr v-for="(donation, index) in donations" :key="index">
            <!-- 체크박스 -->
            <td><input type="checkbox" /></td>
            <!-- 게시글 번호 -->
            <td>{{ index + 1 }}</td>
            <!-- 후원 날짜 -->
            <td>{{ formatDate(donation.payDate) }}</td>
            <!-- 후원 금액 -->
            <td>{{ donation.amount }}</td>
            <!-- 후원 방식 -->
            <td>{{ translateMethod(donation.method) }}</td>
            <!-- 후원 상태 -->
            <td>{{ translateStatus(donation.status) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  // 컴포넌트 데이터
  data() {
    return {
      donations: [],
    };
  },
  mounted() {
    this.fetchDonations();
  },
  methods: {
    async fetchDonations() {
      try {
        const response = await axios.get(`https://stitchkosa.store/api/member/payments`);
        this.donations = response.data;
      } catch (error) {
        console.error("Error fetching donations:", error);
      }
    },
    // 날짜 형식 변환
    formatDate(date) {
      const options = { year: "numeric", month: "2-digit", day: "2-digit" }; // 24.12.31.
      return new Date(date).toLocaleDateString("ko-KR", options);
    },
    translateMethod(method) {
      // 결제 방식에 대한 번역
      switch (method) {
        case "card":
          return "카드";
        default:
          return method; // 기본 값
      }
    },
    translateStatus(status) {
      // 상태에 대한 번역
      switch (status) {
        case "completed":
          return "완료";
        case "pending":
          return "대기 중";
        default:
          return status; // 기본 값
      }
    },
  },
};
</script>

<style scoped>
/* 메인 컨테이너 스타일 */
.post-management {
  max-width: 800px; /* 최대 너비 */
  margin: 0 auto; /* 가운데 정렬 */
  text-align: center; /* 텍스트 가운데 정렬 */
}

/* 테이블 스타일 */
table {
  width: 100%; /* 테이블 너비 */
  border-collapse: collapse; /* 테이블 셀 간격 제거 */
  margin-top: 20px; /* 위 여백 */
}

/* 테이블 헤더와 셀 스타일 */
th,
td {
  border: 1px solid #ddd; /* 테두리 */
  padding: 8px; /* 안쪽 여백 */
  text-align: center; /* 텍스트 가운데 정렬 */
}

/* 테이블 헤더 배경색 */
th {
  background-color: #f2f2f2; /* 헤더 배경색 */
}

/* 체크박스 스타일 */
input[type="checkbox"] {
  margin: 0; /* 체크박스 외부 여백 제거 */
}
</style>
