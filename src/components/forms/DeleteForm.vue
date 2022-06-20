<template>
  <form class="form">
    <h3><b>Verwijderen?</b></h3>

    <button class="deleteButton" @click="deleteThing()">
      <b>verwijder</b>
    </button>
    <button class="returnButton" @click="goBack()">
      <b>Terug</b>
    </button>
    
    <div v-if="firebaseError !== ''" id="errorText">{{ firebaseError }}</div>

    <div
      v-if="message"
      class="alert"
      :class="successful ? 'alert-success' : 'alert-danger'"
    >
      {{ message }}
    </div>
  </form>
</template>

<script>
import { Form, Field, ErrorMessage } from "vee-validate";

export default {
  name: "Register",
  props: {
    firebaseError: String,
  },
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    return {
      successful: false,
      loading: false,
      message: "",
    };
  },
  mounted() {},

  methods: {
    goBack() {
      this.$emit("close");
    },
    deleteThing() {
      this.$emit("delete");
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

.form {
  position: absolute;
  top: 40%;
  right: 0;
  left: 0;
  background-color: #fff;
  width: 350px;
  padding: 40px;
  margin: 0 auto;
  transform: translateY(-60%);
  box-shadow: 0 10px 20px -5px #ccc;
}

h3 {
  font-size: 30px;
  margin: 0 0 40px 0;
}

label {
  display: block;
  cursor: pointer;
  font-size: 1.2em;
}

.input_box {
  margin-bottom: 20px;
}
#tnc_text {
  font-size: 14px;
}

#submit_btn_cover {
  margin-top: 40px;
}

.deleteButton {
  display: block;
  width: 100%;
  color: #fff;
  background-color: #e6302b;
  border-radius: 2px;
  border: 0;
  font-size: 18px;
  font-weight: bold;
  padding: 16px 16px 18px 16px;
  margin-bottom: 0.5rem;
}

.deleteButton:hover {
  background: #d3322c;
  border: none;
}

.returnButton {
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

.returnButton:hover {
  background: #0161b6;
  border: none;
}

</style>
