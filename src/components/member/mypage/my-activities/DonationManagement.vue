<template>
  <!-- 메인 컨테이너 -->
  <div class="post-management">
    <h1>후원 관리</h1>
    <p>회원님께서 후원해주신 내역입니다.</p>

    <!-- 정보공유 게시판 테이블 -->
    <table>
      <!-- 테이블 헤더 -->
      <thead>
        <tr>
          <th></th>
          <th>번호</th>
          <th>후원 날짜</th>
          <th>후원 금액</th>
          <th>후원 방식</th>
        </tr>
      </thead>
      <!-- 테이블 바디 -->
      <tbody>
        <tr v-for="(donation, index) in donations" :key="index">
          <!-- 체크박스 -->
          <td><input type="checkbox" /></td>
          <!-- 게시글 번호 -->
          <td>{{ index + 1 }}</td>
          <!-- 후원날짜 -->
          <td>{{ donation.date }}</td>
          <!-- 후원 금액 -->
          <td>{{ donation.amount }}</td>
          <!-- 후원 방식 -->
          <td>{{ donation.method }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  // 컴포넌트 데이터
  data() {
    return {
      donations: [
        {
          date: "2024-09-01", // 후원 날짜
          amount: "10000원", // 후원 금액
          method: "카드", // 후원 방식
        },
        {
          date: "2024-09-02",
          amount: "20000원",
          method: "계좌이체",
        },
        // 필요한 만큼 추가로 후원 객체를 추가할 수 있음
      ],
    };
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
