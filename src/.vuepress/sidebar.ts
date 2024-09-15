import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  "/": [
    "",
    {
      text: "Projects",
      icon: "folder-open",
      prefix: "projects/",
      link: "projects/",
      children: "structure",
      sorter: "date",
    },
    {
      text: "Posts",
      icon: "book",
      prefix: "posts/",
      link: "posts/",
      children: [
        {
          text: "Optimization",
          icon: "infinity",
          prefix: "Optimization/",
          link: "Optimization/",
          children: "structure"
        },
        {
          text: "C++",
          icon: "code",
          prefix: "Cpp/",
          link: "Cpp/",
          children: "structure"
        },
        {
          text: "Python",
          icon: "fa-brands fa-python",
          prefix: "Python/",
          link: "Python/",
          children: "structure"
        },
      ],
    },
    "about-me",
  ],
});
