<template>
  <div class="review-page">
    <h2>후기 작성 페이지</h2>
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
      <button class="cancel-btn">취소</button>
      <button class="submit-btn" @click="handleButtonClick">
        {{ buttonText }}
      </button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
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
      chart: null,
      isChartGenerated: false,
      buttonText: "등록",
      memberId: null, // 회원 정보를 저장할 변수
    };
  },
  mounted() {
    this.courseId = this.$route.params.courseId;
    // 컴포넌트가 마운트되면 사용자 정보를 가져옴
    this.fetchMemberInfo();
  },
  methods: {
    setRating(index, rating) {
      this.reviews[index].rating = rating;
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
    handleButtonClick() {
      if (!this.isChartGenerated) {
        this.generateChart();
        this.buttonText = "저장";
        this.isChartGenerated = true;
      } else {
        this.saveReviewData();
      }
    },
    fetchMemberInfo() {
      axios
        .get("http://localhost:8080/api/member/info")
        .then((response) => {
          this.userInfo = response.data;
          this.memberId = this.userInfo.memberId; // memberId를 저장합니다.
          console.log(JSON.stringify("리뷰에서 사용자정보" + JSON.stringify(this.userInfo)));
          this.editableUserInfo = { ...this.userInfo };
        })
        .catch((error) => {
          console.error("회원 정보를 불러오는 중 오류가 발생했습니다.", error);
        });
    },
    saveReviewData() {
      if (!this.memberId || !this.courseId) {
        console.log("회원아이디 : " + this.memberId + " 코스아이디 : " + this.courseId);
        console.error("회원 ID를 가져오지 못했습니다.");
        alert("회원 ID를 가져오지 못했습니다. 다시 시도해 주세요.");
        return;
      }
      const reviewData = [
        {
          memberId: this.memberId,
          courseId: this.courseId,
          education: this.reviews[0].comment,
          educationRating: this.reviews[0].rating,
          instructor: this.reviews[1].comment,
          instructorRating: this.reviews[1].rating,
          facility: this.reviews[2].comment,
          facilityRating: this.reviews[2].rating,
          atmosphere: this.reviews[3].comment,
          atmosphereRating: this.reviews[3].rating,
          management: this.reviews[4].comment,
          managementRating: this.reviews[4].rating,
          later: this.reviews[5].comment,
          laterRating: this.reviews[5].rating,
          regDate: new Date(),
        },
      ];
      console.log("전송할 리뷰 데이터:", reviewData);
      axios
        .post("http://localhost:8080/api/member/reviews", reviewData)
        .then((response) => {
          alert("리뷰가 성공적으로 저장되었습니다.");
          console.log("리뷰서버 응답:", response.data); // 서버 응답 데이터를 처리
          // 저장 후 courseDetail 페이지로 이동
          this.$router.push({ name: "CourseInfoDetail", params: { courseId: this.courseId } });
        })
        .catch((error) => {
          console.error("리뷰 저장 중 오류 발생:", error);
          alert("리뷰 저장 중 오류가 발생했습니다. 다시 시도해 주세요.");
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
