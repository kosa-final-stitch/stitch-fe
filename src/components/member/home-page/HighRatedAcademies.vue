<!-- 
 담당자: 박요한
 시작 일자: 2024.09.13
 설명 : 평점이 높은 학원 목록
 ---------------------
 2024.09.13 박요한 | 컴포넌트 생성.
 -->

<template>
  <div>
    <h2>평점 높은 학원</h2>
    <!-- 학원 리스트 표시 -->

    <more-button to="/academies" />
  </div>
</template>

<script>
import MoreButton from "./MoreButton.vue";
export default {
  name: "HighRatedAcademies",
  components: { MoreButton },
};
</script>

<style scoped></style>
