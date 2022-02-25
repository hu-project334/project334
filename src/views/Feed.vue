Register.vue - base vue
<template>
  <h1>alexander / milo</h1>

  <p><button @click="getData()">get Data</button></p>
</template>

<script>
import { roundTo20 } from "/src/libraries/bluethooth.js";
export default {
  name: "regster",
  data() {
    return {
      x: 0,
      y: 0,
    };
  },
  methods: {
    getData() {
      console.log(roundTo20(), "hoort 5 te returnen");
    },
  },
};
</script>
