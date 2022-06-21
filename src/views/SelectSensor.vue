<template>
    <div id="screen">
        <nav-bar-top></nav-bar-top>
        <h1 class="title">Koppel sensor</h1>

        <button class="connectSensorButton" @click="connectSensor()">
            <b>Koppel sensor</b>
        </button>

        <div style="margin-top: 80px;"></div>
        <footer>
            <button class="backBtn" @click="goBackToInfo()"><b>Terug</b></button>
        </footer>
    </div>
    <h1 id="loadText" class="loadText"></h1>
</template>

<script>
import NavBarTop from "../components/navbars/NavBarTop.vue";
import { findBluetoothDevices } from "/src/libraries/interface.js";

var loading = false;

export default {
  name: "Select Sensor",
  components: {
    NavBarTop,
  },

  methods: {
    goBackToInfo() {
      this.$router.push({ name: "measureInfo" });
    },
    connectSensor() {
        document.getElementById("screen").style = "filter: blur(24px); opacity: 0.6;";
        document.getElementById("loadText").innerHTML = "loading...";
        loading = true;
        this.loadAnimation();
        findBluetoothDevices().then(() => {
            return new Promise((resolve) => {
                this.$router.push({ name: "measure" });
                document.getElementById("screen").style = "";
                document.getElementById("loadText").innerHTML = "";
                loading = false;
                resolve();
            });
        });
    },
    loadAnimation() {
        setTimeout(() => {
            if(loading){
                document.getElementById("loadText").innerHTML = "loading...";
            }
        }, 500);
        setTimeout(() => {
            if(loading){
                document.getElementById("loadText").innerHTML = "loading..";
            }
        }, 1000);
        setTimeout(() => {
            if(loading){
                document.getElementById("loadText").innerHTML = "loading.";
            }
        }, 1500);
        setTimeout(() => {
            if(loading){
                document.getElementById("loadText").innerHTML = "loading";
                this.loadAnimation();
            }
        }, 2000);
    },
  },
};
</script>

<style scoped>
.page_container {
  position: relative;
  overflow: none;
}

.loadText {
  color: white;
  font-size: 3em;
  margin-left: 30%
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
  position: fixed;
  bottom: 0;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  padding-top: 1rem;
  padding-bottom: 1rem;
  width: 100%;
  background-color: #f4f4f4;
}
</style>
