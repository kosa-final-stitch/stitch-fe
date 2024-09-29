<!--
 담당자: 김호영
 시작 일자: 2024.09.29
 설명 : admin 수강인증 확인 페이지 기능 구현 및 디자인 개발
 ---------------------

 2024.09.29 김호영 | 수강인증 모델 기능 구현.
 -->


 <template>
  <!-- 모달 오버레이 -->
  <div class="inquiry-modal-overlay" @click="closeModal"></div>

  <!-- 모달 컨테이너 -->
  <div class="inquiry-modal-container">
    <h2>수료과목 신청하기</h2>
    <form @submit.prevent="submitCertificate">
      <!-- 수료 과정명 -->
      <div class="form-group">
        <label for="course">수료 과정명</label>
        <input type="text" id="course" v-model="courseName" placeholder="예: MSA 4차 풀스택 개발 과정" required />
      </div>

      <!-- 수료 학원명 -->
      <div class="form-group">
        <label for="academy">수료 학원명</label>
        <input type="text" id="academy" v-model="academyName" placeholder="예: 한국소프트웨어산업협회" required />
      </div>

      <!-- 개강일 -->
      <div class="form-group">
        <label for="start-date">개강일</label>
        <input type="date" id="start-date" v-model="startDate" required />
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
export default {
  data() {
    return {
      courseName: '',
      academyName: '',
      startDate: '',
      completionDate: '',
      file: null,
      imagePreview: null, // 이미지 미리보기 URL
    };
  },
  methods: {
    submitCertificate() {
      const formData = new FormData();
      formData.append('courseName', this.courseName);
      formData.append('academyName', this.academyName);
      formData.append('startDate', this.startDate);
      formData.append('completionDate', this.completionDate);
      if (this.file) {
        formData.append('file', this.file);
      }
      
      // 여기에서 FormData를 백엔드로 전송할 수 있음
      console.log('신청한 데이터:', formData);
      this.closeModal();
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.file = file;

        // 파일을 읽어서 미리보기 URL 생성
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imagePreview = e.target.result;
        };
        reader.readAsDataURL(file); // 파일을 읽어 미리보기로 사용
      }
    },
    closeModal() {
      this.$emit('close');
    },
  },
};
</script>

<style scoped>
.inquiry-modal-container {
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
}

.inquiry-modal-overlay {
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
  width: 300px;
  height: auto;
  margin-top: 10px;
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