<template>
  <NavBarTop></NavBarTop>

  <!-- //! is not dynamic yet -->
  <h1 class="title">Meet</h1>
  <!-- //! graph has to be installed and used -->
  <div class="info_container">
    <b>Meet resultaten</b>
    <table>
      <tr>
        <td class="header_name"><b class="table_content" >Tijd (m:s:ms) </b></td>
        <td>
          <span id="minutes">{{minutes}}:</span>
          <span id="seconds">{{seconds}}:</span>
          <span id="milliseconds">{{miliseconds}}</span>
        </td>
      </tr>
      <tr>
        <td class="header_name"><b>Beweging (graden) </b></td>
        <td> {{ maxAngle }}° </td>
      </tr>
      <tr>
        <td class="header_name"><b>Procent van de norm </b></td>
        <td>{{norm}}%</td>
      </tr>
    </table>

    <button
        class="measureButtonBlue"
        @click="measure()"
        id="button1"
      ><b>{{button1text}}</b>
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
import { XsensDotSensor } from "/src/libraries/bluetooth.js";
import { addResultToCategory } from "../db/fdb";
import { useRoute } from "vue-router";
import jsonMovementData from "/src/libraries/movement_data.json"
import { getUnixOfToday } from "../controllers/unix.js";

var measureState = "idle";
var timer;

export default {
  name: "Select Sensor",
  components: {
    NavBarTop,
  },

  data() {
    return{
      miliseconds: 0,
      seconds: 0,
      minutes: 0,
      maxAngle: 0.00,
      route: useRoute(),
      button1text: "Start meting",
      norm: 0.00
    }
  },
  methods: {
    async saveMeasurement(){
      if(!this.maxAngle == 0){
        console.log("Unix: " + getUnixOfToday())
        let docIdPatient = this.route.params.name;
        let docIdCategory = this.route.params.category;
        await addResultToCategory(docIdPatient, docIdCategory, this.maxAngle, this.norm);
        this.$router.push({ name: "exerciseResults" ,params:{}});
      }
    },
    deleteMeasurement(){
      this.$router.push({ name: "exerciseResults" ,params:{}});
    },
    goBackToSelect() {
      clearInterval(timer);
      this.$router.push({ name: "selectSensor" });
    },

    //bron: https://dev.to/walternascimentobarroso/creating-a-timer-with-javascript-8b7
    updateTimer() {
      if ((this.miliseconds += 10) == 1000) {
        this.miliseconds = 0;
        this.seconds++;
      }
      if (this.seconds == 60) {
        this.seconds = 0;
        this.minutes++;
      }
    },

    async measure() {
      if(XsensDotSensor.device == null){
        console.log("No device connected")
      }
      if(measureState == "idle") {
        XsensDotSensor.startRTStream();

        document.getElementById("button1").classList.toggle('measureButtonBlue');
        document.getElementById("button1").classList.toggle('measureButtonRed');
        this.button1text = "Stop meting";

        clearInterval(timer);
        timer = setInterval(() => { this.updateTimer(); }, 10);

        measureState = "measuring";
      }
      else if(measureState == "measuring"){
        document.getElementById("button1").classList.toggle('measureButtonBlue');
        document.getElementById("button1").classList.toggle('measureButtonRed');
        this.button1text = "Begin opnieuw";

        document.getElementById("button2").style = ('margin-top: 0.5rem; display: inline');
        document.getElementById("button3").style = ('margin-top: 0.5rem; display: inline');

        clearInterval(timer);
        measureState = "results";

        await XsensDotSensor.stopRTStream();

        const category = this.route.params.category;
        let TMPnorm = 0
        let age = this.$store.state.age;
        let gender = this.$store.state.gender;

        if(age <= 8) {
          age = "2-8"
        } else if (age <= 19) {
          age = "9-19"
        } else if(age <= 44) {
          age = "20-44"
        } else {
          age = "45+"
        }

        if (category === "elleboog-flexie-extensie-rechts" || category === "elleboog-flexie-extensie-links") {
          TMPnorm = jsonMovementData["elleboog-flexie-extensie"][gender][age]
        }
        else if (category === "heup-extensie-links" || category === "heup-extensie-rechts") {
          TMPnorm = jsonMovementData["heup-extensie"][gender][age]
        }
        else if (category === "heup-flexie-links" || category === "heup-flexie-rechts") {
          TMPnorm = jsonMovementData["heup-flexie"][gender][age]
        }
        else if (category === "knie-extensie-flexie-links" || category === "knie-extensie-flexie-rechts") {
          TMPnorm = jsonMovementData["knie-extensie-flexie"][gender][age]
        }
        else if (category === "enkel-dorsaalflexie-links" || category === "enkel-dorsaalflexie-rechts") {
          TMPnorm = jsonMovementData["enkel-dorsaalflexie"][gender][age]
        }
        else if (category === "enkel-plantairflexie-links" || category === "enkel-plantairflexie-rechts") {
          TMPnorm = jsonMovementData["enkel-plantairflexie"][gender][age]
        }
        else if (category === "shouder-flexie-links" || category === "shouder-flexie-rechts") {
          TMPnorm = jsonMovementData["shouder-flexie"][gender][age]
        }
        else if (category === "elleboog-pronatie-links" || category === "elleboog-pronatie-rechts") {
          TMPnorm = jsonMovementData["elleboog-pronatie"][gender][age]
        }
        else if (category === "elleboog-supinatie-links" || category === "elleboog-supinatie-rechts") {
          TMPnorm = jsonMovementData["elleboog-supinatie"][gender][age]
        }
        
        this.maxAngle = XsensDotSensor.max_angle;
        this.norm = ((this.maxAngle / TMPnorm ) * 100).toFixed(2);
      }
      else if(measureState == "results"){
        document.getElementById("button2").style = ('margin-top: 0.5rem; display: none');
        document.getElementById("button3").style = ('margin-top: 0.5rem; display: none');
        this.button1text = "Start meting";

        this.miliseconds  = 0;
        this.seconds      = 0;
        this.minutes      = 0;
        clearInterval(timer);

        this.maxAngle = 0.00;
        this.norm = 0.00;
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
tr td {
  border: 2px solid #00a1e1;
  padding-left: 1%;
  margin-right: 100px;
}
table {
  table-layout: fixed;
  width: 98%;
  margin-right: 2%;
}
.header_name {
  padding-left: 1%;
  width: 40%;
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
  margin-left: 1%;
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
  margin-left: 1%;
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
