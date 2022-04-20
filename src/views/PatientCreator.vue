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
        <ErrorMessage name="surname"></ErrorMessage>
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
    <button>Maak patient</button>
  </Form>
</template>

<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import NavBarTop from "../components/navbars/NavBarTop.vue";

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
      name: yup.string().required("Naam is verplicht"),
      surname: yup.string().required("Achternaam is verplicht"),
      height: yup.string().required("Lengte is verplicht"),
      weight: yup.string().required("Gewicht is verplicht"),
      dateOfBirth: yup.string().required("Geboortedatum is verplicht"),
    });
    return {
      schema,
      patients: [],
    };
  },
  methods: {
    submitForm(patient) {
      console.log(patient);
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
button {
  display: block;
  width: 40vw;
  margin-left: 30%;
  margin-right: 30%;
  color: #fff;
  background-color: red;
  border-radius: 2px;
  border: 0;
  font-size: 18px;
  font-weight: bold;
  padding: 16px 16px 18px 16px;
}

.form {
  margin-top: 3%;
  text-align: center;
}
</style>
