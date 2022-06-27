<template>
  <div :style="blurrStyle()">
    <NavBarTop></NavBarTop>

    <h1 class="title">{{ name }}</h1>

    <div class="info_container">
      <b>Patiënt gegevens</b>
      <table>
        <tr>
          <td class="header_name"><b class="table_content">Naam </b></td>
          <td>
            <div class="table_data">{{ name }}</div>
          </td>
        </tr>
        <tr>
          <td class="header_name"><b>E-mail</b></td>
          <td>
            <div class="table_data">{{ email }}</div>
          </td>
        </tr>
        <tr>
          <td class="header_name"><b>Gewicht</b></td>
          <td>
            <div class="table_data">{{ weight }} kg</div>
          </td>
        </tr>
        <tr>
          <td class="header_name"><b>Lengte</b></td>
          <td>
            <div class="table_data">{{ heightInM }} m</div>
          </td>
        </tr>
        <tr>
          <td class="header_name"><b>leeftijd </b></td>
          <td>
            <div class="table_data">{{ age }} jaar</div>
          </td>
        </tr>
      </table>
      <button class="editButton" @click="showEditForm">
        <b>Gegevens aanpassen</b>
      </button>
    </div>

    <template v-for="[name] in categories" :key="docKeyCategory">
      <div class="category">
        <div class="text-holder">
          <p>
            <div style="max-width: 100%; word-break: break-word;"><b>{{ name }}</b></div>
          </p>
          <!-- <p>Laatste meting: {{ category.lastMeasure }}</p> -->
        </div>
        <!-- TOO set param for patient -> category -> results -->
        <button class="see-results" @click="goToExerciseResults(name)">
          Bekijk
        </button>
      </div>
    </template>

    <button class="deletePatientBtn" @click="showDeleteForm">
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
  </div>
  <DeleteForm
    @close="closeForm"
    @delete="deletePatientWithFireStore"
    v-if="showFormDelete && !showFormEdit"
  ></DeleteForm>
  <EditForm
    @close="closeForm"
    @edit="editPatient"
    v-if="showFormEdit && !showFormDelete"
  ></EditForm>
</template>

<script>
import NavBarTop from "../components/navbars/NavBarTop.vue";
import _ from "lodash";
import LinkButton from "../components/btns/LinkButton.vue";
import { formatBirthDateToAge } from "../Controllers/AgeCalculatorController.js";
import { getSinglePatient, deletePatient, getCategories } from "../db/fdb";
import { useRoute } from "vue-router";
import DeleteForm from "../components/forms/DeleteForm.vue";
import EditForm from "../components/forms/EditPatientForm.vue";



export default {
  name: "patients",
  components: {
    NavBarTop,
    LinkButton,
    DeleteForm,
    EditForm,
  },
  data() {
    return {
      name: "",
      weight: null,
      age: "",
      heightInM: null,
      patients: null,
      categories: null,
      showFormDelete: false,
      showFormEdit: false,
      gender: "",
      email: "",
      fysio: this.$store.getters.getUser.uid,
      route: useRoute(),
      patientID: null,
    };
  },

  mounted() {
    this.getPatientData();
    this.getCategories();
    console.log(this.categories);
  },

  methods: {
    async getCategories() {
      const docIdPatient = this.route.params.name;
      console.log(docIdPatient);
      let categories = await getCategories(docIdPatient);
      this.categories = categories;
      console.log(this.categories);
    },
    async getPatientData() {
      
      const docKey = this.route.params.name;
      let patient = await getSinglePatient(docKey);
      this.$store.commit("setPatientGender",patient.gender);
      this.$store.commit("setPatientAge", formatBirthDateToAge(patient.dateOfBirth))
      this.name = patient.name;
      this.weight = patient.weight;
      this.age = formatBirthDateToAge(patient.dateOfBirth);
      this.heightInM = patient.heightInM;
      this.email = patient.email;
      this.gender = patient.gender;
    },
    deletePatientWithFireStore() {
      let docKey = this.route.params.name;
      deletePatient(docKey);
      this.$router.push({ name: "patients" });
    },
    goBackToPatientList() {
      this.$router.push({ name: "patients" });
    },
    goToExerciseResults(category) {
      let docKey = this.route.params.name;
      this.$router.push({
        name: "exerciseResults",
        params: { name: docKey, category: category },
      });
    },

    goToCategory() {
      const name = this.route.params.name;
      this.$router.push({
        name: "addCategorie",
        params: { name: name },
      });
    },
    blurrStyle() {
      if (this.showFormDelete | this.showFormEdit) {
        let style = "filter: blur(24px); opacity: 0.6;";
        return style;
      } else {
        return "";
      }
    },
    showDeleteForm(event) {
      event.stopPropagation();
      this.showFormDelete = true;
    },
    showEditForm(event) {
      event.stopPropagation();
      this.showFormEdit = true;
    },
    closeForm() {
      this.showFormDelete = false;
      this.showFormEdit = false;
      this.errorMessage = "";
      return;
    },
    editPatient() {
      this.closeForm();
      // TODO Edit de patient's gegevens
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

/* patient data */

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
  width: 110px;
}
.table_content {
  margin-right: 70px;
}

.table_data {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
  margin-bottom: 3rem;
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

.editButton {
  background-color: #0275d8;
  border-radius: 10px;
  color: #f8f9fa;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  border: none;
  margin-top: 1rem;
  margin-left: 0%;
  width: 98%;
  margin-right: 2%;
}

.editButton:hover {
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
  background-color: #f4f4f4;
}
</style>
