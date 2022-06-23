<template>
    <div id="loadText" class="loadText"></div>
    <div id="screen">
        <nav-bar-top></nav-bar-top>
        <h1 class="title">Koppel sensor</h1>
        
        <div class="info_container">
          <p class="boxTitle"> Een sensor koppelen </p>
          <p> 1. Klik op 'Koppel sensor' hieronder</p>
          <p> 2. Klik op de sensor die u wilt verbinden</p>
          <p> 3. Klik op verbinden</p>
        </div>
        
        <button class="connectSensorButton" @click="connectSensor()">
            <b>Koppel sensor</b>
        </button>
        
        <footer>
            <button class="backBtn" @click="goBackToInfo()"><b>Terug</b></button>
        </footer>
    </div>
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

  mounted(){
    window.onclick = function(){
      if(loading){
        document.getElementById("screen").style = "";
        document.getElementById("loadText").innerHTML = "";
        loading = false;
      }
    }
  },

  methods: {
    // Function copied from https://masteringjs.io/tutorials/fundamentals/wait-1-second-then#:~:text=To%20delay%20a%20function%20execution,call%20fn%20after%201%20second.
    delay(time) {
      return new Promise(resolve => setTimeout(resolve, time));
    },
    goBackToInfo() {
      this.$router.push({ name: "measureInfo" });
    },
    connectSensor() {
      this.delay(100).then(() => this.connect());
    },
    connect(){
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
  position: absolute;
  font-size: 3em;
  margin-top: 70%;
  margin-left: 30%;
  z-index: 1;
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

.boxTitle {
   padding-top: 3%;
   padding-left: 3%;
   font-weight: bold;
   font-size: 1.5em; 
}

.info_container {
  margin-top: 1%;
  height: 50%;
  margin-right: 5%;
  margin-left: 5%;
  background: white;
  width: 90%;
  border-radius: 15px;
  padding-bottom: 1rem;
  padding-left: 1rem;
  margin-bottom: 2rem;
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
