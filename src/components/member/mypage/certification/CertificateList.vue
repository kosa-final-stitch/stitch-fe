<template>
  <!-- 메인 컨테이너 -->
  <div class="post-management">
    <h1>수료 인증 현황</h1>
    <p>수료 현황 내역입니다.</p>
    <table>
      <!-- 테이블 헤더 -->
      <thead>
        <tr>
          <th></th>
          <th>번호</th>
          <th>수료과정명</th>
          <th>수료학원</th>
          <th>개강일</th>
          <th>종료일</th>
          <th>수료여부</th>
        </tr>
      </thead>
      <!-- 테이블 바디 -->
      <tbody>
        <tr v-for="(certificate, index) in certificate" :key="index">
          <!-- 체크박스 -->
          <td><input type="checkbox" /></td>
          <!-- 게시글 번호 -->
          <td>{{ index + 1 }}</td>
          <!-- 수료과정명 -->
          <td>{{ certificate.title }}</td>
          <!-- 수료학원명 -->
          <td>{{ certificate.academy }}</td>
          <!-- 시작일 -->
          <td>{{ certificate.startDate }}</td>
          <!-- 종료일 -->
          <td>{{ certificate.endDate }}</td>
          <!-- 수료여부 -->
          <td>{{ certificate.complete }}</td>
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
      certificate: [
        {
          title: "MSA 4차 풀스택",
          academy: "한국소프트웨어산업협회",
          startDate: "2024-04-11",
          endDate: "2024-10-07",
          complete: "수료",
        },
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
