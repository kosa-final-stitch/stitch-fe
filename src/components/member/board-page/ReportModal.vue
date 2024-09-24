<template>
  <!-- 신고 모달 -->
  <div v-if="show" class="modal">
    <div class="modal-content">
      <h2>신고 하기</h2>
      <div class="report-form">
        <label for="reportType">신고 유형</label>
        <select v-model="reportType" id="reportType" >
          <option>스팸</option>
          <option>욕설</option>
          <option>기타</option>
        </select>
      </div>
      <div class="report-form">
        <label for="reportContent">내용</label>
        <textarea v-model="reportContent" id="reportContent" placeholder="신고 내용을 입력하세요"></textarea>
      </div>
      <div class="modal-actions">
        <button class="modal-submit" @click="submitReport">등록</button>
        <button class="modal-cancel" @click="closeModal">취소</button>
      </div>
    </div>
  </div>

</template>
<script>
import axios from "axios";
import { useMemberStore } from '/src/store/member-store'; // Pinia 상태관리에서 memberStore 가져오기

export default {
  name: "ReportModal",
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    postId: {
      type: Number,
      required: true,
    },
    commentId: {
      type: Number,
      required: false, // 댓글 신고가 아닐 경우 필요 없음
    },
  },
  data() {
    return {
      reportType: '', // 신고 유형
      reportContent: '', // 신고 내용
    };
  },
  methods: {
    closeModal() {
      this.$emit('close');
      this.resetForm();
    },
    submitReport() {
      const memberStore = useMemberStore(); // Pinia 스토어에서 memberStore 가져오기
      const memberId = memberStore.memberId; // 로그인된 사용자 ID 가져오기

      if (this.reportType.trim() === '' || this.reportContent.trim() === '') {
        alert('신고 유형과 내용을 입력하세요.');
        return;
      }
      // 서버로 신고 데이터 전송
      axios.post('/api/member/report', {
        memberId: memberId, // 사용자 ID는 memberStore에서 가져옴
        postId: this.postId, // 게시글 ID
        commentId: this.commentId || null, // 댓글 ID (댓글 신고가 아닐 경우 null)
        reportType: this.reportType,
        reportContent: this.reportContent,
      })
          .then(() => {
            alert("신고가 접수되었습니다.");
            this.closeModal();
          })
          .catch(error => {
            console.error('Error submitting report:', error);
            alert('신고 접수 중 오류가 발생했습니다.');
          });
    },
    resetForm() {
      this.reportType = '';
      this.reportContent = '';
    }
  }
};
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* 반투명한 검은색 배경 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999; /* 모달이 다른 요소 위에 표시되도록 설정 */
}

.modal-content {
  position: relative; /* 모달 내용 부분이 부모 요소를 기준으로 위치를 잡도록 설정 */
  background-color: #fff; /* 모달 내용 부분의 배경 색상 */
  padding: 30px 20px;
  border-radius: 8px;
  text-align: center;
  width: 450px; /* 너비 조정 */
  z-index: 10000; /* 모달 배경 위에 표시되도록 설정 */
}

.report-form {
  margin-bottom: 15px; /* 신고 폼 간의 간격 */
  text-align: left; /* 왼쪽 정렬 */
}

.report-form label {
  display: block; /* 블록 요소로 변환 */
  margin-bottom: 5px; /* 라벨과 입력 필드 사이 간격 */
  font-weight: bold; /* 라벨 글자 굵게 */
}

#reportType, #reportContent {
  width: 100%; /* 입력 요소 너비 */
  padding: 8px; /* 입력 요소 내부 패딩 */
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

#reportType {
  height: 35px; /* 선택 박스의 높이 조정 */
  width: 100px;
}

#reportContent {
  height: 80px; /* 텍스트 영역 높이 줄임 */
  width : 420px;
}

.modal-actions {
  display: flex;
  justify-content: center; /* 버튼들을 가운데 정렬 */
  gap : 20px;
  margin-top: 20px;
}

.modal-actions button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: #f28c28;
  color: #fff;
  font-size: 16px;
  transition: background-color 0.3s;
}

.modal-actions button:hover {
  background-color: #d47723;
}


.modal-submit, .modal-cancel {
  padding: 8px 20px; /* 버튼 크기 조정 */
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.modal-submit {
  background-color: #f28c28;
  color: white;
}

.modal-cancel {
  background-color: #f28c28;
  color: white;
}

.modal-submit:hover, .modal-cancel:hover {
  background-color: #d47723; /* 호버 시 색상 변경 */
}
</style>
