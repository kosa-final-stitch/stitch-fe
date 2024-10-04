<!--
 담당자: 김호영
 시작 일자: 2024.09.10
 설명 : adminContentWrapper 구현
 ---------------------
 2024.09.10 김호영 | template 초기 설정

 -->

 <template>
  <div class="content-wrapper">
    
    <admin-header class="header"></admin-header> <!-- 상단 헤더 -->
    <content-area class="content-area"></content-area> <!-- 메인 컨텐츠 영역 -->
  </div>
</template>

<script>
import AdminHeader from './admin-header/AdminHeader.vue';
import ContentArea from './content/ContentArea.vue';


export default {
  components: { AdminHeader, ContentArea },
  name: 'AdminContentWrapper',
};
</script>

<style scoped>
.content-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%; /* 부모로부터 전체 높이 차지 */
}

.header {
  height: 60px; /* 헤더 높이 고정 */
  text-align: center;
  padding: 15px;
}

.content-area {
  flex-grow: 1;
  padding: 20px;
  overflow: auto; /* 컨텐츠가 길어지면 스크롤 가능 */
  text-align: center;
}
</style>