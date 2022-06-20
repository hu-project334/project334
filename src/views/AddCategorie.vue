<template>
    <nav-bar-top></nav-bar-top>
    <h1 class="title">Meet categorie toevoegen</h1>

    <!-- MOET DYNAMISC -->

    <div class="categoryBox">
        <div class="textBox">
            <div><b class="categoryTitle">Linker onder arm</b></div>
            <div class="categorySubText">1 Xsens sensor vereist</div>
        </div>
        <img class="addImage" src="@/assets/add.png"  @click="addSelected()"/>
    </div>

    <div class="categoryBox">
        <div class="textBox">
            <div><b class="categoryTitle">Rechter onder arm</b></div>
            <div class="categorySubText">1 Xsens sensor vereist</div>
        </div>
        <img class="addImage" src="@/assets/add.png"  @click="addSelected()"/>
    </div>

    <div class="categoryBox">
        <div class="textBox">
            <div><b class="categoryTitle">Linker boven arm</b></div>
            <div class="categorySubText">1 Xsens sensor vereist</div>
        </div>
        <img class="addImage" src="@/assets/add.png"  @click="addSelected()"/>
    </div>

    <div class="categoryBox">
        <div class="textBox">
            <div><b class="categoryTitle">Rechter boven arm</b></div>
            <div class="categorySubText">1 Xsens sensor vereist</div>
        </div>
        <img class="addImage" src="@/assets/add.png"  @click="addSelected()"/>
    </div>

    <div class="categoryBox">
        <div class="textBox">
            <div><b class="categoryTitle">Linker onder been</b></div>
            <div class="categorySubText">1 Xsens sensor vereist</div>
        </div>
        <img class="addImage" src="@/assets/add.png"  @click="addSelected()"/>
    </div>

    <div class="categoryBox">
        <div class="textBox">
            <div><b class="categoryTitle">Rechter onder been</b></div>
            <div class="categorySubText">1 Xsens sensor vereist</div>
        </div>
        <img class="addImage" src="@/assets/add.png"  @click="addSelected()"/>
    </div>

    <div class="categoryBox">
        <div class="textBox">
            <div><b class="categoryTitle">Linker boven been</b></div>
            <div class="categorySubText">1 Xsens sensor vereist</div>
        </div>
        <img class="addImage" src="@/assets/add.png"  @click="addSelected()"/>
    </div>

    <div class="categoryBox">
        <div class="textBox">
            <div><b class="categoryTitle">Rechter boven been</b></div>
            <div class="categorySubText">1 Xsens sensor vereist</div>
        </div>
        <img class="addImage" src="@/assets/add.png"  @click="addSelected()"/>
    </div>

    <div class="categoryBox">
        <div class="textBox">
            <div><b class="categoryTitle">Hoofd links/rechts</b></div>
            <div class="categorySubText">1 Xsens sensor vereist</div>
        </div>
        <img class="addImage" src="@/assets/add.png"  @click="addSelected()"/>
    </div>

    <div class="categoryBox">
        <div class="textBox">
            <div><b class="categoryTitle">Hoofd voor/achter</b></div>
            <div class="categorySubText">1 Xsens sensor vereist</div>
        </div>
        <img class="addImage" src="@/assets/add.png"  @click="addSelected()"/>
    </div>

    <div class="categoryBox">
        <div class="textBox">
            <div><b class="categoryTitle">Linker hand</b></div>
            <div><b class="categoryTitle">links/rechts</b></div>
            <div class="categorySubText">1 Xsens sensor vereist</div>
        </div>
        <img class="addImage" src="@/assets/add.png"  @click="addSelected()"/>
    </div>

    <div class="categoryBox">
        <div class="textBox">
            <div><b class="categoryTitle">Linker hand</b></div>
            <div><b class="categoryTitle">benenden/boven</b></div>
            <div class="categorySubText">1 Xsens sensor vereist</div>
        </div>
        <img class="addImage" src="@/assets/add.png"  @click="addSelected()"/>
    </div>

    <div class="categoryBox">
        <div class="textBox">
            <div><b class="categoryTitle">Rechter hand</b></div>
            <div><b class="categoryTitle">links/rechts</b></div>
            <div class="categorySubText">1 Xsens sensor vereist</div>
        </div>
        <img class="addImage" src="@/assets/add.png"  @click="addSelected()"/>
    </div>

    <div class="categoryBox">
        <div class="textBox">
            <div><b class="categoryTitle">Rechter hand</b></div>
            <div><b class="categoryTitle">benenden/boven</b></div>
            <div class="categorySubText">1 Xsens sensor vereist</div>
        </div>
        <img class="addImage" src="@/assets/add.png"  @click="addSelected()"/>
    </div>

    <div class="categoryBox">
        <div class="textBox">
            <div><b class="categoryTitle">Linker voet</b></div>
            <div><b class="categoryTitle">voor/achter</b></div>
            <div class="categorySubText">1 Xsens sensor vereist</div>
        </div>
        <img class="addImage" src="@/assets/add.png"  @click="addSelected()"/>
    </div>

    <div class="categoryBox">
        <div class="textBox">
            <div><b class="categoryTitle">Rechter voet</b></div>
            <div><b class="categoryTitle">voor/achter</b></div>
            <div class="categorySubText">1 Xsens sensor vereist</div>
        </div>
        <img class="addImage" src="@/assets/add.png"  @click="addSelected()"/>
    </div>

    <div class="categoryBox" >
        <div class="textBox">
            <div><b class="categoryTitle">Rug voor/achter</b></div>
            <div class="categorySubText">1 Xsens sensor vereist</div>
        </div>
        <img class="addImage" src="@/assets/add.png"  @click="addSelected()"/>
    </div>


    <!-- EINDE MOET DYNAMISC -->
    <div style="margin-top: 80px;"></div>
    <footer>
        <button class="backBtn" @click="goBackToPatient()"><b>Terug</b></button>
    </footer>
</template>

<script>
import NavBarTop from "../components/navbars/NavBarTop.vue";

export default {
  name: "Select Sensor",
  components: {
    NavBarTop,
  },

  methods: {
    goBackToPatient() {
      this.$router.push({ name: "patient" });
    },

    addSelected() {

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
  background-color: #f8f9fa;
  border-top:1px solid black;
}
</style>
