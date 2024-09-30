<!-- 
2024.9.29 박요한 | watch 추가 - 검색 라우터 오류 수정
-->
<template>
  <div class="course-detail">
    <div class="course-header">
      <div class="course-info">
        <p>
          평균 별점:
          <span class="stars">
            <span v-for="n in 5" :key="n">
              {{ n <= Math.round(course.rating) ? "★" : "☆" }}
            </span>
          </span>
        </p>
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

    <!-- 수강 후기 작성 버튼 -->
    <button class="write-review-btn" @click="goToReviewForm">수강 후기 쓰기</button>

    <!-- 리뷰 섹션 -->
    <h3>학생 리뷰</h3>
    <div class="review-container">
      <div
        class="review-card"
        v-for="review in course.reviews"
        :key="review.reviewId"
        @click="goToReviewDetail(review.reviewId)"
      >
        <!-- memberId로 리뷰 작성자 표시 -->
        <!-- <h4>{{ review.memberId }}</h4> -->
        <!-- <div class="rating-stars">
          <span v-for="n in 5" :key="n" class="star" :class="{ filled: n <= review.educationRating }">★</span>
        </div> -->
        <div class="review-details">
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

    <!-- 페이지네이션 버튼 -->
    <!-- <div class="pagination">
      <button v-for="page in totalPages" :key="page" @click="changePage(page)" class="page-button">
        {{ page }}
      </button>
    </div> -->
  </div>
</template>

<script>
import axios from "axios";
import { useMemberStore } from "/src/store/member-store"; // Pinia 상태관리에서 memberStore 가져오기

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
  props: ["initialReviews"], // initialReviews라는 prop으로 데이터를 받음
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
        reviews: [] || this.initialReviews, // prop에서 받은 리뷰 데이터를 기본값으로 설정
      }, // 코스 상세 정보를 저장할 객체
      chart: null, // 차트를 저장할 변수 추가
      currentPage: 1, // 현재 페이지
      reviewsPerPage: 5, // 페이지 당 표시할 리뷰 수
    };
  },

  computed: {
    currentUser() {
      const memberStore = useMemberStore();
      return memberStore.member || { memberId: null }; // 현재 로그인한 사용자 정보
    },
  },
  mounted() {
    this.fetchCourseDetail();
    if (!this.initialReviews) {
      this.fetchReviewData(); // 초기 데이터가 없으면 서버에서 다시 가져옴
    }
    console.log("리뷰 현재 사용자 정보:", this.currentUser);
  },
  methods: {
    async fetchCourseDetail() {
      const courseId = this.$route.params.courseId;
      axios
        .get(`/api/courses/${courseId}`)
        .then((response) => {
          this.course = response.data;
          const reviewData = response.data;
          console.log("코스디테일:", reviewData); // 데이터를 확인
          this.course.completed = this.checkIfCourseCompleted(); // 완료 여부 확인
        })
        .catch((error) => {
          console.error("코스 정보를 불러오는 중 오류 발생:", error);
        });
    },
    // 오늘 날짜와 코스 종료일을 비교하여 코스 완료 여부를 반환하는 메서드
    checkIfCourseCompleted() {
      const today = new Date();
      const endDate = new Date(this.course.end_date);
      return today > endDate;
    },
    formatDate(date) {
      const options = { year: "numeric", month: "2-digit", day: "2-digit" };
      return new Date(date).toLocaleDateString("ko-KR", options);
    },
    // 리뷰 작성 페이지로 이동
    goToReviewForm() {
      // 로그인 여부 확인
      if (!this.currentUser.memberId) {
        // currentUser.memberId로 로그인 상태 확인
        console.log("리뷰 user id:", this.currentUser.memberId); // currentUser.id 값 확인
        alert("로그인 후 리뷰 작성이 가능합니다.");
        // 0.5초 후 로그인 페이지로 이동
        setTimeout(() => {
          this.$router.push({ name: "Login" }); // 로그인 페이지로 이동
        }, 500);
      } else {
        // 로그인된 경우 강의 종료 여부 확인
        if (this.course.completed) {
          const academyId = this.$route.params.academyId;
          const courseId = this.$route.params.courseId;
          this.$router.push({
            name: "ReviewForm", // ReviewForm으로 라우팅
            params: { academyId, courseId },
          });
        } else {
          // 강의가 종료되지 않은 경우 알림 메시지
          alert("강의 종료 이후에만 리뷰를 남길 수 있습니다.");
        }
      }
    },

    // 리뷰 데이터를 불러오는 메서드 추가
    async fetchReviewData() {
      const courseId = this.$route.params.courseId;
      axios
        .get(`/api/courses/${courseId}/reviews`)
        .then((response) => {
          const reviewData = response.data;
          console.log("받아온 리뷰 데이터:", reviewData); // 데이터를 확인
          this.course.reviews = reviewData;

          if (Array.isArray(reviewData)) {
            this.calculateAverageRating(reviewData);
            this.generateChartFromData(reviewData);
          } else {
            console.error("리뷰 데이터가 배열이 아닙니다:", reviewData);
          }
        })
        .catch((error) => {
          console.error("리뷰 데이터를 불러오는 중 오류 발생:", error);
        });
    },

    //리뷰데이터들의 평균별점 구하기
    calculateAverageRating(reviews) {
      console.log("평균 별점 calculateAverageRating호출");
      let totalRatings = {
        education: 0,
        instructor: 0,
        facility: 0,
        atmosphere: 0,
        management: 0,
        later: 0,
      };
      let totalReviews = reviews.length;

      reviews.forEach((review) => {
        // 각 항목의 rating 값을 합산
        totalRatings.education += review.educationRating || 0;
        totalRatings.instructor += review.instructorRating || 0;
        totalRatings.facility += review.facilityRating || 0;
        totalRatings.atmosphere += review.atmosphereRating || 0;
        totalRatings.management += review.managementRating || 0;
        totalRatings.later += review.laterRating || 0;
      });

      // 각 항목의 평균을 계산
      let averageRatings = {
        education: totalRatings.education / totalReviews,
        instructor: totalRatings.instructor / totalReviews,
        facility: totalRatings.facility / totalReviews,
        atmosphere: totalRatings.atmosphere / totalReviews,
        management: totalRatings.management / totalReviews,
        later: totalRatings.later / totalReviews,
      };

      // 전체 항목들의 평균 계산
      const overallAverageRating =
        (averageRatings.education +
          averageRatings.instructor +
          averageRatings.facility +
          averageRatings.atmosphere +
          averageRatings.management +
          averageRatings.later) /
        6;

      // 소수점 한 자리로 반올림된 값을 course.rating에 할당
      this.course.rating = overallAverageRating.toFixed(1);
      console.log("평균 별점 : " + this.course.rating);
    },

    // 서버에서 받아온 리뷰 데이터를 차트로 변환
    generateChartFromData(reviewData) {
      if (this.chart) {
        this.chart.destroy(); // 기존 차트가 있으면 삭제
      }

      const totalReviews = reviewData.length;
      const totalRatings = {
        education: 0,
        instructor: 0,
        facility: 0,
        atmosphere: 0,
        management: 0,
        later: 0,
      };

      // 각 항목에 대한 총점을 계산
      reviewData.forEach((review) => {
        totalRatings.education += review.educationRating || 0;
        totalRatings.instructor += review.instructorRating || 0;
        totalRatings.facility += review.facilityRating || 0;
        totalRatings.atmosphere += review.atmosphereRating || 0;
        totalRatings.management += review.managementRating || 0;
        totalRatings.later += review.laterRating || 0;
      });

      // 각 항목에 대한 평균 평점 계산
      const averageRatings = {
        education: (totalRatings.education / totalReviews).toFixed(1),
        instructor: (totalRatings.instructor / totalReviews).toFixed(1),
        facility: (totalRatings.facility / totalReviews).toFixed(1),
        atmosphere: (totalRatings.atmosphere / totalReviews).toFixed(1),
        management: (totalRatings.management / totalReviews).toFixed(1),
        later: (totalRatings.later / totalReviews).toFixed(1),
      };

      const ctx = document.getElementById("radarChart").getContext("2d");
      this.chart = new Chart(ctx, {
        type: "radar",
        data: {
          labels: ["교육", "강사", "시설", "분위기", "행정", "사후관리"],
          datasets: [
            {
              label: "평균 평점",
              data: Object.values(averageRatings),
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
  // 리뷰 디테일 페이지로 이동()
  goToReviewDetail(reviewId) {
    const courseId = this.$route.params.courseId;
    const academyId = this.$route.params.academyId;
    this.$router.push({
      name: "ReviewDetail",
      params: { academyId, courseId, reviewId },
    });
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
  width: 300px; /* 차트 크기를 줄이기 */
  height: 300px; /* 차트 크기를 줄이기 */
  text-align: center;
  padding: 10px;
  border-radius: 10px;
}

canvas {
  max-width: 100%; /* 부모 요소에 맞게 크기 조정 */
  max-height: 100%; /* 부모 요소에 맞게 크기 조정 */
  width: 100%; /* 부모 요소에 맞게 크기 조정 */
  height: auto; /* 높이 자동 조절 */
}

.reviews {
  margin-bottom: 20px;
  display: flex;
  flex-wrap: wrap; /* 여러 줄로 넘어갈 수 있도록 */
  justify-content: space-between; /* 카드들 사이 간격을 균등하게 */
}
.review-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
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
