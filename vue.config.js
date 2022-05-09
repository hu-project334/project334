// vue.config.js file to be place in the root of your repository

module.exports = {
  // ...Other Vue config options here, possibly
  publicPath:
    process.env.NODE_ENV === "production"
      ? "/334-HOGESCHOOL-UTRECHT-INSTITUUT-VOOR-BEWEGINGSSTUDIES/"
      : "/",
  pwa: {
    name: "project",
    themeColor: "#d8222a",
  },
};
