// Register.vue - base vue
<template>
  <div class="container" @click="closeForm()" :style="blurrStyle()">
    <img class="logo" alt="hogeschool utrecht logo" src="@/assets/logo.png" />

    <p class="main-text">Sensor technologie voor de fysiotherapeut</p>

    <GoogleRegisterButton @click="RegisterWithGoogle()"></GoogleRegisterButton>

    <EmailRegisterButton @click="showRegisterForm"></EmailRegisterButton>
    <p style="color: white">
      HEB JE AL EEN ACCOUNT?<button @click="showLogForm" class="loginBTN">
        LOGIN
      </button>
    </p>
  </div>
  <RegisterForm
    :firebaseError="firebaseErrorFromRegister"
    @send="registerWithEmail"
    v-if="showForm && !showLoginForm"
  ></RegisterForm>
  <LoginForm
    :errorMessage="errorMessage"
    @send="login"
    v-if="showLoginForm"
  ></LoginForm>
</template>

<script>
// import {
//   getAuth,
//   createUserWithEmailAndPassword,
//   GoogleAuthProvider,
//   signInWithEmailAndPassword,
//   signInWithPopup,
// } from "firebase/auth";
// import { createUser } from "../db/fdb";
import GoogleRegisterButton from "../components/registerBtns/googleRegisterBtn.vue";
import EmailRegisterButton from "../components/registerBtns/emailRegisterBtn.vue";
import RegisterForm from "../components/forms/RegisterForm.vue";
import LoginForm from "../components/forms/LogInForm.vue";

import {
  registerWithEmail,
  login,
  RegisterWithGoogle,
} from "../db/firebaseAuth.js";

export default {
  name: "register",
  components: {
    GoogleRegisterButton,
    EmailRegisterButton,
    RegisterForm,
    LoginForm,
  },
  data() {
    return {
      showForm: false,
      user: null,
      showLoginForm: false,
      errorMessage: "",
      registerMessage: "",
      firebaseErrorFromRegister: "",
    };
  },
  methods: {
    showLogForm(event) {
      event.stopPropagation();
      this.showLoginForm = true;
    },
    showRegisterForm(event) {
      event.stopPropagation();
      this.showForm = true;
    },
    blurrStyle() {
      if (this.showForm || this.showLoginForm) {
        let style = "filter: blur(24px); opacity: 0.6;";
        return style;
      } else {
        return "";
      }
    },
    closeForm() {
      this.showForm = false;
      this.showLoginForm = false;
      this.errorMessage = "";

      return;
    },
    RegisterWithGoogle() {
      RegisterWithGoogle();
    },

    registerWithEmail(value) {
      registerWithEmail(value).then((data) => {
        this.firebaseErrorFromRegister = data;
      });
    },

    login(value) {
      login(value).then(() => {});

      // const auth = getAuth();
      // signInWithEmailAndPassword(auth, value.email, value.password)
      //   .then((userCredential) => {
      //     // Signed in
      //     const user = userCredential.user;
      //     this.$store.commit("setUser", user);
      //     this.$router.push({ path: "/patients" });
      //     // ...
      //   })
      //   .catch((error) => {
      //     switch (error.code) {
      //       case "auth/invalid-email":
      //         this.errorMessage = "Invalid email";
      //         break;
      //       case "auth/user-not-found":
      //         this.errorMessage = "No account with that email was found";
      //         break;
      //       case "auth/wrong-password":
      //         this.errorMessage = "Incorrect password";
      //         break;
      //       default:
      //         this.errorMessage = "Email or password was incorrect";
      //         break;
      //     }
      //   });
    },
  },
};
</script>

<style scoped>
.container {
  text-align: center;
}
.title {
  margin-top: 1em;
}
.main-text {
  color: white;
  /* font-weight: bold; */
  margin-top: 1em;
  margin-bottom: 1em;
  font-size: 2em;
  padding: 5px;
}

.logo {
  max-width: 100%;
  height: auto;
  margin-top: 3em;
}
.loginBTN {
  color: #e81717;
  border: none;
  background-color: inherit;
  padding: 5px 5px;
  font-size: 16px;
  cursor: pointer;
  display: inline-block;
  font-weight: bold;
}

.loginBTN:hover {
  background: #eee;
}
</style>
