<template>
  <!-- 메인 컨테이너 -->
  <div class="post-management">
    <h1>게시판 글 관리</h1>
    <p>회원님께서 작성한 게시글 정보 입니다.</p>

    <!-- 탭 버튼 -->
    <div class="tabs">
      <!-- 정보공유 게시판 탭 -->
      <button
        :class="{ active: selectedTab === 'info' }"
        @click="selectedTab = 'info'"
      >
        정보공유 게시판
      </button>
      <!-- Q&A 탭 -->
      <button
        :class="{ active: selectedTab === 'qna' }"
        @click="selectedTab = 'qna'"
      >
        Q&A
      </button>
      <!-- 자유게시판 탭 -->
      <button
        :class="{ active: selectedTab === 'free' }"
        @click="selectedTab = 'free'"
      >
        자유게시판
      </button>
    </div>

    <!-- 정보공유 게시판 테이블 -->
    <!-- selectedTab이 'info'일 때만 표시 -->
    <table v-if="selectedTab === 'info'">
      <!-- 테이블 헤더 -->
      <thead>
        <tr>
          <th></th>
          <th>번호</th>
          <th>내용</th>
          <th>작성일</th>
          <th>최종 수정일</th>
        </tr>
      </thead>
      <!-- 테이블 바디 -->
      <tbody>
        <tr>
          <!-- 체크박스 -->
          <td><input type="checkbox" /></td>
          <!-- 게시글 번호 -->
          <td>1</td>
          <!-- 게시글 내용 -->
          <td>로그인이 왜 안되죠</td>
          <!-- 작성일 -->
          <td>2024-09-01</td>
          <!-- 최종수정일 -->
          <td>2024-09-01</td>
        </tr>
      </tbody>
    </table>

    <!-- Q&A 게시판 테이블 -->
    <!-- selectedTab이 'qna'일 때만 표시 -->
    <table v-if="selectedTab === 'qna'">
      <thead>
        <tr>
          <th></th>
          <th>번호</th>
          <th>내용</th>
          <th>작성일</th>
          <th>최종 수정일</th>
        </tr>
      </thead>
      <tbody>
        <!-- Q&A 게시판 내용 (현재는 예시로 빈 내용) -->
        <tr>
          <td colspan="5">Q&A 내용이 여기에 표시됩니다.</td>
        </tr>
      </tbody>
    </table>

    <!-- 자유게시판 테이블 -->
    <!-- selectedTab이 'free'일 때만 표시 -->
    <table v-if="selectedTab === 'free'">
      <thead>
        <tr>
          <th></th>
          <th>번호</th>
          <th>내용</th>
          <th>작성일</th>
          <th>최종 수정일</th>
        </tr>
      </thead>
      <tbody>
        <!-- 자유게시판 내용 (현재는 예시로 빈 내용) -->
        <tr>
          <td colspan="5">자유게시판 내용이 여기에 표시됩니다.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  // 컴포넌트 데이터
  data() {
    return {
      // 선택된 탭 상태 (초기값은 'info')
      selectedTab: "info",
    };
  },
};
</script>

<style scoped>
/* 메인 컨테이너 스타일 */
.post-management {
  max-width: 800px; /* 최대 너비 */
  margin: 0 auto; /* 가운데 정렬 */
  text-align: center; /* 텍스트 가운데 정렬 */
}

/* 탭 버튼 스타일 */
.tabs {
  display: flex; /* 플렉스 박스 사용 */
  justify-content: center; /* 중앙 정렬 */
  margin-bottom: 20px; /* 아래 여백 */
}

/* 탭 버튼 기본 스타일 */
.tabs button {
  padding: 10px 20px; /* 버튼 안쪽 여백 */
  margin: 0 5px; /* 버튼 사이 여백 */
  border: none; /* 테두리 제거 */
  background-color: #f5f5f5; /* 배경색 */
  cursor: pointer; /* 커서 모양 변경 */
}

/* 선택된 탭 버튼 스타일 */
.tabs .active {
  border-bottom: 2px solid orange; /* 하단 테두리 */
  font-weight: bold; /* 글자 두껍게 */
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
</style>
