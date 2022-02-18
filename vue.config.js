module.exports = {
  // ...Other Vue config options here, possibly
  publicPath:
    process.env.NODE_ENV === "production"
      ? "/334-HOGESCHOOL-UTRECHT-INSTITUUT-VOOR-BEWEGINGSSTUDIES/"
      : "/",

  pwa: {
    name: "sensortechnology voor de fysiotherapeut",
    themeColor: "#e96851",
  },
};
