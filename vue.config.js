// vue.config.js file to be place in the root of your repository

module.exports = {
  // ...Other Vue config options here, possibly
  publicPath: process.env.NODE_ENV === "production" ? "/project334/" : "/",
  pwa: {
    name: "project",
    themeColor: "#d8222a",
  },
};
