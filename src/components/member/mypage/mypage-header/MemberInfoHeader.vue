<template>
  <div class="member-info-header">
    <!-- 사용자 정보 표시 -->
    <h2>마이페이지</h2>
    <p>이름: {{ name }}</p>
    <p>닉네임: {{ nickname }}</p>
    <p>이메일: {{ email }}</p>
    <p>평균별점 : {{ star }}</p>
    <p>지역: {{ region }}</p>
    <p>게시글 수: {{ postCount }}</p>
    <p>수강평 수: {{ reviewCount }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: "박유은",
      nickname: "박쓸개",
      email: "email@stitch.com",
      star: "⭐⭐⭐⭐☆ 4.0 / 5.0",
      region: "서울",
      postCount: 10,
      reviewCount: 2,
    };
  },
};
</script>

<style scoped>
.member-info-header {
  background-color: #f8f9fa;
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
}
.info-details {
  display: flex;
  justify-content: space-between;
}
</style>
