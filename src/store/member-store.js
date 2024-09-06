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
  actions: {
    setMember(member) {
      this.member = member;
      this.isAuthenticated = true; // 로그인 상태로 전환
    },
    logout() {
      this.member = null;
      this.isAuthenticated = false; // 로그아웃 상태로 전환
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