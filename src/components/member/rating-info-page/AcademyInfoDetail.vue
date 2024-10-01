<!-- 
2024.9.29 박요한 | watch 추가 - 검색 라우터 오류 수정 (+ 별 색상 추가)
-->
<template>
  <div class="academy-info">
    <!-- 학원 정보 상단 -->
    <div class="info-box">
      <div class="details">
        <p class="stars">
          <span v-for="n in 5" :key="n">{{ n <= academy.rating ? "★" : "☆" }}</span>
        </p>
        <h2>{{ academy.academy_name }}</h2>
        <p>주소: {{ academy.address }}</p>
        <p>전화번호: {{ academy.phone }}</p>
        <p>
          웹사이트:
          <a :href="academy.site_address" target="_blank">학원 정보 바로가기</a>
        </p>
      </div>
      <div class="radar-chart">
        <canvas id="radarChart" width="400" height="400"></canvas>
      </div>
    </div>

    <!-- 과정별 탭 -->
    <div class="tab-header">
      <div :class="{ active: selectedTab === 'upcoming' }" @click="selectedTab = 'upcoming'">진행 예정 과정</div>
      <div :class="{ active: selectedTab === 'current' }" @click="selectedTab = 'current'">현재 진행중인 과정</div>
      <div :class="{ active: selectedTab === 'completed' }" @click="selectedTab = 'completed'">진행 완료 과정</div>
    </div>

    <!-- 현재 진행 중인 과정 -->
    <div v-if="selectedTab === 'current'" class="course-section">
      <h3>현재 진행중인 과정</h3>
      <div
        v-for="course in currentCourses"
        :key="course.course_id"
        class="course-card"
        @click="goToCourseDetail(course.course_id)"
      >
        <div class="course-details">
          <h4>{{ course.course_name }}</h4>
          <p>
            모집일정: {{ formatDate(course.start_date) }} ~
            {{ formatDate(course.end_date) }}
          </p>
          <p>강사: {{ course.lector || "정보 없음" }}</p>
          <a :href="course.title_link" target="_blank">훈련과정 보러가기</a>
        </div>
      </div>
    </div>

    <!-- 진행 완료 과정 -->
    <div v-if="selectedTab === 'completed'" class="course-section">
      <h3>진행 완료 과정</h3>
      <div
        v-for="course in completedCourses"
        :key="course.course_id"
        class="course-card"
        @click="goToCourseDetail(course.course_id)"
      >
        <div class="rating-box">
          <p class="stars">
            <span v-for="n in 5" :key="n">
              {{ n <= Math.round(course.rating) ? "★" : "☆" }}
            </span>
            별점:{{ course.rating }}
          </p>
        </div>
        <div class="course-details">
          <h4>{{ course.course_name }}</h4>
          <p>
            모집일정: {{ formatDate(course.start_date) }} ~
            {{ formatDate(course.end_date) }}
          </p>
          <p>강사: {{ course.lector || "정보 없음" }}</p>
          <a :href="course.title_link" target="_blank">훈련과정 보러가기</a>
        </div>
      </div>
    </div>

    <!-- 진행 예정 과정 -->
    <div v-if="selectedTab === 'upcoming'" class="course-section">
      <h3>진행 예정 과정</h3>
      <div
        v-for="course in upcomingCourses"
        :key="course.course_id"
        class="course-card"
        @click="goToCourseDetail(course.course_id)"
      >
        <div class="course-details">
          <h4>{{ course.course_name }}</h4>
          <p>
            모집일정: {{ formatDate(course.start_date) }} ~
            {{ formatDate(course.end_date) }}
          </p>
          <p>강사: {{ course.lector || "정보 없음" }}</p>
          <a :href="course.title_link" target="_blank">훈련과정 보러가기</a>
        </div>
      </div>
    </div>
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
  props: ["academyId"], // URL에서 전달받은 academy_id
  data() {
    return {
      selectedTab: "current", // 기본 탭은 '현재 진행중인 과정'
      academy: {
        academy_name: "",
        address: "",
        phone: "",
        site_address: "",
        rating: 0, // 평균 별점
      },
      currentCourses: [], // 현재 진행 중인 과정
      completedCourses: [], // 완료된 과정
      upcomingCourses: [], // 진행 예정 과정
    };
  },
  watch: {
    academyId(newId, oldId) {
      if (newId !== oldId) {
        // academyId가 변경되었을 때 데이터를 다시 불러오기
        this.fetchAcademyData();
        this.fetchCourses();
        this.fetchAcademyRating();
      }
    },
  },
  mounted() {
    this.fetchAcademyData(); // 학원 정보 가져오기
    this.fetchCourses(); // 강좌 정보 가져오기
    this.fetchAcademyRating(); // 학원 평균 별점 가져오기
    this.fetchAllCourseReviews(); // 모든 과정의 리뷰 데이터를 가져와 차트 생성
  },

  methods: {
    // 학원 정보 가져오는 메서드
    fetchAcademyData() {
      axios
        .get(`/api/academies/academy/${this.academyId}`) // props로 받은 id 사용
        .then((response) => {
          this.academy = response.data; // 서버에서 받아온 학원 정보 저장
          console.log("학원 정보: ", response.data);
          // this.fetchReviewData(); // 리뷰 데이터를 불러와 차트 생성
        })
        .catch((error) => {
          console.error("학원 정보를 불러오는 중 오류가 발생했습니다.", error);
        });
    },
    // 학원 평균 별점 가져오는 메서드
    fetchAcademyRating() {
      axios
        .get(`/api/academies/academy/${this.academyId}/rating`)
        .then((response) => {
          this.academy.rating = response.data; // 서버에서 받아온 평균 별점 저장
          console.log("학원 평균 별점: ", response.data);
        })
        .catch((error) => {
          console.error("학원 평균 별점을 불러오는 중 오류가 발생했습니다.", error);
        });
    },

    // 강좌 정보 가져오는 메서드
    fetchCourses() {
      axios
        .get(`/api/academies/courses/${this.academyId}`) // props로 받은 id 사용
        .then((response) => {
          console.log("아카데미 인포 강좌 목록 응답: ", response.data);
          const today = new Date(); // 오늘 날짜
          const upcomingCourses = []; // 진행 예정 과정 리스트
          const currentCourses = []; // 현재 진행 중인 과정 리스트
          const completedCourses = []; // 완료된 과정 리스트

          // 각 과정에 대해 분류
          response.data.forEach((course) => {
            const startDate = new Date(course.start_date);
            const endDate = new Date(course.end_date);

            // 완료된 과정: 종료일이 오늘 이전
            if (endDate < today) {
              completedCourses.push(course);
            }
            // 현재 진행 중인 과정: 시작일이 오늘 이전이거나 같고, 종료일이 오늘 이후거나 같은 경우
            else if (startDate <= today && endDate >= today) {
              currentCourses.push(course);
            }
            // 진행 예정 과정: 시작일이 오늘 이후인 경우
            else if (startDate > today) {
              upcomingCourses.push(course);
            }
          });

          // 완료된 과정: 종료일 기준 내림차순 정렬
          this.completedCourses = completedCourses.sort((a, b) => new Date(b.end_date) - new Date(a.end_date));

          // 진행 중인 과정: 시작일 기준 내림차순 정렬
          this.currentCourses = currentCourses.sort((a, b) => new Date(b.start_date) - new Date(a.start_date));

          // 진행 예정 과정: 시작일 기준 내림차순 정렬
          this.upcomingCourses = upcomingCourses.sort((a, b) => new Date(b.start_date) - new Date(a.start_date));
          const completedCoursescheck = this.completedCourses;
          console.log("완료과정: ", completedCoursescheck);
        })

        .catch((error) => {
          console.error("강좌 정보를 불러오는 중 오류가 발생했습니다.", error);
        });
    },

    // 학원 모든 과정 리뷰 데이터를 가져오는 메서드
    fetchAllCourseReviews() {
      axios
        .get(`/api/academies/reviews/all/${this.academyId}`)
        .then((response) => {
          const reviewData = response.data;
          console.log("모든 과정 리뷰 데이터: ", reviewData);
          this.generateChart(reviewData); // 리뷰 데이터를 차트에 전달
        })
        .catch((error) => {
          console.error("모든 과정 리뷰 데이터를 불러오는 중 오류가 발생했습니다.", error);
        });
    },

    // 학원 모든리뷰의 차트 생성 함수
    generateChart(reviewData) {
      if (this.chart) {
        this.chart.destroy(); // 기존 차트가 있으면 삭제
      }

      // 각 항목에 대한 총점과 리뷰 개수 계산
      const totalRatings = {
        education: 0,
        instructor: 0,
        facility: 0,
        atmosphere: 0,
        management: 0,
        later: 0,
      };
      const totalReviews = reviewData.length;

      // 각 리뷰 항목별로 총점 계산
      reviewData.forEach((review) => {
        totalRatings.education += review.educationRating || 0;
        totalRatings.instructor += review.instructorRating || 0;
        totalRatings.facility += review.facilityRating || 0;
        totalRatings.atmosphere += review.atmosphereRating || 0;
        totalRatings.management += review.managementRating || 0;
        totalRatings.later += review.laterRating || 0;
      });

      // 차트에 사용할 데이터 설정 (필요에 따라 평균값이 아닌 개별 값으로도 가능)
      const averageRatings = {
        education: (totalRatings.education / totalReviews).toFixed(1),
        instructor: (totalRatings.instructor / totalReviews).toFixed(1),
        facility: (totalRatings.facility / totalReviews).toFixed(1),
        atmosphere: (totalRatings.atmosphere / totalReviews).toFixed(1),
        management: (totalRatings.management / totalReviews).toFixed(1),
        later: (totalRatings.later / totalReviews).toFixed(1),
      };

      // 차트 생성
      const ctx = document.getElementById("radarChart").getContext("2d");
      this.chart = new Chart(ctx, {
        type: "radar",
        data: {
          labels: ["교육", "강사", "시설", "분위기", "행정", "사후관리"],
          datasets: [
            {
              label: "평균 평점",
              data: Object.values(averageRatings),
              backgroundColor: "rgba(54, 162, 235, 0.2)",
              borderColor: "rgba(54, 162, 235, 1)",
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
    ///////////////////
    // 날짜 형식 변환
    formatDate(date) {
      const options = { year: "numeric", month: "2-digit", day: "2-digit" };
      return new Date(date).toLocaleDateString("ko-KR", options);
    },

    goToCourseDetail(courseId) {
      const academyId = this.academyId; // props로 받은 academyId 사용
      this.$router.push({
        name: "CourseInfoDetail", // 라우터 설정에 정의된 이름
        params: { academyId, courseId },
      });
    },
  },
};
</script>

<style scoped>
/* academy-info: 학원 정보를 담고 있는 컨테이너 박스 */
.academy-info {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
}

.info-box {
  display: flex;
  justify-content: space-between;
  border: 1px solid #ddd;
  padding: 20px;
  margin-bottom: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
}

/* 탭 스타일 */
.tab-header {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
  cursor: pointer;
}

.tab-header div {
  padding: 10px 20px;
  border-bottom: 2px solid transparent;
  transition: border-bottom 0.3s ease;
}

.tab-header div.active {
  border-bottom: 2px solid #f28c00;
  font-weight: bold;
  color: #f28c00;
}

/* course-section: 과정 섹션 박스 */
.course-section {
  margin-bottom: 20px;
  padding-top: 20px;
}

.course-card {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  border: 1px solid #ddd;
  padding: 20px;
  margin-bottom: 10px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* rating-box: 별점 박스 */
.rating-box {
  display: block;
  margin-bottom: 10px;
  text-align: left;
  width: 100%;
}

/* stars: 별점 */
.stars {
  color: #ffcc00;
  font-size: 24px;
  margin-bottom: 10px;
  display: block;
}

.course-details {
  flex: 1;
  width: 100%;
}

.details {
  margin-bottom: 10px;
}

.radar-chart {
  width: 300px; /* 차트 크기를 줄이기 */
  height: 300px; /* 차트 크기를 줄이기 */
  text-align: center;
  background-color: #f9f9f9;
  padding: 10px;
  border-radius: 10px;
}

canvas {
  max-width: 100%; /* 부모 요소에 맞게 크기 조정 */
  max-height: 100%; /* 부모 요소에 맞게 크기 조정 */
  width: 100%; /* 부모 요소에 맞게 크기 조정 */
  height: auto; /* 높이 자동 조절 */
}
</style>
