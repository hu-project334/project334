import { createApp } from "vue";
import Vuex from "vuex";
import App from "./App.vue";

createApp(App).use(Vuex);
export default new Vuex.Store({
  state: {
    user: "",
  },
  getters: {
    getUser() {
      return JSON.parse(localStorage.getItem("user"));
    },
    isLogedIn() {
      return localStorage.getItem("user") !== null;
    },
  },
  mutations: {
    changeProfilePicture(state, photoUrl) {
      state.user.photoUrl = photoUrl;
    },

    setUser(state, user) {
      state.user = user;
      localStorage.setItem("user", JSON.stringify(state.user));
    },
  },
  actions: {
    logOutUser(state) {
      state.user = "";
      localStorage.removeItem("user");
    },
  },
});
