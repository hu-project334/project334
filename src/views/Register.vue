Register.vue - base vue
<template>
  <h1>Create an Account</h1>
  <p><input type="text" placeholder="Email" v-model="email" /></p>
  <p>
    <input type="password" placeholder="Password" v-model="password" />
  </p>
  <p><button @click="register()">Submit</button></p>
</template>

<script>
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "vue-router"; // import router

export default {
  name: "regster",
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    register() {
      const router = useRouter();
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, this.email, this.password)
        .then((userCredential) => {
          // Signed in

          const user = userCredential.user;
          console.log(user);

          router.push({ path: "/feed" });
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode, errorMessage);
          // ..
        });
    },
  },
};
</script>
