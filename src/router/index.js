import { createRouter, createWebHashHistory } from "vue-router";
import store from "../store/userStore";

const router = createRouter({
  history: createWebHashHistory(),

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
      path: "/patients/:name",
      name: "patient",
      component: () => import("../views/Patient.vue"),
    },
    {
      path: "/newPatient",
      name: "patientCreator",
      component: () => import("../components/forms/PatientCreatorForm.vue"),
    },
    {
      path: "/:name/:category/exerciseResults",
      name: "exerciseResults",
      component: () => import("../views/ExerciseResults.vue"),
    },
    {
      path: "/selectSensor",
      name: "selectSensor",
      component: () => import("../views/SelectSensor.vue"),
    },
    {
      path: "/:name/:category/measureInfo",
      name: "measureInfo",
      component: () => import("../views/MeasureInfo.vue"),
    },
    {
      path: "/measure",
      name: "measure",
      component: () => import("../views/Measure.vue"),
    },
    {
      path: "/:name/addCategorie",
      name: "addCategorie",
      component: () => import("../views/AddCategorie.vue"),
    },
  ],
});

router.beforeEach(async (to) => {
  console.log(import.meta.env.BASE_URL);
  if (to.name !== "Register" && !store.getters.isLogedIn)
    return { name: "Register" };
});

export default router;
