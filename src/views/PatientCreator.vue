<template>
  <nav-bar-top></nav-bar-top>
  <Form @submit="submitForm" class="form" :validation-schema="schema">
    <div class="row mb-3">
      <label for="name" class="col-sm-2 col-form-label">Naam</label>
      <div class="col-sm-8">
        <Field
          type="email"
          class="form-control"
          name="name"
          placeholder="Naam"
        />
        <ErrorMessage name="name"></ErrorMessage>
      </div>
    </div>
    <div class="row mb-3">
      <label for="inputSurname" class="col-sm-2 col-form-label"
        >Achternaam</label
      >
      <div class="col-sm-8">
        <Field
          type="name"
          class="form-control"
          name="surname"
          placeholder="achternaam"
        />
        <ErrorMessage name="name"></ErrorMessage>
      </div>
    </div>
    <div class="row mb-3">
      <label for="height" class="col-sm-2 col-form-label">Lengte</label>
      <div class="col-sm-8">
        <Field
          type="number"
          class="form-control"
          name="height"
          placeholder="Lengte in m"
        />
        <ErrorMessage name="height"></ErrorMessage>
      </div>
    </div>
    <div class="row mb-3">
      <label for="weight" class="col-sm-2 col-form-label">Gewicht</label>
      <div class="col-sm-8">
        <Field
          type="number"
          class="form-control"
          name="weight"
          placeholder="Gewicht in kg"
          step="0.01"
        />
        <ErrorMessage name="weight"></ErrorMessage>
      </div>
    </div>
    <div class="row mb-3">
      <label for="dateOfBirth" class="col-sm-2 col-form-label"
        >Geboortedatum</label
      >
      <div class="col-sm-8">
        <Field
          type="name"
          class="form-control"
          name="dateOfBirth"
          placeholder="Geboortedatum in dd-mm-yy"
        />
        <ErrorMessage name="dateOfBirth"></ErrorMessage>
      </div>
    </div>
    <button class="addButton">Voeg patiënt toe</button>
  </Form>
</template>

<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import NavBarTop from "../components/navbars/NavBarTop.vue";
import { createPatient } from "../db/fdb";

export default {
  name: "patients",
  components: {
    Form,
    Field,
    ErrorMessage,
    NavBarTop,
  },
  data() {
    const schema = yup.object().shape({
      name: yup.string().required("Dit veld is verplicht"),
      surname: yup.string().required("Dit veld is verplicht"),
      height: yup.string().required("Dit veld is verplicht"),
      weight: yup.string().required("Dit veld is verplicht"),
      dateOfBirth: yup.string().required("Dit veld is verplicht"),
    });
    return {
      schema,
      patients: [],
    };
  },
  mounted() {
    this.createPatientWithFireStore();
  },
  methods: {
    submitForm(patient) {
      console.log(patient);
    },
    createPatientWithFireStore() {
      // test
      let fysioId = this.$store.getters.getUser.uid;

      createPatient(
        1,
        "jayh",
        "de Cuba",
        70,
        "24-11-1998",
        171,
        "jayh.decuba@student.hu.nl",
        fysioId
      );
    },
  },
};
</script>

<style scoped>
.form-control {
  padding: 1rem 1rem;
  width: 90%;
  margin-left: 5%;
}
.addButton {
  display: block;
  width: 40vw;
  margin-left: 30%;
  margin-right: 30%;
  color: #fff;
  background-color: #e6302b;
  border-radius: 2px;
  border: 0;
  font-size: 18px;
  font-weight: bold;
  padding: 16px 16px 18px 16px;
}

.addButton:hover {
  background: #d3322c;
  border: none;
}

.form {
  margin-top: 3%;
  text-align: center;
}
</style>
