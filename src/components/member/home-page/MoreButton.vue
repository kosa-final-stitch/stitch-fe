<!-- 
 담당자: 박요한
 시작 일자: 2024.09.13
 설명 : 라우터 링크가 담긴 더보기 버튼
 ---------------------
 2024.09.13 박요한 | 컴포넌트 생성.
 -->

<template>
  <router-link :to="to" class="more-button"> 더보기 </router-link>
</template>

<script>
export default {
  name: "MoreButton",
  props: {
    to: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped>
.more-button {
  display: inline-block;
  margin-top: 10px;
  padding: 8px 16px;
  background-color: #ffdf50;
  color: white;
  text-decoration: none;
  border-radius: 5px;
}

.more-button:hover {
  background-color: #ff7701;
}
</style>
