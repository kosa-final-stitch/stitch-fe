<!-- 
 담당자: 김호영 
 시작 일자: 2024.09.06
 설명 : 헤더를 위한 Layout설정 
 ---------------------
 2024.09.06 김호영 | 헤더 영역 패딩 적용 ( 로그인 로그아웃 제외)
 2024.09.12 박요한 | 라우터에 맞춰 구조 수정 (header, content, footer)
 -->

<template>
  <div class="layout-container">
    <member-header class="header" />
    <content-area class="content" />
    <member-footer class="footer" />
  </div>
</template>

<script>
import MemberHeader from "./member-header/MemberHeader.vue";
import ContentArea from "./ContentArea.vue";
import MemberFooter from "./footer/MemberFooter.vue";

export default {
  components: { MemberHeader, MemberFooter, ContentArea },
};
</script>

<style scoped>
/* 전체 레이아웃을 화면 전체 높이로 설정 */
.layout-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* 헤더 영역 */
.header {
  /* 헤더 고정 여부에 따라 처리 */
  position: relative; /* 스크롤과 함께 올라가도록 기본값 설정 */
  width: 100%;
  z-index: 10;
}

/* 헤더를 고정하고 싶다면 아래 주석 해제 */
/* 
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 10;
}
*/

/* 콘텐츠 영역 */
.content {
  flex: 1;
  padding: 20px;
}
</style>
