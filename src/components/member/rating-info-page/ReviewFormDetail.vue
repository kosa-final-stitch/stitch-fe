<template>
  <div class="review-page">
    <h2>후기 확인 페이지</h2>
    <div class="review-container">
      <!-- 평가 항목 리스트 -->
      <div class="review-grid">
        <div v-for="review in reviews" :key="review.title" class="review-item">
          <label>{{ review.title }}</label>
          <div class="rating">
            <span v-for="n in 5" :key="n" class="star" :class="{ filled: n <= review.rating }">★</span>
          </div>
          <div class="comment">{{ review.comment }}</div>
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
      <button class="cancel-btn" @click="goBack">돌아가기</button>
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
  props: {
    academyId: {
      type: String,
      required: true,
    },
    courseId: {
      type: String,
      required: true,
    },
    reviewId: {
      type: String,
      required: true,
    },
  },
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
      chart: null,
      isChartGenerated: false,
    };
  },
  computed: {
    currentUser() {
      const memberStore = useMemberStore();
      return memberStore.member || { memberId: null }; // 현재 로그인한 사용자 정보
    },
  },
  mounted() {
    console.log("academyId:", this.academyId); // 확인용 로그
    console.log("courseId:", this.courseId); // 확인용 로그
    console.log("reviewId:", this.reviewId); // 확인용 로그
    // 여기서 academyId, courseId, reviewId 값을 넘겨줌
    this.fetchReviewData(this.academyId, this.courseId, this.reviewId);
  },
  methods: {
    fetchReviewData(academyId, courseId, reviewId) {
      const apiUrl = `/api/member/reviews/${academyId}/course/${courseId}/review/${reviewId}`;
      console.log("API 요청 URL:", apiUrl); // API 경로 출력 확인

      axios
        .get(apiUrl)
        .then((response) => {
          console.log("응답 데이터:", response.data); // 응답 데이터 확인
          if (response.data) {
            this.reviews = [
              { title: "강의", comment: response.data.education, rating: response.data.educationRating },
              { title: "강사", comment: response.data.instructor, rating: response.data.instructorRating },
              { title: "시설", comment: response.data.facility, rating: response.data.facilityRating },
              { title: "반 분위기", comment: response.data.atmosphere, rating: response.data.atmosphereRating },
              { title: "행정", comment: response.data.management, rating: response.data.managementRating },
              { title: "취업관련", comment: response.data.later, rating: response.data.laterRating },
            ];
            this.generateChart();
          } else {
            console.error("응답 데이터가 비어있습니다.");
          }
        })
        .catch((error) => {
          console.error("리뷰 데이터를 가져오는 중 오류 발생:", error);
          if (error.response) {
            console.log("서버 응답 상태 코드:", error.response.status);
            console.log("서버 응답 데이터:", error.response.data);
          } else {
            console.log("네트워크 오류:", error.message);
          }
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
    goBack() {
      this.$router.go(-1); // 이전 페이지로 이동
    },
  },
};
</script>

<style scoped>
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
.comment {
  width: 90%;
  min-height: 60px;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
  resize: none;
  background-color: #f9f9f9;
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
