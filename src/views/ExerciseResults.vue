<template>
  <nav-bar-top></nav-bar-top>
  <!-- //! is not dynamic yet -->
  <h1 class="title">Rechter onder arm</h1>
  <!-- //! graph has to be installed and used -->
  <main>
    <div class="result_container"><b>Recent geplotte data </b></div>

    <div class="recent_results">
      <b>Recente resultaten in vergelijking tot de norm</b>
      <table>
        <tr>
          <th>Datum</th>
          <th>Bewginging in graden</th>
          <th>Vergeleken tot de norm in %</th>
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

  <button class="delete_categoryBtn" @click="deleteCategory()">
    Verwijder categorie
  </button>

  <footer>
    <button class="backBtn" @click="goBackToPatient()"><b>Terug</b></button>
    <button class="addMeasurement" @click="addMeasurement()">
      <b>Niewe meting</b>
    </button>
  </footer>
</template>

<script>
import NavBarTop from "../components/navbars/NavBarTop.vue";
import results from "../db/results.json";
export default {
  name: "Exercise results",
  components: {
    NavBarTop,
  },

  data() {
    return {
      results: null,
    };
  },

  methods: {
    goBackToPatient() {
      //! patient id is necesary change routing param
      // this.$router.push({ name: "patient" });
    },
    addMeasurement() {
      this.$router.push({ name: "feed" });
    },
    deleteCategory() {
      //! delete category from the patient with firestore and than route to categories
      // this.$router.push({name:"patient"}) and params
    },
  },
  mounted() {
    this.results = results;
  },
};
</script>

<style scoped>
.title {
  color: white;
  margin-bottom: 1rem;
  margin-top: 3%;
  margin-right: 25%;
  margin-left: 25%;
  font-size: 3em;
  width: 50%;
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

/* .results_graph {


 
} */

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
  margin-bottom: 2rem;
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

.backBtn {
  width: 30%;
  background-color: #e6302b;
  border-radius: 10px;
  color: #f8f9fa;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  border: none;
}

.delete_categoryBtn {
  margin-left: 5%;
  margin-right: 5%;
  margin-bottom: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  width: 90%;
  background-color: #e6302b;
  color: #f8f9fa;
  border-radius: 15px;
  border: none;
}
/* footer */

footer {
  position: sticky;
  top: 0;
  /* margin-top: 300px; */
  background-color: #f8f9fa;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  padding-top: 1rem;
  padding-bottom: 1rem;
}
</style>
