<!-- 
 담당자: 박요한
 시작 일자: 2024.09.13
 설명 : 좋아요 많이 받은 리뷰 목록
 ---------------------
 2024.09.13 박요한 | 컴포넌트 생성.
 2024.09.18 박요한 | 구체화.
 2024.09.25 박요한 | 더보기 버튼 위치 조정.
 -->

<template>
  <div class="popular-reviews">
    <div class="header-row">
      <h2>인기 리뷰</h2>
      <!-- 더보기 버튼 -->
      <MoreButton to="/academies/academy" />
    </div>
    <div class="review-container">
      <div
        v-for="(review, index) in reviews"
        :key="review.reviewId"
        class="review-card"
        @click="goToCourseDetail(review.academyId, review.courseId)"
      >
        <div class="stars">{{ "★".repeat(roundedStars[index]) }}{{ "☆".repeat(5 - roundedStars[index]) }}</div>
        <h3>{{ review.courseName }}</h3>
        <div class="review-details">
          <p>교육: {{ review.educationReview }}</p>
          <p>강사: {{ review.instructorReview }}</p>
          <p>시설: {{ review.facilityReview }}</p>
          <p>분위기: {{ review.atmosphereReview }}</p>
          <p>행정: {{ review.managementReview }}</p>
          <p>사후 관리: {{ review.laterReview }}</p>
        </div>
        <div class="like-container">
          <font-awesome-icon icon="heart" />
          <span>{{ review.likeCount }}</span>
          <!-- 좋아요 수 표시 -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import MoreButton from "./MoreButton.vue";

export default {
  name: "PopularReviews",
  components: { MoreButton },
  data() {
    return {
      reviews: [], // 인기 리뷰 데이터
    };
  },
  mounted() {
    this.fetchPopularReviews(); // 데이터 가져오기
  },
  methods: {
    async fetchPopularReviews() {
      try {
        const response = await axios.get("/api/member/reviews/top");
        this.reviews = response.data;
      } catch (error) {
        console.error("Error fetching popular reviews:", error);
      }
    },
    // 교육 과정 상세 페이지로 이동
    goToCourseDetail(academyId, courseId) {
      this.$router.push({ path: `/academies/academy/${academyId}/courses/${courseId}` });
    },
  },
  computed: {
    roundedStars() {
      return this.reviews.map((review) => {
        if (review.averageRating) {
          return Math.round(review.averageRating); // 평균 별점을 반올림
        }
        return 0; // 값이 없으면 0으로 설정
      });
    },
  },
};
</script>

<style scoped>
.popular-reviews {
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

.review-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 5개의 열 */
  gap: 10px; /* 카드 간의 간격 */
}

.review-card {
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

.review-card:hover {
  transform: scale(1.05);
}

.stars {
  color: #ffcc00;
  font-size: 20px;
  text-align: center;
}

.review-card h3 {
  margin-bottom: 30px;
  text-align: center;
}

.review-details {
  margin-top: auto; /* 아래로 정렬 */
  text-align: left;
}

.review-details p {
  margin: 5px 0;
  text-align: left;
}

.like-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
}

.like-container .fa-heart {
  color: #ff4b5c; /* 하트 색상 */
  margin-right: 5px;
  font-size: 20px;
}

.like-container span {
  font-size: 16px;
  color: #333;
}
</style>
