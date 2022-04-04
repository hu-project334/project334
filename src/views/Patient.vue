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
// import LinkButton from "@/components/btns/LinkButton.vue";

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

      patients: [
        {
          id: 1,
          name: "Alexander",
          surName: "de graaff",
          weight: 70,
          dateOfBirth: "22-06-2002",
          heightInM: 1.82,
        },
        {
          id: 2,
          name: "Milo",
          surName: "Belien",

          weight: 70,
          dateOfBirth: "28-09-2002",
          heightInM: 1.83,
        },
        {
          id: 3,
          name: "Jayh",
          surName: "de Cuba",

          weight: 65,
          dateOfBirth: "24-11-1998",
          heightInM: 1.71,
        },
        {
          id: 4,
          name: "Twan",
          surName: "van de Bor",

          weight: 65,
          dateOfBirth: "28-09-1997",
          heightInM: 1.78,
        },
      ],
    };
  },

  mounted() {
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

<style>
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
