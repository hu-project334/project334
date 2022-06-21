<template>
  <nav-bar-top></nav-bar-top>
  <h1 class="title">Meet categorie toevoegen</h1>

  <!-- MOET DYNAMISC -->

  <div class="categoryBox">
    <div class="textBox">
      <div><b class="categoryTitle">Elleboog flexie &</b></div>
      <div><b class="categoryTitle">extensie links</b></div>
      <div class="categorySubText">1 Xsens sensor vereist</div>
    </div>
    <img
      class="addImage"
      src="@/assets/add.png"
      @click="addSelected('elleboog-flexie-extensie-links')"
    />
  </div>

  <div class="categoryBox">
    <div class="textBox">
      <div><b class="categoryTitle">Elleboog flexie &</b></div>
      <div><b class="categoryTitle">extensie rechts</b></div>
      <div class="categorySubText">1 Xsens sensor vereist</div>
    </div>
    <img
      class="addImage"
      src="@/assets/add.png"
      @click="addSelected('elleboog-flexie-extensie-rechts')"
    />
  </div>

  <div class="categoryBox">
    <div class="textBox">
      <div><b class="categoryTitle">Heup extensie links</b></div>
      <div class="categorySubText">1 Xsens sensor vereist</div>
    </div>
    <img
      class="addImage"
      src="@/assets/add.png"
      @click="addSelected('heup-extensie-links')"
    />
  </div>

  <div class="categoryBox">
    <div class="textBox">
      <div><b class="categoryTitle">Heup extensie rechts</b></div>
      <div class="categorySubText">1 Xsens sensor vereist</div>
    </div>
    <img
      class="addImage"
      src="@/assets/add.png"
      @click="addSelected('heup-extensie-rechts')"
    />
  </div>

  <div class="categoryBox">
    <div class="textBox">
      <div><b class="categoryTitle">Heup flexie links</b></div>
      <div class="categorySubText">1 Xsens sensor vereist</div>
    </div>
    <img
      class="addImage"
      src="@/assets/add.png"
      @click="addSelected('heup-flexie-links')"
    />
  </div>

  <div class="categoryBox">
    <div class="textBox">
      <div><b class="categoryTitle">Heup flexie rechts</b></div>
      <div class="categorySubText">1 Xsens sensor vereist</div>
    </div>
    <img
      class="addImage"
      src="@/assets/add.png"
      @click="addSelected('heup-flexie-rechts')"
    />
  </div>

  <div class="categoryBox">
    <div class="textBox">
      <div><b class="categoryTitle">Knie extensie &</b></div>
      <div><b class="categoryTitle">flexie links</b></div>
      <div class="categorySubText">1 Xsens sensor vereist</div>
    </div>
    <img
      class="addImage"
      src="@/assets/add.png"
      @click="addSelected('knie-extensie-flexie-links')"
    />
  </div>

  <div class="categoryBox">
    <div class="textBox">
      <div><b class="categoryTitle">Knie extensie &</b></div>
      <div><b class="categoryTitle">flexie rechts</b></div>
      <div class="categorySubText">1 Xsens sensor vereist</div>
    </div>
    <img
      class="addImage"
      src="@/assets/add.png"
      @click="addSelected('knie-extensie-flexie-rechts')"
    />
  </div>

  <div class="categoryBox">
    <div class="textBox">
      <div><b class="categoryTitle">Enkel dorsaalflexie</b></div>
      <div><b class="categoryTitle">links</b></div>
      <div class="categorySubText">1 Xsens sensor vereist</div>
    </div>
    <img
      class="addImage"
      src="@/assets/add.png"
      @click="addSelected('enkel-dorsaalflexie-links')"
    />
  </div>

  <div class="categoryBox">
    <div class="textBox">
      <div><b class="categoryTitle">Enkel dorsaalflexie</b></div>
      <div><b class="categoryTitle">rechts</b></div>
      <div class="categorySubText">1 Xsens sensor vereist</div>
    </div>
    <img
      class="addImage"
      src="@/assets/add.png"
      @click="addSelected('enkel-dorsaalflexie-rechts')"
    />
  </div>

  <div class="categoryBox">
    <div class="textBox">
      <div><b class="categoryTitle">Enkel plantairflexie</b></div>
      <div><b class="categoryTitle">links</b></div>
      <div class="categorySubText">1 Xsens sensor vereist</div>
    </div>
    <img
      class="addImage"
      src="@/assets/add.png"
      @click="addSelected('enkel-plantairflexie-links')"
    />
  </div>

  <div class="categoryBox">
    <div class="textBox">
      <div><b class="categoryTitle">Enkel plantairflexie</b></div>
      <div><b class="categoryTitle">rechts</b></div>
      <div class="categorySubText">1 Xsens sensor vereist</div>
    </div>
    <img
      class="addImage"
      src="@/assets/add.png"
      @click="addSelected('enkel-plantairflexie-rechts')"
    />
  </div>

  <div class="categoryBox">
    <div class="textBox">
      <div><b class="categoryTitle">Shouder flexie links</b></div>
      <div class="categorySubText">1 Xsens sensor vereist</div>
    </div>
    <img
      class="addImage"
      src="@/assets/add.png"
      @click="addSelected('shouder-flexie-links')"
    />
  </div>

  <div class="categoryBox">
    <div class="textBox">
      <div><b class="categoryTitle">Shouder flexie rechts</b></div>
      <div class="categorySubText">1 Xsens sensor vereist</div>
    </div>
    <img
      class="addImage"
      src="@/assets/add.png"
      @click="addSelected('shouder-flexie-rechts')"
    />
  </div>

  <div class="categoryBox">
    <div class="textBox">
      <div><b class="categoryTitle">Elleboog pronatie</b></div>
      <div><b class="categoryTitle">links</b></div>
      <div class="categorySubText">1 Xsens sensor vereist</div>
    </div>
    <img
      class="addImage"
      src="@/assets/add.png"
      @click="addSelected('elleboog-pronatie-links')"
    />
  </div>

  <div class="categoryBox">
    <div class="textBox">
      <div><b class="categoryTitle">Elleboog pronatie</b></div>
      <div><b class="categoryTitle">rechts</b></div>
      <div class="categorySubText">1 Xsens sensor vereist</div>
    </div>
    <img
      class="addImage"
      src="@/assets/add.png"
      @click="addSelected('elleboog-pronatie-rechts')"
    />
  </div>

  <div class="categoryBox">
    <div class="textBox">
      <div><b class="categoryTitle">Elleboog supinatie</b></div>
      <div><b class="categoryTitle">links</b></div>
      <div class="categorySubText">1 Xsens sensor vereist</div>
    </div>
    <img
      class="addImage"
      src="@/assets/add.png"
      @click="addSelected('elleboog-supinatie-links')"
    />
  </div>

  <div class="categoryBox">
    <div class="textBox">
      <div><b class="categoryTitle">Elleboog supinatie</b></div>
      <div><b class="categoryTitle">rechts</b></div>
      <div class="categorySubText">1 Xsens sensor vereist</div>
    </div>
    <img
      class="addImage"
      src="@/assets/add.png"
      @click="addSelected('elleboog-supinatie-rechts')"
    />
  </div>

  <!-- EINDE MOET DYNAMISC -->
  <div style="margin-top: 80px"></div>
  <footer>
    <button class="backBtn" @click="goBackToPatient()"><b>Terug</b></button>
  </footer>
</template>

<script>
import NavBarTop from "../components/navbars/NavBarTop.vue";
import { addCategorie } from "../db/fdb";
import { useRoute } from "vue-router";

export default {
  name: "Select Sensor",
  components: {
    NavBarTop,
  },
  data() {
    return {
      route: useRoute(),
    };
  },

  methods: {
    goBackToPatient() {
      this.$router.push({ name: "patient" });
    },

    addSelected(type) {
      let docIdPatient = this.route.params.name;
      console.log(type);
      addCategorie(docIdPatient, type);
    },
  },
};
</script>

<style scoped>
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

.addImage {
  margin-top: 5px;
  margin-bottom: 5px;
  max-width: auto;
  height: 80px;
  display: block;
  margin-left: auto;
  margin-right: 5px;
}

.categoryBox {
  cursor: pointer;
  background: white;

  margin-right: 5%;
  margin-left: 5%;
  margin-bottom: 2%;
  width: 90%;
  padding: 0em;
  border: 1px solid white;
  color: white;
  border-radius: 1em;
  display: flex;
  flex-wrap: wrap;
}

.textBox {
  margin: 15px;
}

.categoryTitle {
  color: black;
  font-size: 1.5em;
  display: inline;
}

.categorySubText {
  color: black;
  margin-bottom: 0px;
  display: inline;
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

/* footer */

footer {
  display: flex;
  position: fixed;
  bottom: -1px;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  padding-top: 1rem;
  padding-bottom: 1rem;
  width: 100%;
  background-color: #f4f4f4;
}
</style>
