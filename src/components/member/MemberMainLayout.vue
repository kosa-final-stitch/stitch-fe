<!-- 
 담당자: 김호영 
 시작 일자: 2024.09.06
 설명 : 헤더를 위한 Layout설정 
 ---------------------
 2024.09.06 김호영 | 헤더 영역 패딩 적용 ( 로그인 로그아웃 제외)
 -->
<template>
  <div :class="{'has-padding': !isAuthPage}">
    <router-view />
  </div>
</template>

<script>
export default {
  computed: {
    // 현재 경로가 로그인 또는 회원가입 페이지인지 확인
    isAuthPage() {
      const path = this.$route.path;
      return path === '/login' || path === '/signup'; // 로그인, 회원가입 페이지일 때 true
    }
  }
};
</script>

<style>
/* 기본적으로 모든 페이지에 패딩 적용 */
.has-padding {
  padding-top: 200px;
}

/* 로그인, 회원가입 페이지는 패딩을 적용하지 않음 */
</style>