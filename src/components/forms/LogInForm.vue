<template>
  <form>
    <h3><b>Log in met email</b></h3>
    <label for="email" style="font-weight: bold">Email</label>
    <div class="input_box">
      <input
        v-model="userData.email"
        type="email"
        id="email_adress"
        name="emailAdress"
      />
    </div>
    <label for="password" style="font-weight: bold">Wachtwoord</label>
    <div class="input_box">
      <input
        v-model="userData.password"
        type="password"
        id="password"
        name="password"
      />
    </div>
    <div v-if="errorMessage !== ''" id="errorText">{{ errorMessage }}</div>
    <div id="submit_btn_cover">
      <button class="logInButton" type="button" @click="submitForm()">
        Login
      </button>
      <button class="returnButton" @click="goBackToRegister()">Terug</button>
    </div>
  </form>
</template>

<script>
export default {
  name: "LoginForm",
  props: {
    errorMessage: String,
  },
  data() {
    return {
      userData: { email: "", password: "" },
    };
  },
  methods: {
    submitForm() {
      this.$emit("send", this.userData);
    },
    goBackToRegister() {
      this.$emit("close");
    },
  },
};
</script>

<style scoped>
html,
body {
  height: 100%;
}
body {
  margin: 0;
}
body,
input,
button {
  font-family: "segeo UI", Tahoma, Geneva, Verdana, sans-serif;
}

body:before {
  content: "";
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  filter: blur(24px);
  opacity: 0.3;
  z-index: 1;
}

form {
  position: absolute;
  top: 50%;
  right: 0;
  left: 0;
  background-color: #fff;
  width: 350px;
  padding: 40px;
  margin: auto;

  /* margin: 0 auto; */
  transform: translateY(-60%);
  box-shadow: 0 10px 20px -5px #ccc;
}

h3 {
  color: red;
  font-size: 30px;
  margin: 0 0 40px 0;
}

label {
  display: block;
  cursor: pointer;
  font-size: 1.2em;
}

.input_box input {
  display: block;
  width: 100%;
  font-size: 18px;
  font-weight: bold;
  padding: 10px;
  background-color: #f1f2f3;
  border-radius: 2px;
  border: 0;
  box-sizing: border-box;
}

.input_box {
  margin-bottom: 20px;
}

#submit_btn_cover {
  margin-top: 40px;
}

.returnButton {
  display: block;
  width: 100%;
  color: #fff;
  background-color: #e6302b;
  border-radius: 2px;
  border: 0;
  font-size: 18px;
  font-weight: bold;
  padding: 16px 16px 18px 16px;
}

.returnButton:hover {
  background: #d3322c;
  border: none;
}

.logInButton {
  display: block;
  width: 100%;
  color: #fff;
  background-color: #0275d8;
  border-radius: 2px;
  border: 0;
  font-size: 18px;
  font-weight: bold;
  padding: 16px 16px 18px 16px;
  margin-bottom: 1rem;
}

.logInButton:hover {
  background: #0161b6;
  border: none;
}

#errorText {
  color: red;
}
</style>
