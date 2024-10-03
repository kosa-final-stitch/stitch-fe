<template>
  <div class="review-page">
    <h2>후기 작성 페이지</h2>
    <div class="review-container">
      <!-- 평가 항목 리스트 -->
      <div class="review-grid">
        <div class="review-item" v-for="(review, index) in reviews" :key="index">
          <label :for="'review-' + index">{{ index + 1 }}. {{ review.title }}</label>
          <div class="rating">
            <!-- 별을 클릭할 때마다 별점을 변경하는 이벤트 바인딩 -->
            <span
              v-for="n in 5"
              :key="n"
              class="star"
              :class="{ filled: n <= review.rating }"
              @click="setRating(index, n)"
              >★</span
            >
          </div>
          <textarea
            class="onetext"
            :id="'review-' + index"
            v-model="review.comment"
            placeholder="한줄평을 입력해주세요"
          ></textarea>
        </div>
      </div>

      <!-- 레이더 차트 -->
      <div>
        차트 확인
        <div class="chart-container">
          <canvas id="radarChart" width="400" height="400"></canvas>
        </div>
      </div>
    </div>

    <!-- 버튼 영역 -->
    <div class="buttons">
      <button class="cancel-btn">내 리뷰 목록으로돌아가기</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import {
  Chart,
  RadarController,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export default {
  data() {
    return {
      reviews: [
        { title: "강의", rating: 1, comment: "" },
        { title: "강사", rating: 1, comment: "" },
        { title: "시설", rating: 1, comment: "" },
        { title: "반 분위기", rating: 1, comment: "" },
        { title: "행정", rating: 1, comment: "" },
        { title: "취업관련", rating: 1, comment: "" },
      ],
      chart: null, // 차트 객체를 저장할 변수
      isChartGenerated: false, // 버튼 클릭 상태를 저장할 변수
      buttonText: "등록", // 버튼에 표시할 텍스트
    };
  },
  created() {
    const reviewId = this.$route.params.reviewId; // URL에서 inquiryId를 가져옴
    console.log("문의디테일 reviewId:", reviewId); // 콘솔에서 inquiryId 확인
    this.fetchReviews(reviewId);
  },
  methods: {
    // 별점 설정 함수
    setRating(index, rating) {
      this.reviews[index].rating = rating;
    },
    // 차트 생성 함수
    generateChart() {
      if (this.chart) {
        this.chart.destroy(); // 기존 차트를 제거하여 중복되지 않도록 함
      }

      const labels = this.reviews.map((review) => review.title || `항목 ${this.reviews.indexOf(review) + 1}`);
      const data = this.reviews.map((review) => review.rating);

      const ctx = document.getElementById("radarChart").getContext("2d");

      this.chart = new Chart(ctx, {
        type: "radar",
        data: {
          labels: labels,
          datasets: [
            {
              label: "평가 점수",
              data: data,
              backgroundColor: "rgba(255, 99, 132, 0.2)",
              borderColor: "rgba(255, 99, 132, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            r: {
              beginAtZero: true,
              max: 5, // 최대값을 5로 설정하여 0.5 단위가 아닌 1 단위로 스케일링
              ticks: {
                stepSize: 1, // 스케일 단계 설정을 통해 1 단위로 표시
              },
            },
          },
        },
      });
    },
    async fetchReviews(reviewId) {
      try {
        // 백엔드에서 문의 상세 데이터를 가져오는 API 요청
        const response = await axios.get(`/api/member/review/detail/${reviewId}`);

        // 데이터를 설정
        this.review = response.data;
        console.log("문의 상세 정보:", this.review);
      } catch (error) {
        console.error("문의 상세 정보를 가져오는 중 오류 발생:", error);
      } finally {
        // 데이터를 가져온 후 로딩 상태 종료
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
/* 동일한 스타일 유지 */
.review-page {
  max-width: 1200px;
  margin: 20px auto;
  text-align: center;
}

.review-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  margin-top: 20px;
}

.review-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  flex: 1;
}

.review-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.chart-container {
  padding: 20px;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

label {
  font-weight: bold;
  margin-bottom: 8px;
}

.rating {
  margin-bottom: 10px;
  cursor: pointer; /* 마우스를 올렸을 때 포인터 모양으로 변경 */
}

.star {
  font-size: 20px;
  color: #ccc;
}

.filled {
  color: orange;
}

textarea {
  width: 90%;
  min-height: 60px;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
  resize: none;
}

.buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
}

.cancel-btn,
.submit-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 20px;
  background-color: #f5f5f5;
  cursor: pointer;
  transition: background-color 0.3s;
}

.cancel-btn:hover,
.submit-btn:hover {
  background-color: #ffa500;
  color: white;
}
</style>
