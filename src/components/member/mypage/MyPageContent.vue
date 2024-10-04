<template>
  <div class="mypage-content">
    <!-- 자식 컴포넌트들이 렌더링될 위치 -->
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  // 필요 시 로직 추가
};
</script>

<style scoped>
.mypage-content {
  padding: 20px;
}
</style>
