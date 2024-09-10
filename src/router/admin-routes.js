/*
 담당자: 박요한, 김호영
 시작 일자: 2024.08.30
 설명 : 라우터 컴포넌트
 ---------------------
 2024.08.30 박요한 | 라우터 설계
 2024.09.10 김호영 | 라우터 통합,수정,개선
 */
import AdminApp from '../components/admin/AdminApp.vue';
import AdminMainLayout from '../components/admin/AdminMainLayout.vue';
//import DashboardLayout from '../components/admin/content/DashboardLayout.vue';
//import UserInfoManagement from '../components/admin/content/UserInfoManagement.vue';
//import PostManagement from '../components/admin/content/PostManagement.vue';
//import ReviewManagement from '../components/admin/content/ReviewManagement.vue';
//import ReportInquiryManagement from '../components/admin/content/ReportInquiryManagement.vue';
//import DirectInquiryManagement from '../components/admin/content/DirectInquiryManagement.vue';
//import AnnouncementManagement from '../components/admin/content/AnnouncementManagement.vue';

const adminRoutes = [
  {
    path: '/admin',
    component: AdminApp,
    children: [
      {
        path: '',
        component: AdminMainLayout,
        meta: { requiresAuth: true },
        children: [
        //   {
        //     path: 'dashboard',
        //     name: 'Dashboard',
        //     component: DashboardLayout,
        //   },
        //   {
        //     path: 'user-info',
        //     name: 'UserInfoManagement',
        //     component: UserInfoManagement,
        //   },
        //   {
        //     path: 'post-management',
        //     name: 'PostManagement',
        //     component: PostManagement,
        //   },
        //   {
        //     path: 'review-management',
        //     name: 'ReviewManagement',
        //     component: ReviewManagement,
        //   },
        //   {
        //     path: 'report-inquiry',
        //     name: 'ReportInquiryManagement',
        //     component: ReportInquiryManagement,
        //   },
        //   {
        //     path: 'direct-inquiry',
        //     name: 'DirectInquiryManagement',
        //     component: DirectInquiryManagement,
        //   },
        //   {
        //     path: 'announcement',
        //     name: 'AnnouncementManagement',
        //     component: AnnouncementManagement,
        //   },
        ],
      },
    ],
  },
];

export default adminRoutes;