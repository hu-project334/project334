<template>
  <PWAPrompt></PWAPrompt>
  <img alt="Vue logo" src="./assets/logo.png" />
</template>

<script>
import PWAPrompt from "./components/PWAPrompt.vue";
export default {
  name: "App",
  components: {
    PWAPrompt,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
