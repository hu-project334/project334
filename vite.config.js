import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { VitePWA } from "vite-plugin-pwa";

const path = require("path");

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      mode: "development",
      includeAssets: [
        "favicon.svg",
        "favicon.ico",
        "robots.txt",
        "apple-touch-icon.png",
      ],
      base: "/334-HOGESCHOOL-UTRECHT-INSTITUUT-VOOR-BEWEGINGSSTUDIES/",
      srcDir: "src",
      filename: "sw.js",
      strategies: "injectManifest",
      manifest: {
        name: "Project334",
        short_name: "P334",
        description: "Sensortechnologie voor de fysiotherapuit",
        theme_color: "#ffffff",
        display: "standalone",
        background_color: "#ffffff",

        icons: [
          {
            src: "img/icons/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "img/icons/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "img/icons/apple-touch-icon.png",
            sizes: "180x180",
            type: "image/png",
          },
          {
            src: "img/icons/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],

  base: "/334-HOGESCHOOL-UTRECHT-INSTITUUT-VOOR-BEWEGINGSSTUDIES/",

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
