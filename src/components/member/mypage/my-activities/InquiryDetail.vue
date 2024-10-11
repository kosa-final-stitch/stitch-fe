<template>
  <div class="inquiry-detail" v-if="inquiry">
    <div class="inquiry-title-header">
      <h1>문의 사항</h1>
      <p>문의하신 내용에 대한 답변을 드립니다.</p>
    </div>
    <!-- 문의 제목과 작성자 정보 -->
    <div class="inquiry-header">
      <h2>{{ inquiry.title }}</h2>
      <div class="inquiry-info">
        <span>{{ inquiry.memberName }}</span>
        <span>{{ formatDate(inquiry.regDate) }}</span>
      </div>
    </div>

    <!-- 문의 내용 -->
    <div class="inquiry-content">
      <p>{{ inquiry.content }}</p>
    </div>

    <!-- 관리자 답변 -->
    <div class="inquiry-reply" v-if="inquiry.answer">
      <h3>답변</h3>
      <div class="reply-info">
        <span>{{ inquiry.adminName }}</span>
        <span>{{ formatDate(inquiry.ansDate) }}</span>
      </div>
      <p>{{ inquiry.answer }}</p>
    </div>
  </div>
</template>

<script>
import axios from "axios"; // axios import

export default {
  data() {
    return {
      inquiry: null, // 초기값은 null로 설정
    };
  },
  created() {
    const inquiryId = this.$route.params.inquiryId; // URL에서 inquiryId를 가져옴
    console.log("문의디테일 inquiryId:", inquiryId); // 콘솔에서 inquiryId 확인
    this.fetchInquiry(inquiryId);
  },
  methods: {
    async fetchInquiry(inquiryId) {
      try {
        // 백엔드에서 문의 상세 데이터를 가져오는 API 요청
        const response = await axios.get(`https://stitchkosa.store/api/member/inquiry/detail/${inquiryId}`);

        // 데이터를 설정
        this.inquiry = response.data;
        console.log("문의 상세 정보:", this.inquiry);
      } catch (error) {
        console.error("문의 상세 정보를 가져오는 중 오류 발생:", error);
      } finally {
        // 데이터를 가져온 후 로딩 상태 종료
        this.loading = false;
      }
    },
    // 날짜 형식을 보기 좋게 변환하는 메서드
    formatDate(date) {
      const options = { year: "numeric", month: "2-digit", day: "2-digit" };
      return new Date(date).toLocaleDateString("ko-KR", options);
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
  line-height: 1.6;
}

p {
  color: #666;
  margin-bottom: 20px;
  line-height: 1.6;
}

.inquiry-header {
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 20px;
}

.inquiry-header h2 {
  font-size: 18px; /* 제목 크기 */
  font-weight: normal; /* 제목 굵기 */
  margin: 10;
  line-height: 1.5;
}

.inquiry-info,
.reply-info {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #999;
  margin-bottom: 10px;
}
.inquiry-title-header {
  margin-bottom: 100px;
}

.inquiry-content {
  margin-bottom: 140px;
}

.inquiry-reply {
  margin-bottom: 10px;
}

.inquiry-reply {
  background-color: #f0f0f0; /* 옅은 회색 배경 */
  padding: 15px;
  border-radius: 5px;
  margin-top: 10px;
  font-size: 16px;
}

.inquiry-info {
  font-size: 12px; /* 작성자 정보 크기 */
  color: #999;
}

.inquiry-reply h3 {
  font-size: 16px; /* 답변 제목 크기 */
  color: #333;
}
</style>
