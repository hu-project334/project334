<template>
  <NavBarTop></NavBarTop>

  <h1 class="title">Patiënten</h1>

  <main>
    <template v-for="patient in patients" :key="patient">
      <div class="patient">
        <i class="bi bi-person-square userIcon"></i>
        <div class="patient-text-holder">
          <p>
            <b>{{ patient.name }} {{ patient.surName }}</b>
          </p>
          <p class="text">{{ patient.email }}</p>
        </div>
        <button class="seeResultsButton" @click="goToPatient(patient.id)">
          <b> Ga naar patiënt</b>
        </button>
      </div>
    </template>
  </main>

  <footer>
    <button class="seeResultsButton" @click="addNewPatient()">
      <b>Patiënt toevoegen</b>
    </button>
  </footer>
</template>

<script>
import NavBarTop from "../components/navbars/NavBarTop.vue";
import IconButton from "../components/btns/IconButton.vue";
import _ from "lodash";
import LinkParamButton from "../components/btns/LinkParamButton.vue";
import LinkButton from "../components/btns/LinkButton.vue";

// json file;
import patients from "../db/patients.json";

export default {
  name: "patients",
  components: {
    NavBarTop,
    IconButton,
    LinkParamButton,
    LinkButton,
  },
  data() {
    return {
      patients: null,
      newPatientForm: false,
    };
  },
  mounted() {
    this.patients = patients;
  },
  methods: {
    goToPatient(id) {
      this.$router.push({ name: "patient", params: { id: id } });
    },

    addNewPatient() {
      this.$router.push({ name: "patientCreator" });
    },
  },
};
</script>

<style scoped>
.title {
  color: white;
  margin-bottom: 3%;
  margin-top: 3%;
  margin-right: 25%;
  margin-left: 25%;
  font-size: 3em;
  width: 50%;
  text-align: center;
}
p {
  margin: 0;
  color: black;
}
.patient {
  cursor: pointer;
  background: white;

  margin-right: 5%;
  margin-left: 5%;
  margin-bottom: 3%;
  width: 90%;
  padding: 1em;
  border: 1px solid white;
  color: white;
  border-radius: 1em;
  display: flex;
  flex-wrap: wrap;
}

.patient-text-holder {
  margin: 20px;
}

.icons {
  font-size: 4em;
}
.seeResultsButton {
  flex: 0 0 100%;
  border: none;
  background: #0275d8;
  color: white;
  border: none;
  padding: 0.5em;
  transition: all 0.2s ease-in-out;
  border-radius: 10px;
}

.seeResultsButton:focus,
.seeResultsButton:focus-within,
.seeResultsButton:hover {
  background: #0161b6;
  border: none;
}

/*Any Mobile Device*/
@media only screen and (max-width: 500px) {
  .text {
    padding: 0;
    font-size: 0.8em;
  }
}
@media only screen and (max-width: 767px) and (min-width: 500px) {
  .text {
    padding: 0;
    font-size: 0.8em;
  }
}
/* everything in between */
@media only screen and (max-width: 1281px) and (min-width: 767px) {
  .text {
    padding: 0;
    font-size: 1.3em;
  }
}

/* desktops */
@media (min-width: 1281px) {
  .text {
    padding: 0;
    font-size: 1.3em;
  }
}

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

.userIcon {
  font-size: 4rem;
  color: #0275d8;
}
</style>
