//  담당자: 김호영 
//  시작 일자: 2024.09.06
//  설명 : 기본 설정 설정
//  ---------------------
//  2024.09.06 김호영 | member-store 테스트를 위한 pinia 설정 
//  2024.09.21 김호영 | admin 권한 계정 처리


import { defineStore } from 'pinia';
import jwt_decode from "jwt-decode";

export const useMemberStore = defineStore('memberStore', {
  state: () => ({
    member: null,  // 사용자 정보
    isAuthenticated: false,  // 로그인 상태
    authority: null,  // 사용자 권한 정보
  }),
  getters: {
    memberId(state) {
      return state.member ? state.member.id : null;
    },
    isAdmin(state) {
      return state.authority && state.authority.includes('ROLE_ADMIN');  // 권한에 따라 관리자 여부 확인
    },
  },
  actions: {
    setMember(member) {
      this.member = member;
      this.isAuthenticated = true;
      this.authority = member.roles || [];  // 권한을 설정
    },
    setToken(token) {
      try {
        const decodedToken = jwt_decode(token);  // JWT 토큰 디코딩
        const authority = decodedToken.roles || [];
        this.setMember({
          ...this.member,
          authority,  // 권한 설정
        });
        this.authority = authority;
      } catch (error) {
        console.error("토큰 디코딩 중 오류 발생:", error);
      }
    },
    logout() {
      this.isAuthenticated = false;
      this.member = null;
      this.authority = null;
      localStorage.removeItem('jwt');
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