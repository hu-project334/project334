<template>
  <div>
    <router-link v-slot="{ href, navigate, isActive }" :to="navigateTo" custom>
      <button
        type="button"
        :active="isActive"
        :href="href"
        :aria-label="name"
        @click="navigate"
      >
        <i :class="`bi ${icon} ${color}`" />
      </button>
    </router-link>
  </div>
</template>

<script>
export default {
  name: "LinkButton",
  props: {
    navigateTo: { type: String, required: true },
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

/* button > i {
  font-size: 4em;
} */

/*Any Mobile Device*/
</style>
