<template>
  <div class="course-detail">
    <div class="course-header">
      <div class="course-info">
        <p>평균 별점: {{ course.rating }} / 5</p>
        <h2>{{ course.course_name }}</h2>
        <p>회차정보: {{ course.session_number }}회차</p>
        <p>
          기간: {{ formatDate(course.start_date) }} ~
          {{ formatDate(course.end_date) }}
        </p>
        <p>강사: {{ course.lector || "정보 없음" }}</p>
        <a :href="course.title_link" target="_blank">훈련정보 보러가기</a>
      </div>
      <div class="radar-chart">
        <canvas id="radarChart" width="400" height="400"></canvas>
      </div>
    </div>

    <!-- 리뷰 섹션 -->
    <div class="reviews" v-if="course.reviews && course.reviews.length">
      <h3>학생 리뷰</h3>
      <div class="review-card" v-for="review in course.reviews" :key="review.id">
        <h4>{{ review.reviewer_name }}</h4>
        <div class="rating-stars">
          <span v-for="n in 5" :key="n" class="star" :class="{ filled: n <= review.rating }">★</span>
        </div>
        <div class="review-details">
          <p><strong>승진 기회 및 가능성:</strong> {{ review.promotion_opportunity }}</p>
          <p><strong>복지 및 급여:</strong> {{ review.salary_and_benefits }}</p>
          <p><strong>업무와 삶의 균형:</strong> {{ review.work_life_balance }}</p>
          <p><strong>사내문화:</strong> {{ review.company_culture }}</p>
          <p><strong>경영진:</strong> {{ review.management }}</p>
        </div>
      </div>
    </div>

    <!-- 수강 후기 작성 버튼 -->
    <button class="write-review-btn" @click="goToReviewForm">수강 후기 쓰기</button>
  </div>
</template>

<script>
import axios from "axios";

// Chart.js 관련 import 추가
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
      course: {
        course_name: "",
        rating: 0,
        session_number: 0,
        start_date: "",
        end_date: "",
        lector: "",
        title_link: "",
        reviews: [],
      }, // 코스 상세 정보를 저장할 객체
      chart: null, // 차트를 저장할 변수 추가
    };
  },
  mounted() {
    this.fetchCourseDetail();
    this.fetchReviewData(); // 리뷰 데이터를 가져오는 메서드를 추가로 호출
  },
  methods: {
    fetchCourseDetail() {
      const academyId = this.$route.params.academyId;
      const courseId = this.$route.params.courseId;

      if (academyId) {
        // 학원 ID가 있을 때
        axios
          .get(`http://localhost:8080/api/academies/academy/${academyId}/courses/${courseId}`)
          .then((response) => {
            this.course = response.data;
          })
          .catch((error) => {
            console.error("강의 정보를 불러오는 중 오류가 발생했습니다.", error);
          });
      }
      //else {
      //   // 학원 ID 없이 강의 조회
      //   axios
      //     .get(`http://localhost:8080/api/courses/${courseId}`)
      //     .then((response) => {
      //       this.course = response.data;
      //     })
      //     .catch((error) => {
      //       console.error("강의 정보를 불러오는 중 오류가 발생했습니다.", error);
      //     });
      // }
    },
    formatDate(date) {
      const options = { year: "numeric", month: "2-digit", day: "2-digit" };
      return new Date(date).toLocaleDateString("ko-KR", options);
    },
    goToReviewForm() {
      const academyId = this.$route.params.academyId;
      const courseId = this.$route.params.courseId;
      console.log("넘어가는 academyId:", academyId);
      console.log("넘어가는 courseId:", courseId);
      this.$router.push({
        name: "ReviewForm",
        params: { academyId, courseId },
      }); // ReviewForm으로 라우팅
    },
    // 리뷰 데이터를 불러오는 메서드 추가
    fetchReviewData() {
      const courseId = this.$route.params.courseId;
      const academyId = this.$route.params.academyId;
      console.log("리뷰 데이터 메서드:", courseId);
      console.log("리뷰 데이터 메서드:", academyId);
      axios
        .get(`http://localhost:8080/api/member/reviews/courses/${courseId}`)
        .then((response) => {
          const reviewData = response.data.reviews || []; // 데이터를 배열로 처리
          console.log("리뷰데이터 :" + reviewData);
          if (Array.isArray(reviewData)) {
            this.generateChartFromData(reviewData);
          } else {
            console.error("리뷰 데이터가 배열이 아닙니다:", reviewData);
          }
        })
        .catch((error) => {
          console.error("리뷰 데이터를 불러오는 중 오류 발생:", error);
        });
    },

    // 서버에서 받아온 리뷰 데이터를 차트로 변환
    generateChartFromData(reviewData) {
      if (this.chart) {
        this.chart.destroy(); // 기존 차트가 있으면 제거
      }

      const labels = reviewData.map((review) => review.title);
      const data = reviewData.map((review) => review.rating);

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

    // 기존 차트 생성 메서드
    generateChart() {
      this.fetchReviewData(); // 리뷰 데이터를 불러와서 차트를 생성
    },
  },
};
</script>

<style scoped>
.course-detail {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.course-header {
  display: flex;
  justify-content: space-between;
  padding: 20px;
  background-color: #fff;
  border: 1px solid #ddd;
  margin-bottom: 20px;
}

.course-info {
  flex: 2;
}

.radar-chart {
  flex: 1;
  text-align: center;
}

.reviews {
  margin-bottom: 20px;
}

.review-card {
  background-color: #f9f9f9;
  padding: 20px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 10px;
}

.write-review-btn {
  background-color: #f28c00;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  display: block;
  margin: 0 auto;
}
</style>
