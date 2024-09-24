<!--작성자 : 박주희 -->
<template>
  <MemberHeader></MemberHeader>
  <div class="board-container">
    <!-- 뒤로가기 버튼 -->
    <router-link to="/board/free-community" class="back-button">
      <span>&lt; 뒤로가기</span>
    </router-link>

    <!-- 게시글 -->
    <div class="post-section" v-if="post">
      <div class="post-header">
        <div class="header-top">
          <div class="category">{{ post.category }}</div>
          <div class="post-actions">
<!--            &lt;!&ndash; 본인 글일 때만 수정/삭제 버튼 렌더링 &ndash;&gt;-->
<!--            <button class="edit-button" v-if="post.memberId === currentUser.memberId" @click="toggleEditMode">수정</button>-->
<!--            <button class="delete-button" v-if="post.memberId === currentUser.memberId" @click="confirmDelete">삭제</button>-->
<!--            &lt;!&ndash; 본인 글이 아닐 때만 신고 버튼 렌더링 &ndash;&gt;-->
<!--            <button class="report-button" v-if="post.memberId !== currentUser.memberId" @click="openReportModal(post)">신고</button>-->
            <!-- 본인 글일 때만 수정/삭제 버튼 렌더링 -->
            <button class="edit-button" @click="toggleEditMode">수정</button>
            <button class="delete-button" @click="confirmDelete">삭제</button>
            <!-- 본인 글이 아닐 때만 신고 버튼 렌더링 -->
            <button class="report-button"  @click="openReportModal(post)">신고</button>
          </div>
        </div>
        <div v-if="editMode">
          <input v-model="editedPost.title" placeholder="제목을 입력하세요" class="edit-title" />
        </div>
        <div v-else>
          <div class="title">{{ post.title }} [{{ comments.length }}]</div>
        </div>
        <div class="meta-info">
          <span class="nickname">{{ post.nickname }}</span>
          <span class="date">{{ formatDate(post.regdate) }}</span>
          <span class="views">조회 {{ post.views }}</span>
        </div>
      </div>

      <hr class="divider" />

    <!-- 내용 부분: 수정 모드일 때 텍스트 에어리어를 표시, 아닐 때는 내용 텍스트를 표시 -->
    <div class="post-content">
      <div v-if="editMode">
        <textarea v-model="editedPost.content" placeholder="내용을 입력하세요" class="edit-content"></textarea>
        <div class="edit-actions">
          <button class="save-button" @click="savePost">저장</button>
          <button class="cancel-button" @click="toggleEditMode">취소</button>
        </div>
      </div>
      <div v-else>
        <p v-for="paragraph in post.content.split('\n')" :key="paragraph">{{ paragraph }}</p>
      </div>
    </div>
  </div>

    <!-- 댓글 입력 폼 -->
    <div class="comment-form">
      <h3 class="comment-count">댓글 ({{ comments.length }})</h3>
      <div class="comment-input-container">
        <input v-model="newComment.content" placeholder="댓글을 입력하세요" class="comment-input" />
        <button class="comment-submit" @click="addComment">작성</button>
      </div>
    </div>


    <!-- 댓글 섹션 -->
    <div class="comment-section" v-if="comments.length">
      <div class="comment" v-for="comment in comments" :key="comment.commentId">
        <div class="comment-header">
          <span class="comment-author">{{ comment.nickname }}</span>
          <span class="comment-date">{{ formatDateTime(comment.regdate) }}</span>
          <span class="comment-actions">
<!--          &lt;!&ndash; 수정/삭제 버튼은 본인 댓글일 때만 표시 &ndash;&gt;-->
<!--          <button class="edit-button" v-if="comment.authorId === currentUser.memberId" @click="toggleEditComment(comment)">수정</button>-->
<!--          <button class="delete-button" v-if="comment.authorId === currentUser.memberId" @click="confirmDeleteComment(comment.commentId)">삭제</button>-->
<!--            &lt;!&ndash; 신고 버튼은 본인 댓글이 아닐 때만 표시 &ndash;&gt;-->
<!--          <button class="report-button" v-if="comment.authorId !== currentUser.memberId" @click="openReportModal(comment)">신고</button>-->
            <!-- 본인 글일 때만 수정/삭제 버튼 렌더링 -->
            <button class="edit-button"  @click="toggleEditMode">수정</button>
            <button class="delete-button" @click="confirmDelete">삭제</button>
            <!-- 본인 글이 아닐 때만 신고 버튼 렌더링 -->
            <button class="report-button" @click="openReportModal(post)">신고</button>
          </span>
        </div>
        <div class="comment-content">
          <!-- 수정 모드일 때는 텍스트에어리어를 표시 -->
          <div v-if="editingCommentId === comment.commentId">
            <textarea v-model="editedCommentContent" class="edit-comment-content"></textarea>
            <div class="edit-actions">
              <button class="save-button" @click="saveComment(comment.commentId)">저장</button>
              <button class="cancel-button" @click="cancelEditComment">취소</button>
            </div>
          </div>
          <!-- 수정 모드가 아닐 때는 일반 텍스트를 표시 -->
          <div v-else>
            {{ comment.content }}
          </div>
        </div>
      </div>
    </div>


    <!-- 로딩 중일 때 -->
    <div v-else-if="loading">
      <p>게시글을 불러오는 중입니다...</p>
    </div>

    <!-- 게시글이나 댓글이 없는 경우 -->
    <div v-else>
      <p>댓글이 없습니다.</p>
    </div>
    <!-- 삭제 확인 모달 -->
    <div v-if="showDeleteModal" class="modal">
      <div class="modal-content">
        <h3>삭제하시겠습니까?</h3>
        <p>이 게시글을 삭제하시겠습니까?</p>
        <div class="modal-actions">
          <button @click="deletePost">네</button>
          <button @click="showDeleteModal = false">아니요</button>
        </div>
      </div>
    </div>

    <!-- 댓글 삭제 확인 모달 -->
    <div v-if="showCommentDeleteModal" class="modal">
      <div class="modal-content">
        <h3>댓글 삭제 확인</h3>
        <p>정말로 이 댓글을 삭제하시겠습니까?</p>
        <div class="modal-actions">
          <button @click="deleteComment">네</button>
          <button @click="showCommentDeleteModal = false">아니요</button>
        </div>
      </div>
    </div>

    <!-- 삭제 성공 메시지 -->
    <div v-if="deleteSuccess" class="success-message">
      <p>삭제되었습니다.</p>
    </div>

    <!-- 신고 모달 컴포넌트 -->
    <ReportModal
        :show="showReportModal"
        :postId="reportTargetId"
        @close="closeReportModal"
        @submit="handleReportSubmit"
    />
  </div>
</template>

<script>
import axios from 'axios';
import MemberHeader from '../member-header/MemberHeader.vue';
import { useMemberStore } from '/src/store/member-store'; // Pinia 상태관리에서 memberStore 가져오기
import ReportModal from "@/components/member/board-page/ReportModal.vue";

export default {
  name: "PostDetail",
  components: {
    MemberHeader,
    ReportModal,
  },
  props: {
    boardId: {
      type: Number,
      required: true, // boardId가 반드시 필요함
    }
  },
  data(){
    return {
      requiresAuth: false,
      post: { memberId: null, category: '', title: '', content: '', nickname: '', regdate: '', views: 0 }, // 기본값 설정
      editedPost: {}, // 수정할 게시글 데이터
      comments: [], // 댓글 데이터
      newComment: { content: '' }, // 새 댓글 데이터
      editedCommentContent: '', // 수정할 댓글 내용
      editingCommentId: null, // 수정 중인 댓글 ID
      loading: true, // 로딩 상태
      showDeleteModal: false, // 삭제 확인 모달 상태
      deleteSuccess: false, // 삭제 성공 메시지
      showReportModal: false, // 신고 모달 상태
      reportTargetId: null, // 신고 대상 ID (게시글 ID 또는 댓글 ID)
      report: { type: '', content: '' }, // 신고 데이터
      editMode: false, // 수정 모드 상태
      showCommentDeleteModal: false, // 댓글 삭제 모달 상태
      commentToDelete: null, // 삭제할 댓글 ID
    };
  },
  computed: {
    currentUser() {
      const memberStore = useMemberStore();
      return memberStore.currentUser || { memberId: null }; // 현재 로그인한 사용자 정보
    }
  },
  watch: {
    // boardId가 변경될 때마다 게시글을 가져옴
    boardId: {
      immediate: true,
      handler(newBoardId) {
        this.fetchPost(newBoardId);
      }
    }
  },
  mounted() {
    const boardId = this.$route.params.boardId; // 게시글 ID 가져오기
    this.fetchComments(boardId); // 페이지 로드 시 댓글 데이터를 가져옴
  },
  methods: {
    fetchPost(boardId) {
      // 조회수 증가 API 호출
      this.loading = true; // 로딩 상태 시작
      this.incrementViewCount(boardId);

      // 게시글 데이터를 가져오는 API 호출
      axios.get(`/api/board/post/${boardId}`)
          .then(response => {
            console.log("Response data: ", response.data); // 전체 응답 데이터를 확인
            this.post = response.data;
            this.editedPost = { ...response.data }; // 수정할 게시글 데이터도 초기화
            console.log("Post authorId:", this.post.memberId); // post.authorId 값 확인
            console.log("Current user id:", this.currentUser.memberId); // currentUser.id 값 확인
          })
          .catch(error => {
            console.error('Error fetching post:', error);
            this.post = null; // 에러 발생 시 post를 null로 초기화
          })
          .finally(() => {
            this.loading = false;
          });
      // 댓글 데이터도 함께 가져옴
      this.fetchComments(boardId);
    },
    // 조회수 증가 메서드
    incrementViewCount(boardId) {
      axios.post(`/api/board/post/increment-views/${boardId}`)
          .then(response => {
            console.log('View count incremented:', response.data);
          })
          .catch(error => {
            console.error('Error incrementing view count:', error);
          });
    },
    fetchComments(boardId) {
      // 댓글 데이터를 가져오는 API 호출
      axios.get(`/api/comments/board/${boardId}`)
          .then(response => {
            console.log("Comments data: ", response.data); // 댓글 데이터를 확인
            this.comments = response.data; // 댓글 데이터를 저장
          })
          .catch(error => {
            console.error('Error fetching comments:', error);
          });
    },
    // 날짜 포맷팅 메서드 (날짜와 시간 모두 표시)
    formatDateTime(dateString) {
      const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },
    // 날짜 포맷팅 메서드
    formatDate(dateString) {
      const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },
    // 수정 모드 토글
    toggleEditMode() {
      if (this.editMode) {
        this.editedPost = { ...this.post }; // 취소 시 수정 내용을 원래대로 복구
      }
      this.editMode = !this.editMode;
    },
    // 게시글 저장 메서드
    savePost() {
      axios.put(`/api/board/post/update/${this.boardId}`, this.editedPost)
          .then(response => {
            console.log('Post updated:', response.data);
            this.post = { ...this.editedPost }; // 저장 후 수정 내용을 게시글 데이터에 반영
            this.editMode = false; // 수정 모드 종료
          })
          .catch(error => {
            console.error('Error updating post:', error);
          });
    },
    // 댓글 수정 모드 토글
    toggleEditComment(comment) {
      if (this.editingCommentId === comment.commentId) {
        // 현재 수정 중인 댓글을 다시 클릭하면 수정 모드 해제
        this.cancelEditComment();
      } else {
        // 수정 모드 시작
        this.editingCommentId = comment.commentId;
        this.editedCommentContent = comment.content; // 수정할 댓글 내용 초기화
      }
    },
    // 댓글 수정 취소
    cancelEditComment() {
      this.editingCommentId = null;
      this.editedCommentContent = '';
    },
    // 댓글 수정 저장
    saveComment(commentId) {
      axios.put(`/api/comments/update/${commentId}`, {
        content: this.editedCommentContent,
      })
          .then(response => {
            console.log('Comment updated:', response.data);
            // 댓글 리스트에서 수정된 댓글을 반영
            const index = this.comments.findIndex(comment => comment.commentId === commentId);
            if (index !== -1) {
              this.comments[index].content = this.editedCommentContent;
            }
            this.cancelEditComment(); // 수정 모드 종료
          })
          .catch(error => {
            console.error('Error updating comment:', error);
          });
    },
    // 신고 모달 열기
    openReportModal(target = null) {
      console.log('Report modal opened for target:', target); // 콘솔 로그로 확인
      this.showReportModal = true;
      this.reportTargetId = target ? target.commentId : this.boardId; // 댓글 신고 시에는 commentId, 게시글 신고 시에는 boardId
    },
    // 신고 모달 닫기
    closeReportModal() {
      this.showReportModal = false;
    },
    // 신고 처리 메서드
    handleReportSubmit(reportData) {
      axios.post(`/api/report`, {
        postId: this.reportTargetId,
        reportType: reportData.reportType,
        reportContent: reportData.reportContent
      })
          .then(() => {
            alert('신고가 접수되었습니다.');
            this.closeReportModal(); // 모달 닫기
          })
          .catch(error => {
            console.error('Error submitting report:', error);
          });
    },
    // 댓글 작성 메서드
    addComment() {
      const memberStore = useMemberStore(); // Pinia 스토어 가져오기
      console.log('isAuthenticated:', this.isAuthenticated);
      console.log('boardId:', this.boardId);
      console.log('newComment content:', this.newComment.content);

      if (!memberStore.isAuthenticated) {
        alert('로그인이 필요합니다.');
        this.$router.push('/login'); // 로그인 페이지로 리다이렉트
        return;
      }

      if (this.newComment.content.trim() === '') {
        alert('댓글 내용을 입력하세요.');
        return;
      }

      axios.post(`/api/member/comments/create`,
          {
            boardId: this.boardId,
            content: this.newComment.content,
          },
          {
            headers: {
              'Content-Type': 'application/json'
            },
            withCredentials: true // 세션 쿠키가 포함되도록 설정
          })
          .then(response => {
            // 작성한 댓글을 댓글 리스트에 추가
            const boardId = this.boardId;

            this.comments.push(response.data);
            // 입력 필드 초기화
            this.newComment.content = '';
            this.fetchComments(boardId);
          })
          .catch(error => {
            console.error('Error adding comment:', error);
          });

    },
    // 댓글 삭제 확인 모달 표시 및 삭제할 댓글 ID 설정
    confirmDeleteComment(commentId) {
      this.commentToDelete = commentId; // 삭제할 댓글 ID 저장
      this.showCommentDeleteModal = true; // 삭제 확인 모달 표시
    },
    // 댓글 삭제 메서드
    deleteComment() {
      if (!this.commentToDelete) return;

      axios.delete(`/api/comments/delete/${this.commentToDelete}`)
          .then(response => {
            console.log('Comment deleted:', response.data);
            // 댓글 리스트에서 삭제된 댓글을 제거
            this.comments = this.comments.filter(comment => comment.commentId !== this.commentToDelete);
            this.showCommentDeleteModal = false; // 모달 닫기
            this.commentToDelete = null; // 삭제할 댓글 초기화
          })
          .catch(error => {
            console.error('Error deleting comment:', error);
            this.showCommentDeleteModal = false;
            this.commentToDelete = null;
          });
    },
    // 삭제 확인 모달을 표시
    confirmDelete() {
      console.log('Delete button clicked'); // 로그가 찍히는지 확인
      this.showDeleteModal = true;
    },
    // 게시글 삭제 메서드
    deletePost() {
      axios.delete(`/api/board/post/delete/${this.boardId}`)
          .then(response => {
            console.log('Post deleted:', response.data);
            this.showDeleteModal = false;
            this.deleteSuccess = true;
            // 삭제 후 리스트 페이지로 이동
            setTimeout(() => {
              this.$router.push('/board/free-community');
            }, 800); // 0.8초 후 이동
          })
          .catch(error => {
            console.error('Error deleting post:', error);
            this.showDeleteModal = false;
          });
    }
  }
};
</script>

<style scoped>
.board-container {
  padding: 20px;
  max-width: 900px;
  margin: 0 auto;
  font-family: 'Arial', sans-serif;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.back-button {
  display: block;
  margin-bottom: 20px;
  color: #666;
  text-decoration: none;
}

.board-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
}

.back-button:hover {
  text-decoration: underline;
}

.board-title {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
  color: #333;
}

.post-section {
  padding: 20px;
  margin-bottom: 30px;

  background-color: #fff;
  border-radius: 8px;
}

/* 게시글 헤더 스타일 */
.post-header {
  display: flex;
  flex-direction: column;
  gap: 10px; /* 요소 간 간격 */
}

/* 카테고리와 버튼을 한 줄에 배치하는 컨테이너 */
.header-top {
  display: flex;
  justify-content: space-between; /* 양쪽 정렬 */
  align-items: center; /* 수직 중앙 정렬 */
  margin-bottom: 10px; /* 아래쪽 간격 */
}

/* 카테고리 스타일 */
.category {
  color: #f28c28; /* 글자 색상 */
  font-weight: bold; /* 굵게 */
  font-size: 16px; /* 글자 크기 */
}

/* 수정, 삭제, 신고 버튼 */
.post-actions {
  display: flex;
  gap: 10px;
}

.post-actions button {
  background: none;
  border: 1px solid #f28c28;
  border-radius: 4px;
  color: #f28c28;
  cursor: pointer;
  padding: 5px 10px;
  font-size: 14px;
  transition: background-color 0.3s, color 0.3s;
}

.post-actions button:hover {
  background-color: #f28c28;
  color: #fff;
}

.post-header .title {
  font-size: 20px;
  margin-bottom: 10px;
}

.meta-info {
  display: flex;
  justify-content: space-between; /* 좌우 배치 */
  align-items: center; /* 수직 중앙 정렬 */
  font-size: 14px; /* 글자 크기 */
  color: #666; /* 글자색 */
  padding-bottom: 5px; /* 구분선과의 간격 */
}

.meta-info .nickname {
  margin-right: 10px; /* 닉네임과 날짜 간격 */
  color: #999; /* 날짜 색상 */

}

.meta-info .date {
  margin-right: auto; /* 닉네임과 조회수 사이 간격 확보 */
  font-size: 12px; /* 날짜 글자 크기 */
  color: #999; /* 날짜 색상 */
}

.meta-info .views {
  font-size: 12px; /* 조회수 글자 크기 */
  color: #999; /* 조회수 글자색 */
}

/* 구분선 스타일 */
.divider {
  border: none;
  border-top: 1px solid #ddd; /* 얇은 구분선 */
  margin: 10px 0; /* 위아래 여백 */
}

.post-content {
  margin-top: 20px;
  line-height: 1.5;
}

.comment-form {
  display: flex;
  flex-direction: column; /* 세로로 나열 */
  align-items: flex-start; /* 왼쪽 정렬 */
  gap: 10px; /* 입력 필드와 버튼 사이 간격 */
  margin-top: 20px; /* 댓글 섹션과의 간격 */
  padding: 10px 0; /* 여백 */

}

.comment-input-container {
  display: flex; /* 입력창과 버튼을 같은 줄에 배치 */
  gap: 10px; /* 입력창과 버튼 사이의 간격 */
  width: 100%;
}


.comment-input {
  flex: 1; /* 남은 공간을 입력 필드가 차지하게 함 */
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.comment-submit {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  background-color: #f28c28;
  color: white;
  cursor: pointer;
  font-size: 14px;
  flex-shrink: 0;
}

.comment-submit:hover {
  background-color: #d47723;
}


.comment-section {
  padding-top: 20px; /* 위쪽 여백 */
  margin-top: 20px; /* 상단과의 간격 */
}

.comment-count {
  font-size: 16px; /* 댓글 수 글자 크기 */
  font-weight: bold; /* 굵게 */
  color: #666; /* 글자 색상 */
  margin-bottom: 20px; /* 댓글 섹션과 댓글 리스트 간 간격 */
}

.comment {
  padding: 10px 0; /* 댓글 내부 여백 */
  border-bottom: 1px solid #eee; /* 댓글 간 구분선 */
}

.comment-header {
  display: flex;
  justify-content: space-between; /* 작성자와 날짜, 액션 버튼을 양쪽 정렬 */
  align-items: center;
  font-size: 14px; /* 글자 크기 */
  color: #666; /* 글자 색상 */
  margin-bottom: 5px; /* 작성자와 내용 간 간격 */
}

.comment-author {
  font-weight: bold; /* 작성자명 강조 */
  margin-right: 20px; /* 작성자와 날짜 사이 간격 추가 */
}

.comment-date {
  font-size: 12px; /* 날짜 글자 크기 */
  color: #999; /* 날짜 색상 */
  margin-right: 10px;
}

.comment-actions {
  display: flex;
  gap: 10px; /* 수정, 삭제, 신고 버튼 간 간격 */
  margin-right: auto; /* 작성자와 날짜 사이 간격 고정 */
}

.comment-actions button {
  background: none;
  border: none;
  color: #f28c28;
  cursor: pointer;
  font-size: 12px;
}

.comment-content {
  font-size: 16px; /* 댓글 내용 글자 크기 */
  color: #333; /* 글자 색상 */
}

/* 모달 스타일 */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.modal-content {
  background-color: #fff;
  padding: 30px 20px;
  border-radius: 8px;
  text-align: center;
  width: 400px; /* 너비 조정 */
}

h3 {
  margin-bottom: 20px; /* 제목과 폼 간의 간격 */
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
  width : 380px;
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

.success-message {
  background-color: #f28c28;
  color: #fff;
  padding: 10px;
  text-align: center;
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 4px;
  z-index: 1000;
}

/* 수정 폼 스타일 */
.edit-title, .edit-content {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 10px;
}
.edit-content {
  min-height: 100px; /* 텍스트 영역의 최소 높이 */
}
.edit-actions {
  display: flex;
  justify-content: center; /* 가운데 정렬 */
  align-items: center; /* 수직 중앙 정렬 */
  gap: 10px;
  margin-bottom: 20px;
}
.save-button, .cancel-button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}
.save-button {
  background-color: #f28c28;
  color: white;
}
.cancel-button {
  background-color: #f28c28;
  color: white;
}

</style>