// Register.vue - base vue
<template>
  <div class="container" @click="closeForm()" :style="blurrStyle()">
    <img class="logo" alt="hogeschool utrecht logo" src="@/assets/logo.png" />

    <p class="main-text">Sensor technologie voor de fysiotherapeut</p>

    <GoogleRegisterButton @click="RegisterWithGoogle()"></GoogleRegisterButton>

    <EmailRegisterButton @click="showLogForm"></EmailRegisterButton>
    <p class="acountText">HEB JE NOG GEEN ACCOUNT?</p>
    <p>
      <button @click="showRegisterForm" class="loginBTN">Registreer</button>
    </p>
  </div>
  <RegisterForm
    :firebaseError="firebaseErrorFromRegister"
    @send="registerWithEmail"
    @close="closeForm"
    v-if="showForm && !showLoginForm"
  ></RegisterForm>
  <LoginForm
    :errorMessage="errorMessage"
    @send="login"
    @close="closeForm"
    v-if="showLoginForm"
  ></LoginForm>
</template>

<script>
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
        this.firebaseErrorFromRegister = data.error;
      });
    },

    login(value) {
      login(value).then((data) => {
        this.errorMessage = data.error;
      });
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
  color: #e6302b;
  border: none;
  background-color: inherit;
  padding: 5px 5px;
  font-size: 18px;
  cursor: pointer;
  display: inline-block;
  font-weight: bold;
}

.loginBTN:hover {
  color: #d3322c;
}

.acountText {
  color: white;
  margin-bottom: -5px;
}
</style>
