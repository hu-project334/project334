import { createRouter, createWebHistory } from "vue-router";
import store from "@/store.js";

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
      name: "",
      component: () => import("../views/Patients.vue"),
    },
  ],
});

router.beforeEach(async (to) => {
  console.log(store.getters.isLogedIn);

  if (to.name !== "Register" && !store.getters.isLogedIn)
    return { name: "Register" };
});

export default router;
