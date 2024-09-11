<!--
 담당자: 김호영
 시작 일자: 2024.09.10
 설명 : adminMainLayout 구현
 ---------------------
 2024.09.10 김호영 | template 초기 설정
 2024.09.11 김호영 | 각 라우터별 구조 작업 완

 -->

 <template>
  <div class="admin-layout">
    <admin-sidebar class="sidebar"></admin-sidebar> <!-- 사이드바 -->
    <admin-content-wrapper class="content-wrapper"></admin-content-wrapper> <!-- 헤더 + 컨텐츠 영역 -->
  </div>
</template>

<script>
import AdminSidebar from './AdminSidebar.vue';
import AdminContentWrapper from './AdminContentWrapper.vue';

export default {
  components: { AdminSidebar, AdminContentWrapper },
  name: 'AdminMainLayout',
};
</script>

<style scoped>
.admin-layout {
  display: flex;
  height: 100vh;
}

.sidebar {
  width: 250px; /* 사이드바 너비 고정 */
}

.content-wrapper {
  flex-grow: 1;
  display: flex;
  flex-direction: column; /* 헤더와 컨텐츠를 위아래로 배치 */
  background-color: #f4f4f4; /* 임시 색상 */
  height: 100%; /* 부모 요소인 admin-layout의 전체 높이를 차지 */
  width: 100%; /* 너비도 가득 채움 */
}
</style>