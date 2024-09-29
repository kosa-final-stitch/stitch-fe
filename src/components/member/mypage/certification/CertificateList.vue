<!--
 담당자: 김호영
 시작 일자: 2024.09.29
 설명 : admin 수강인증 확인 페이지 기능 구현 및 디자인 개발
 ---------------------

 2024.09.29 김호영 | 수강인증 확인 기능 구현.
 -->

 <template>
  <!-- 메인 컨테이너 -->
  <div class="post-management">
    <h1>수료 인증 현황</h1>
    <div class="header-container">
      <!-- 수료과목 신청하기 버튼 -->
      <button class="apply-button" @click="openModal">수료과목 신청하기</button>
    </div>
    <table v-if="certificate.length > 0">
      <!-- 테이블 헤더 -->
      <thead>
        <tr>
          <th>번호</th>
          <th>교육 과정명</th>
          <th>교육 과정 ID</th>
          <th>교육 학원 이름</th>
          <th>수료일</th>
          <th>수료여부</th>
        </tr>
      </thead>
      <!-- 테이블 바디 -->
      <tbody>
        <tr v-for="(cert, index) in certificate" :key="index">
          <!-- 게시글 번호 -->
          <td>{{ index + 1 }}</td>
          <!-- 수료과정명 -->
          <td>{{ cert.courseName }}</td>
          <!-- 수료과정 ID -->
          <td>{{ cert.courseId }}</td>         
          <!-- 수료학원명 -->
          <td>{{ cert.academyName }}</td>
          <!-- 수료일 -->
          <td>{{ formatDate(cert.completionDate) }}</td>
          <!-- 수료여부 -->
          <td>{{ cert.status }}</td>
        </tr>
      </tbody>
    </table>
    <!-- 수료 정보가 없을 때 보여줄 메시지 -->
    <p v-else>수료 신청 내역이 없습니다.</p>

    <!-- 모달 컴포넌트 -->
    <CertificateRequest v-if="isModalOpen" :isVisible="isModalOpen" @close="closeModal" />
  </div>
</template>

<script>
import axios from 'axios';
import CertificateRequest from './CertificateRequest.vue';

export default {
  components: {
    CertificateRequest,
  },
  data() {
    return {
      certificate: [],
      isModalOpen: false, //모달 상태 변수
    };
  },
  mounted() {
    this.fetchCertificates(); // 컴포넌트가 마운트 되면 데이터 불러오기
  },
  methods: {
    openModal() {
      console.log('Modal Open Called'); // 로그 확인
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
    },
    async fetchCertificates() {
      try {
        // 로그인된 사용자 수료 정보 가져오기
        const response = await axios.get('/api/certificate/list', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}` // JWT 토큰을 사용
          }
        });
        this.certificate = response.data; // 데이터를 Vue의 data에 저장
      } catch (error) {
        console.error("수료 정보를 불러오는 중 오류가 발생했습니다.", error);
      }
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
      return new Date(dateString).toLocaleDateString(undefined, options); // 날짜만 포맷해서 출력
    }    
  },
};
</script>

<style scoped>
/* 메인 컨테이너 스타일 */
.post-management {
  max-width: 1000px; /* 최대 너비 */
  margin: 0 auto; /* 가운데 정렬 */
  text-align: center; /* 텍스트 가운데 정렬 */
}

/* 테이블 스타일 */
table {
  width: 100%; /* 테이블 너비 */
  border-collapse: collapse; /* 테이블 셀 간격 제거 */
  margin-top: 20px; /* 위 여백 */
}

/* 테이블 헤더와 셀 스타일 */
th,
td {
  border: 1px solid #ddd; /* 테두리 */
  padding: 8px; /* 안쪽 여백 */
  text-align: center; /* 텍스트 가운데 정렬 */
}

/* 테이블 헤더 배경색 */
th {
  background-color: #f2f2f2; /* 헤더 배경색 */
}

/* 체크박스 스타일 */
input[type="checkbox"] {
  margin: 0; /* 체크박스 외부 여백 제거 */
}

/* 상단 문구와 버튼을 위한 컨테이너 */
.header-container {
  display: flex; /* 플렉스 박스 사용 */
  justify-content: space-between; /* 양쪽 끝으로 정렬 */
  align-items: center; /* 수직 가운데 정렬 */
  margin-top: 10px;
}

/* 수료과목 신청하기 버튼 스타일 */
.apply-button {
  padding: 10px 20px; /* 안쪽 여백 */
  background-color: #ffa15e; /* 버튼 배경색 */
  color: white; /* 버튼 글자색 */
  border: none; /* 테두리 없음 */
  border-radius: 5px; /* 둥근 테두리 */
  cursor: pointer; /* 마우스 커서 */
  margin-left: auto; /* 왼쪽 여백 자동으로 설정해서 우측 정렬 */
}

.apply-button:hover {
  background-color: #f28c00; /* 호버 시 색상 */
}
</style>