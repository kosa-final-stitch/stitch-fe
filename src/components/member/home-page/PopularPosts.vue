<!-- 
 담당자: 박요한
 시작 일자: 2024.09.13
 설명 : 조회수 높은 게시글 목록
 ---------------------
 2024.09.13 박요한 | 컴포넌트 생성.
 -->

<template>
  <div>
    <h2>인기 게시글</h2>
    <!-- 게시판별 인기 게시글 리스트 -->

    <more-button to="/board/info-share" />
    <more-button to="/board/free-community" />
    <more-button to="/board/qna" />
  </div>
</template>

<script>
import MoreButton from "./MoreButton.vue";
export default {
  components: { MoreButton },
  name: "PopularPosts",
};
</script>

<style scoped></style>
