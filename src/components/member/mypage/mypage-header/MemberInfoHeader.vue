<!-- 
  2024.9.26. 박요한 | aios api 경로 수정 (localhost 삭제)
-->
<template>
  <div class="member-info-header">
    <h2>마이페이지</h2>
    <div class="info-bar"></div>

    <div class="info-details">
      <!-- 첫 번째 줄: 이름, 지역, 별점, 빈 칸 -->
      <div class="info-row">
        <div class="info-item">
          <strong>이름</strong>
          <p>{{ member.name }}</p>
        </div>
        <div class="info-item">
          <strong>지역</strong>
          <p>{{ member.address }}</p>
        </div>
        <!-- <div class="info-item">
          <strong>평균 별점</strong>
          <div class="star-rating">
            <span class="stars">{{ member.star }}</span>
            <span class="rating-text">{{ member.ratingScore }} / 5.0</span>
          </div>
        </div> -->
        <div class="info-item">
          <!-- 빈칸으로 공간 맞춤 -->
        </div>
        <div class="info-item">
          <!-- 빈칸으로 공간 맞춤 -->
        </div>
      </div>

      <!-- 두 번째 줄: 닉네임, 이메일, 수강평 수, 게시글 수 -->
      <div class="info-row">
        <div class="info-item">
          <strong>닉네임</strong>
          <p>{{ member.nickname }}</p>
        </div>
        <div class="info-item">
          <strong>이메일</strong>
          <p>{{ member.email }}</p>
        </div>
        <div class="info-item">
          <strong>수강평 수</strong>
          <p>{{ member.reviewCount }}개</p>
        </div>
        <div class="info-item">
          <strong>게시글 수</strong>
          <p>{{ member.postCount }}개</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      member: {
        name: "",
        nickname: "",
        email: "",
        star: "☆☆☆☆☆", // 초기값
        ratingScore: "0.0", // 초기값
        address: "",
        postCount: 0,
        reviewCount: 0,
      },
    };
  },
  mounted() {
    axios
      .get("/api/member/info")
      .then((response) => {
        console.log("멤버헤드 서버 응답: ", response);
        this.member = response.data;
        console.log("멤버헤드 response.data: ", this.member);
      })
      .catch((error) => {
        console.error("회원 정보를 불러오는 중 오류가 발생했습니다.", error);
        if (error.response) {
          console.log("응답 데이터:", error.response.data);
          console.log("응답 상태 코드:", error.response.status);
          console.log("응답 헤더:", error.response.headers);
        } else if (error.request) {
          console.log("요청은 되었으나 응답을 받지 못함:", error.request);
        } else {
          console.log("요청을 설정하는 중 오류 발생:", error.message);
        }
      });
  },
};
</script>

<style scoped>
.member-info-header {
  width: 100%;
  padding: 20px; /* 호영 80 -> 20 으로 수정 */
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-sizing: border-box;
  margin: 0 auto;
  text-align: left;
}

h2 {
  font-size: 24px;
  margin-bottom: 10px;
}

.info-bar {
  height: 4px;
  background-color: #ffa500;
  margin-bottom: 20px;
  border-radius: 2px;
}

.info-details {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-row {
  display: flex;
  justify-content: space-between;
}

.info-item {
  flex: 1;
  padding: 0 10px;
}

.info-item strong {
  font-size: 16px;
  color: #666;
}

.info-item p {
  font-size: 18px;
  color: #333;
  margin: 5px 0 0;
}

.star-rating {
  display: flex;
  align-items: center;
}

.stars {
  font-size: 18px;
  color: #ffa500;
  margin-right: 5px;
}

.rating-text {
  font-size: 16px;
  color: #333;
}
</style>
