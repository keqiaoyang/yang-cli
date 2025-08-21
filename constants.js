export const templates = [
  {
    name: "vue-admin-better",
    value: "zxwk1998/vue-admin-better",
    description: "zxwk 基于vue2 + element-ui 中后台前端框架",
  },
  {
    name: "vue3-admin-better",
    value: "zxwk1998/vue3-admin-better",
    description: "zxwk 基于vue3 + element-plus 中后台前端框架",
  },
  {
    name: "vue-admin-box",
    value: "cmdparkour/vue-admin-box",
    description: "cmdparkour 基于vue3 + vite中后台项目模板",
  },
];

export const messages = [
  {
    message: "请输入项目名称:",
    name: "name",
    validate(val) {
      if (val.match(/[\u4E00-\u9FFF`~!@#$%&^*[\]()\\;:<.>/?]/g)) {
        return "项目名称存在非法字符";
      }
      return true;
    },
  },
  {
    message: "请输入项目关键词(,分割):",
    name: "keywords",
  },
  {
    message: "请输入项目描述:",
    name: "description",
  },
  {
    message: "请输入作者名称:",
    name: "author",
  },
];
