<template>
  <div v-if="offlineReady || needRefresh" class="flex flex-wrap" role="alert">
    <div class="message mt-1">
      <span v-if="offlineReady"> App ready to work offline </span>
      <span v-else
        >New content available, click on reload button to update.</span
      >
    </div>
    <div class="buttons flex align-middle mt-2 md:mt-0">
      <button
        v-if="needRefresh"
        class="button"
        @click="updateServiceWorkerAction()"
      >
        Reload
      </button>
      <button class="button" @click="closeButtonAction()">Close</button>
    </div>
  </div>
</template>

<script>
// https://rubenr.dev/en/pwa-vite/
// with composition api
import { useRegisterSW } from "virtual:pwa-register/vue";
const { updateServiceWorker } = useRegisterSW();

export default {
  name: "ReloadPWA",
  setup() {
    const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW();
    const close = async () => {
      this.offlineReady = false;
      this.needRefresh = false;
    };
    return { offlineReady, needRefresh, updateServiceWorker, close };
  },
  methods: {
    async closeButtonAction() {
      this.offlineReady = false;
      this.needRefresh = false;
    },
    async updateServiceWorkerAction() {
      await updateServiceWorker();
    },
  },
};
</script>
