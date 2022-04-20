<template>
  <nav-bar-top></nav-bar-top>
  <h1 class="title">Results</h1>
  <div class="results_holder">
    <p>Min:</p>
    <p>Max:</p>
    <p>Angle</p>
    <p>Normaal:</p>
    <p>Percentage:</p>
  </div>
</template>

<script>
import NavBarTop from "../components/navbars/NavBarTop.vue";
export default {
  name: "Exercise results",
  components: {
    NavBarTop,
  },

  data() {
    return {};
  },

  methods: {},
};
</script>

<style scoped>
.results_holder {
  padding: 1px;
  margin: auto;
  height: 50%;
  background: white;
  width: 90%;
  font-size: 1.4em;
}

.title {
  text-align: center;
  margin-top: 1%;
}
</style>
