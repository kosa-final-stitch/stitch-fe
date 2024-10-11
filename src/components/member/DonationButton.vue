<!-- 
 담당자: 박요한 
 시작 일자: 2024.09.19
 설명 : ContentArea 안에 위치하는 후원하기 버튼. 클릭 시 모달 창.
 ---------------------
 2024.09.19 박요한 | 컴포넌트 생성
 2024.09.20 박요한 | 포트원 연결
 2024.09.24 박요한 | 결제 성공 로직
 2024.10.01 박요한 | 완료 시 status는 pending, category는 donation
 -->

<template>
  <div>
    <button @click="openModal" class="button">후원하기</button>

    <!-- 모달 -->
    <teleport to="body">
      <div v-if="showModal" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
          <h1>후원하기</h1>

          <select v-model="category" class="donation-select">
            <option value="" disabled>카테고리</option>
            <option value="후원">후원하기</option>
          </select>

          <div class="donation-amount-container">
            <input type="text" placeholder="후원금액" v-model="donationAmount" class="donation-input" />
            <span class="currency-label">원</span>
          </div>

          <p class="donation-message">
            모든 사람이 다양한 교육 정보를 빠르게 얻을 수 있는 세상을 만들기 위해, 모두가 함께하는 공간을 만들기 위해,
            여러분의 후원을 부탁드립니다.
          </p>

          <p class="donation-message">
            작은 관심과 지원이 더 나은 미래를 여는 큰 힘이 됩니다. 여러분의 기부는 더 많은 사람들이 필요한 정보를 얻고,
            꿈을 향해 나아갈 수 있는 힘이 됩니다.
          </p>

          <button :disabled="loading" class="submit-button" @click="submitDonation">
            {{ loading ? "결제 처리 중..." : "후원" }}
          </button>
          <button class="close-button" @click="closeModal">닫기</button>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script>
import axios from "axios";
import { useMemberStore } from "@/store/member-store";

export default {
  data() {
    return {
      showModal: false,
      category: "",
      donationAmount: "",
      loading: false, // 로딩 상태 추가
    };
  },
  methods: {
    openModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.loading = false; // 모달 닫을 때 로딩 상태 초기화
      this.category = "";
      this.donationAmount = "";
    },
    async submitDonation() {
      if (!this.donationAmount || isNaN(this.donationAmount) || Number(this.donationAmount) <= 0) {
        alert("올바른 금액을 입력해주세요.");
        return;
      }

      this.loading = true; // 결제 시작 시 로딩 상태

      try {
        const memberStore = useMemberStore(); // Pinia 스토어에서 유저 정보 접근
        const member = memberStore.member || {}; // 로그인된 유저 정보 (없으면 빈 객체)

        // PortOne(아임포트) 결제 처리
        const IMP = window.IMP;
        const userCode = process.env.VUE_APP_IMP_USER_CODE; // 아임포트에서 발급받은 가맹점 식별 코드
        IMP.init(userCode); // 아임포트 초기화

        await new Promise((resolve, reject) => {
          IMP.request_pay(
            {
              pg: "html5_inicis", // PG사 선택 (여기서는 이니시스 예시)
              pay_method: "card", // 결제 방식 (카드)
              merchant_uid: `mid_${new Date().getTime()}`, // 가맹점 고유 주문번호
              name: "후원금", // 결제 이름
              amount: this.donationAmount, // 사용자 입력 금액
              buyer_email: member?.email || "anonymous@domain.com", // 유저 이메일
              buyer_name: member?.name || "익명", // 유저 이름
              buyer_tel: member?.phone || "010-0000-0000", // 유저 전화번호
              buyer_addr: member?.address || "주소 정보 없음", // 유저 주소
              buyer_postcode: member?.postcode || "00000", // 우편번호 (없는 경우 기본값)
            },
            (rsp) => {
              if (rsp.success) {
                this.handlePaymentSuccess(rsp); // 결제 성공 처리
                resolve(rsp); // Promise 성공 처리
              } else {
                reject(new Error(rsp.error_msg)); // 결제 실패 처리
              }
            }
          );
        });
      } catch (error) {
        alert(`결제 실패: ${error.message}`);
      } finally {
        this.loading = false; // 결제 완료 후 로딩 상태 해제
      }
    },
    async handlePaymentSuccess(paymentData) {
      try {
        // 결제 정보를 서버로 전송하여 저장
        const response = await axios.post("https://stitchkosa.store/api/payment/complete", {
          amount: paymentData.paid_amount, // 결제 금액
          method: paymentData.pay_method, // 결제 방식 (예: 카드)
          category: "donation", // 결제 카테고리 (후원)
          status: "pending", // 결제 상태 (완료)
        });

        if (response) {
          alert("결제가 성공적으로 완료되었습니다.");
          this.closeModal(); // 모달 닫기
        }
      } catch (error) {
        console.error("결제 처리 중 오류가 발생했습니다.", error);
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
  padding: 12px 24px;
  background-color: #f28c00;
  color: white;
  text-decoration: none;
  border-radius: 50px;
  border: none;
  font-size: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease;
}

.button:hover {
  background-color: #ffdf50;
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
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

.donation-amount-container {
  display: flex;
  align-items: baseline;
  margin-bottom: 20px;
}

.currency-label {
  margin-left: 10px; /* "원" 글자와 input 간격 조정 */
  font-size: 16px;
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

button:hover {
  background-color: #ffdf50;
}

.donation-message {
  font-size: 14px;
  margin: 20px 0;
  line-height: 1.5;
  text-align: left; /* 글자 왼쪽 정렬 */
}
</style>
