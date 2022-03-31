<template>
  <NavBarTop></NavBarTop>

  <h1 class="title">excersises</h1>

  <template v-for="excersise in excersises" :key="excersise">
    <div @click="getExcersizeResults(excersise)" class="excersise">
      <p>Name: {{ excersise.name }}</p>
    </div>
  </template>
</template>

<script>
import NavBarTop from "@/components/navbars/NavBarTop.vue";

export default {
  name: "excersises",
  components: {
    NavBarTop,
  },
  data() {
    return {
      excersises: [
        {
          id: 1,
          name: "lumbale wervelkolom met 2 sensoren",
        },
        {
          id: 2,
          name: "li-re vergelijking 1 gewricht 4 sensoren",
        },
        {
          id: 3,
          name: "Loopanalyse (let op! Ander type bestand wat ingelezen moet worden!; data uit andere verzamelmethode beschikbaar)",
        },
      ],
    };
  },
  methods: {
    getExcersizeResults(excersise) {
      console.log(excersise.id, excersise.name);
      this.$router.push({ path: "/feed" });
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

.excersise {
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
