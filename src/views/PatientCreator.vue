<template>
  <nav-bar-top></nav-bar-top>
  <Form @submit="addClient" class="form" :validation-schema="schema">
    <div class="row mb-3">
      <label for="name" class="col-sm-2 col-form-label">Name</label>
      <div class="col-sm-8">
        <Field
          type="email"
          class="form-control"
          name="name"
          placeholder="Name"
        />
        <ErrorMessage name="name"></ErrorMessage>
      </div>
    </div>
    <div class="row mb-3">
      <label for="inputSurname" class="col-sm-2 col-form-label">Surname</label>
      <div class="col-sm-8">
        <Field
          type="name"
          class="form-control"
          name="surname"
          placeholder="Surname"
        />
        <ErrorMessage name="surname"></ErrorMessage>
      </div>
    </div>
    <div class="row mb-3">
      <label for="height" class="col-sm-2 col-form-label">Height</label>
      <div class="col-sm-8">
        <Field
          type="number"
          class="form-control"
          name="height"
          placeholder="height in m"
        />
        <ErrorMessage name="height"></ErrorMessage>
      </div>
    </div>
    <div class="row mb-3">
      <label for="weight" class="col-sm-2 col-form-label">Weight</label>
      <div class="col-sm-8">
        <Field
          type="number"
          class="form-control"
          name="weight"
          placeholder="weight in kg"
        />
        <ErrorMessage name="weight"></ErrorMessage>
      </div>
    </div>
    <div class="row mb-3">
      <label for="dateOfBirth" class="col-sm-2 col-form-label"
        >Date of birth</label
      >
      <div class="col-sm-8">
        <Field
          type="name"
          class="form-control"
          name="dateOfBirth"
          placeholder="date of birth in dd-mm-yy"
        />
        <ErrorMessage name="dateOfBirth"></ErrorMessage>
      </div>
    </div>
    <button>Create client</button>
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
      name: yup.string().required("Name is required"),
      surname: yup.string().required("Surname is required"),
      height: yup.string().required("Height is required"),
      weight: yup.string().required("Weight is required"),
      dateOfBirth: yup.string().required("Date of birth is required"),
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
