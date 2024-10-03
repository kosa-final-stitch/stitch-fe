<!-- 
 담당자: 김호영, 박요한
 시작 일자: 2024.09.06
 설명 : 헤더를 위한 HomePage 컴포넌트 설정
 ---------------------
 2024.09.06 김호영 | 헤더 template 추가.
 2024.09.13 박요한 | 헤더 삭제.
 2024.09.13 박요한 | 홈 레이아웃 생성.
 2024.09.25 박요한 | margin 조정.
 -->

<template>
  <div class="home-page">
    <section class="high-rated-academies">
      <HighRatedAcademies />
    </section>

    <section class="high-rated-courses">
      <HighRatedCourses />
    </section>

    <section class="popular-reviews">
      <PopularReviews />
    </section>

    <section class="popular-posts">
      <PopularPosts />
    </section>
  </div>
</template>

<script>
import HighRatedAcademies from "./HighRatedAcademies.vue";
import HighRatedCourses from "./HighRatedCourses.vue";
import PopularReviews from "./PopularReviews.vue";
import PopularPosts from "./PopularPosts.vue";
import { useMemberStore } from "@/store/member-store"; // Pinia 스토어 import
import axios from "axios"; // 사용자 정보 불러올 때 사용할 Axios


export default {
  components: {
    HighRatedAcademies,
    HighRatedCourses,
    PopularReviews,
    PopularPosts,
  },
  mounted() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");  // URL에서 JWT 토큰 추출
    const roles = urlParams.get("roles");  // URL에서 roles 추출 (필요 시 사용)

    if (roles) {
      // roles 문자열을 배열로 변환
      const rolesArray = roles.split(',');

      // ROLE_USER만 필터링하여 가져옴
      const filteredRoles = rolesArray.filter(role => role === 'ROLE_USER');
      console.log("Filtered roles:", filteredRoles); // 필터링된 roles 값 확인

      // Pinia 스토어에 저장할 권한
      if (filteredRoles.length > 0) {
        const memberStore = useMemberStore();

        // Pinia 스토어에 사용자 인증 상태와 권한 저장
        memberStore.setAuthorities(filteredRoles); // ROLE_USER만 저장
        memberStore.isAuthenticated = true; // 인증 상태 true로 변경
      }
    }

    if (token) {
      // 토큰을 로컬 스토리지에 저장
      localStorage.setItem("jwt", token);

      // 이후 요청 시 Axios에 JWT 토큰을 추가
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Pinia 스토어 불러오기
      const memberStore = useMemberStore();

      // 사용자 정보를 백엔드에서 불러와 Pinia 스토어에 저장
      axios.get('/api/member/info')
          .then(response => {
            const memberData = response.data;
            memberStore.setMember(memberData); // 사용자 정보 설정

            // roles 값이 있으면 Pinia 스토어에 권한 정보 저장
            if (roles) {
              const rolesArray = roles.split(','); // 권한을 배열로 변환
              memberStore.setAuthorities(rolesArray); // Pinia 스토어에 권한 설정
            }
          })
          .catch(error => {
            console.error("사용자 정보를 불러오는 중 오류 발생:", error);
          });
    }
  }
};
</script>

<style scoped>
.home-page {
  padding: 20px;
  max-width: 1280px;
  margin: 0 auto; /* 가운데 정렬 */
}

section {
  margin-top: 30px;
  margin-bottom: 120px;
}
</style>
