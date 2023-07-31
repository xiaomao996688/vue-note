import { defaultTheme } from "vuepress";
export default {
  base: "/vue-note/",
  dest: "dist",
  title: "Vue.js 技术",
  description: "Analysis vue.js deeply",
  head: [
    // ["link", { rel: "icon", href: `/logo.png` }],
    // ["link", { rel: "manifest", href: "/manifest.json" }],
    ["meta", { name: "theme-color", content: "#3eaf7c" }],
    ["meta", { name: "apple-mobile-web-app-capable", content: "yes" }],
    [
      "meta",
      { name: "apple-mobile-web-app-status-bar-style", content: "black" },
    ],
    [
      "link",
      { rel: "apple-touch-icon", href: `/icons/apple-touch-icon-152x152.png` },
    ],
    [
      "link",
      {
        rel: "mask-icon",
        href: "/icons/safari-pinned-tab.svg",
        color: "#3eaf7c",
      },
    ],
    [
      "meta",
      {
        name: "msapplication-TileImage",
        content: "/icons/msapplication-icon-144x144.png",
      },
    ],
    ["meta", { name: "msapplication-TileColor", content: "#000000" }],
  ],
  serviceWorker: false,
  theme: defaultTheme({
    repo: "",
    editLinks: true,
    docsDir: "docs",
    editLinkText: "在 GitHub 上编辑此页",
    lastUpdated: "上次更新",
    navbar: [
      {
        text: "2.x 版本",
        link: "/v2/introduction",
      },
      {
        text: "3.x 版本",
        link: "/v3/introduction/",
      },
    ],
    sidebar: {
      "/v2/": [
        {
          collapsible: false,
          text: "分析",
          children: [
            "/v2/introduction/index.md",
            "/v2/introduction/directory.md",
            "/v2/introduction/build.md",
          ],
        },
        {
          text: "生命周期",
          collapsable: false,
          children: [
            "/v2/lifecycle/index.md",
            "/v2/lifecycle/prepare-init.md",
            "/v2/lifecycle/init.md",
            "/v2/lifecycle/compiler.md",
          ],
        },
        {
          text: "数据驱动",
          collapsable: false,
          children: [
            "/v2/data-driven/index.md",
            "data-driven/new-vue",
            "data-driven/mounted",
            "data-driven/render",
            "data-driven/virtual-dom",
            "data-driven/create-element",
            "data-driven/update",
          ],
        },
      ],
      "/v3/": [
        {
          title: "前言",
          collapsable: false,
          children: ["/v3/introduction/index.md"],
        },
        {
          title: "前言",
          collapsable: false,
          children: [["guide/", "Introduction"]],
        },
        {
          title: "Vue.js 3.0 核心源码解析​",
          collapsable: false,
          children: [["new/", "Introduction"]],
        },
      ],
    },
  }),
};
