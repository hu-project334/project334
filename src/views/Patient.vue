<template>
  <NavBarTop></NavBarTop>

  <h1 class="title">{{ name }}</h1>

  <div class="container">
    <b>Patiënt gegevens</b>
    <table>
      <tr>
        <td class="header_name"><b class="table_content">Naam </b></td>
        <td>{{ name }}</td>
      </tr>
      <tr>
        <td class="header_name"><b>Gewicht </b></td>
        <td>{{ weight }}</td>
      </tr>
      <tr>
        <td class="header_name"><b>Lengte </b></td>
        <td>{{ heightInM }}</td>
      </tr>
      <tr>
        <td class="header_name"><b>leeftijd </b></td>
        <td>{{ age }}</td>
      </tr>
      <tr>
        <td class="header_name"><b> Email</b></td>
        <td>{{ email }}</td>
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

  <button
    class="deletePatientBtn"
    @click="deletePatientWithFireStore(this.email)"
  >
    <b>Verwijder patiënt</b>
  </button>

  <div style="margin-top: 80px"></div>
  <footer>
    <button class="backBtn" @click="goBackToPatientList()">
      <b>Terug</b>
    </button>
    <button class="addCategory" @click="goToCategory()">
      <b>Categorie toevoegen</b>
    </button>
  </footer>
</template>

<script>
import NavBarTop from "../components/navbars/NavBarTop.vue";
import _ from "lodash";
import categories from "../db/exerciseCategories.json";
import LinkButton from "../components/btns/LinkButton.vue";
import { formatBirthDateToAge } from "../Controllers/AgeCalculatorController.js";
import { getSinglePatient, deletePatient } from "../db/fdb";
import { deleteWhiteSpaceFromString } from "../Controllers/StringChanger";

export default {
  name: "patients",
  components: {
    NavBarTop,
    LinkButton,
  },
  data() {
    return {
      name: "",
      weight: null,
      age: "",
      heightInM: null,
      patients: null,
      categories: null,
      gender: "",
      email: "",
      fysio: this.$store.getters.getUser.uid,
    };
  },

  mounted() {
    this.getPatientData();
    this.categories = categories;
  },

  methods: {
    async getPatientData() {
      let email = this.$store.getters.getPatientEmail;
      let uid = this.$store.getters.getUser.uid;

      let patient = await getSinglePatient(email, uid).then((patient) => {
        return patient;
      });

      this.name = patient.name;
      this.weight = patient.weight;
      this.age = formatBirthDateToAge(patient.dateOfBirth);
      this.heightInM = patient.heightInM;
      this.email = patient.email;
      this.gender = patient.gender;
    },
    deletePatientWithFireStore(email) {
      deletePatient(email, this.fysio);
      this.$router.push({ name: "patients" });
    },
    goBackToPatientList() {
      this.$router.push({ name: "patients" });
    },
    goToExerciseResults(category) {
      let naam = deleteWhiteSpaceFromString(this.name);
      this.$router.push({
        name: "exerciseResults",
        params: { name: naam },
      });
    },

    goToCategory(category) {
      //! fix params
      this.$router.push({ name: "addCategorie" });
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
p {
  margin: 0;
}

/* patient data */
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
.table_content {
  margin-right: 100px;
}

/* list of categories */
.category {
  cursor: pointer;
  background: white;
  margin-right: 1%;
  margin-left: 5%;
  margin-bottom: 1%;
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
.see-results:hover {
  background: #0161b6;
  border: none;
}

.deletePatientBtn {
  margin-left: 5%;
  width: 90%;
  margin-right: 5%;
  padding: 0.5rem;
  background-color: #e6302b;
  margin-top: 1rem;
  margin-bottom: 1rem;
  color: white;
  border: none;
}

.deletePatientBtn:hover {
  background: #d3322c;
  border: none;
}

.addCategory {
  width: 70%;
  background-color: #0275d8;
  border-radius: 10px;
  color: #f8f9fa;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  border: none;
}

.addCategory:hover {
  background: #0161b6;
  border: none;
}

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
  bottom: 0;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  padding-top: 1rem;
  padding-bottom: 1rem;
  width: 100%;
  background-color: #f8f9fa;
}
</style>
