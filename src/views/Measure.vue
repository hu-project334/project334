<template>
  <nav-bar-top></nav-bar-top>

  <!-- //! is not dynamic yet -->
  <h1 class="title">Meet</h1>
  <!-- //! graph has to be installed and used -->
  <main>

  </main>

  <button class="connectSensorButton">
    <b>Start meting</b>
  </button>

  <footer>
    <button class="backBtn" @click="goBackToSelect()"><b>Terug</b></button>
  </footer>
  
</template>

<script>
import NavBarTop from "../components/navbars/NavBarTop.vue";
import { findBluetoothDevices } from "/src/libraries/interface.js";

export default {
  name: "Select Sensor",
  components: {
    NavBarTop,
  },

  methods: {
    goBackToSelect() {
      this.$router.push({ name: "selectSensor" });
    },
  },
};
</script>

<style scoped>
.page_container {
  position: relative;
  overflow: none;
}
.title {
  color: white;
  margin-bottom: 3%;
  margin-top: 3%;
  margin-right: 10%;
  margin-left: 10%;
  font-size: 3em;
  width: 80%;
  text-align: center;
}

/* buttons */

.backBtn {
  width: 30%;
  background-color: #e6302b;
  border-radius: 10px;
  color: #f8f9fa;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  border: none;
}

.backBtn:hover {
  background: #d3322c;
  border: none;
}

.connectSensorButton {
  margin-left: 5%;
  margin-right: 5%;
  margin-bottom: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  width: 90%;
  background-color: #0275d8;
  color: #f8f9fa;
  border-radius: 15px;
  border: none;
}

.connectSensorButton:hover {
  background: #0161b6;
  border: none;
}
/* footer */

footer {
  display: flex;
  position: sticky;
  bottom: 0;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  padding-top: 1rem;
  padding-bottom: 1rem;
  width: 100%;
  background-color: #f8f9fa;
}
</style>
