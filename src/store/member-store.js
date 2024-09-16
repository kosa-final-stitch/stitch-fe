//  담당자: 김호영 
//  시작 일자: 2024.09.06
//  설명 : 기본 설정 설정
//  ---------------------
//  2024.09.06 김호영 | member-store 테스트를 위한 pinia 설정 


import { defineStore } from 'pinia';

export const useMemberStore = defineStore('memberStore', {
  state: () => ({
    member: null, // 사용자 정보
    isAuthenticated: false, // 로그인 상태
  }),
  getters: {
    memberId(state) {
      // member 객체에서 memberId 추출
      return state.member ? state.member.id : null; // member 객체에서 id를 가져오고 없으면 null 반환
    },
  },
  actions: {
    setMember(member) {
      this.member = member;
      this.isAuthenticated = true; // 로그인 상태로 전환
    },
    logout() {
      this.isAuthenticated = false; // 인증 상태 초기화
      this.member = null;           // 사용자 정보 초기화
      localStorage.removeItem('token'); // 로컬스토리지에서 토큰 삭제
    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'member-store', // 저장되는 키
        storage: sessionStorage, // sessionStorage에 저장 (localStorage로 변경 가능)
      },
    ],
  },
});