<template>
  <div class="review-page">
    <h2>후기 작성 페이지(ReviewFormDetail)</h2>
    <div class="review-container">
      <!-- 평가 항목 리스트 -->
      <div class="review-grid">
        <div class="review-item" v-for="(review, index) in reviews" :key="index">
          <label :for="'review-' + index">{{ index + 1 }}. {{ review.title }}</label>
          <div class="rating">
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
      <button class="cancel-btn" @click="handleCancel">돌아가기</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { useMemberStore } from "/src/store/member-store"; // Pinia 상태관리에서 memberStore 가져오기
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
        { title: "강의", comment: "", rating: 1 },
        { title: "강사", comment: "", rating: 1 },
        { title: "시설", comment: "", rating: 1 },
        { title: "반 분위기", comment: "", rating: 1 },
        { title: "행정", comment: "", rating: 1 },
        { title: "취업관련", comment: "", rating: 1 },
      ],
      initialReviews: [
        { title: "강의", comment: "", rating: 1 },
        { title: "강사", comment: "", rating: 1 },
        { title: "시설", comment: "", rating: 1 },
        { title: "반 분위기", comment: "", rating: 1 },
        { title: "행정", comment: "", rating: 1 },
        { title: "취업관련", comment: "", rating: 1 },
      ], // 초기 리뷰 값 저장
      chart: null,
      isChartGenerated: false,
      buttonText: "등록",
      memberId: null, // 회원 정보를 저장할 변수
    };
  },
  computed: {
    currentUser() {
      const memberStore = useMemberStore();
      return memberStore.member || { memberId: null }; // 현재 로그인한 사용자 정보
    },
  },
  mounted() {
    this.courseId = this.$route.params.courseId;
    this.fetchReviewData(); // 리뷰 데이터를 불러옵니다
  },
  methods: {
    fetchReviewData() {
      axios
        .get(`/api/member/reviews/${this.currentUser.memberId}/course/${this.courseId}`)
        .then((response) => {
          const reviewData = response.data;
          // 서버에서 받은 데이터를 reviews 배열에 반영합니다.
          console.log("리뷰상세 리뷰 데이터:", reviewData); // 확인용
          this.reviews = [
            { title: "강의", comment: reviewData.educationComment, rating: reviewData.educationRating },
            { title: "강사", comment: reviewData.instructorComment, rating: reviewData.instructorRating },
            { title: "시설", comment: reviewData.facilityComment, rating: reviewData.facilityRating },
            { title: "반 분위기", comment: reviewData.atmosphereComment, rating: reviewData.atmosphereRating },
            { title: "행정", comment: reviewData.managementComment, rating: reviewData.managementRating },
            { title: "취업관련", comment: reviewData.employmentComment, rating: reviewData.employmentRating },
          ];
          // 데이터를 바탕으로 차트를 생성합니다.
          this.generateChart();
        })
        .catch((error) => {
          console.error("리뷰 데이터를 가져오는 중 오류 발생:", error);
        });
    },
    generateChart() {
      if (this.chart) {
        this.chart.destroy();
      }
      const labels = this.reviews.map((review) => review.title);
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
              max: 5,
              ticks: {
                stepSize: 1,
              },
            },
          },
        },
      });
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
  cursor: pointer;
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
