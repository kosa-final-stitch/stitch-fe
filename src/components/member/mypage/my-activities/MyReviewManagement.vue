<template>
  <div class="review-list-page">
    <h2>학생 리뷰</h2>
    <div class="review-container">
      <!-- 리뷰 리스트 -->
      <div v-for="(review, index) in reviews" :key="index" class="review-card">
        <div class="review-details">
          <p>
            <strong>교육 </strong>
            <span class="stars">
              <span v-for="n in 5" :key="n">
                {{ n <= review.educationRating ? "■" : "□" }}
              </span>
            </span>
          </p>
          <p>
            <strong>강사 </strong>
            <span class="stars">
              <span v-for="n in 5" :key="n">
                {{ n <= review.instructorRating ? "■" : "□" }}
              </span>
            </span>
          </p>
          <p>
            <strong>시설 </strong>
            <span class="stars">
              <span v-for="n in 5" :key="n">
                {{ n <= review.facilityRating ? "■" : "□" }}
              </span>
            </span>
          </p>
          <p>
            <strong>분위기 </strong>
            <span class="stars">
              <span v-for="n in 5" :key="n">
                {{ n <= review.atmosphereRating ? "■" : "□" }}
              </span>
            </span>
          </p>
          <p>
            <strong>행정 </strong>
            <span class="stars">
              <span v-for="n in 5" :key="n">
                {{ n <= review.managementRating ? "■" : "□" }}
              </span>
            </span>
          </p>
          <p>
            <strong>사후관리 </strong>
            <span class="stars">
              <span v-for="n in 5" :key="n">
                {{ n <= review.laterRating ? "■" : "□" }}
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

export default {
  data() {
    return {
      reviews: [], // 리뷰 데이터를 저장할 배열
    };
  },
  methods: {
    // 서버에서 리뷰 데이터를 받아오는 함수
    fetchReviews() {
      axios
        .get("http://localhost:8080/api/member/reviews/myreviews")
        .then((response) => {
          const reviewData = response.data;
          console.log("마이페이지 리뷰 서버 응답:", reviewData);

          if (Array.isArray(reviewData)) {
            this.reviews = reviewData.map((review) => {
              return {
                educationRating: review.educationRating || 0,
                instructorRating: review.instructorRating || 0,
                facilityRating: review.facilityRating || 0,
                atmosphereRating: review.atmosphereRating || 0,
                managementRating: review.managementRating || 0,
                laterRating: review.laterRating || 0,
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
  },
  mounted() {
    this.fetchReviews(); // 컴포넌트가 마운트되면 서버에서 데이터를 받아옴
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
