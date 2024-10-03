/*
 담당자: 박요한, 김호영
 시작 일자: 2024.08.30
 설명 : member 라우터 컴포넌트
 ---------------------
 2024.08.30 박요한 | 라우터 설계
 2024.09.05 김호영 | 라우터 통합,수정,개선
 2024.09.18 박요한 | mypage에 meta 필드 추가
 */

import MemberMainLayout from "@/components/member/MemberMainLayout.vue";
import MemberLoginPage from "../components/member/auth/MemberLoginPage.vue";
import MemberSignUpPage from "../components/member/auth/MemberSignUpPage.vue";
import HomePage from "../components/member/home-page/HomePage.vue";
import FCommunityBoard from "../components/member/board-page/FCommunityBoard.vue";
// import InfoShareBoard from '../components/BoardPage/InfoShareBoard.vue';
// import QnABoard from '../components/BoardPage/QnABoard.vue';
import PostDetail from "../components/member/board-page/PostDetail.vue";
import PostForm from "../components/member/board-page/PostForm.vue";
import AcademyInfoList from "@/components/member/rating-info-page/AcademyInfoList.vue";
import CourseInfoList from "@/components/member/rating-info-page/CourseInfoList.vue";
import MyPage from "../components/member/mypage/MyPage.vue";
import ProfileEdit from "../components/member/mypage/my-activities/ProfileEdit.vue";
import DonationManagement from "../components/member/mypage/my-activities/DonationManagement.vue";
import InquiryManagement from "../components/member/mypage/my-activities/InquiryManagement.vue";
import InquiryDetail from "@/components/member/mypage/my-activities/InquiryDetail.vue";
import CertificateList from "../components/member/mypage/certification/CertificateList.vue";
import MyReviewDetail from "@/components/member/mypage/my-activities/MyReviewDetail.vue";
import MyPostManagement from "@/components/member/mypage/my-activities/MyPostManagement.vue";
import MyReviewManagement from "@/components/member/mypage/my-activities/MyReviewManagement.vue";
import AcademyInfoDetail from "@/components/member/rating-info-page/AcademyInfoDetail.vue";
import CourseInfoDetail from "@/components/member/rating-info-page/CourseInfoDetail.vue";
import ReviewForm from "@/components/member/rating-info-page/ReviewForm.vue";
import ReviewFormDetail from "@/components/member/rating-info-page/ReviewFormDetail.vue";
import QnABoard from "@/components/member/board-page/QnABoard.vue";
import InfoShareBoard from "@/components/member/board-page/InfoShareBoard.vue";

// import CertificateRequest from "../components/mypage/Certification/CertificateRequest.vue";
// import DonationPage from "../components/MyPage/DonationPage.vue";

const MemberRoutes = [
  { path: "/login", component: MemberLoginPage, name: "Login" },
  { path: "/signup", component: MemberSignUpPage, name: "SignUp" },
  {
    path: "/",
    component: MemberMainLayout,
    children: [
      { path: "", component: HomePage, name: "Home" },
      //     //   { path: 'board/info-share', component: InfoShareBoard, name: 'InfoShareBoard' },
      {
        path: "board/free-community",
        component: FCommunityBoard,
        name: "FCommunityBoard",
      },
      {
        path: "board/qna",
        component: QnABoard,
        name: "QnABoard",
      },
      {
        path: "board/info-share",
        component: InfoShareBoard,
        name: "InfoShareBoard",
      },
      {
        path: "board/free-community/:boardId",
        component: PostDetail,
        name: "PostDetail",
        props: true,
      },
      {
        path: "board/post-form",
        component: PostForm,
        name: "PostForm",
      },
      {
        path: "member/review-form/:academyId/:courseId",
        component: ReviewForm,
        name: "ReviewForm",
      },
      {
        //리뷰 디테일 불러오기
        path: "academy/:academyId/course/:courseId/review/:reviewId",
        name: "ReviewFormDetail",
        component: ReviewFormDetail,
        props: true, // URL 파라미터를 props로 전달
      },

      { path: "/board/PostForm", component: PostForm, name: "PostForm" },
      {
        path: "/academies/academy", // 학원 목록 페이지
        component: AcademyInfoList,
        name: "AcademyInfoList",
      },
      {
        path: "/academies/courses", //강의 목록 페이지
        component: CourseInfoList,
        name: "CourseInfoList",
      },
      {
        path: "academies/academy/:academyId", // 특정 학원의 상세 정보
        component: AcademyInfoDetail,
        name: "AcademyInfoDetail",
        props: true, // URL 매개변수를 props로 전달
      },
      {
        path: "academies/academy/:academyId/courses/:courseId", // 특정 학원의 상세 정보
        component: CourseInfoDetail,
        name: "CourseInfoDetail",
        props: true, // URL 매개변수를 props로 전달
      },

      {
        path: "mypage",
        component: MyPage,
        name: "MyPage",
        meta: { requiresAuth: true }, // 인증 필요
        children: [
          {
            path: "activities/profileEdit",
            component: ProfileEdit,
            name: "ProfileEdit",
          },
          {
            path: "activities/post",
            component: MyPostManagement,
            name: "PostManagement",
          },
          {
            path: "activities/review",
            component: MyReviewManagement,
            name: "ReviewManagement",
          },
          {
            path: "activities/review/detail/:reviewId",
            component: MyReviewDetail,
            name: "MyReviewDetail",
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
            path: "activities/inquiry/detail/:inquiryId",
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
