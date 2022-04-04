import { createRouter, createWebHistory } from "vue-router";
import store from "../store/userStore";

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Register",
      component: () => import("../views/Register.vue"),
    },
    {
      path: "/feed",
      name: "feed",
      component: () => import("../views/Feed.vue"),
    },
    {
      path: "/patients",
      name: "patients",
      component: () => import("../views/Patients.vue"),
    },
    {
      path: "/excersiseResults/:id",
      name: "excersiseResults",
      component: () => import("../views/ExceriseResults.vue"),
    },
    {
      path: "/patient/:id",
      name: "patient",
      component: () => import("../views/Patient.vue"),
    },
    {
      path: "/newPatient",
      name: "patientCreator",
      component: () => import("../views/PatientCreator.vue"),
    },
  ],
});

router.beforeEach(async (to) => {
  if (to.name !== "Register" && !store.getters.isLogedIn)
    return { name: "Register" };
});

export default router;
