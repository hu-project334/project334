<template>
  <nav-bar-top></nav-bar-top>
  <h1 class="title">Info meting</h1>
  <main>
    <div class="info_container">
      <p class="boxTitle">{{ titleText }}</p>
      <img
        id="infoImage"
        class="infoImage"
        src="@/assets/measureImages/underArm1.png"
      />
      <hr class="line" />
      <p>{{ infoBox1 }}</p>
      <p>{{ infoBox2 }}</p>
      <p>{{ infoBox3 }}</p>
      <p>{{ infoBox4 }}</p>

      <div>
        <img
          id="leftArrow"
          class="arrowImageLeft"
          src="@/assets/empty.png"
          @click="previousPanel()"
        />
        <div class="indexText">{{ indexBox }}</div>
        <img
          id="rightArrow"
          class="arrowImageRight"
          src="@/assets/arrowRight.png"
          @click="nextPanel()"
        />
      </div>
    </div>
  </main>

  <button class="connectSensorButton" @click="goToConnectSensor()">
    <b>Koppel sensor</b>
  </button>

  <div style="margin-top: 80px"></div>
  <footer>
    <button class="backBtn" @click="goBackToResults()"><b>Terug</b></button>
  </footer>
</template>

<script>
import { useRoute } from "vue-router";
import NavBarTop from "../components/navbars/NavBarTop.vue";


var textIndex = 1;

export default {
  name: "Measure info",
  components: {
    NavBarTop,
  },

  data() {
    return {
      titleText: "Plaats de sensor",
      indexBox: "1/3",
      infoBox1: "1. Plaats de sensor op de rechter onder arm (zoals afgebeeld)",
      infoBox2: "2. Zorg ervoor dat de sensor stevig vast zit",
      infoBox3: "",
      infoBox4: "",
      route: useRoute(),
      XsenseDotObject: {},
    };
  },
  mounted() {
    this.dynamicPanels();
    
  },

  methods: {
    dynamicPanels() {
       const  object =  this.$store.getters.getXsenseDotObject
      console.log(object)
   
      const category = this.route.params.category;
      if (category === "elleboog-flexie-extensie-rechts") {
        console.log("elleboog-flexie-extensie");
      }
    },

    goBackToResults() {
      
      this.$router.push({ name: "exerciseResults" ,params:{

      }});
    },
    goToConnectSensor() {
      const patientId = this.route.params.name;
      const category = this.route.params.category;
      this.$router.push({ name: "selectSensor" ,params: {name:patientId,category:category}});
    },
    nextPanel() {
      if (textIndex != 3) {
        textIndex += 1;
      }
      if (textIndex == 2) {
        this.indexBox = "2/3";
        document.getElementById("leftArrow").src = "/src/assets/arrowLeft.png";

        // V Moet dynamisch V
        this.titleText = "Beweging van de meting";
        document.getElementById("infoImage").src =
          "/src/assets/measureImages/underArm2.png";

        this.infoBox1 =
          "1. Zorg dat de patiënt zijn/haar arm zo recht mogelijk strekt";
        this.infoBox2 =
          "2. Laat de patiënt zijn/haar arm zo ver mogelijk terug te laten bewegen (zoals weergegeven)";
        this.infoBox3 = "";
        this.infoBox4 = "";
      } else if (textIndex == 3) {
        this.indexBox = "3/3";
        document.getElementById("rightArrow").src = "/src/assets/empty.png";

        // V Moet dynamisch V
        this.titleText = "Start van de meting";
        document.getElementById("infoImage").src =
          "/src/assets/measureImages/startStop.png";

        this.infoBox1 = '1. klik hieronder op "Koppel sensor"';
        this.infoBox2 = "2. koppel een sensor en klik op start";
        this.infoBox3 =
          "3. Zorg ervoor dat de patiënt zijn/haar boven arm zo horizontaal mogelijk  houdt";
        this.infoBox4 =
          "4. Zodra de patiënt zijn/haar top punt  heeft bereikt; druk op stop";
      }
    },
    previousPanel() {
      if (textIndex != 1) {
        textIndex -= 1;
      }
      if (textIndex == 2) {
        this.indexBox = "2/3";
        document.getElementById("rightArrow").src =
          "/src/assets/arrowRight.png";

        // V Moet dynamisch V
        this.titleText = "Beweging van de meting";
        document.getElementById("infoImage").src =
          "/src/assets/measureImages/underArm2.png";

        this.infoBox1 =
          "1. Zorg dat de patiënt zijn/haar arm zo recht mogelijk strekt";
        this.infoBox2 =
          "2. Laat de patiënt zijn/haar arm zo ver mogelijk terug te laten bewegen (zoals weergegeven)";
        this.infoBox3 = "";
        this.infoBox4 = "";
      } else if (textIndex == 1) {
        this.indexBox = "1/3";
        document.getElementById("leftArrow").src = "/src/assets/empty.png";

        // V Moet dynamisch V
        this.titleText = "Plaats de sensor";
        document.getElementById("infoImage").src =
          "/src/assets/measureImages/underArm1.png";

        this.infoBox1 =
          "1. Plaats de sensor op de rechter onder arm (zoals afgebeeld)";
        this.infoBox2 = "2. Zorg ervoor dat de sensor stevig vast zit";
        this.infoBox3 = "";
        this.infoBox4 = "";
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

.boxTitle {
  padding-top: 3%;
  padding-left: 3%;
  font-weight: bold;
  font-size: 1.5em;
}

.indexText {
  font-weight: bold;
  font-size: 1.2em;
  text-align: center;
}

.infoImage {
  max-width: 100%;
  height: auto;
  padding-right: 2em;
  padding-left: 2em;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.arrowImageLeft {
  max-width: 35px;
  height: auto;
  position: absolute;
}

.arrowImageRight {
  max-width: 35px;
  height: auto;
  display: block;
  margin-left: auto;
  margin-right: 10px;
  position: relative;
  margin-top: -28px;
}

.line {
  width: 96%;
  height: 5px;
  background-color: black;
  margin-left: 0px;
}

/* result graph*/
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
