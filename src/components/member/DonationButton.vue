<!-- 
 담당자: 박요한 
 시작 일자: 2024.09.19
 설명 : ContentArea 안에 위치하는 후원하기 버튼. 클릭 시 모달 창.
 ---------------------
 2024.09.19 박요한 | 컴포넌트 생성
 2024.09.20 박요한 | 포트원 연결
 -->

<template>
  <div>
    <button @click="openModal" class="button">후원하기</button>

    <!-- 모달 -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h1>후원하기</h1>

        <select v-model="category" class="donation-select">
          <option value="" disabled>카테고리</option>
          <option value="기부">기부하기</option>
        </select>

        <input type="text" placeholder="기부금액" v-model="donationAmount" class="donation-input" /> 원

        <p class="donation-message">
          모든 사람이 다양한 교육 정보를 빠르게 얻을 수 있는 세상을 만들기 위해, 모두가 함께하는 공간을 만들기 위해,
          여러분의 후원을 부탁드립니다.
        </p>

        <p class="donation-message">
          작은 관심과 지원이 더 나은 미래를 여는 큰 힘이 됩니다. 여러분의 기부는 더 많은 사람들이 필요한 정보를 얻고,
          꿈을 향해 나아갈 수 있는 힘이 됩니다.
        </p>

        <button class="submit-button" @click="submitDonation">후원</button>
        <button class="close-button" @click="closeModal">닫기</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      showModal: false,
      category: "",
      donationAmount: "",
    };
  },
  methods: {
    openModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    submitDonation() {
      if (!this.donationAmount || isNaN(this.donationAmount) || Number(this.donationAmount) <= 0) {
        alert("올바른 금액을 입력해주세요.");
        return;
      }

      // PortOne(아임포트) 결제 처리
      const IMP = window.IMP;
      const userCode = "imp37551151"; // 아임포트에서 발급받은 가맹점 식별 코드
      IMP.init(userCode); // 아임포트 초기화

      IMP.request_pay(
        {
          pg: "html5_inicis", // PG사 선택 (여기서는 이니시스 예시)
          pay_method: "card", // 결제 방식 (카드)
          merchant_uid: `mid_${new Date().getTime()}`, // 가맹점 고유 주문번호
          name: "기부금", // 결제 이름
          amount: this.donationAmount, // 사용자 입력 금액
          buyer_email: "test@test.com",
          buyer_name: "홍길동",
          buyer_tel: "01012345678",
          buyer_addr: "서울특별시 강남구",
          buyer_postcode: "12345",
        },
        (rsp) => {
          if (rsp.success) {
            // 결제 성공 처리
            this.handlePaymentSuccess(rsp);
          } else {
            // 결제 실패 처리
            alert(`결제 실패: ${rsp.error_msg}`);
          }
        }
      );
    },
    async handlePaymentSuccess(paymentData) {
      try {
        // 서버로 결제 결과 전송 로직
        const response = await axios.post("/api/payment/complete", paymentData); // await로 axios 처리
        if (response) {
          alert("결제가 성공적으로 완료되었습니다.");
        }
        this.closeModal(); // 모달 닫기
      } catch (error) {
        console.error(error); // 에러 로그
        alert("결제 처리 중 오류가 발생했습니다.");
      }
    },
  },
};
</script>

<style scoped>
.button {
  display: inline-block;
  margin-top: 10px;
  padding: 8px 16px;
  background-color: #f28c00;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  border: none;
}

button:hover {
  background-color: #ffdf50;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1001;
}

.modal-content {
  background-color: white;
  padding: 40px;
  border-radius: 8px;
  text-align: center;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h1 {
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: bold;
}

.donation-select,
.donation-input {
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
}

.submit-button {
  background-color: #f28c00;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.close-button {
  background-color: #ccc;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 10px;
}

.donation-message {
  font-size: 14px;
  margin: 20px 0;
  line-height: 1.5;
}
</style>
