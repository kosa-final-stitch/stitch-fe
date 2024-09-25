<!--
 담당자: 김호영
 시작 일자: 2024.09.10
 설명 : admin 대시보드 페이지 기능 구현 및 디자인 개발
 ---------------------
 2024.09.10 김호영 | admin 초기 설정
 2024.09.25 김호영 | 대시보드 디자인 구현
 -->


 <template>
  <div class="dashboard">

    <!-- 상단 영역 -->
    <div class="top-section">
      <div class="dashboard-cards">

        <div class="dashboard-card">
          <h6>전체 사용자 수 :</h6>
          <div class="yellow-line"></div>
        </div>

        <div class="dashboard-card">
          <h6>이번달 후원 금액 :</h6>
          <div class="yellow-line"></div>
        </div>

        <div class="dashboard-card">
          <h6>오늘 방문자 수 :</h6>
          <div class="yellow-line"></div>
        </div>

      </div>
    </div>

    <!-- 하단 영역 -->
    <div class="bottom-section">
      <div class="large-boxes">

        <div class="large-box">
          사용자 수 비교 그래프
        </div>

        <div class="large-box">
          후원 비교 그래프
        </div>

        <div class="large-box">
          ...
        </div>

      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'AdminDashboard'
}
</script>

<style scoped>
.dashboard {
  margin: 20px;
}

.top-section {

  padding: 10px;
  border-radius: 10px;
}

.bottom-section {
  padding: 30px 10px;
  margin-top: 10px;

}

.dashboard-cards {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.dashboard-card {
  width: 30%;
  border: 1px solid #f1f1f1;
  border-radius: 3px;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  position: relative;
}

.dashboard-card h6 {
  text-align: left;
  margin-left: 15px;
  font-size: 11px;
  color: #2e2e2e;
}

.yellow-line {
  content: '';
  position: absolute;
  left: 15px;
  bottom: 7px;
  width: calc(100% - 30px);
  height: 4px;
  background-color: orange;
  border-radius: 80px;
}

/* 큰 상자들을 가로로 배치 */
.large-boxes {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.large-box {
  width: 30%;
  height: 200px; /* 큰 상자의 높이 */
  border: 1px solid #f1f1f1;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.1);
  position: relative;
}

</style>