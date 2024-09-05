<template>
  <div class="my-page">
    <!-- 상단 정보 헤더 -->
    <MemberInfoHeader />
    <div class="my-page-body">
      <!-- 좌측 네비게이션 -->
      <MyPageNavi />
      <!-- 메인 콘텐츠 영역 -->
      <MyPageContent />
    </div>
  </div>
</template>

<script>
import MemberInfoHeader from "./mypage-header/MemberInfoHeader.vue";
import MyPageNavi from "./MyPageNavi.vue";
import MyPageContent from "./MyPageContent.vue";

export default {
  components: {
    MemberInfoHeader,
    MyPageNavi,
    MyPageContent,
  },
};
</script>

<style scoped>
.my-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.my-page-body {
  display: flex;
  flex: 1;
}

.my-page-body > * {
  flex: 1;
}

.my-page-body > MyPageNavi {
  flex: 0 0 200px; /* 네비게이션 고정 너비 */
}

.my-page-body > MyPageContent {
  flex: 1; /* 콘텐츠 영역이 남은 공간 차지 */
  padding: 20px; /* 콘텐츠 영역 내부 여백 */
}
</style>
