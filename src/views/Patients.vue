<template>
  <NavBarTop></NavBarTop>

  <h1 class="title">Patients</h1>

  <template v-for="patient in patients" :key="patient">
    <div @click="getExcersizeResults(patient)" class="patient">
      <p>Name: {{ patient.name }}</p>
      <p>Last name: {{ patient.surName }}</p>
    </div>
  </template>
</template>

<script>
import NavBarTop from "@/components/navbars/NavBarTop.vue";

export default {
  name: "patients",
  components: {
    NavBarTop,
  },
  data() {
    return {
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
      ],
    };
  },
  methods: {
    getExcersizeResults(patient) {
      console.log(patient.id, patient.name);
      this.$router.push({ path: "/excersises" });
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
  /* margin-top: 3%; */
  margin: 0;
}

.patient {
  cursor: pointer;
  background: #e6302b;
  margin-top: 2%;
  padding-top: 10px;
  margin-right: 15%;
  margin-left: 15%;
  width: 70%;
  border: 1px solid black;
  color: white;
}
</style>
