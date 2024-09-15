import { defineUserConfig } from "vuepress";
import theme from "./theme.js";

export default defineUserConfig({
  base: "/",

  lang: "en-US",
  title: "StephLin's Personal Blog",
  description: "StephLin's Personal Blog",

  theme,

  // Enable it with pwa
  // shouldPrefetch: false,
});
