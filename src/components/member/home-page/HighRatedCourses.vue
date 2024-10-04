<!-- 
 담당자: 박요한
 시작 일자: 2024.09.13
 설명 : 평점이 높은 교육 과정 목록
 ---------------------
 2024.09.13 박요한 | 컴포넌트 생성.
 2024.09.17 박요한 | 구체화.
 2024.09.25 박요한 | 더보기 버튼 위치 조정.
 -->

<template>
  <div class="high-rated-courses">
    <div class="header-row">
      <h2>평점 높은 교육 과정</h2>
      <!-- 더보기 버튼 -->
      <MoreButton to="/academies/courses" />
    </div>
    <div class="course-container">
      <div
        v-for="(course, index) in courses"
        :key="course.courseId"
        class="course-card"
        @click="goToCourseDetail(course.academyId, course.courseId)"
      >
        <div class="stars">{{ "★".repeat(roundedStars[index]) }}{{ "☆".repeat(5 - roundedStars[index]) }}</div>
        <h3>{{ course.courseName }}</h3>
        <div class="course-details">
          <p>회차: {{ course.sessionNumber }}</p>
          <p>학원명: {{ course.academyName }}</p>
          <p>시작일: {{ course.startDate }}</p>
          <p>종료일: {{ course.endDate }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import MoreButton from "./MoreButton.vue";

export default {
  name: "HighRatedCourses",
  components: { MoreButton },
  data() {
    return {
      courses: [], // 고 평점 교육 과정 데이터
    };
  },
  mounted() {
    this.fetchTopRatedCourses(); // 데이터 가져오기
  },
  methods: {
    // 고 평점 교육 과정 가져오는 메서드
    async fetchTopRatedCourses() {
      try {
        const response = await axios.get("/api/courses/top");
        console.log("2. Status Code:", response.status); // 상태 코드 확인
        console.log("2. Response Data:", response.data); // 응답 데이터 확인
        this.courses = response.data;
      } catch (error) {
        console.error("2. Error fetching courses:", error);
      }
    },
    // 교육 과정 상세 페이지로 이동
    goToCourseDetail(academyId, courseId) {
      this.$router.push({ path: `/academies/academy/${academyId}/courses/${courseId}` });
    },
  },
  computed: {
    roundedStars() {
      return this.courses.map((course) => {
        if (course.averageRating) {
          return Math.round(course.averageRating); // 평균 별점을 반올림
        }
        return 0; // 값이 없으면 0으로 설정
      });
    },
  },
};
</script>

<style scoped>
.high-rated-courses {
  margin: 0 auto;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding: 1%;
}

.header-row h2 {
  margin: 0;
}

.course-container {
  display: grid;
  grid-template-columns: repeat(5, 1fr); /* 5개의 열 */
  gap: 10px; /* 카드 간의 간격 */
}

.course-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* 위와 아래의 콘텐츠가 일정 간격을 유지 */
  border: 1px solid #ddd;
  padding: 25px;
  margin-bottom: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s ease;
}

.course-card:hover {
  transform: scale(1.05);
}

.stars {
  color: #ffcc00;
  font-size: 20px;
  /* margin-bottom: 10px; */
  text-align: center;
}

.course-card h3 {
  margin-bottom: 30px;
  text-align: center;
}

.course-details {
  margin-top: auto; /* 아래로 정렬 */
  text-align: left;
}

.course-details p {
  margin: 5px 0;
  text-align: left;
}
</style>
