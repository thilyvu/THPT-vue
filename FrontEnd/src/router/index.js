import Vue from "vue";
import VueRouter from "vue-router";
import landingPage from "../components/LandingPage/LandingPage.vue";
import VueCookies from "vue-cookies";

Vue.use(VueRouter);

let routes = [
  {
    path: "*",
    redirect: "/dashboard",
  },
  // {
  //   name: "Landing page",
  //   path: "/",
  //   component: landingPage,
  // },
  {
    path: "/dashboard",
    name: "Trang chủ",
    layout: "dashboard",
    component: () => import("../views/Dashboard.vue"),
    beforeEnter: (to, from, next) => {
      if (VueCookies.get("token") !== null) {
        next();
      } else {
        next("/sign-in");
      }
    },
  },
  {
    path: "/layout",
    name: "Layout",
    layout: "dashboard",
    component: () => import("../views/Layout.vue"),
    beforeEnter: (to, from, next) => {
      if (VueCookies.get("token") !== null) {
        next();
      } else {
        next("/sign-in");
      }
    },
  },
  {
    path: "/resources",
    name: "Resources",
    layout: "dashboard",
    component: () => import("../views/Resources.vue"),
    beforeEnter: (to, from, next) => {
      if (VueCookies.get("token") !== null) {
        next();
      } else {
        next("/sign-in");
      }
    },
  },
  {
    path: "/calendar",
    name: "Calendar",
    layout: "dashboard",
    component: () => import("../views/Calendar.vue"),
    beforeEnter: (to, from, next) => {
      if (VueCookies.get("token") !== null) {
        next();
      } else {
        next("/sign-in");
      }
    },
  },
  {
    path: "/questionBank",
    name: "Question Bank",
    layout: "dashboard",
    component: () => import("../components/QuestionBank/listQuestionBank.vue"),
    beforeEnter: (to, from, next) => {
      if (VueCookies.get("token") !== null) {
        next();
      } else {
        next("/sign-in");
      }
    },
  },
  {
    path: "/quiz",
    name: "Quiz",
    layout: "dashboard",
    component: () => import("../components/Quiz/listQuiz.vue"),
    beforeEnter: (to, from, next) => {
      if (VueCookies.get("token") !== null) {
        next();
      } else {
        next("/sign-in");
      }
    },
  },
  {
    path: "/test",
    name: "Test",
    layout: "dashboard",
    component: () => import("../components/Test/listTest.vue"),
    beforeEnter: (to, from, next) => {
      if (VueCookies.get("token") !== null) {
        next();
      } else {
        next("/sign-in");
      }
    },
  },
  {
    path: "/class/add",
    name: "Tạo Lớp",
    layout: "dashboard",
    component: () => import("../views/AdditionalPage/AddClass.vue"),
    beforeEnter: (to, from, next) => {
      if (VueCookies.get("token") !== null) {
        next();
      } else {
        next("/sign-in");
      }
    },
  },
  {
    path: "/test/add",
    name: "Tạo bài tập mới",
    layout: "dashboard",
    component: () => import("../components/Test/components/AddTest.vue"),
    beforeEnter: (to, from, next) => {
      if (VueCookies.get("token") !== null) {
        next();
      } else {
        next("/sign-in");
      }
    },
  },
  {
    path: "/quiz/add",
    name: "Tạo test mới",
    layout: "dashboard",
    component: () => import("../components/Quiz/components/AddQuiz.vue"),
    beforeEnter: (to, from, next) => {
      if (VueCookies.get("token") !== null) {
        next();
      } else {
        next("/sign-in");
      }
    },
  },
  {
    path: "/questionBank/add",
    name: "Tạo câu hỏi mới",
    layout: "dashboard",
    component: () =>
      import("../components/QuestionBank/components/AddQuestionBank.vue"),
    beforeEnter: (to, from, next) => {
      if (VueCookies.get("token") !== null) {
        next();
      } else {
        next("/sign-in");
      }
    },
  },
  {
    path: "/test/edit/:id",
    name: "editTest",
    layout: "dashboard",
    component: () => import("../components/Test/components/EditTest.vue"),
    beforeEnter: (to, from, next) => {
      if (VueCookies.get("token") !== null) {
        next();
      } else {
        next("/sign-in");
      }
    },
  },
  {
    path: "/test/view/:id",
    name: "detailTest",
    layout: "dashboard",
    component: () => import("../components/Test/components/ViewDetailTest.vue"),
    beforeEnter: (to, from, next) => {
      if (VueCookies.get("token") !== null) {
        next();
      } else {
        next("/sign-in");
      }
    },
  },
  {
    path: "/:id/edit",
    name: "Chỉnh sửa Lớp",
    layout: "dashboard",
    component: () => import("../views/AdditionalPage/EditClass.vue"),
    beforeEnter: (to, from, next) => {
      if (VueCookies.get("token") !== null) {
        next();
      } else {
        next("/sign-in");
      }
    },
  },
  {
    path: "/Profile",
    name: "Trang cá nhân",
    layout: "dashboard",
    meta: {
      layoutClass: "layout-profile",
    },
    component: () => import("../views/Profile.vue"),
    beforeEnter: (to, from, next) => {
      if (VueCookies.get("token") !== null) {
        next();
      } else {
        next("/sign-in");
      }
    },
  },
  {
    path: "/sign-in",
    name: "Sign-In",
    beforeEnter: (to, from, next) => {
      if (VueCookies.get("token") === null) {
        next();
      } else {
        next("/dashboard");
      }
    },
    component: () => import("../views/Sign-In.vue"),
  },
  {
    path: "/TOS/",
    name: "TOS",
    component: () => import("../views/TOS.vue"),
  },
  {
    path: "/policy/",
    name: "Policy",
    component: () => import("../views/policy.vue"),
  },
  {
    path: "/deleteaccount/",
    name: "Delete Account",
    component: () => import("../views/deleteaccount.vue"),
  },
  {
    path: "/sign-up",
    name: "Sign-Up",
    component: () => import("../views/Sign-Up.vue"),
  },
  {
    path: "/forgotPassword/:id",
    name: "forgotPassword",
    component: () => import("../views/ForgotPassword.vue"),
  },
  {
    path: "/test",
    name: "test",
    layout: "classroom",
    component: () => import("../views/Test.vue"),
  },
  {
    path: "/:id/newsfeed",
    name: "Newfeed",
    layout: "classroom",
    component: () => import("../views/Classroom/NewsFeed.vue"),
    beforeEnter: (to, from, next) => {
      if (VueCookies.get("token") !== null) {
        next();
      } else {
        next("/sign-in");
      }
    },
  },
  {
    path: "/:id/member",
    name: "Thành viên",
    layout: "classroom",
    component: () => import("../views/Classroom/Member.vue"),
    beforeEnter: (to, from, next) => {
      if (VueCookies.get("token") !== null) {
        next();
      } else {
        next("/sign-in");
      }
    },
  },
  {
    path: "/:id/exercise",
    name: "Bài tập",
    layout: "classroom",
    component: () => import("../views/Classroom/Excercise.vue"),
    beforeEnter: (to, from, next) => {
      if (VueCookies.get("token") !== null) {
        next();
      } else {
        next("/sign-in");
      }
    },
  },
  {
    path: "/:id/exercise/add",
    name: "Tạo bài tập",
    layout: "classroom",
    component: () => import("../views/AdditionalPage/AddExercise.vue"),
    beforeEnter: (to, from, next) => {
      if (VueCookies.get("token") !== null) {
        next();
      } else {
        next("/sign-in");
      }
    },
  },
  {
    path: "/:id/exercise/:exerciseId/edit",
    name: "Chỉnh sửa bài tập",
    layout: "classroom",
    component: () => import("../views/AdditionalPage/EditExercise.vue"),
    beforeEnter: (to, from, next) => {
      if (VueCookies.get("token") !== null) {
        next();
      } else {
        next("/sign-in");
      }
    },
  },
  {
    path: "/:id/exercise/:exerciseId/do",
    name: "doTest",
    layout: "",
    component: () => import("../components/Quiz/components/DoQuiz.vue"),
    beforeEnter: (to, from, next) => {
      if (VueCookies.get("token") !== null) {
        next();
      } else {
        next("/sign-in");
      }
    },
  },
  {
    path: "/:id/lesson",
    name: "Bài giảng",
    layout: "classroom",
    component: () => import("../views/Classroom/Lesson.vue"),
    beforeEnter: (to, from, next) => {
      if (VueCookies.get("token") !== null) {
        next();
      } else {
        next("/sign-in");
      }
    },
  },
  {
    path: "/:id/document",
    name: "Document",
    layout: "classroom",
    component: () => import("../views/Classroom/Document.vue"),
    beforeEnter: (to, from, next) => {
      if (VueCookies.get("token") !== null) {
        next();
      } else {
        next("/sign-in");
      }
    },
  },
  {
    path: "/:id/test",
    name: "quizExercise",
    layout: "classroom",
    component: () => import("../views/Classroom/Test.vue"),
    beforeEnter: (to, from, next) => {
      if (VueCookies.get("token") !== null) {
        next();
      } else {
        next("/sign-in");
      }
    },
  },
  {
    path: "/feedback",
    name: "feedback",
    component: () => import("../views/Feedback.vue"),
    beforeEnter: (to, from, next) => {
      if (VueCookies.get("token") !== null) {
        next();
      } else {
        next("/sign-in");
      }
    },
  },
];

function addLayoutToRoute(route, parentLayout = "default") {
  route.meta = route.meta || {};
  route.meta.layout = route.layout || parentLayout;

  if (route.children) {
    route.children = route.children.map((childRoute) =>
      addLayoutToRoute(childRoute, route.meta.layout)
    );
  }
  return route;
}

routes = routes.map((route) => addLayoutToRoute(route));

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        selector: to.hash,
        behavior: "smooth",
      };
    }
    return {
      x: 0,
      y: 0,
      behavior: "smooth",
    };
  },
});

export default router;
