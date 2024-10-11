<!-- 
 담당자: 박요한 
 시작 일자: 2024.09.19
 설명 : 헤더의 검색창 － 학원, 교육과정 검색
 ---------------------
 2024.09.19 박요한 | 컴포넌트 생성.
 2024.09.27 박요한 | selectResult 라우터 절대경로로 수정.
 -->

<template>
  <div class="search-container" @click.stop>
    <input
      type="text"
      v-model="searchText"
      placeholder="학원명, 과정명 검색"
      class="search-input"
      @keyup="handleKeyEvents"
      @focus="showResults = true"
    />
    <button class="clear-btn" @click="clearSearch">X</button>
    <div class="results" v-if="showResults && results.length > 0">
      <div
        v-for="(item, index) in results"
        :key="`${item.academyId}-${item.courseId}`"
        :class="{ 'result-item': true, selected: index === selectedIndex }"
        @click="selectResult(item)"
        ref="resultItem"
      >
        <span>[{{ item.type === "academy" ? "학원" : "과정" }}] {{ item.name }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      searchText: "", // 검색어
      results: [], // 검색 결과
      showResults: false, // 결과 표시 여부
      selectedIndex: -1, // 키보드 이벤트 처리용 인덱스
    };
  },
  mounted() {
    // ESC 키 처리 및 외부 클릭 처리
    document.addEventListener("keydown", this.handleEscKey);
    document.addEventListener("click", this.handleClickOutside);
  },
  beforeUnmount() {
    // 이벤트 리스너 해제
    document.removeEventListener("keydown", this.handleEscKey);
    document.removeEventListener("click", this.handleClickOutside);
  },
  methods: {
    async search() {
      if (this.searchText.length > 0) {
        try {
          const response = await axios.get(`https://stitchkosa.store/api/search?query=${this.searchText}`);
          this.results = response.data;
          this.showResults = true;
        } catch (error) {
          console.error("검색 중 오류 발생", error);
        }
      } else {
        this.results = [];
        this.showResults = false;
      }
    },
    handleKeyEvents(event) {
      const resultCount = this.results.length;

      if (event.key === "Enter" && this.selectedIndex === -1) {
        this.search(); // Enter 입력 시에만 검색 수행
      } else if (event.key === "ArrowDown") {
        this.selectedIndex = (this.selectedIndex + 1) % resultCount;
        this.scrollToSelected();
      } else if (event.key === "ArrowUp") {
        this.selectedIndex = (this.selectedIndex - 1 + resultCount) % resultCount;
        this.scrollToSelected();
      } else if (event.key === "Enter" && this.selectedIndex >= 0) {
        this.selectResult(this.results[this.selectedIndex]);
      }
    },
    handleEscKey(event) {
      if (event.key === "Escape") {
        this.hideResults(); // ESC 키를 눌렀을 때 검색 결과 숨김
      }
    },
    handleClickOutside(event) {
      if (!this.$el.contains(event.target)) {
        this.hideResults(); // 검색창 외부 클릭 시 검색 결과 숨김
      }
    },
    scrollToSelected() {
      const selectedItem = this.$refs.resultItem[this.selectedIndex];
      if (selectedItem) {
        selectedItem.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    },
    selectResult(item) {
      const routePath =
        item.type === "academy"
          ? `/academies/academy/${item.academyId}`
          : `/academies/academy/${item.academyId}/courses/${item.courseId}`;
      this.$router.push(routePath);
      this.clearSearch();
    },
    hideResults() {
      this.showResults = false; // 검색 결과를 숨김
      this.selectedIndex = -1;
    },
    clearSearch() {
      this.searchText = "";
      this.results = [];
      this.showResults = false;
      this.selectedIndex = -1;
    },
  },
};
</script>

<style scoped>
.search-container {
  display: flex;
  align-items: center;
  border: 1.5px solid #ddd;
  border-radius: 10px;
  padding: 5px 10px;
  width: 100%;
  height: 30px;
  max-width: 999px;
  position: relative;
}

.search-input {
  border: none;
  outline: none;
  flex-grow: 1;
  font-size: 15px;
  padding: 5px;
}

.search-input:focus {
  border-color: #f8a060;
}

.search-container:focus-within {
  border-color: #f8a060;
}

.clear-btn {
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 16px;
  color: #888;
  padding: 5px;
}

.clear-btn:hover {
  color: #333;
}

.results {
  position: absolute;
  top: 45px;
  left: 0;
  right: 0;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 5px;
  max-height: 200px;
  overflow-y: auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.result-item {
  padding: 10px;
  cursor: pointer;
  border-bottom: 1px solid #eee;
}

.result-item:hover,
.selected {
  background-color: #f8f8f8;
}

.result-item:last-child {
  border-bottom: none;
}

/* 반응형 처리를 위한 추가 */
@media (max-width: 800px) {
  .search-container {
    width: 80%;
  }
}

@media (max-width: 400px) {
  .search-container {
    width: 80%;
  }

  .search-input {
    font-size: 10px;
  }

  .search-input::placeholder {
    font-size: 10px;
  }
}
</style>
