// Register.vue - base vue
<template>
  <div class="container" @click="closeForm()" :style="blurrStyle()">
    <img class="logo" src="@/assets/logo.png" />

    <p class="main-text">Sensor technology for the fysio</p>

    <GoogleRegisterButton @click="RegisterWithGoogle()"></GoogleRegisterButton>

    <EmailRegisterButton @click="showRegisterForm"></EmailRegisterButton>
    <p style="color: white">
      ALREADY HAVE AN ACCOUNT?<button @click="showLogForm" class="loginBTN">
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
import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import GoogleRegisterButton from "../components/registerBtns/googleRegisterBtn.vue";
import EmailRegisterButton from "../components/registerBtns/emailRegisterBtn.vue";
import RegisterForm from "../components/forms/RegisterForm.vue";
import LoginForm from "../components/forms/LogInForm.vue";

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
    registerWithEmail(value) {
      this.errorMessage = "";

      const auth = getAuth();
      createUserWithEmailAndPassword(auth, value.email, value.password)
        .then((userCredential) => {
          // Signed in

          let user = userCredential.user;
          this.$store.commit("setUser", user);

          this.$router.push({ path: "/patients" });
        })
        .catch((error) => {
          const errorCode = error.code;
          // const errorMessage = error.message;

          this.firebaseErrorFromRegister = errorCode;
        });
    },

    login(value) {
      const auth = getAuth();
      signInWithEmailAndPassword(auth, value.email, value.password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;

          this.$store.commit("setUser", user);

          this.$router.push({ path: "/patients" });
          // ...
        })
        .catch((error) => {
          switch (error.code) {
            case "auth/invalid-email":
              this.errorMessage = "Invalid email";

              break;
            case "auth/user-not-found":
              this.errorMessage = "No account with that email was found";
              break;
            case "auth/wrong-password":
              this.errorMessage = "Incorrect password";
              break;
            default:
              this.errorMessage = "Email or password was incorrect";
              break;
          }
        });
    },

    RegisterWithGoogle() {
      const provider = new GoogleAuthProvider();
      const auth = getAuth();

      signInWithPopup(auth, provider)
        .then((result) => {
          // user info
          const user = result.user;
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const accessToken = credential.accessToken;

          this.$store.commit("setUser", user);

          console.log(accessToken, "token");
          this.$router.push({ path: "/patients" });
        })
        .catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          // The email of the user's account used.
          const email = error.email;
          // The AuthCredential type that was used.
          const credential = GoogleAuthProvider.credentialFromError(error);
          console.log(errorCode, errorMessage, email, credential);
        });
    },
  },
};
</script>

<style scoped>
/* include bg in every file */

.title {
  margin-top: 1em;
}
.main-text {
  color: white;
  margin-top: 5px;
  font-size: 2em;
  padding: 5px;
}

.logo {
  height: 70px;

  margin-top: 3em;
}

.loginBTN {
  color: red;
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
