Register.vue - base vue
<template>
  <h1>alexander / milo</h1>

  <p><button @click="getData()">connect</button></p>
  <p><button @click="identify()">identify device</button></p>
  <h2>
    Battery level:
    <p id="batterylevel">0</p>
  </h2>
  <p><button @click="startRec()">start recording</button></p>
  <p><button @click="stopRec()">stop recording</button></p>
</template>

<script>
import { findBluetoothDevices } from "/src/libraries/bluethooth.js";
import { XsensDotSensor } from "/src/libraries/bluethooth.js";
import { startRecording } from "/src/libraries/bluethooth.js";
import { stopRecording } from "/src/libraries/bluethooth.js";
export default {
  name: "Feed",
  data() {
    return {
      x: 0,
      y: 0,
    };
  },
  methods: {
    getData() {
      findBluetoothDevices();
    },
    identify() {
      XsensDotSensor.blinkDeviceLED();
    },
    startRec() {
      startRecording();
    },
    stopRec() {
      stopRecording();
    },
  },
};
</script>
