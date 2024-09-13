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
        <!-- 레이더 차트 자리 -->
        <p>Radar Chart Placeholder</p>
      </div>
    </div>

    <!-- 리뷰 섹션 -->
    <div class="reviews" v-if="course.reviews && course.reviews.length">
      <h3>학생 리뷰</h3>
      <div
        class="review-card"
        v-for="review in course.reviews"
        :key="review.id"
      >
        <h4>{{ review.reviewer_name }}</h4>
        <p>{{ review.content }}</p>
        <p>평점: {{ review.rating }} / 5</p>
      </div>
    </div>

    <!-- 수강 후기 작성 버튼 -->
    <button class="write-review-btn" @click="goToReviewForm">
      수강 후기 쓰기
    </button>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      course: {
        course_name: "",
      }, // 코스 상세 정보를 저장할 객체
    };
  },
  mounted() {
    this.fetchCourseDetail();
  },
  methods: {
    fetchCourseDetail() {
      const academyId = this.$route.params.academyId;
      const courseId = this.$route.params.courseId;

      if (academyId) {
        // 학원 ID가 있을 때
        axios
          .get(
            `http://localhost:8080/api/academies/academy/${academyId}/courses/${courseId}`
          )
          .then((response) => {
            this.course = response.data;
          })
          .catch((error) => {
            console.error(
              "강의 정보를 불러오는 중 오류가 발생했습니다.",
              error
            );
          });
      } else {
        // 학원 ID 없이 강의 조회
        axios
          .get(`http://localhost:8080/api/courses/${courseId}`)
          .then((response) => {
            this.course = response.data;
          })
          .catch((error) => {
            console.error(
              "강의 정보를 불러오는 중 오류가 발생했습니다.",
              error
            );
          });
      }
    },
    formatDate(date) {
      const options = { year: "numeric", month: "2-digit", day: "2-digit" };
      return new Date(date).toLocaleDateString("ko-KR", options);
    },
    goToReviewForm() {
      const academyId = this.$route.params.academyId;
      const courseId = this.$route.params.courseId;
      this.$router.push({
        name: "ReviewForm",
        params: { academyId, courseId },
      }); // ReviewForm으로 라우팅
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
