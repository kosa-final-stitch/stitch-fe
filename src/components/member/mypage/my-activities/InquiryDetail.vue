<template>
  <div v-if="loading">
    <!-- 로딩 중일 때 표시할 내용 -->
    <p>로딩 중입니다...</p>
  </div>
  <div class="inquiry-detail" v-else-if="inquiry">
    <h1>문의상세보기</h1>
    <p>회원님께서 문의하신 정보 입니다.</p>

    <!-- 문의 제목과 작성자 정보 -->
    <div class="inquiry-header">
      <h2>{{ inquiry.title }}</h2>
      <div class="inquiry-info">
        <span>{{ inquiry.author }}</span>
        <span>{{ inquiry.date }}</span>
      </div>
    </div>

    <!-- 문의 내용 -->
    <div class="inquiry-content">
      <p>{{ inquiry.content }}</p>
    </div>

    <!-- 관리자 답변 -->
    <div class="inquiry-reply" v-if="inquiry.reply">
      <h3>답변</h3>
      <div class="reply-info">
        <span>{{ inquiry.reply.author }}</span>
        <span>{{ inquiry.reply.date }}</span>
      </div>
      <p>{{ inquiry.reply.content }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      inquiry: null, // 초기값은 null로 설정
      loading: true, // 로딩 상태 추가
    };
  },
  created() {
    const inquiryId = this.$route.params.inquiryId; // URL에서 inquiryId를 가져옴
    console.log("inquiryId:", inquiryId); // 콘솔에 inquiryId 출력
    this.fetchInquiry(inquiryId);
  },
  methods: {
    fetchInquiry(inquiryId) {
      // 데이터를 가져오기 전에 로딩 상태 시작
      this.loading = true;

      // 하드코딩된 데이터 예시
      const inquiries = [
        {
          inquiryId: 1,
          title: "로그인이 왜 안되죠?",
          author: "박호영",
          date: "2024-09-01",
          content: "로그인이 안됩니다! 왜 나만 안되죠?",
          reply: {
            author: "관리자",
            date: "2024-09-02",
            content: "처리되도록 해드렸습니다. 다시한번 시도 부탁드립니다.",
          },
        },
        {
          inquiryId: 2,
          title: "비밀번호가 기억이 안납니다",
          author: "김철수",
          date: "2024-09-02",
          content: "비밀번호를 잊어버렸습니다.",
          reply: { author: "관리자", date: "2024-09-03", content: "비밀번호 초기화 링크를 이메일로 보내드렸습니다." },
        },
      ];

      // id에 맞는 데이터를 찾기
      this.inquiry = inquiries.find((inquiry) => inquiry.inquiryId == inquiryId);

      // 데이터를 설정한 후 로딩 상태 종료
      this.loading = false;
    },
  },
};
</script>

<style scoped>
.inquiry-detail {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

h1 {
  color: #ff6600;
  font-size: 24px;
  margin-bottom: 10px;
}

p {
  color: #666;
  margin-bottom: 20px;
}

.inquiry-header {
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 20px;
}

.inquiry-header h2 {
  font-size: 20px;
  margin: 0;
}

.inquiry-info,
.reply-info {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #999;
}

.inquiry-content,
.inquiry-reply {
  margin-bottom: 20px;
}

.inquiry-reply h3 {
  font-size: 18px;
  color: #333;
  margin-bottom: 10px;
}

.inquiry-reply p {
  margin: 0;
}
</style>
