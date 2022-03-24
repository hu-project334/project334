<template>
  <div>
    <router-view />
    <PWAPrompt></PWAPrompt>
  </div>
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
}
</style>
