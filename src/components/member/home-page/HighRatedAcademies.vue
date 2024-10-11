<!-- 
 담당자: 박요한
 시작 일자: 2024.09.13
 설명 : 평점이 높은 학원 목록
 ---------------------
 2024.09.13 박요한 | 컴포넌트 생성.
 2024.09.15 박요한 | 구체화.
 2024.09.25 박요한 | 더보기 버튼 위치 조정.
 -->

<template>
  <div class="high-rated-academies">
    <div class="header-row">
      <h2>평점 높은 학원</h2>
      <!-- 더보기 버튼 -->
      <MoreButton to="/academies/academy" />
    </div>
    <div class="academy-container">
      <div
        v-for="(academy, index) in academies"
        :key="academy.academyid"
        class="academy-card"
        @click="goToAcademyDetail(academy.academyId)"
      >
        <div class="stars">{{ "★".repeat(roundedStars[index]) }}{{ "☆".repeat(5 - roundedStars[index]) }}</div>
        <h3>{{ academy.academyName }}</h3>
        <div class="academy-details">
          <p>주소: {{ academy.address }}</p>
          <p>전화번호: {{ academy.phone }}</p>
        </div>
      </div>
    </div>
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
        const response = await axios.get("https://stitchkosa.store/api/academies/top");
        console.log("Status Code:", response.status); // 상태 코드 확인
        console.log("Response Data:", response.data); // 응답 데이터 확인
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
  computed: {
    roundedStars() {
      return this.academies.map((academy) => {
        if (academy.averageRating) {
          return Math.round(academy.averageRating); // 평균 별점을 반올림
        }
        return 0; // 값이 없으면 0으로 설정
      });
    },
  },
};
</script>

<style scoped>
.high-rated-academies {
  margin: 0 auto;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding: 1%;
}

.header-row h2 {
  margin: 0;
}

.academy-container {
  display: grid;
  grid-template-columns: repeat(5, 1fr); /* 5개의 열 */
  gap: 10px; /* 카드 간의 간격 */
}

.academy-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* 위와 아래의 콘텐츠가 일정 간격을 유지 */
  border: 1px solid #ddd;
  padding: 25px;
  margin-bottom: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s ease;
}

.academy-card:hover {
  transform: scale(1.05);
}

.stars {
  color: #ffcc00;
  font-size: 20px;
  /* margin-bottom: 10px; */
  text-align: center;
}

.academy-card h3 {
  margin-bottom: 30px;
  text-align: center;
}

.academy-details {
  margin-top: auto; /* 아래로 정렬 */
  text-align: left;
}

.academy-details p {
  margin: 5px 0;
  text-align: left;
}
</style>
