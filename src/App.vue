<template>
  <!-- <reload-pwa></reload-pwa> -->

  <div id="app">
    <router-view />
    <!-- <PWAPrompt></PWAPrompt> -->
  </div>
</template>

<script>
// import PWAPrompt from "./components/PWAPrompt.vue";
// import ReloadPWA from "./components/ReloadPWA.vue";
export default {
  name: "App",
  components: {
    // PWAPrompt,
    // ReloadPWA,
  },
};
</script>

<style>
#app {
  min-height: 100vh;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  background: #00a1e1;
}
</style>
