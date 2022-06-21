<template>
  <NavBarTop></NavBarTop>

  <!-- //! is not dynamic yet -->
  <h1 class="title">Meet</h1>
  <!-- //! graph has to be installed and used -->
  <div class="container">
    <b>Meet resultaten</b>
    <table>
      <tr>
        <td class="header_name"><b class="table_content" >Tijd (m:s:ms) </b></td>
        <td>
          <span id="minutes">00:</span>
          <span id="seconds">00:</span>
          <span id="milliseconds">00</span>
        </td>
      </tr>
      <tr>
        <td class="header_name"><b>Beweging (graden) </b></td>
        <td>-</td>
      </tr>
      <tr>
        <td class="header_name"><b>Procent van de norm </b></td>
        <td>-</td>
      </tr>
    </table>

    <button
        class="measureButtonBlue"
        @click="measure()"
        id="button1"
      ><b id="button1Text">Start meting</b>
    </button>

    <button
        class="measureButtonBlue"
        @click="saveMeasurement()"
        style="margin-top: 0.5rem; display: none;"
        id="button2"
      ><b>Sla meting op</b>
    </button>

    <button
        class="measureButtonRed"
        @click="deleteMeasurement()"
        style="margin-top: 0.5rem; display: none;"
        id="button3"
      ><b>Verwijder meting</b>
    </button>
  </div>

  <div style="margin-top: 80px;"></div>
  <footer>
    <button class="backBtn" @click="goBackToSelect()"><b>Terug</b></button>
  </footer>
  
</template>

<script>
import NavBarTop from "../components/navbars/NavBarTop.vue";

var measureState = "idle";
var miliseconds  = 0;
var seconds      = 0;
var minutes      = 0;
var timer;

export default {
  name: "Select Sensor",
  components: {
    NavBarTop,
  },

  methods: {
    saveMeasurement(){

    },
    deleteMeasurement(){

    },
    goBackToSelect() {
      clearInterval(timer);
      this.$router.push({ name: "selectSensor" });
    },

    //bron: https://dev.to/walternascimentobarroso/creating-a-timer-with-javascript-8b7
    updateTimer() {
      if ((miliseconds += 10) == 1000) {
        miliseconds = 0;
        seconds++;
      }
      if (seconds == 60) {
        seconds = 0;
        minutes++;
      }
      document.getElementById('minutes').innerHTML = minutes+":";
      document.getElementById('seconds').innerHTML = seconds+":";
      document.getElementById('milliseconds').innerHTML = miliseconds;
    },

    measure() {
      if(measureState == "idle"){
        document.getElementById("button1").classList.toggle('measureButtonBlue');
        document.getElementById("button1").classList.toggle('measureButtonRed');
        document.getElementById("button1Text").innerHTML = 'Stop meting';

        clearInterval(timer);
        timer = setInterval(() => { this.updateTimer(); }, 10);

        measureState = "measuring";
      }
      else if(measureState == "measuring"){
        document.getElementById("button1").classList.toggle('measureButtonBlue');
        document.getElementById("button1").classList.toggle('measureButtonRed');
        document.getElementById("button1Text").innerHTML = 'Begin opnieuw';

        document.getElementById("button2").style = ('margin-top: 0.5rem; display: inline');
        document.getElementById("button3").style = ('margin-top: 0.5rem; display: inline');

        clearInterval(timer);
        measureState = "results";
      }
      else if(measureState == "results"){
        document.getElementById("button1Text").innerHTML = 'Start meting';
        document.getElementById("button2").style = ('margin-top: 0.5rem; display: none');
        document.getElementById("button3").style = ('margin-top: 0.5rem; display: none');

        miliseconds  = 0;
        seconds      = 0;
        minutes      = 0;
        clearInterval(timer);
        document.getElementById('minutes').innerHTML = minutes+":";
        document.getElementById('seconds').innerHTML = seconds+":";
        document.getElementById('milliseconds').innerHTML = miliseconds;

        measureState = "idle";
      }

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

.container {
  margin-top: 1%;
  height: 50%;
  margin-right: 5%;
  margin-left: 5%;
  background: white;
  width: 90%;
  border-radius: 15px;
  padding-bottom: 0.5rem;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  padding-top: 0.5rem;
  margin-bottom: 1.25rem;
}
tr td {
  border: 2px solid #00a1e1;
  padding-left: 1%;
  width: 100%;
}
.header_name {
  padding-left: 1%;
  width: 20%;
}
.table_content{
  margin-right: 100px;
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

.measureButtonBlue {
  margin-left: 2%;
  margin-right: 2%;
  margin-top: 2rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  width: 96%;
  background-color: #0275d8;
  color: #f8f9fa;
  border-radius: 15px;
  border: none;
}

.measureButtonBlue:hover {
  background: #0161b6;
  border: none;
}

.measureButtonRed {
  margin-left: 2%;
  margin-right: 2%;
  margin-top: 2rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  width: 96%;
  background-color: #e6302b;
  color: #f8f9fa;
  border-radius: 15px;
  border: none;
}

.measureButtonRed:hover {
  background: #d3322c;
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
