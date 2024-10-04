<!--
 담당자: 김호영
 시작 일자: 2024.09.10
 설명 : contentArea 구현
 ---------------------
 2024.09.10 김호영 | template 초기 설정 및 라우터 연결 준비
 -->

 <template>
  <div class="content-area">
    <router-view></router-view> <!-- 이곳에서 라우트된 컴포넌트가 렌더링됨 -->
  </div>
</template>

<script>
export default {
  name: 'ContentArea',
};
</script>

<style scoped>
.content-area {
  flex-grow: 1;
  background-color: #fff;
  padding: 20px;
  overflow-y: auto;
}
</style>