<template>
  <!-- 메인 컨테이너 -->
  <div class="post-management">
    <h1>문의 현황</h1>
    <p>회원님께서 문의하신 내역입니다.</p>

    <table>
      <!-- 테이블 헤더 -->
      <thead>
        <tr>
          <th></th>
          <th>카테고리</th>
          <th>제목</th>
          <th>질문일</th>
          <th>답변일</th>
        </tr>
      </thead>
      <!-- 테이블 바디 -->
      <tbody>
        <!-- 여러 개의 문의를 리스트로 출력 -->
        <tr v-for="(inquiry, index) in inquiries" :key="inquiry.inquiryid" @click="goToDetail(inquiry.inquiryid)">
          <td>{{ index + 1 }}</td>
          <td>{{ categoryName(inquiry.category) }}</td>
          <td>{{ inquiry.title }}</td>
          <td>{{ formatDate(inquiry.regDate) }}</td>
          <td>{{ formatDate(inquiry.ansDate) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from "axios";
import { useMemberStore } from "/src/store/member-store"; // Pinia 상태관리에서 memberStore 가져오기

export default {
  data() {
    return {
      inquiries: [], //모든 문의글 저장
      memberId: null, // 로그인한 사용자 ID

      // 카테고리명 매핑
      categoryMap: {
        "service-use": "서비스 이용",
        "account-management": "계정 관리",
        "payment-issue": "결제 관련",
        "technical-support": "기술 지원",
        "content-feedback": "콘텐츠 피드백",
        other: "기타",
      },
    };
  },
  computed: {
    currentUser() {
      const memberStore = useMemberStore();
      return memberStore.member || { memberId: null }; // 현재 로그인한 사용자 정보
    },
  },
  mounted() {
    this.memberId = this.currentUser.memberId;
    console.log("마페 문의 현재 사용자 정보:", this.memberId);
    if (this.memberId) {
      this.fetchInquiries(); // 초기 데이터 로드
    }
  },
  methods: {
    fetchInquiries() {
      axios
        .get(`/api/member/inquiry/${this.memberId}`)
        .then((response) => {
          const inquiries = response.data || []; // 데이터가 없을 경우 빈 배열 처리
          console.log("문의 글들 :", inquiries); // 데이터를 확인

          if (Array.isArray(inquiries)) {
            this.inquiries = inquiries.map((inquiry) => {
              return {
                inquiryid: inquiry.inquiryid,
                category: inquiry.category,
                content: inquiry.content,
                regDate: inquiry.regDate,
                ansDate: inquiry.ansDate,
                title: inquiry.title,
              };
            });
          } else {
            console.error("받아온 데이터가 배열이 아닙니다:", inquiries);
            this.inquiries = []; // 배열이 아닌 경우 빈 데이터 처리s
          }
        })
        .catch((error) => {
          console.error("게시글 데이터를 가져오는 중 오류 발생", error);
          this.inquiries = []; // 오류 발생 시 빈 배열로 설정
        });
    },
    // 카테고리명을 한글로 변환
    categoryName(categoryKey) {
      return this.categoryMap[categoryKey] || "알 수 없음";
    },
    // 날짜 형식 변환
    formatDate(date) {
      if (!date) return null;
      return new Date(date).toLocaleDateString();
    },
    goToDetail(id) {
      // 해당 문의의 상세 페이지로 이동
      this.$router.push({ name: "InquiryDetail", params: { id } });
    },
  },
};
</script>

<style scoped>
.post-management {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
  cursor: pointer;
}

th {
  background-color: #f2f2f2;
}

input[type="checkbox"] {
  margin: 0;
}
</style>
