<template>
  <div class="my-page-navi">
    <ul>
      <li><router-link to="/">회원 정보 수정</router-link></li>
      <li><router-link to="/comment-management">게시글 관리</router-link></li>
      <li><router-link to="/review-management">수강평 관리</router-link></li>
      <li><router-link to="/donation-management">후원 관리</router-link></li>
      <li><router-link to="/inquiry-management">문의 관리</router-link></li>
      <li><router-link to="/certification">수료 인증 등록</router-link></li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "MyPageNavi",
};
</script>

<style scoped>
.my-page-navi {
  background-color: #fafafa;
  border-right: 1px solid #e0e0e0;
  padding: 20px;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  margin-bottom: 10px;
}
a {
  text-decoration: none;
  color: #ff6600;
}
</style>
