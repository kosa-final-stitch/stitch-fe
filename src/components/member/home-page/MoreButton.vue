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
  padding: 0; /* 패딩을 제거하여 텍스트만 남김 */
  background: none; /* 배경색 제거 */
  color: #f28c00; /* 텍스트 색상 */
  border: none; /* 테두리 제거 */
  font-size: 16px; /* 적절한 크기 */
  cursor: pointer; /* 마우스 커서를 포인터로 변경 */
  text-decoration: underline; /* 텍스트에 밑줄 추가 */
  transition: color 0.3s ease; /* 색상 전환 효과 */
}

.more-button:hover {
  color: #ffdf50; /* hover 시 색상 변경 */
  text-decoration: none; /* hover 시 밑줄 제거 */
}
</style>
