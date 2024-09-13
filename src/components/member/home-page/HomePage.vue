<!-- 
 담당자: 김호영, 박요한
 시작 일자: 2024.09.06
 설명 : 헤더를 위한 HomePage 컴포넌트 설정
 ---------------------
 2024.09.06 김호영 | 헤더 template 추가.
 2024.09.13 박요한 | 헤더 삭제.
 2024.09.13 박요한 | 홈 레이아웃 생성.
 -->

<template>
  <div class="home-page">
    <section class="high-rated-academies">
      <HighRatedAcademies />
    </section>

    <section class="high-rated-courses">
      <HighRatedCourses />
    </section>

    <section class="popular-reviews">
      <PopularReviews />
    </section>

    <section class="popular-posts">
      <PopularPosts />
    </section>
  </div>
</template>

<script>
import HighRatedAcademies from "./HighRatedAcademies.vue";
import HighRatedCourses from "./HighRatedCourses.vue";
import PopularReviews from "./PopularReviews.vue";
import PopularPosts from "./PopularPosts.vue";

export default {
  components: {
    HighRatedAcademies,
    HighRatedCourses,
    PopularReviews,
    PopularPosts,
  },
};
</script>

<style scoped>
.home-page {
  padding: 20px;
}

section {
  margin-bottom: 80px;
}
</style>
