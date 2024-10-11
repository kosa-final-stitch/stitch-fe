<!--  
  2024.09.24 박요한 | 학원마다 평균 별점 가져오기 해결
  2024.10.01 박요한 | 제목 추가
-->
<template>
  <div class="academy-list">
    <h1>학원 정보 목록</h1>
    <!-- 학원 리스트 -->
    <div class="academy-container">
      <div
        v-for="academy in paginatedAcademies"
        :key="academy.academy_id"
        class="academy-card"
        @click="goToAcademyDetail(academy.academy_id)"
      >
        <div class="academy-details">
          <p class="stars">
            <span v-for="n in 5" :key="n">{{ n <= academy.rating ? "★" : "☆" }}</span>
          </p>
          <h3>{{ academy.academy_name }}</h3>
          <p>주소: {{ academy.address }}</p>
          <p>전화번호: {{ academy.phone }}</p>
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
      academyList: [], // 학원 리스트 저장
      currentPage: 1, // 현재 페이지
      itemsPerPage: 12, // 한 페이지당 학원 수
    };
  },
  computed: {
    // 페이지에 맞게 표시할 학원 리스트
    paginatedAcademies() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = this.currentPage * this.itemsPerPage;
      return this.academyList.slice(start, end);
    },
    // 총 페이지 수
    totalPages() {
      return Math.ceil(this.academyList.length / this.itemsPerPage);
    },
  },
  mounted() {
    this.fetchAcademies(); // 학원 리스트 가져오기
  },
  methods: {
    // 학원 리스트 가져오는 메서드
    fetchAcademies() {
      axios
        .get(`https://stitchkosa.store/api/academies/academy`) // 학원 리스트 API 엔드포인트
        .then((response) => {
          this.academyList = response.data;
          console.log("학원정보리스트실행.", response.data);
          this.academyList.forEach((academy) => this.fetchAcademyRating(academy.academy_id)); // 각 학원의 별점도 가져오기
        })
        .catch((error) => {
          console.error("학원 리스트를 불러오는 중 오류가 발생했습니다.", error);
        });
    },
    // 학원 평균 별점 가져오는 메서드
    fetchAcademyRating(academyId) {
      axios
        .get(`https://stitchkosa.store/api/academies/academy/${academyId}/rating`)
        .then((response) => {
          const academy = this.academyList.find((a) => a.academy_id === academyId);
          if (academy) {
            academy.rating = response.data; // 평균 별점을 해당 학원에 저장
          }
        })
        .catch((error) => {
          console.error("학원 평균 별점을 불러오는 중 오류가 발생했습니다.", error);
        });
    },
    // 페이지네이션 - 이전 페이지
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    // 페이지네이션 - 다음 페이지
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    // 학원 카드 클릭 시 학원 상세 페이지로 이동
    goToAcademyDetail(academyId) {
      this.$router.push({ name: "AcademyInfoDetail", params: { academyId } }); // 학원 ID를 전달하며 상세 페이지로 이동
    },
  },
};
</script>

<style scoped>
.academy-list {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.academy-list h1 {
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 60px;
}

.academy-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.academy-card {
  width: 20%; /* 카드를 더 크게 조정하여 한 줄에 3개 표시 */
  border: 1px solid #ddd;
  padding: 25px; /* 내부 패딩 증가 */
  margin-bottom: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center; /* 가운데 정렬 */
  cursor: pointer; /* 카드에 클릭 가능 커서 표시 */
  transition: transform 0.3s ease; /* 클릭 시 약간의 확대 효과 */
}

.academy-card:hover {
  transform: scale(1.05); /* 마우스 오버 시 카드 확대 */
}

.stars {
  color: #ffcc00; /* 별점 색상 */
  font-size: 20px;
  margin-bottom: 10px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
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
