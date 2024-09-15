import { navbar } from "vuepress-theme-hope";

export default navbar([
  "/",
  {
    text: "Projects",
    icon: "folder-open",
    link: "/projects/",
  },
  {
    text: "Posts",
    icon: "book",
    link: "/posts/",
  },
  "/about-me.html",
]);
