<!--
 담당자: 김호영
 시작 일자: 2024.09.10
 설명 : adminMainLayout 구현
 ---------------------
 2024.09.10 김호영 | template 초기 설정

 -->


<template>
  <div>
    <admin-sidebar></admin-sidebar>
    <AdminContentWrapper></AdminContentWrapper>
  </div>
</template>

<script>
import AdminSidebar from './AdminSidebar.vue';
import AdminContentWrapper from './AdminContentWrapper.vue';
export default {
  components: {AdminSidebar,AdminContentWrapper, },
  name: 'AdminMainLayout',
};
</script>