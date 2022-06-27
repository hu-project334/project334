<template>
  <div :style="blurrStyle()">
    <NavBarTop></NavBarTop>

    <h1 class="title">Patiënten</h1>


    <main>
      <template v-for="[docKey, patient] in patients" :key="patient">
        <div class="patient">
          <i class="bi bi-person-square userIcon"></i>
          <div class="patient-text-holder">
            <p>
              <b>{{ patient.name }} </b>
            </p>
            <p class="text" style="word-break: break-word;">{{ patient.email }}</p>
          </div>
          <button class="seeResultsButton" @click="goToPatient(docKey)">
            <b> Ga naar patiënt</b>
          </button>
        </div>
      </template>
    </main>

    <div style="margin-top: 80px"></div>
    <footer>
      <button class="seeResultsButton" @click="showPatientForm">
        <b>Patiënt toevoegen</b>
      </button>
    </footer>
  </div>
  <PatientForm
    @send="registerWithEmail"
    @close="closeForm"
    v-if="showForm && !showLoginForm"
  ></PatientForm>
</template>

<script>
import NavBarTop from "../components/navbars/NavBarTop.vue";
import IconButton from "../components/btns/IconButton.vue";
import _ from "lodash";
import LinkParamButton from "../components/btns/LinkParamButton.vue";
import LinkButton from "../components/btns/LinkButton.vue";
import { getPatients } from "../db/fdb";
import PatientForm from "../components/forms/PatientCreatorForm.vue";

export default {
  name: "patients",
  components: {
    NavBarTop,
    IconButton,
    LinkParamButton,
    PatientForm,
    LinkButton,
  },
  data() {
    return {
      showForm: false,
      user: null,
      showLoginForm: false,
      patients: null,
      newPatientForm: false,
    };
  },
  mounted() {
    this.getPatientsFromFireStore();
  },
  methods: {
    async getPatientsFromFireStore() {
      let uid = this.$store.getters.getUser.uid;

      await getPatients(uid).then((results) => {
        this.patients = results;
      });
    },
    goToPatient(docKey) {
      this.$router.push({
        name: "patient",
        params: { name: docKey },
      });
    },
    showPatientForm(event) {
      event.stopPropagation();
      this.showForm = true;
    },
    blurrStyle() {
      if (this.showForm) {
        let style = "filter: blur(24px); opacity: 0.6;";
        return style;
      } else {
        return "";
      }
    },
    closeForm() {
      this.showForm = false;
      this.showLoginForm = false;
      this.errorMessage = "";
      this.getPatientsFromFireStore(); // Show newly added patients
      return;
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
  margin-bottom: 2%;
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
  position: fixed;
  bottom: 0;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  padding-top: 1rem;
  padding-bottom: 1rem;
  width: 100%;
  background-color: #f4f4f4;
}

.userIcon {
  font-size: 4rem;
  color: #0275d8;
}
</style>
