<!-- 
 담당자: 박요한 
 시작 일자: 2024.09.12
 설명 : MemberMainLayout의 가운데 부분으로, router-view 가 위치하는 컴포넌트
 ---------------------
 2024.09.12 박요한 | 컴포넌트 생성
 2024.09.19 박요한 | 후원 버튼 추가
 -->

<template>
  <div>
    <router-view />

    <donation-button class="donation-button" />
  </div>
</template>

<script>
import DonationButton from "./DonationButton.vue";
export default {
  components: { DonationButton },
};
</script>

<style scoped>
.donation-button {
  position: fixed;
  bottom: 100px;
  right: 80px;
  z-index: 1000;
}
</style>
