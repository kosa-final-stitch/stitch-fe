<template>
  <div class="academy-info">
    <!-- 학원 정보 상단 -->
    <div class="info-box">
      <p class="stars">⭐⭐⭐⭐⭐</p>
      <div class="details">
        <h2>{{ academy.academy_name }}</h2>
        <p>주소: {{ academy.address }}</p>
        <p>전화번호: {{ academy.phone }}</p>
        <p>
          웹사이트:
          <a :href="academy.site_address" target="_blank">{{
            academy.site_address
          }}</a>
        </p>
      </div>
      <div class="radar-chart">
        <!-- 레이더 차트 (차트 라이브러리 사용 가능) -->
        <p>Radar Chart Placeholder</p>
      </div>
    </div>

    <!-- 과정별 탭 -->
    <div class="tab-header">
      <div
        :class="{ active: selectedTab === 'upcoming' }"
        @click="selectedTab = 'upcoming'"
      >
        진행 예정 과정
      </div>
      <div
        :class="{ active: selectedTab === 'current' }"
        @click="selectedTab = 'current'"
      >
        현재 진행중인 과정
      </div>
      <div
        :class="{ active: selectedTab === 'completed' }"
        @click="selectedTab = 'completed'"
      >
        진행 완료 과정
      </div>
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
          <p class="stars">⭐⭐⭐⭐☆</p>
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
        rating: 0,
      },
      currentCourses: [], // 현재 진행 중인 과정
      completedCourses: [], // 완료된 과정
      upcomingCourses: [], // 진행 예정 과정
    };
  },
  mounted() {
    this.fetchAcademyData(); // 학원 정보 가져오기
    this.fetchCourses(); // 강좌 정보 가져오기
  },
  methods: {
    // 학원 정보 가져오는 메서드
    fetchAcademyData() {
      axios
        .get(`http://localhost:8080/api/academies/academy/${this.academyId}`) // props로 받은 id 사용
        .then((response) => {
          this.academy = response.data; // 서버에서 받아온 학원 정보 저장
          console.log("학원정보디테일실행.", response.data);
        })
        .catch((error) => {
          console.error("학원 정보를 불러오는 중 오류가 발생했습니다.", error);
        });
    },
    // 강좌 정보 가져오는 메서드
    fetchCourses() {
      axios
        .get(`http://localhost:8080/api/academies/courses/${this.academyId}`) // props로 받은 id 사용
        .then((response) => {
          console.log("강좌 목록 응답: ", response.data);
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
          this.completedCourses = completedCourses.sort(
            (a, b) => new Date(b.end_date) - new Date(a.end_date)
          );

          // 진행 중인 과정: 시작일 기준 내림차순 정렬
          this.currentCourses = currentCourses.sort(
            (a, b) => new Date(b.start_date) - new Date(a.start_date)
          );

          // 진행 예정 과정: 시작일 기준 내림차순 정렬
          this.upcomingCourses = upcomingCourses.sort(
            (a, b) => new Date(b.start_date) - new Date(a.start_date)
          );
        })

        .catch((error) => {
          console.error("강좌 정보를 불러오는 중 오류가 발생했습니다.", error);
        });
    },
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
  max-width: 900px; /* 최대 너비를 900px로 설정하여 중앙 정렬 */
  margin: 0 auto; /* 좌우 여백을 자동으로 하여 가운데 정렬 */
  padding: 20px; /* 전체 컨테이너에 패딩 추가 */
  background-color: #fff; /* 배경을 흰색으로 설정 */
}

/* info-box: 학원 정보를 포함하는 박스 */
.info-box {
  display: flex; /* 학원 정보와 레이더 차트를 가로로 나열 */
  justify-content: space-between; /* 학원 정보와 차트 사이 간격 유지 */
  border: 1px solid #ddd; /* 외곽선 */
  padding: 20px; /* 내부 패딩 */
  margin-bottom: 20px; /* 아래쪽 간격 */
  background-color: #f9f9f9; /* 배경을 연한 회색으로 */
  border-radius: 10px; /* 모서리를 둥글게 설정 */
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
  border-bottom: 2px solid #f28c00; /* 선택된 탭에 주황색 경계선 */
  font-weight: bold;
  color: #f28c00;
}

/* course-section: 과정 섹션 박스 */
.course-section {
  margin-bottom: 20px; /* 과정 섹션 간 간격 */
  padding-top: 20px; /* 섹션 상단에 패딩 추가 */
  /* border-top: 2px solid #f28c00; 섹션 상단에 색상있는 경계선 추가 */
}
/* course-card: 개별 과정 카드 */
.course-card {
  display: flex;
  flex-direction: column; /* 세로 방향으로 배치되도록 수정 */
  justify-content: flex-start; /* 왼쪽 정렬 */
  align-items: flex-start; /* 수직 방향으로 왼쪽 정렬 */
  border: 1px solid #ddd; /* 외곽선 */
  padding: 20px; /* 내부 패딩 */
  margin-bottom: 10px; /* 아래쪽 간격 */
  background-color: #fff; /* 카드 배경을 흰색으로 설정 */
  border-radius: 10px; /* 모서리를 둥글게 설정 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 약간의 그림자 추가 */
}

/* rating-box: 별점 박스 */
.rating-box {
  display: block; /* 별점을 한 줄에 배치 */
  margin-bottom: 10px; /* 별점 아래쪽 간격 */
  text-align: left; /* 왼쪽 정렬 */
  width: 100%; /* 전체 너비 사용 */
}

/* stars: 별점 */
.stars {
  font-size: 24px; /* 별 크기 조정 */
  margin-bottom: 10px; /* 별점과 제목 사이 간격 조정 */
  display: block; /* 별을 한 줄에 배치 */
}

.course-details {
  flex: 1; /* 과정 정보가 남은 공간을 차지하도록 설정 */
  width: 100%; /* 전체 너비 사용 */
}

/* 학원 정보 */
.details {
  margin-bottom: 10px; /* 학원 정보 아래쪽에 간격 추가 */
}
</style>
