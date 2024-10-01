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
      <button class="cancel-btn" @click="handleCancel">돌아가기</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { useMemberStore } from "/src/store/member-store"; // Pinia 상태관리에서 memberStore 가져오기
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
      initialReviews: [
        { title: "강의", comment: "", rating: 1 },
        { title: "강사", comment: "", rating: 1 },
        { title: "시설", comment: "", rating: 1 },
        { title: "반 분위기", comment: "", rating: 1 },
        { title: "행정", comment: "", rating: 1 },
        { title: "취업관련", comment: "", rating: 1 },
      ], // 초기 리뷰 값 저장
      chart: null,
      isChartGenerated: false,
      buttonText: "등록",
      memberId: null, // 회원 정보를 저장할 변수
    };
  },
  computed: {
    currentUser() {
      const memberStore = useMemberStore();
      return memberStore.member || { memberId: null }; // 현재 로그인한 사용자 정보
    },
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
        // 차트가 생성되지 않았다면 차트를 생성하고 버튼 텍스트를 저장으로 변경
        this.generateChart();
        this.buttonText = "저장";
        this.isChartGenerated = true;
      } else {
        // 저장 버튼 클릭 시 데이터를 저장
        this.saveReviewData();
      }
    },
    //     handleButtonClick() {
    //   // 로그인 여부 확인
    //   if (!this.memberId) {
    //     console.log("로그인이 필요합니다.");  // 로그를 통해 확인
    //     alert("로그인 후 리뷰 작성이 가능합니다. 학원 정보 페이지로 이동합니다.");

    //     // 경고 후 학원 정보 페이지로 이동
    //     setTimeout(() => {
    //       this.$router.push({ name: "CourseInfoDetail", params: { courseId: this.courseId } });
    //     }, 500);  // 0.5초 지연 후 페이지 이동
    //   }
    //   // 차트가 생성되지 않은 경우 차트를 생성
    //   else if (!this.isChartGenerated) {
    //     this.generateChart();
    //     this.buttonText = "저장";
    //     this.isChartGenerated = true;
    //   }
    //   // 차트가 이미 생성된 경우 리뷰 데이터를 저장
    //   else {
    //     this.saveReviewData();
    //   }
    // }

    handleCancel() {
      if (this.buttonText === "등록") {
        // 등록 상태일 때는 초기화
        this.reviews = JSON.parse(JSON.stringify(this.initialReviews));
        this.isChartGenerated = false;
        if (this.chart) {
          this.chart.destroy(); // 차트가 있다면 제거
        }
      } else if (this.buttonText === "저장") {
        // 저장 상태일 때는 저장 취소 처리
        this.$router.push({ name: "CourseInfoDetail", params: { courseId: this.courseId } });
      }
    },
    fetchMemberInfo() {
      const memberStore = useMemberStore(); // Pinia 상태 가져오기
      if (memberStore.member && memberStore.member.memberId) {
        this.memberId = memberStore.member.memberId; // memberId를 Pinia에서 가져와 설정
        console.log("리뷰에서 사용자정보: ", this.memberId);
      } else {
        console.error("회원 정보를 가져오지 못했습니다. 로그인 필요.");
        alert("로그인 후 리뷰 작성이 가능합니다.");
      }
    },
    saveReviewData() {
      if (!this.currentUser.memberId || !this.courseId) {
        console.log("리뷰폼 회원아이디 : " + this.currentUser.memberId + " 코스아이디 : " + this.courseId);
        console.error("회원 ID를 가져오지 못했습니다.");
        alert("로그인 후 리뷰 작성이 가능합니다. 로그인 후 이용해 주세요");
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
        .post(`/api/member/reviews`, reviewData)
        .then((response) => {
          alert("리뷰가 성공적으로 저장되었습니다.");
          console.log("리뷰서버 응답:", response.data); // 서버 응답 데이터를 처리

          // 저장 후 courseDetail 페이지로 이동
          this.$router.push({
            name: "CourseInfoDetail",
            params: { courseId: this.courseId },
            query: { reviews: reviewData },
          });
        })
        .catch((error) => {
          console.error("리뷰 저장 중 오류 발생:", error);
          alert("빈 칸을 채워주세요.");
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
