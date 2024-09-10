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
          <p>{{ member.region }}</p>
        </div>
        <div class="info-item">
          <strong>평균 별점</strong>
          <div class="star-rating">
            <span class="stars">{{ member.star }}</span>
            <span class="rating-text">{{ member.ratingScore }} / 5.0</span>
          </div>
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
        region: "",
        postCount: 0,
        reviewCount: 0,
      },
    };
  },
  mounted() {
    // 백엔드 서버 주소와 API 경로에 대한 요청을 보냄
    const memberId = 1; // 실제 회원 ID를 이 변수로 설정
    axios
      .get(`http://localhost:8080/api/member/info/${memberId}`) // 백엔드 API 호출
      .then((response) => {
        this.member = response.data; // 서버로부터 데이터를 받아서 member 객체에 할당
      })
      .catch((error) => {
        console.error("회원 정보를 불러오는 중 오류가 발생했습니다.", error);
      });
  },
};
</script>

<style scoped>
.member-info-header {
  width: 100%;
  padding: 80px;
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
