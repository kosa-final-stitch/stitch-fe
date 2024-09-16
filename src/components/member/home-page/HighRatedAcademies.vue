<!-- 
 담당자: 박요한
 시작 일자: 2024.09.13
 설명 : 평점이 높은 학원 목록
 ---------------------
 2024.09.13 박요한 | 컴포넌트 생성.
 2024.09.15 박요한 | 구체화.
 -->

<template>
  <div class="high-rated-academies">
    <h2>평점 높은 학원</h2>
    <div class="academy-container">
      <div
        v-for="academy in academies"
        :key="academy.academy_id"
        class="academy-card"
        @click="goToAcademyDetail(academy.academy_id)"
      >
        <div class="academy-details">
          <div class="stars">★★★★★</div>
          <h3>{{ academy.academy_name }}</h3>
          <p>주소: {{ academy.address }}</p>
          <p>전화번호: {{ academy.phone }}</p>
        </div>
      </div>
    </div>

    <!-- 더보기 버튼 -->
    <MoreButton to="/academies" />
  </div>
</template>

<script>
import axios from "axios";
import MoreButton from "./MoreButton.vue";

export default {
  name: "HighRatedAcademies",
  components: { MoreButton },
  data() {
    return {
      academies: [], // 백엔드에서 가져온 상위 5개의 학원 데이터
    };
  },
  mounted() {
    this.fetchTopRatedAcademies(); // 상위 학원 데이터 가져오기
  },
  methods: {
    // 상위 학원 리스트 가져오는 메서드
    async fetchTopRatedAcademies() {
      try {
        const response = await axios.get("/api/academies/top", {
          withCredentials: true, // 인증이 필요한 경우 세션 쿠키 포함
        });
        this.academies = response.data;
      } catch (error) {
        console.error("Error fetching academies:", error);
      }
    },
    // 학원 상세 페이지로 이동
    goToAcademyDetail(academyId) {
      this.$router.push({ name: "AcademyInfoDetail", params: { academyId } });
    },
  },
};
</script>

<style scoped>
.high-rated-academies {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.academy-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.academy-card {
  width: 20%;
  border: 1px solid #ddd;
  padding: 25px;
  margin-bottom: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.academy-card:hover {
  transform: scale(1.05);
}

.stars {
  color: #ffcc00;
  font-size: 20px;
  margin-bottom: 10px;
}
</style>
