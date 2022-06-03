<template>
  <div class="g-sign-in-button">
    <div class="content-wrapper">
      <div class="logo-wrapper">
        <img alt="envelop" src="@/assets/output-onlinepngtools.png" />
      </div>
      <span class="text-container">
        <span class="text">Log in met email</span>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: "RegisterBtn",
  props: {
    textColor: String,
    backgroudnColor: String,
    activeColor: String,
  },
  methods: {},
};
</script>

<style scoped>
*,
*:before,
*:after {
  box-sizing: border-box;
}

.g-sign-in-button {
  margin: 10px;
  display: inline-block;
  width: 240px;
  height: 50px;
  background-color: #e6302b;
  color: #fff;
  border-radius: 15px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.25);
  transition: background-color 0.218s, border-color 0.218s, box-shadow 0.218s;
}

.g-sign-in-button:hover {
  cursor: pointer;
  -webkit-box-shadow: 0 0 3px 3px rgba(66, 133, 244, 0.3);
  box-shadow: 0 0 3px 3px rgba(66, 133, 244, 0.3);
  background: #d3322c;
  border: none;
}

.g-sign-in-button .content-wrapper {
  height: 100%;
  width: 100%;
  border: 1px solid transparent;
}

.g-sign-in-button img {
  width: 18px;
  height: 18px;
}

.g-sign-in-button .logo-wrapper {
  padding: 10px;
  width: 48px;
  height: 100%;
  border-radius: 15px;
  display: inline-block;
}

.g-sign-in-button .text-container {
  font-family: Roboto, arial, sans-serif;
  font-weight: 500;
  letter-spacing: 0.21px;
  font-size: 16px;
  line-height: 48px;
  vertical-align: top;
  border: none;
  display: inline-block;
  text-align: center;
  width: 180px;
}

.text {
  color: white;
}
</style>
