/*
 담당자: 박요한, 김호영
 시작 일자: 2024.08.30
 설명 : 로그인 컴포넌트
 ---------------------
 2024.08.30 박요한 | 라우터 설계
 2024.09.05 김호영 | 라우터 통합,수정,개선
 */

import MemberMainLayout from "@/components/member/MemberMainLayout.vue";
import MemberLoginPage from '../components/member/auth/MemberLoginPage.vue';
import MemberSignUpPage from '../components/member/auth/MemberSignUpPage.vue';
import HomePage from '../components/member/home-page/HomePage.vue';
// import InfoShareBoard from '../components/BoardPage/InfoShareBoard.vue';
// import FCommunityBoard from '../components/BoardPage/FCommunityBoard.vue';
// import QnABoard from '../components/BoardPage/QnABoard.vue';
// import PostDetail from '../components/BoardPage/PostDetail.vue';
// import PostForm from '../components/BoardPage/PostForm.vue';
// import AcademyInfoList from '../components/RatingInfoPage/AcademyInfoList.vue';
// import CourseInfoList from '../components/RatingInfoPage/CourseInfoList.vue';
// import ReviewForm from '../components/RatingInfoPage/ReviewForm.vue';
import MyPage from "../components/member/mypage/MyPage.vue";
import ProfileEdit from "../components/member/mypage/my-activities/ProfileEdit.vue";
import ReviewManagement from "../components/member/mypage/my-activities/ReviewManagement.vue";
import ReviewDetail from "@/components/member/mypage/my-activities/ReviewDetail.vue";
import PostManagement from "../components/member/mypage/my-activities/PostManagement.vue";
import DonationManagement from "../components/member/mypage/my-activities/DonationManagement.vue";
import InquiryManagement from "../components/member/mypage/my-activities/InquiryManagement.vue";
import InquiryDetail from "@/components/member/mypage/my-activities/InquiryDetail.vue";
import CertificateList from "../components/member/mypage/certification/CertificateList.vue";
// import CertificateRequest from "../components/mypage/Certification/CertificateRequest.vue";
// import DonationPage from "../components/MyPage/DonationPage.vue";

const MemberRoutes = [
    { path: '/login', component: MemberLoginPage, name: 'Login' },
    { path: '/signup', component: MemberSignUpPage, name: 'SignUp' },
  {
    path: "/",
    component: MemberMainLayout,
    children: [
           { path: '', component: HomePage, name: 'Home' },
      //     //   { path: 'board/info-share', component: InfoShareBoard, name: 'InfoShareBoard' },
      //     //   { path: 'board/free-community', component: FCommunityBoard, name: 'FCommunityBoard' },
      //     //   { path: 'board/qna', component: QnABoard, name: 'QnABoard' },
      //     //   { path: 'board/post/:id', component: PostDetail, name: 'PostDetail', props: true },
      //     //   { path: 'board/post-form', component: PostForm, name: 'PostForm' },
      //     //   { path: 'academies', component: AcademyInfoList, name: 'AcademyInfoList' },
      //     //   { path: 'courses', component: CourseInfoList, name: 'CourseInfoList' },
      //     //   { path: 'review-form', component: ReviewForm, name: 'ReviewForm' },
      {
        path: "mypage",
        component: MyPage,
        name: "MyPage",
        children: [
          {
            path: "activities/profileEdit",
            component: ProfileEdit,
            name: "ProfileEdit",
          },
          {
            path: "activities/review",
            component: ReviewManagement,
            name: "ReviewManagement",
          },
          {
            path: "activities/reviewDetail",
            component: ReviewDetail,
            name: "ReviewDetail",
          },
          {
            path: "activities/post",
            component: PostManagement,
            name: "PostManagement",
          },
          {
            path: "activities/donation",
            component: DonationManagement,
            name: "DonationManagement",
          },
          {
            path: "activities/inquiry",
            component: InquiryManagement,
            name: "InquiryManagement",
          },
          {
            path: "activities/inquirydetail",
            component: InquiryDetail,
            name: "InquiryDetail",
          },
          {
            path: "certification/list",
            component: CertificateList,
            name: "CertificateList",
          },
          // {
          //   path: "certification/request",
          //   component: CertificateRequest,
          //   name: "CertificateRequest",
          // },
        ],
      },
      //     //   { path: 'donation', component: DonationPage, name: 'DonationPage' }
    ],
  },
];
export default MemberRoutes;
