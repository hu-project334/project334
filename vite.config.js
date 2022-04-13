import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { VitePWA } from "vite-plugin-pwa";

const path = require("path");

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      includeAssets: [
        "favicon.svg",
        "favicon.ico",
        "robots.txt",
        "apple-touch-icon.png",
      ],
      base: "/project334/",
      srcDir: "src",
      filename: "sw.js",
      strategies: "injectManifest",
      manifest: {
        name: "Name of your app",
        short_name: "Short name of your app",
        description: "Description of your app",
        theme_color: "#ffffff",
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

  base: "/project334/",

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
