/*
 담당자: 박요한, 김호영
 시작 일자: 2024.08.30
 설명 : 라우터 컴포넌트
 ---------------------
 2024.08.30 박요한 | 라우터 설계
 2024.09.10 김호영 | 라우터 통합,수정,개선
 2024.09.11 김호영 | admin, memeber App 라우터 통합 결정중.. post,review 라우트 이름 변경 
 */

 //import AdminApp from '../components/admin/AdminApp.vue';
 import AdminMainLayout from '../components/admin/AdminMainLayout.vue';
 import DashboardLayout from '../components/admin/content/DashboardLayout.vue';
 import MemberInfoManagement from '../components/admin/content/memberInfoMangement.vue';
 import PostManagement from '../components/admin/content/PostManagement.vue';
 import ReviewManagement from '../components/admin/content/ReviewManagement.vue';
 import ReportInquiryManagement from '../components/admin/content/ReportInquiryManagement.vue';
 import DirectInquiryManagement from '../components/admin/content/DirectInquiryManagement.vue';
 import AnnouncementManagement from '../components/admin/content/AnnouncementManagement.vue';
 import PayManagement from '../components/admin/content/PayManagement.vue';
// import ContentArea from '@/components/admin/content/ContentArea.vue';
//import AdminContentWrapper from '@/components/admin/AdminContentWrapper.vue';



 
 const adminRoutes = [
  {
    path: "/admin",
    component: AdminMainLayout, // AdminApp이 최상위 레이아웃 역할
    redirect: "/admin/dashboard",
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: DashboardLayout,
      },

      {
        path: "dashboard",
        name: "Dashboard",
        component: DashboardLayout,
      },

          {
            path: 'user-info',
            name: 'UserInfoManagement',
            component: MemberInfoManagement,
          },
          {
            path: 'post-management',
            name: 'AdminPostManagement',
            component: PostManagement,
          },
          {
            path: 'review-management',
            name: 'AdminReviewManagement',
            component: ReviewManagement,
          },
          {
            path: 'report-inquiry',
            name: 'ReportInquiryManagement',
            component: ReportInquiryManagement,
          },
          {
            path: 'direct-inquiry',
            name: 'DirectInquiryManagement',
            component: DirectInquiryManagement,
          },
          {
            path: 'announcement',
            name: 'AnnouncementManagement',
            component: AnnouncementManagement,
          },
          {
            path: 'pay-management',
            name: 'PayManagement',
            component: PayManagement,
          }
    ],
  },
];

export default adminRoutes;
