<!-- 
 2024.9.30. 박요한 | 리팩토링: 전체 강의 목록 + 페이지네이션, 정렬 + 진행 구분
-->
<template>
  <div class="course-info">
    <!-- 과정별 탭 -->
    <div class="tab-header">
      <div :class="{ active: selectedTab === 'upcoming' }" @click="selectTab('upcoming')">진행 예정 과정</div>
      <div :class="{ active: selectedTab === 'current' }" @click="selectTab('current')">현재 진행중인 과정</div>
      <div :class="{ active: selectedTab === 'completed' }" @click="selectTab('completed')">진행 완료 과정</div>
    </div>

    <!-- 현재 진행 중인 과정 -->
    <div v-if="selectedTab === 'current'" class="course-section">
      <div
        v-for="course in currentCourses"
        :key="course.course_id"
        class="course-card"
        @click="goToCourseDetail(course.course_id, course.academy_id)"
      >
        <div class="course-details">
          <h4>{{ course.course_name }}</h4>
          <p>
            일정: {{ formatDate(course.start_date) }} ~
            {{ formatDate(course.end_date) }}
          </p>
          <p>강사: {{ course.lector || "정보 없음" }}</p>
          <a :href="course.title_link" target="_blank">훈련과정 보러가기</a>
        </div>
      </div>
    </div>

    <!-- 진행 완료 과정 -->
    <div v-if="selectedTab === 'completed'" class="course-section">
      <div
        v-for="course in completedCourses"
        :key="course.course_id"
        class="course-card"
        @click="goToCourseDetail(course.course_id, course.academy_id)"
      >
        <div class="course-details">
          <h4>{{ course.course_name }}</h4>
          <p>
            일정: {{ formatDate(course.start_date) }} ~
            {{ formatDate(course.end_date) }}
          </p>
          <p>강사: {{ course.lector || "정보 없음" }}</p>
          <a :href="course.title_link" target="_blank">훈련과정 보러가기</a>
        </div>
      </div>
    </div>

    <!-- 진행 예정 과정 -->
    <div v-if="selectedTab === 'upcoming'" class="course-section">
      <div
        v-for="course in upcomingCourses"
        :key="course.course_id"
        class="course-card"
        @click="goToCourseDetail(course.course_id, course.academy_id)"
      >
        <div class="course-details">
          <h4>{{ course.course_name }}</h4>
          <p>
            일정: {{ formatDate(course.start_date) }} ~
            {{ formatDate(course.end_date) }}
          </p>
          <p>강사: {{ course.lector || "정보 없음" }}</p>
          <a :href="course.title_link" target="_blank">훈련과정 보러가기</a>
        </div>
      </div>
    </div>

    <!-- 페이지네이션 -->
    <div class="pagination">
      <button @click="previousPage" :disabled="currentPage === 1">Previous</button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      selectedTab: "current", // 기본 탭은 '현재 진행중인 과정'
      currentPage: 1, // 현재 페이지 번호
      itemsPerPage: 12, // 한 페이지당 표시할 강의 수
      currentCourses: [], // 현재 진행 중인 과정
      completedCourses: [], // 완료된 과정
      upcomingCourses: [], // 진행 예정 과정
      totalPages: 0, // 총 페이지 수를 초기값 0으로 설정
    };
  },
  mounted() {
    this.fetchCourses(); // 강좌 정보 가져오기
  },
  methods: {
    // 강좌 정보 가져오는 메서드
    fetchCourses() {
      const selectedStatus = this.selectedTab;

      axios
        .get(`/api/courses`, {
          params: {
            status: selectedStatus,
            pageNumber: this.currentPage,
            pageSize: this.itemsPerPage,
          },
        })
        .then((response) => {
          if (this.selectedTab === "upcoming") {
            this.upcomingCourses = response.data.courses;
          } else if (this.selectedTab === "current") {
            this.currentCourses = response.data.courses;
          } else if (this.selectedTab === "completed") {
            this.completedCourses = response.data.courses;
          }
          // 백엔드에서 받은 totalPages 사용
          this.totalPages = response.data.totalPages;
        })
        .catch((error) => {
          console.error("강좌 정보를 불러오는 중 오류가 발생했습니다.", error);
        });
    },
    // 이전 페이지로 이동
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.fetchCourses(); // 페이지가 변경될 때 데이터를 다시 가져옴
      }
    },
    // 다음 페이지로 이동
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.fetchCourses(); // 페이지가 변경될 때 데이터를 다시 가져옴
      }
    },
    // 강의 상세 페이지로 이동
    goToCourseDetail(courseId, academyId) {
      this.$router.push({
        path: `/academies/academy/${academyId}/courses/${courseId}`,
      });
    },
    // 탭 선택 시 현재 페이지를 1로 초기화하고, 새로운 탭에 맞는 데이터를 가져옴
    selectTab(tab) {
      this.selectedTab = tab;
      this.currentPage = 1;
      this.fetchCourses(); // 탭 변경 시 데이터를 새로 가져옴
    },
    // 날짜 형식 변환
    formatDate(date) {
      const options = { year: "2-digit", month: "2-digit", day: "2-digit" }; // 24.12.31.
      return new Date(date).toLocaleDateString("ko-KR", options);
    },
  },
};
</script>

<style scoped>
/* course-info: 강의 정보를 담고 있는 컨테이너 박스 */
.course-info {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
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
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* 4개씩 한 줄에 배치 */
  gap: 20px;
}

/* course-card: 개별 과정 카드 */
.course-card {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  border: 1px solid #ddd;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s ease;
}

.course-card:hover {
  transform: scale(1.02);
}

/* course-details: 강의 세부 정보 */
.course-details {
  width: 100%;
}

/* pagination 스타일 */
.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.pagination button {
  background-color: #f28c00;
  border: none;
  color: white;
  padding: 10px 20px;
  margin: 0 5px;
  border-radius: 5px;
  cursor: pointer;
}

.pagination button:disabled {
  background-color: #ddd;
  cursor: not-allowed;
}

.pagination span {
  margin: 0 10px;
  font-size: 16px;
}
</style>
