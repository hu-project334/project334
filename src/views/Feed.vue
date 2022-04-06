Register.vue - base vue
<template>
  <h1>XsensDotSensor Development</h1>

  <p><button @click="getData()">connect</button></p>
  <p><button @click="identify()">identify device</button></p>
  <h2>Battery level: <p id="batterylevel">0</p></h2>
  <h2>Sensor status: <p id="sensorStatus">offline</p></h2>
  <p><button @click="startDataExport()">Export data</button></p>
  <p><button @click="streamData()">Start real time streaming</button></p>
  <p><button @click="stopDataStream()">stop real time streaming</button></p>
  <h2>X: <p id="x-axis"> 0 </p></h2>
  <h2>Y: <p id="y-axis"> 0 </p></h2>
  <h2>Z: <p id="z-axis"> 0 </p></h2>
</template>

<script>
import { XsensDotSensor } from "/src/libraries/bluetooth.js";
import { findBluetoothDevices, startRTStream, stopRTStream } from "/src/libraries/bluetooth.js";
export default {
  name: "regster",
  data() {
    return {
      x: 0,
      y: 0,
    };
  },
  created() {
    window.addEventListener('beforeunload', this.handler)
  },
  methods: {
    getData() {
      findBluetoothDevices()
    },
    identify() {
      XsensDotSensor.blinkDeviceLED()
    },
    startDataExport() {
      XsensDotSensor.downloadDataToCSV()
    },
    streamData() {
      startRTStream()
    },
    stopDataStream() {
      stopRTStream()
    },
    handler: function handler() {
      stopRTStream()
    }
  },
};
</script>
