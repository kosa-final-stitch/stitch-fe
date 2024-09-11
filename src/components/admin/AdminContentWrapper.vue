<!--
 담당자: 김호영
 시작 일자: 2024.09.10
 설명 : adminContentWrapper 구현
 ---------------------
 2024.09.10 김호영 | template 초기 설정

 -->

<template>
  <div>
<admin-header></admin-header>
<content-area></content-area>
</div>
</template>

<script>
import AdminHeader from './admin-header/AdminHeader.vue';
import ContentArea from './content/ContentArea.vue';
export default {
components: { AdminHeader, ContentArea, },
name: 'AdminContentWrapper',
};
</script>

<style>

</style>