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
    return {};
  },
  mounted() {
    console.log(this.dataProp);
  },
};
</script>

<style scoped></style>
