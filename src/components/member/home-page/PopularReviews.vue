<!-- 
 담당자: 박요한
 시작 일자: 2024.09.13
 설명 : 좋아요 많이 받은 리뷰 목록
 ---------------------
 2024.09.13 박요한 | 컴포넌트 생성.
 -->

<template>
  <div>
    <h2>인기 리뷰</h2>
    <!-- 리뷰 리스트 표시 -->

    <more-button to="/mypage/activities/review" />
  </div>
</template>

<script>
import MoreButton from "./MoreButton.vue";
export default {
  name: "PopularReviews",
  components: { MoreButton },
};
</script>

<style scoped></style>
