<template>
  <NavBarTop></NavBarTop>

  <h1 class="title">Patienten</h1>

  <main>
    <link-button
      icon="bi bi-person-plus-fill"
      name="Create patient"
      navigate-to="/newPatient"
      class="addPatientBtn"
      color="#0275d8"
    />

    <template v-for="patient in patients" :key="patient">
      <div class="patient">
        <link-param-button
          icon="bi bi-person-square"
          color="text-primary"
          name="go to patient"
          navigate-to="patient"
          :id="patient.id"
          class="link-param-button"
        />

        <div class="patient-text">
          <p class="text">Naam: {{ patient.name }}</p>
          <p class="text">Achternaam : {{ patient.surname }}</p>
        </div>
        <icon-button
          name="delete patient"
          icon="bi bi-trash icon"
          color="text-primary"
          type="button"
          aria-label="deletePatient"
          class="icon-button"
          @click="deletePatient(patient.id)"
        />

        <button
          class="seeResultsButton"
          @click="getExcersizeResults(patient.id)"
        >
          geschiedenis van oefeningen
        </button>
      </div>
    </template>
  </main>
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
    getExcersizeResults(id) {
      this.$router.push({ name: "excersiseResults", params: { id: id } });
    },
    deletePatient(id) {
      let index = _.findIndex(this.patients, { id: id });
      this.patients.splice(index, 1);
    },
    addNewPatient(value) {
      console.log(value);
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
  justify-content: space-between;
  flex-wrap: wrap;
}

.patient-text {
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
}

.seeResultsButton:focus,
.seeResultsButton:focus-within,
.seeResultsButton:hover {
  background: blue;
  border: none;
}

/*Any Mobile Device*/
@media only screen and (max-width: 500px) {
  .link-param-button {
    font-size: 3em;
  }
  .icon-button {
    font-size: 4em;
  }
  .text {
    padding: 0;
    font-size: 0.8em;
  }
  .addPatientBtn {
    left: calc(100vw - 2.5em);
    top: calc(100vh - 3em);
    font-size: 3em;
  }
}
@media only screen and (max-width: 767px) and (min-width: 500px) {
  .link-param-button {
    font-size: 3em;
  }
  .icon-button {
    font-size: 4em;
  }
  .text {
    padding: 0;
    font-size: 0.8em;
  }
  .addPatientBtn {
    left: calc(100vw - 2.5em);
    top: calc(100vh - 4em);
    font-size: 3em;
  }
}
/* everything in between */
@media only screen and (max-width: 1281px) and (min-width: 767px) {
  .text {
    padding: 0;
    font-size: 1.3em;
  }
  .addPatientBtn {
    left: calc(100vw - 5em);
    top: calc(100vh - 4em);
    font-size: 3em;
  }
  .link-param-button {
    font-size: 4em;
  }
  .icon-button {
    font-size: 4em;
  }
  .text {
    padding: 0;
    font-size: 1.3em;
  }
  .addPatientBtn {
    left: calc(100vw - 4em);
    top: calc(100vh - 4em);
    font-size: 3em;
  }
  .link-param-button {
    font-size: 4em;
  }
}

/* desktops */
@media (min-width: 1281px) {
  .text {
    padding: 0;
    font-size: 1.3em;
  }
  .addPatientBtn {
    left: calc(100vw - 3em);
    top: calc(100vh - 3em);
    font-size: 4em;
  }
  .link-param-button {
    font-size: 4em;
  }
  .icon-button {
    font-size: 4em;
  }
}

.addPatientBtn {
  position: sticky;
  width: 1.9em;
  height: 1.9em;
  background: white;
  display: grid;
  justify-content: center;
  align-items: center;
  border-radius: 75%;
  border: 1px solid #707070;
  z-index: 1;
}

/* .addPatientBtn > button {
  bottom: 6em;
} */
</style>
