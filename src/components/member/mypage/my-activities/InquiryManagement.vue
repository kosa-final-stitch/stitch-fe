<template>
  <!-- 메인 컨테이너 -->
  <div class="post-management">
    <h1>문의 현황</h1>
    <p>회원님께서 문의하신 내역입니다.</p>

    <table>
      <!-- 테이블 헤더 -->
      <thead>
        <tr>
          <th></th>
          <th>번호</th>
          <th>내용</th>
          <th>질문일</th>
          <th>답변일</th>
        </tr>
      </thead>
      <!-- 테이블 바디 -->
      <tbody>
        <!-- 여러 개의 문의를 리스트로 출력 -->
        <tr
          v-for="inquiry in inquiries"
          :key="inquiry.id"
          @click="goToDetail(inquiry.id)"
        >
          <td><input type="checkbox" /></td>
          <td>{{ inquiry.id }}</td>
          <td>{{ inquiry.title }}</td>
          <td>{{ inquiry.date }}</td>
          <td>{{ inquiry.replyDate }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      inquiries: [
        {
          id: 1,
          title: "로그인이 안된다구요",
          date: "2024-09-01",
          replyDate: "2024-09-02",
        },
        {
          id: 2,
          title: "비밀번호가 기억이 안납니다",
          date: "2024-09-02",
          replyDate: "2024-09-03",
        },
        // 추가적인 문의 항목들
      ],
    };
  },
  methods: {
    navigateToCertificateRequest() {
      this.$router.push({ name: "CertificateRequest" });
    },
    goToDetail(id) {
      // 해당 문의의 상세 페이지로 이동
      this.$router.push({ name: "InquiryDetail", params: { id } });
    },
  },
};
</script>

<style scoped>
.post-management {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
  cursor: pointer;
}

th {
  background-color: #f2f2f2;
}

input[type="checkbox"] {
  margin: 0;
}
</style>
