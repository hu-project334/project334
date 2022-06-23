import { createApp } from "vue";
import Vuex from "vuex";
import App from "../App.vue";

createApp(App).use(Vuex);
export default new Vuex.Store({
  state: {
    user: "",
    patientEmail: "",
    XsenseDotObject: null,
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
    setXsenseDotObject(state, XsenseDotObject) {
      state.XsenseDotObject = XsenseDotObject;
    },

    setPatientEmail(state, email) {
      // using localstorage to save patient email for fdb function temporary solution
      localStorage.removeItem("patientEmail");
      state.patientEmail = email;
      localStorage.setItem("patientEmail", JSON.stringify(state.patientEmail));
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
      indexedDB.deleteDatabase("firebaseLocalStorageDb");
      state.patientEmail = "";
      localStorage.removeItem("patientEmail");
    },
    deletePatient() {
      state.patientEmail = "";
      localStorage.removeItem("patientEmail");
    },
  },
});
