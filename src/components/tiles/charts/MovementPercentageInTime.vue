<template>
  <!-- x,y -->
  <line-chart
    :data="dataProp"
    xtitle="data"
    ytitle="Bewegingspercentage"
  ></line-chart>
</template>

<script>
export default {
  name: "MovementPercentageInTime",
  props: {
    dataProp: Array,
  },
  data() {
    return {
      //   data1: { "2021-01-01": 10, "2021-01-02": 6 },
    };
  },
  mounted() {
    console.log(this.dataProp);
  },
};
</script>

<style scoped></style>
