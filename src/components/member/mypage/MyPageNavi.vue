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
.my-page-container {
  display: flex;
  justify-content: flex-end; /* 사이드바를 오른쪽으로 배치 */
  align-items: flex-end;
  padding: 20px;
}

.main-content {
  flex: 1; /* 메인 콘텐츠가 대부분의 너비를 차지 */
}

.my-page-navi {
  background-color: #fafafa;
  border-left: 1px solid #e0e0e0; /* 왼쪽에 테두리 추가 */
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
  color: #333; /* 기본 색상 */
  transition: color 0.3s, background-color 0.3s; /* 색상 전환을 부드럽게 만듦 */
  padding: 10px;
  display: block;
  border-radius: 5px;
}

a:hover {
  color: white; /* 마우스 오버 시 텍스트 색상 */
  background-color: #ff66005c; /* 마우스 오버 시 배경색 */
}
</style>
