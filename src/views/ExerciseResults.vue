<template>
  <div :style="blurrStyle()">
    <nav-bar-top></nav-bar-top>

    <!-- //! is not dynamic yet -->
    <h1 class="title">Rechter onder arm</h1>
    <!-- //! graph has to be installed and used -->
    <main>
      <div class="result_container">
        <b>Meest recente metingen </b>
        <movement-percentage-in-time
          :dataProp="graphResults"
        ></movement-percentage-in-time>
      </div>

      <div class="recent_results">
        <b>Recente resultaten in vergelijking tot de norm</b>
        <table>
          <tr>
            <th>Datum</th>
            <th>Beweging (graden)</th>
            <th>Vergeleken tot de norm i (%)</th>
          </tr>
          <template v-for="result in results" :key="result">
            <tr>
              <!-- //! not dynamic yet firestore is needed -->
              <td>{{ result.date }}</td>
              <td>{{ result.MovementInDegree }}</td>
              <td>{{ result.comparedToNorm }}</td>
            </tr>
          </template>
        </table>
      </div>
    </main>

    <button class="delete_categoryBtn" @click="showDeleteForm">
      <b>Verwijder categorie</b>
    </button>

    <div style="margin-top: 80px;"></div>
    <footer>
      <button class="backBtn" @click="goBackToPatient()"><b>Terug</b></button>
      <button class="addMeasurement" @click="addMeasurement()">
        <b>Niewe meting</b>
      </button>
    </footer>
  </div>
  <DeleteForm
    @close="closeForm"
    @delete="deleteCategory"
    v-if="showForm"
  ></DeleteForm>
</template>

<script>
import NavBarTop from "../components/navbars/NavBarTop.vue";
import MovementPercentageInTime from "../components/tiles/charts/MovementPercentageInTime.vue";
import results from "../db/results.json";
import { ReformatArrayList } from "../Controllers/ReformatArrayList.js";
import DeleteForm from "../components/forms/DeleteForm.vue";

export default {
  name: "Exercise results",
  components: {
    NavBarTop,
    MovementPercentageInTime,
    DeleteForm,
  },

  data() {
    return {
      results: null,
      graphResults: null,
      showForm: false,
    };
  },

  methods: {
    goBackToPatient() {
      this.$router.push({ name: "patient" });
    },
    addMeasurement() {
      this.$router.push({ name: "measureInfo" });
    },
    deleteCategory() {
      //! delete category from the patient with firestore and than route to categories
      // this.$router.push({name:"patient"}) and params
      this.$router.push({ name: "patient" });
    },
    blurrStyle() {
      if (this.showForm) {
        let style = "filter: blur(24px); opacity: 0.6;";
        return style;
      } else {
        return "";
      }
    },
    showDeleteForm(event) {
      event.stopPropagation();
      this.showForm = true;
    },
    closeForm() {
      this.showForm = false;
      this.errorMessage = "";
      return;
    },
  },
  mounted() {
    this.results = results;
    // https://riptutorial.com/javascript/example/7860/using-map-to-reformat-objects-in-an-array
    this.graphResults = ReformatArrayList(results);
    console.log(this.graphResults);
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

/* result graph*/
.result_container {
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

/* recent results */
.recent_results {
  margin-top: 1%;
  height: 50%;
  margin-right: 5%;
  margin-left: 5%;
  background: white;
  width: 90%;
  border-radius: 15px;
  padding-bottom: 1rem;
  padding-left: 1rem;
  padding-right: 1rem;
  margin-bottom: 1rem;
}

tr td {
  border: 2px solid #00a1e1;
}
td {
  width: 40%;
}
th {
  border: 2px solid #00a1e1;
}

/* buttons */

.addMeasurement {
  width: 70%;
  background-color: #0275d8;
  border-radius: 10px;
  color: #f8f9fa;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  border: none;
}

.addMeasurement:hover {
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

.delete_categoryBtn {
  margin-left: 5%;
  width: 90%;
  margin-right: 5%;
  padding: 0.5rem;
  background-color: #e6302b;
  color: white;
  border: none;
}

.delete_categoryBtn:hover {
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
