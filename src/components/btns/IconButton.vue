<template>
  <div>
    <button type="button" :aria-label="name">
      <i :class="`bi ${icon} ${color}`" />
    </button>
  </div>
</template>

<script>
export default {
  name: "IconButton",
  props: {
    icon: { type: String, required: true },
    name: { type: String, required: true },
    color: { type: String, default: "text-success" },
  },
};
</script>

<style scoped>
button {
  background: none;
  border: none;
  display: grid;
  justify-content: center;
  align-items: center;
  /* margin: 10%; */

  transition: all 0.2s ease-in-out;
}

button:focus,
button:focus-within,
button:hover {
  /* background: green; */
  transform: scale(110%);
  /* transition: all 1.2s ease-in-out; */
  border: none;
}
</style>
