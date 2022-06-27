<template>
  <div :style="blurrStyle()">
    <nav-bar-top></nav-bar-top>

    <h1 class="title">{{ routeName }}</h1>
    <main>
      <div class="result_container">
        <b>Meest recente metingen </b>
        <movement-percentage-in-time
          :data-prop="graphResults"
        ></movement-percentage-in-time>
      </div>

      <div class="recent_results">
        <b>Recente resultaten in vergelijking tot de norm</b>
        <table>
          <tr>
            <th>Datum</th>
            <th>Beweging (graden)</th>
            <th>Vergeleken tot de norm i</th>
          </tr>
          <!-- {{
            JSON.stringify(results)
          }} -->
          <template v-for="result in results" :key="result">
            <!-- <template v-for="(obj2, pos2) in obj" :key="pos2"> -->
            <tr>
              <td>{{ result.date }}</td>
              <td>{{ result.beweging }}°</td>
              <td>{{ result.norm }}%</td>
            </tr>
            <!-- </template> -->
          </template>
        </table>
      </div>
    </main>

    <button class="delete_categoryBtn" @click="showDeleteForm">
      <b>Verwijder categorie</b>
    </button>

    <div style="margin-top: 80px"></div>
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
import DeleteForm from "../components/forms/DeleteForm.vue";
import {
  getCategoryResults,
  deleteCategory,
} from "../db/fdb";
import { useRoute } from "vue-router";

export default {
  name: "Exercise results",
  components: {
    NavBarTop,
    MovementPercentageInTime,
    DeleteForm,
  },

  data() {
    return {
      results: [],
      graphResults: [],
      showForm: false,
      route: useRoute(),
      routeName: "",
    };
  },

  methods: {
    async getCategoryResults() {
      let docIdPatient = this.route.params.name;
      let docIdCategory = this.route.params.category;

       let age = this.$store.state.age;
       let gender = this.$store.state.gender;

      // await addResultToCategory(docIdPatient, docIdCategory,90  ,"nog niet bekend");

      const getCategoryResultsConst = await getCategoryResults(
        docIdPatient,
        docIdCategory
      );
      const results = getCategoryResultsConst.results;
      const name = getCategoryResultsConst.results;
      this.routeName = getCategoryResultsConst.name;

      // 24-11-1998 11:20:30 van de results alle dates in een list en beweging in graden
      // {[date]:beweging}

      const graphResults = results.reduce((res, val, i) => {
        res[val.date] = val.beweging;
        return res;
      }, {});
      this.graphResults = graphResults;

      this.results = results;
      // this.graphResults = this.results;
    },
    goBackToPatient() {
      this.$router.push({ name: "patient" });
    },
    addMeasurement() {
      let name = this.route.params.name;
      let category = this.route.params.category;
      this.$router.push({
        name: "measureInfo",
        params: { name: name, category: category },
      });
    },
    async deleteCategory() {
      let docIdPatient = this.route.params.name;
      let docIdCategory = this.route.params.category;
      await deleteCategory(docIdPatient, docIdCategory);

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
    this.getCategoryResults();
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
  padding-left: 1%;
  margin-right: 100px;
}
table {
  table-layout: fixed;
  width: 98%;
  margin-right: 2%;
}
td {
  width: 40%;
}
th {
  border: 2px solid #00a1e1;
  padding-left: 1%;
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
  margin-bottom: 5rem;
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
