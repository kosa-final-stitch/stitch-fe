<template>
  <div class="review-detail-page">
    <h2>리뷰 리스트</h2>
    <div class="review-list">
      <div class="review-header">
        <span>{{ reviewerName }}</span>
        <div class="rating">
          <span
            v-for="n in 5"
            :key="n"
            class="star"
            :class="{ filled: n <= averageRating }"
            >★</span
          >
        </div>
      </div>

      <div
        v-for="(review, index) in reviews"
        :key="index"
        class="review-item"
        @click="goToDetail(index)"
      >
        <div class="review-content">
          <div class="review-title">{{ review.title }}</div>
          <div class="review-rating-bar">
            <div class="rating-bar">
              <div
                class="filled-bar"
                :style="{ width: review.rating * 20 + '%' }"
              ></div>
            </div>
          </div>
          <div class="review-comment">{{ review.comment }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      reviewerName: "박쓸개",
      averageRating: 4,
      reviews: [
        { title: "숨긴 기회 및 가능성", rating: 4, comment: "최고" },
        { title: "복제 및 끈어", rating: 2, comment: "이건 좀 별로 없음" },
        { title: "업무와 삶의 균형", rating: 3, comment: "실망" },
        { title: "사내문화", rating: 3, comment: "" },
        { title: "경영진", rating: 3, comment: "" },
      ],
    };
  },
  methods: {
    goToDetail(index) {
      this.$router.push({ name: "ReviewDetail", params: { id: index } });
    },
  },
};
</script>
<style scoped>
.review-detail-page {
  max-width: 800px;
  margin: 20px auto;
}

.review-header {
  display: flex;
  align-items: center;
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

.review-rating-bar {
  flex: 1;
  margin-left: 10px;
}

.rating-bar {
  width: 100%;
  height: 8px;
  background-color: #ddd;
  border-radius: 4px;
  overflow: hidden;
}

.filled-bar {
  height: 100%;
  background-color: #ffa500;
}

.review-comment {
  color: #666;
  margin-top: 5px;
}
</style>
