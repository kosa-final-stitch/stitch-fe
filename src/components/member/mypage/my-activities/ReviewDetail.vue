<template>
  <div class="review-page">
    <h2>후기 작성 페이지</h2>
    <div class="review-container">
      <!-- 평가 항목 리스트 -->
      <div class="review-grid">
        <div class="review-item" v-for="(review, index) in reviews" :key="index">
          <label :for="'review-' + index">{{ index + 1 }}. {{ review.title }}</label>
          <div class="rating">
            <!-- 별을 클릭할 때마다 별점을 변경하는 이벤트 바인딩 -->
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
        { title: "강의", rating: 1, comment: "" },
        { title: "강사", rating: 1, comment: "" },
        { title: "시설", rating: 1, comment: "" },
        { title: "반 분위기", rating: 1, comment: "" },
        { title: "행정", rating: 1, comment: "" },
        { title: "취업관련", rating: 1, comment: "" },
      ],
      chart: null, // 차트 객체를 저장할 변수
      isChartGenerated: false, // 버튼 클릭 상태를 저장할 변수
      buttonText: "등록", // 버튼에 표시할 텍스트
    };
  },
  methods: {
    // 별점 설정 함수
    setRating(index, rating) {
      this.reviews[index].rating = rating;
    },
    // 차트 생성 함수
    generateChart() {
      if (this.chart) {
        this.chart.destroy(); // 기존 차트를 제거하여 중복되지 않도록 함
      }

      const labels = this.reviews.map((review) => review.title || `항목 ${this.reviews.indexOf(review) + 1}`);
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
              max: 5, // 최대값을 5로 설정하여 0.5 단위가 아닌 1 단위로 스케일링
              ticks: {
                stepSize: 1, // 스케일 단계 설정을 통해 1 단위로 표시
              },
            },
          },
        },
      });
    },
    // 버튼 클릭 시 차트 생성 또는 DB 저장 실행
    handleButtonClick() {
      if (!this.isChartGenerated) {
        this.generateChart(); // 차트 생성
        this.buttonText = "저장"; // 버튼 텍스트를 '저장'으로 변경
        this.isChartGenerated = true; // 차트가 생성되었음을 기록
      } else {
        this.saveReviewData(); // DB에 데이터 저장
      }
    },
    // 리뷰 데이터를 서버로 전송하는 함수
    saveReviewData() {
      // 서버에 데이터를 전송하는 POST 요청
      axios
        .post("/api/reviews", this.reviews)
        .then((response) => {
          // 요청이 성공했을 때 실행될 코드
          alert("리뷰가 성공적으로 저장되었습니다.");
          console.log("리뷰디테일 서버 응답:", response);
          // 필요한 후처리 (예: 페이지 이동 또는 상태 초기화 등)
        })
        .catch((error) => {
          // 요청이 실패했을 때 실행될 코드
          console.error("리뷰 저장 중 오류가 발생했습니다.", error);
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
  cursor: pointer; /* 마우스를 올렸을 때 포인터 모양으로 변경 */
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
