<!--
 담당자: 김호영
 시작 일자: 2024.09.10
 설명 : admin 페이지 기능 구현 및 디자인 개발
 ---------------------
 2024.09.10 김호영 | admin 초기 설정
 -->

<!-- AdminApp.vue -->
<template>
  <div class="admin-app">
    <!-- 전체 페이지의 레이아웃을 감싸는 컨테이너 -->
    <AdminMainLayout />
  </div>
</template>

<script>
import AdminMainLayout from './AdminMainLayout.vue';

export default {
  components: {
    AdminMainLayout,
  },
};
</script>

<style scoped>
.admin-app {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
</style>