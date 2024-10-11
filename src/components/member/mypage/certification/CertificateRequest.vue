<!--
 담당자: 김호영
 시작 일자: 2024.09.29
 설명 : 수강인증 모달 기능 구현 및 디자인 개발
 ---------------------

 2024.09.29 김호영 | 수강증 제출 확인 모달 기능 구현.
 2024.10.03 김호영 | ADD:교육명, 학원명, 회차 정보로 course_id 조회 구현"

 -->


 <template>
  <!-- 모달 오버레이 -->
  <div class="certificate-modal-overlay" @click="closeModal"></div>

  <!-- 모달 컨테이너 -->
  <div class="certificate-modal-container">
    <h2>수료과목 신청하기</h2>
    <form @submit.prevent="submitCertificate">
      <!-- 교육 과정명 -->
      <div class="form-group">
        <label for="course">수료 과정명</label>
        <input type="text" id="course" v-model="courseName" placeholder="예: MSA 4차 풀스택 개발 과정" required />
      </div>

      <!-- 학원명 -->
      <div class="form-group">
        <label for="academy">수료 학원명</label>
        <input type="text" id="academy" v-model="academyName" placeholder="예: KOSA" required />
      </div>

      <!-- 회차 정보 -->
      <div class="form-group">
        <label for="sessionNumber">회차</label>
        <input type="number" id="sessionNumber" v-model="sessionNumber" placeholder="회차 정보를 입력해주세요 예: 1" required />
      </div>

      <!-- 수료일 -->
      <div class="form-group">
        <label for="completion-date">수료일</label>
        <input type="date" id="completion-date" v-model="completionDate" required />
      </div>

      <!-- 파일 업로드 -->
      <div class="form-group">
        <label for="filename">수료증 업로드</label>
        <input type="file" id="filename" @change="handleFileUpload" accept="image/*" />
        <!-- 미리보기 이미지 -->
        <div v-if="imagePreview" class="image-preview">
          <img :src="imagePreview" alt="미리보기" />
        </div>
      </div>

      <!-- 버튼들 -->
      <div class="modal-buttons">
        <button type="submit" class="submit-button">신청하기</button>
        <button type="button" class="close-button" @click="closeModal">취소</button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      courseName: '',
      academyName: '',
      sessionNumber: '', // 회차 정보
      completionDate: '',
      file: null, // 파일 정보
      imagePreview: null, // 이미지 미리보기 URL
      status: '처리중', // 수료 상태
    };
  },
  methods: {
    // 수료 신청 제출
    async submitCertificate() {
      if (!this.courseName || !this.academyName || !this.sessionNumber || !this.completionDate || !this.file) {
        alert('모든 필수 항목을 입력해주세요.');
        return;
      }

      const formData = new FormData();
      formData.append('courseName', this.courseName);
      formData.append('academyName', this.academyName);
      formData.append('sessionNumber', this.sessionNumber);
      formData.append('completionDate', this.completionDate);
      formData.append('status', this.status); // status 값을 포함
      formData.append('file', this.file); // 파일 첨부

      try {
        const token = localStorage.getItem('token'); // JWT 토큰 가져오기

        await axios.post('https://stitchkosa.store/api/certificate/register', formData, {
        headers: {
          Authorization: `Bearer ${token}`, // JWT 인증
          'Content-Type': 'multipart/form-data',
        },
      });

        alert('수료 신청이 성공적으로 완료되었습니다.');
        this.clearForm();  // 폼 초기화
        this.closeModal(); // 모달 닫기
        window.location.reload(); // 페이지 새로고침
      } catch (error) {
        console.error('신청 실패:', error);
        alert('수료 신청에 실패했습니다. 다시 시도해주세요.');
      }
    },

    // 파일 업로드 처리
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file && file.type.startsWith('image/')) {
        this.file = file;
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imagePreview = e.target.result;
        };
        reader.readAsDataURL(file); // 이미지 미리보기 처리
      } else {
        alert('이미지 파일만 업로드할 수 있습니다.');
      }
    },

    // 모달 닫기
    closeModal() {
      this.$emit('close');
    },

    // 폼 초기화
    clearForm() {
      this.courseName = '';
      this.academyName = '';
      this.sessionNumber = '';
      this.completionDate = '';
      this.file = null;
      this.imagePreview = null;
    },
  },
};
</script>

<style scoped>
.certificate-modal-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2001;
  width: 400px;
  background-color: white;
  padding: 20px;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  max-height: 90vh; /* 모달 최대 높이 설정 */
  overflow-y: auto; /* 모달 내부 스크롤 활성화 */
}

/* Chrome, Safari, Opera에서 스크롤바 숨기기 */
.certificate-modal-container::-webkit-scrollbar {
  display: none;
}

.certificate-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 2000;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 400;
  text-align: left;
}

select,
input,
textarea {
  width: 100%;
  padding: 8px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

textarea {
  height: 150px;
}

/* 미리보기 이미지 스타일 */
.image-preview img {
  width: 100%; /* 이미지의 너비를 모달에 맞게 설정 */
  height: auto;
  margin-top: 10px;
  max-height: 600px; /* 이미지의 최대 높이를 설정 */
  object-fit: contain; /* 이미지를 비율을 유지하며 잘림 없이 표시 */
}

.modal-buttons {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-top: 60px;
}

.submit-button {
  background-color: #f28c00;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  flex: 1;
}

.close-button {
  background-color: #ccc;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  flex: 1;
}

.submit-button:hover {
  background-color: #b16f13; /* 신청하기 버튼 hover 색상 */
}

.close-button:hover {
  background-color: #949494; /* 취소 버튼 hover 색상 */
}
</style>