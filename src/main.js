import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// import store from "./store/store"; //local import
import store from "@/store/userStore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCmQhTuTywz-0SzS3ap66NYlQqt459CJy4",
  authDomain: "project334-3d839.firebaseapp.com",
  databaseURL:
    "https://project334-3d839-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "project334-3d839",
  storageBucket: "project334-3d839.appspot.com",
  messagingSenderId: "290669961377",
  appId: "1:290669961377:web:352d8cfb5f270eced650e0",
  measurementId: "G-MXJHSMN169",
};

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import "mdb-ui-kit";
import "bootstrap-icons/font/bootstrap-icons.css";
import { createDB } from "./db/idb";

// Initialize Firebase
initializeApp(firebaseConfig);
getFirestore();
createDB();
createApp(App).use(router).use(store).mount("#app");
