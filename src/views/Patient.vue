<template>
  <NavBarTop></NavBarTop>
  <h1 class="title">Patient</h1>

  <div class="container">
    <b>Patient gegevens</b>
    <table>
      <tr>
        <td class="header_name"><b>Naam </b></td>
        <td>{{ name }} {{ surName }}</td>
      </tr>
      <tr>
        <td class="header_name"><b>Gewicht </b></td>
        <td>{{ weight }}</td>
      </tr>
      <tr>
        <td class="header_name"><b>Lengte </b></td>
        <td class="header_name">{{ heightInM }}</td>
      </tr>
      <tr>
        <td class="header_name"><b>leeftijd </b></td>
        <td>{{ age }}</td>
      </tr>
      <tr>
        <td class="header_name"><b>Patientnummer</b></td>
        <td>{{ patientID }}</td>
      </tr>
    </table>
  </div>

  <template v-for="category in categories" :key="category">
    <div class="category">
      <div class="text-holder">
        <p>
          <b>{{ category.category }} </b>
        </p>
        <p>Laatste meting: {{ category.lastMeasure }}</p>
      </div>
      <!-- TOO set param for patient -> category -> results -->
      <button
        class="see-results"
        @click="goToExerciseResults(category.category)"
      >
        Bekijk
      </button>
    </div>
  </template>

  <button class="deletePatientBtn" @click="deletePatient(patientID)">
    <b>Verwijder patient</b>
  </button>

  <footer>
    <button class="backBtn" @click="goBackToPatientList()"><b>Terug</b></button>
    <button class="addCategory"><b>Categorie toevoegen</b></button>
  </footer>
</template>

<script>
import NavBarTop from "../components/navbars/NavBarTop.vue";
import _ from "lodash";
import patients from "../db/patients.json";
import categories from "../db/exerciseCategories.json";
import LinkButton from "../components/btns/LinkButton.vue";
import { formatBirthDateToAge } from "../Controllers/AgeCalculatorController.js";

export default {
  name: "patients",
  components: {
    NavBarTop,
    LinkButton,
  },
  data() {
    return {
      patientID: null,
      name: "",
      surName: "",
      weight: null,
      age: "",
      heightInM: null,
      patients: null,
      categories: null,
    };
  },

  mounted() {
    this.categories = categories;
    this.patients = patients;
    this.patientID = this.$route.params.id;
    this.getPatientData();
  },

  methods: {
    getPatientData() {
      let id = parseInt(this.patientID);
      let patient = _.find(this.patients, { id: id });
      console.log(patient);
      this.name = patient.name;
      this.surName = patient.surName;
      this.weight = patient.weight;
      this.age = formatBirthDateToAge(patient.dateOfBirth);
      this.heightInM = patient.heightInM;
    },
    deletePatient(id) {
      let index = _.findIndex(this.patients, { id: id });
      this.patients.splice(index, 1);
      // in database this should delete the patient
      this.$router.push({ name: "patients" });
    },
    goBackToPatientList() {
      this.$router.push({ name: "patients" });
    },
    goToExerciseResults(category) {
      //! fix params
      console.log(category);
      this.$router.push({ name: "exerciseResults" });
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
}

/* patient data */
.container {
  margin-top: 1%;
  height: 50%;
  background: white;
  width: 90%;
  border-radius: 15px;
  padding-bottom: 1rem;
  margin-bottom: 2rem;
}
tr td {
  border: 2px solid #00a1e1;
  width: 100%;
}
.header_name {
  width: 20%;
}

/* list of categorys */
.category {
  cursor: pointer;
  background: white;
  margin-right: 5%;
  margin-left: 5%;
  margin-bottom: 3%;
  width: 90%;
  padding: 1em;
  border: 1px solid white;
  border-radius: 1em;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.text-holder {
  display: block;
}
/* buttons */
.see-results {
  background-color: #0275d8;
  color: white;
  font-weight: bold;
  border-radius: 15px;
  border: none;
  padding: 1rem;
}
.deletePatientBtn {
  margin-left: 5%;
  width: 90%;
  margin-right: 5%;
  padding: 0.5rem;
  border-radius: 15px;
  background-color: #e6302b;
  margin-bottom: 3rem;
  color: white;
}

.addCategory {
  width: 70%;
  background-color: #0275d8;
  border-radius: 10px;
  color: #f8f9fa;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.backBtn {
  width: 30%;
  background-color: #e6302b;
  border-radius: 10px;
  color: #f8f9fa;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

/* footer */

footer {
  position: sticky;
  bottom: 0;
  background-color: #f8f9fa;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  padding-top: 1rem;
  padding-bottom: 1rem;
}
</style>
