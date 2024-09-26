<!-- 
 담당자: 박요한 
 시작 일자: 2024.09.12
 설명 : MemberMainLayout의 아래 부분
 ---------------------
 2024.09.12 박요한 | 컴포넌트 생성
 2024.09.26 김호영 | Footer 디자인 구현
 -->

 <template>
  <footer class="footer-container">
    <div class="container flex-container">
      <div class="footer-item text-align-responsive"> <!-- 반응형 텍스트 정렬 -->
        <h3 class="footer-title cursor-pointer hover-effect" @click="toggleContent('projectContent')">
          Stich
        </h3>
        <div class="content" ref="projectContent" :style="{ maxHeight: projectContentHeight }">
          <p class="footer-subtext">Stich Community Service</p>
        </div>
      </div>

      <div class="footer-item text-align-responsive"> <!-- 반응형 텍스트 정렬 -->
        <h3 class="footer-title cursor-pointer hover-effect" @click="toggleContent('teamContent')">
          [내:일] 프로젝트 팀원 소개
        </h3>
        <div class="content" ref="teamContent" :style="{ maxHeight: teamContentHeight }">
          <p class="footer-subtext">김호영, 박요한, 박유은, 박주희</p>
        </div>
      </div>

      <div class="footer-item text-align-responsive"> <!-- 반응형 텍스트 정렬 -->
        <h3 class="footer-title cursor-pointer hover-effect" @click="toggleContent('techContent')">
          사용 기술
        </h3>
        <div class="content" ref="techContent" :style="{ maxHeight: techContentHeight }">
          <p class="footer-subtext">
            ㆍ Front-end: Vue 3.x
            <br>ㆍ Backend: SpringBoot 3.x
            <br>ㆍ DBMS: SQL
            <br>ㆍ Persistence: Mybatis
            <br>ㆍ API 가져온 주소 : <a href="https://www.work24.go.kr/cm/e/a/0110/selectOpenApiSvcInfo.do?apiSvcId=&upprApiSvcId=&fullApiSvcId=000000000000000000000000000004%5E000000000000000000000000000005" class="link">고용 24</a> : <br>고용 24 국비 교육 및 학원 정보 제공
          </p>
        </div>
      </div>
    </div>

    <div class="container flex-container">
      <div class="footer-copyright">
        <p class="footer-subtext">© 2024 Stich (대한민국 국비교육 전용 커뮤니티)</p>
        <p class="footer-subtext">최종Project · 2024.08.26[월] ~ 2024.10.07[월]</p>
      </div>

      <div class="footer-icons">
        <a href="https://career.sw.or.kr/"><img src="@/assets/KOSA.png" alt="KOSA" class="footer-icon"></a>
        <a href="https://github.com/orgs/kosa-final-stitch/repositories"><img src="@/assets/github.png" alt="GitHub" class="footer-icon"></a>
        <a href="https://www.notion.so/fd02100f55064aea988eed9f7d0440a7?pvs=4"><img src="@/assets/notion.png" alt="notion" class="footer-icon"></a>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  data() {
    return {
      projectContentHeight: '0px',
      teamContentHeight: '0px',
      techContentHeight: '0px'
    };
  },
  methods: {
    toggleContent(refName) {
      const contentRef = this.$refs[refName];
      const currentHeight = this[`${refName}Height`];

      this[`${refName}Height`] = currentHeight === '0px' ? `${contentRef.scrollHeight}px` : '0px';
    }
  }
};
</script>

<style scoped>
.footer-container {
  background-color: rgb(231, 231, 231);
  padding: 16px 60px 30px 80px;
  color: rgb(63, 63, 63);
}

.flex-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: stretch;
  margin: 0 auto;
}

.footer-item {
  width: 100%;
  margin-bottom: 1rem;
  text-align: left;
}

@media (min-width: 768px) {
  .footer-item {
    width: 32%;
    text-align: center;
    margin-bottom: 0;
  }
}

.text-align-responsive {
  text-align: left;
}

.footer-title {
  font-size: 1rem;
  cursor: pointer;
  opacity: 0.8;
  position: relative;
  transition: color 0.3s ease-in-out;
}

.footer-title:hover {
  color: rgb(51, 51, 51);
}

.footer-title::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -2px;
  width: 100%;
  height: 2px;
  background-color: rgb(51, 51, 51);
  transform: scaleX(0);
  transition: transform 0.3s ease-in-out;
}

.footer-title:hover::after {
  transform: scaleX(1);
}

.footer-subtext {
  font-size: 0.875rem;
  opacity: 0.8;
  margin-top: 0.5rem;
}

.content {
  overflow: hidden;
  transition: max-height 0.5s ease-in-out;
}

.footer-copyright {
  text-align: left;
  width: 100%;
  margin-bottom: 1rem;
}

@media (min-width: 768px) {
  .footer-copyright {
    text-align: left;
    width: 50%;
    margin-bottom: 0;
  }
}

.footer-icons {
  display: flex;
  justify-content: center;
  width: 100%;
  gap: 1rem;
  padding: 1rem 0;
}

@media (min-width: 768px) {
  .footer-icons {
    width: 50%;
  }
}

.footer-icon {
  height: 3rem;
}

.link {
  color: rgb(51, 102, 255);
  text-decoration: underline;
}

.link:hover {
  text-decoration: none;
}
</style>