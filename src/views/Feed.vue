Register.vue - base vue
<template>
  <h1>alexander / milo</h1>

  <p><button @click="getData()">get Data</button></p>
</template>

<script>
import { findBluetoothDevices } from "/src/libraries/bluethooth.js";
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
      findBluetoothDevices()
    },
  },
};
</script>
