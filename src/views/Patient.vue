<template>
  <NavBarTop></NavBarTop>
  <h1 class="title">Patient</h1>
  <form class="container">
    <label>id</label>
    <p>{{ patientID }}</p>
    <label>name</label>
    <p>{{ name }}</p>
    <label>Surname</label>
    <p>{{ surName }}</p>
    <label>weight</label>
    <p>{{ weight }}</p>
    <label>Date of birth</label>
    <p>{{ dateOfBirth }}</p>
    <label>Height in Meters</label>
    <p>{{ heightInM }}</p>
  </form>
</template>

<script>
import NavBarTop from "@/components/navbars/NavBarTop.vue";
import _ from "lodash";
import patients from "@/db/patients.json";

export default {
  name: "patients",
  components: {
    NavBarTop,
  },
  data() {
    return {
      patientID: null,
      name: "",
      surName: "",
      weight: null,
      dateOfBirth: "",
      heightInM: null,

      patients: null,
    };
  },

  mounted() {
    this.patients = patients;
    this.patientID = this.$route.params.id;
    console.log(this.patientID);
    this.getPatientData();
  },

  methods: {
    getPatientData() {
      let id = parseInt(this.patientID);
      let patient = _.find(this.patients, { id: id });
      this.name = patient.name;
      this.surName = patient.surName;
      this.weight = patient.weight;
      this.dateOfBirth = patient.dateOfBirth;
      this.heightInM = patient.heightInM;
    },
  },
};
</script>

<style scoped>
.title {
  color: white;
  margin-bottom: 3%;
  margin-top: 5%;
  margin-right: 25%;
  margin-left: 25%;
  width: 50%;
}
p {
  margin: 0;
}

.container {
  padding: 1px;
  margin-top: 1%;
  height: 50%;
  background: white;
  width: 90%;
}
</style>
