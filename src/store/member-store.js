//  담당자: 김호영 
//  시작 일자: 2024.09.06
//  설명 : 기본 설정 설정
//  ---------------------
//  2024.09.06 김호영 | member-store 테스트를 위한 pinia 설정 
//  2024.09.21 김호영 | admin 권한 계정 처리
//  2024.09.23 김호영 | 권한 변경 로직 추가 및 상태 갱신 처리

import { defineStore } from 'pinia';

export const useMemberStore = defineStore('memberStore', {
  state: () => ({
    member: null,         // 사용자 정보
    isAuthenticated: false,  // 로그인 상태
    authority: [],         // 권한 정보
  }),
  getters: {
    memberId(state) {
      return state.member ? state.member.id : null;
    },
    isAdmin(state) {
      return state.authority.some(auth => auth.authority === 'ROLE_ADMIN');
    },
  },
  actions: {
    setMember(member) {
      this.member = member;
      this.isAuthenticated = true;
      // 권한 정보가 있는지 확인하고, 없다면 빈 배열로 처리
      this.authority = member.authorities || [];
    },
    setAuthorities(roles) {
      this.authority = roles;  // 권한 정보 설정
    },
    logout() {
      this.isAuthenticated = false;
      this.member = null;
      this.authority = [];  // 권한 정보 초기화
      localStorage.removeItem('jwt');  // JWT 삭제
    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'member-store',
        storage: sessionStorage,
      },
    ],
  },
});