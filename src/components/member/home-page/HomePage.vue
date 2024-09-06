<!-- 
 담당자: 김호영 
 시작 일자: 2024.09.06
 설명 : 헤더를 위한 HomePage 컴포넌트 설정
 ---------------------
 2024.09.06 김호영 | 헤더 template 추가
 -->


<template>
  <MemberHeader></MemberHeader>

</template>

<script>
import MemberHeader from '../member-header/MemberHeader.vue';

export default {
    name: "MemberApp",
    components: {
        MemberHeader,
    }

};

</script>

<style>



</style>