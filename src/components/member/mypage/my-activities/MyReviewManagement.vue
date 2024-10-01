<template>
  <div class="review-list-page">
    <h2>학생 리뷰</h2>
    <div class="review-container">
      <!-- 리뷰 리스트 -->
      <div
        v-for="review in reviews"
        :key="review.reviewId"
        class="review-card"
        @click="goToReviewDetail(review.reviewId)"
      >
        <div class="review-details">
          <p>학원 : {{ review.academyName }}</p>
          <p>강의 : {{ review.courseName }}</p>
          <p>
            <strong>강의 </strong>
            <span class="stars">
              <span v-for="n in 5" :key="n">
                {{ n <= review.educationRating ? "▬" : "▭" }}
              </span>
            </span>
          </p>
          <p>
            <strong>강사 </strong>
            <span class="stars">
              <span v-for="n in 5" :key="n">
                {{ n <= review.instructorRating ? "▬" : "▭" }}
              </span>
            </span>
          </p>
          <p>
            <strong>시설 </strong>
            <span class="stars">
              <span v-for="n in 5" :key="n">
                {{ n <= review.facilityRating ? "▬" : "▭" }}
              </span>
            </span>
          </p>
          <p>
            <strong>분위기 </strong>
            <span class="stars">
              <span v-for="n in 5" :key="n">
                {{ n <= review.atmosphereRating ? "▬" : "▭" }}
              </span>
            </span>
          </p>
          <p>
            <strong>행정 </strong>
            <span class="stars">
              <span v-for="n in 5" :key="n">
                {{ n <= review.managementRating ? "▬" : "▭" }}
              </span>
            </span>
          </p>
          <p>
            <strong>사후관리 </strong>
            <span class="stars">
              <span v-for="n in 5" :key="n">
                {{ n <= review.laterRating ? "▬" : "▭" }}
              </span>
            </span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { useMemberStore } from "/src/store/member-store"; // Pinia 상태관리에서 memberStore 가져오기

export default {
  props: ["initialReviews"],
  data() {
    return {
      academyId: "", // 학원 ID 설정
      courseId: "", // 강의 ID 설정
      memberId: null, // 현재 로그인한 사용자 ID
      reviews: [] || this.initialReviews, // 리뷰 데이터를 저장할 배열
    };
  },
  computed: {
    currentUser() {
      const memberStore = useMemberStore();
      return memberStore.member || { memberId: null }; // 현재 로그인한 사용자 정보
    },
  },
  mounted() {
    this.fetchReviews(); // 컴포넌트가 마운트되면 서버에서 데이터를 받아옴
  },
  methods: {
    // 서버에서 리뷰 데이터를 받아오는 함수
    fetchReviews() {
      const memberId = this.currentUser.memberId; // 로그인한 사용자의 ID 가져오기
      axios
        .get(`/api/member/reviews/myreviews/${memberId}`)
        .then((response) => {
          const reviewData = response.data;
          console.log("마이페이지 리뷰 서버 응답:", reviewData);

          if (Array.isArray(reviewData)) {
            this.reviews = reviewData.map((review) => {
              return {
                reviewId: review.reviewId,
                educationRating: review.educationRating,
                instructorRating: review.instructorRating,
                facilityRating: review.facilityRating,
                atmosphereRating: review.atmosphereRating,
                managementRating: review.managementRating,
                laterRating: review.laterRating,
                academyName: review.academyName,
                courseName: review.courseName,
              };
            });
          } else {
            console.error("받아온 데이터가 배열이 아닙니다:", reviewData);
          }
        })
        .catch((error) => {
          console.error("리뷰 데이터를 가져오는 중 오류가 발생했습니다.", error);
        });
    },
    // 리뷰 디테일 페이지로 이동()
    goToReviewDetail(reviewId) {
      const courseId = this.$route.params.courseId;
      const academyId = this.$route.params.academyId;
      this.$router.push({
        name: "ReviewDetail",
        params: { academyId, courseId, reviewId },
      });
    },
  },
};
</script>

<style scoped>
.review-list-page {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
}

.review-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); /* 카드의 최소 크기를 설정하여 그리드로 나열 */
  gap: 20px;
}

.review-card {
  background-color: #f9f9f9;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
}

.stars {
  font-size: 18px;
  margin-left: 10px;
}
</style>
