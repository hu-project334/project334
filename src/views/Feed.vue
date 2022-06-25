Register.vue - base vue
<template>
  <nav-bar-top></nav-bar-top>
  <h1>XsensDotSensor Development</h1>

  <p><button @click="getData()">connect</button></p>
  <p><button @click="sync()">synchronize</button></p>
  <input type="text" name="device name" placeholder="enter new device name" :value="device_name" @change="updateDeviceName">
  <p><button @click="identify()">identify device</button></p>
  <h2>Device name: {{ device_name }}</h2>
  <h2>Battery level: {{ batterylevel }}</h2>
  <h2>Sensor status: {{ sensorstatus }}</h2>
  <p><button @click="startDataExport()">Export data</button></p>
  <p><button @click="streamData()">Start real time streaming</button></p>
  <p><button @click="stopDataStream()">stop real time streaming</button></p>
  <h2>X: {{ x }}</h2>
  <h2>Y: {{ y }}</h2>
  <h2>Z: {{ z }}</h2>
  <h2>Biggest angle: {{ angle }}</h2>
</template>

<script>
import NavBarTop from "../components/navbars/NavBarTop.vue";
import { XsensDotSensor } from "/src/libraries/bluetooth.js";

export default {
  name: "Feed",
  components: {
    NavBarTop,
  },
  data() {
    return {
      x: 0,
      y: 0,
      z: 0,
      batterylevel: 0,
      device_name: "",
      sensorstatus: "",
      XsensDotSensor: null,
      angle: null,
    };
  },
  created() {
    window.addEventListener("beforeunload", this.handler);
    this.XsensDotSensor = XsensDotSensor
    this.batterylevel = this.XsensDotSensor.battery_level;
    this.x = this.XsensDotSensor.rotation.x;
    this.y = this.XsensDotSensor.rotation.y;
    this.z = this.XsensDotSensor.rotation.z;
    this.device_name = this.XsensDotSensor.device_name;
    this.sensorstatus = this.XsensDotSensor.sensor_status;
  },
  watch: {
    "XsensDotSensor.device_name": {
      handler(newName) {
        this.device_name = newName;
      },
      deep: true,
    },
    "XsensDotSensor.sensor_status": {
      handler(newStatus) {
        this.sensorstatus = newStatus;
      },
      deep: true,
    },
    "XsensDotSensor.max_angle": {
      handler(newAngle) {
        this.angle = newAngle;
      },
      deep: true,
    },
    "XsensDotSensor.battery_level": {
      handler(newBattery) {
        this.batterylevel = newBattery;
      },
      deep: true,
    },
    "XsensDotSensor.rotation": {
      handler(newRotation) {
        if (newRotation == undefined) {
          return;
        }
        this.x = (newRotation.x * 57.2957795).toFixed(2);
        this.y = (newRotation.y * 57.2957795).toFixed(2);
        this.z = (newRotation.z * 57.2957795).toFixed(2);
      },
      deep: true,
    },
  },
  methods: {
    getData() {
      this.XsensDotSensor.findAndConnect();
    },
    sync() {
      this.XsensDotSensor.getSyncStatusSensor();
    },
    identify() {
      this.XsensDotSensor.blinkDeviceLED();
    },
    startDataExport() {
      this.XsensDotSensor.downloadDataToCSV();
    },
    streamData() {
      this.XsensDotSensor.startRTStream();
    },
    stopDataStream() {
      this.XsensDotSensor.stopRTStream();
    },
    updateDeviceName(e) {
      this.XsensDotSensor.writeDeviceName(e.target.value.trim())
    },
  },
};
</script>
<style scoped>


</style>