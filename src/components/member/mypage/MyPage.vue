<template>
  <MemberHeader></MemberHeader>
  <div class="my-page">
    <!-- 상단 정보 헤더 -->
    <MemberInfoHeader />
    <div class="my-page-body">
      <!-- 좌측 네비게이션 -->
      <MyPageNavi class="my-page-navi" />
      <!-- 메인 콘텐츠 영역 -->
      <MyPageContent class="my-page-content" />
    </div>
  </div>
</template>

<script>
import MemberInfoHeader from "./mypage-header/MemberInfoHeader.vue";
import MyPageNavi from "./MyPageNavi.vue";
import MyPageContent from "./MyPageContent.vue";
import MemberHeader from "../member-header/MemberHeader.vue";

export default {
  components: {
    MemberHeader,
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
}

.my-page-body {
  display: flex;
  flex: 1;
}

.my-page-navi {
  flex: 0 0 300px; /* 네비게이션 고정 너비를 150px로 설정 */
}

.my-page-content {
  flex: 1; /* 콘텐츠 영역이 남은 공간을 차지하도록 설정 */
  padding: 20px; /* 콘텐츠 영역 내부 여백 */
}
</style>
