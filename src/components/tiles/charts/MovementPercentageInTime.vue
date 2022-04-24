<template>
  <!-- x,y -->
  <!-- <line-chart
    :data="{ '2021-01-01': 11, '2021-01-02': 6 }"
    xtitle="data"
    ytitle="Bewegingspercentage"
  ></line-chart> -->

  <line-chart :data="{ '2021-01-01': 11, '2021-01-02': 6 }"></line-chart>
</template>

<script>
export default {
  name: "MovementPercentageInTime",
  props: {
    dataProp: Object,
  },
  data() {
    return {
      //   data1: { "2021-01-01": 10, "2021-01-02": 6 },
    };
  },
  mounted() {
    // console.log(this.dataProp);
  },
};
</script>

<style scoped></style>
