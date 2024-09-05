<template>
  <div class="my-page-navi">
    <ul>
      <li>
        <router-link to="/mypage/activities/profileEdit"
          >회원 정보 수정</router-link
        >
      </li>
      <li>
        <router-link to="/mypage/activities/post">게시글 관리</router-link>
      </li>
      <li>
        <router-link to="/mypage/activities/review">수강평 관리</router-link>
      </li>
      <li>
        <router-link to="/mypage/activities/donation">후원 관리</router-link>
      </li>
      <li>
        <router-link to="/mypage/activities/inquiry">문의 관리</router-link>
      </li>
      <!-- 예시: 수료 인증 등록이 필요한 경우 여기에 추가 -->
      <li>
        <router-link to="/mypage/certification/list"
          >수료 인증 관리</router-link
        >
      </li>
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
