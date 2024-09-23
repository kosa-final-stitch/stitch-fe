//  담당자: 김호영 
//  시작 일자: 2024.09.21
//  설명 : admin 설정
//  ---------------------
//
//  2024.09.21 김호영 | admin 권한 계정 처리

import { defineStore } from 'pinia';

export const useAdminStore = defineStore('adminStore', {
  state: () => ({
    admin: null, // 관리자 정보
    isAdminAuthenticated: false, // 관리자 로그인 상태
  }),
  getters: {
    adminId(state) {
      return state.admin ? state.admin.id : null; // admin 객체에서 id 추출
    },
    hasAdminRole(state) {
      // admin 객체에서 권한을 확인해 관리자 여부를 확인
      return state.admin && state.admin.roles.includes('ROLE_ADMIN');
    },
  },
  actions: {
    setAdmin(admin) {
      this.admin = admin;
      this.isAdminAuthenticated = true; // 관리자 로그인 상태로 전환
    },
    logoutAdmin() {
      this.isAdminAuthenticated = false; // 관리자 인증 상태 초기화
      this.admin = null;                 // 관리자 정보 초기화
      localStorage.removeItem('admin-token'); // 로컬스토리지에서 관리자 토큰 삭제
    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'admin-store', // 저장되는 키
        storage: sessionStorage, // sessionStorage에 저장 (localStorage로 변경 가능)
      },
    ],
  },
});