<!--작성자 : 박주희 -->

<template>
  <MemberHeader></MemberHeader>
  <div class="board-container">
    <div class="category-tab">
      <button>취업정보</button>
      <button>시험정보</button>
      <button>기업정보</button>
      <button>국비정보</button>
      <button>공부방법</button>
    </div>

    <table class="board-table">
      <thead>
      <tr>
        <th>번호</th>
        <th>제목</th>
        <th>작성자</th>
        <th>등록일</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td>1</td>
        <td>공부 할 때 GPT 사용 괜찮을까요?</td>
        <td>박쓸개</td>
        <td>2024-09-02</td>
      </tr>
      <tr>
        <td>2</td>
        <td>오늘 면접 보고 왔습니다.</td>
        <td>김땅콩</td>
        <td>2024-08-31</td>
      </tr>
      </tbody>
    </table>

    <div class="search-bar">
      <input type="text" placeholder="검색어를 입력하세요..." />
      <button>검색</button>
    </div>

    <div class="pagination">
      <button>&larr; Previous</button>
      <span>1</span>
      <button>Next &rarr;</button>
    </div>
  </div>
</template>

<script>
import MemberHeader from '../member-header/MemberHeader.vue';

export default {
  name: "BoardMain",
  components: {
    MemberHeader,
  }
};

</script>

<style scoped>
.board-container {
  width: 100%;
  padding: 20px;
}

.category-tabs {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
}

.category-tabs button {
  border: none;
  background-color: white;
  cursor: pointer;
  padding: 10px 20px;
  font-size: 1rem;
}

.board-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.board-table th, .board-table td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: center;
}

.search-bar {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.search-bar input {
  padding: 10px;
  width: 300px;
  margin-right: 10px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
}

.pagination button {
  padding: 10px 20px;
  margin: 0 5px;
}



</style>