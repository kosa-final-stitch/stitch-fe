<template>
  <div class="review-list-page">
    <h2>리뷰 리스트</h2>
    <div class="rating">
      <span
        v-for="n in 5"
        :key="n"
        class="star"
        :class="{ filled: n <= averageRating }"
        >★</span
      >
    </div>
    <div class="review-list">
      <div class="review-header">
        <span>{{ academy }}</span>
        <!-- 학원 정보 -->
        <span>{{ className }}</span>
        <!-- 클래스 정보 -->
      </div>

      <!-- 리뷰 리스트 -->
      <div
        v-for="(review, index) in reviews"
        :key="index"
        class="review-item"
        @click="goToDetail(index)"
      >
        <div class="review-content">
          <div class="review-title">{{ review.title }}</div>
          <div class="review-rating">
            <span
              v-for="n in 5"
              :key="n"
              class="star"
              :class="{ filled: n <= review.rating }"
              >★</span
            >
          </div>
        </div>
        <div class="review-comment">
          <p>{{ review.comment }}</p>
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
      academy: "한국 소프트웨어 산업협회",
      className: "MSA 4차",
      averageRating: 3.5, // 평균 별점
      reviews: [], // 리뷰 데이터를 서버에서 가져올 예정
    };
  },
  methods: {
    // 서버에서 리뷰 데이터를 받아오는 함수
    fetchReviews() {
      axios
        .get("http://localhost:8080/api/reviews") // 실제 API 경로를 입력
        .then((response) => {
          console.log("리뷰 서버 응답:", response); // 응답 데이터를 확인하기 위해 로그 출력
          this.reviews = response.data; // 서버에서 받아온 리뷰 데이터를 설정
        })
        .catch((error) => {
          console.error(
            "리뷰 데이터를 가져오는 중 오류가 발생했습니다.",
            error
          );
        });
    },
    // 리뷰 상세 페이지로 이동
    goToDetail(id) {
      this.$router.push({ name: "ReviewDetail", params: { id: id } });
    },
  },
  mounted() {
    this.fetchReviews(); // 컴포넌트가 마운트되면 서버에서 데이터를 받아옴
  },
};
</script>

<style scoped>
.review-list-page {
  max-width: 500px;
  margin: 20px;
  border: 1px solid #ddd; /* 테두리 두께를 1px로 설정하고 색상을 연한 회색으로 지정 */
  padding: 20px; /* 내부 여백 추가 */
  border-radius: 8px; /* 모서리를 약간 둥글게 만듭니다 */
}

.review-header {
  display: flex;
  align-items: center;
  justify-content: space-between; /* 학원명과 클래스 정보가 양쪽 끝으로 가도록 설정 */
  margin-bottom: 20px;
}

.rating {
  margin-left: 10px;
}

.star {
  font-size: 20px;
  color: #ccc;
}

.filled {
  color: orange;
}

.review-list {
  margin-top: 20px;
}

.review-item {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  padding: 10px 0;
  border-bottom: 1px solid #ddd;
  cursor: pointer; /* 클릭할 수 있다는 것을 보여주기 위해 커서를 포인터로 변경 */
}

.review-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.review-title {
  font-weight: bold;
  color: #333;
  flex: 1;
}

.review-rating {
  flex: 0 0 auto;
}

.review-comment {
  color: #666;
  margin-top: 5px;
  font-size: 14px;
}
</style>
