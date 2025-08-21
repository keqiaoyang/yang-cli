#! /usr/bin/env node

import figlet from "figlet";
import chalk from "chalk";
import { program } from "commander";
import { templates } from "./constants.js";
import fs from "fs-extra";
import logSymbols from "./logSymbols.js";
import { table } from "table";
import initAction from "./initAction.js";

const pkg = JSON.parse(
  fs.readFileSync(new URL("./package.json", import.meta.url))
);
program.version(pkg.version, "-v, --version", "output the current version");

program
  .name("yang-cli")
  .description("一个快速创建项目工具")
  .usage("<command> [options]")
  .on("--help", () => {
    console.log(
      "\r\n" +
        chalk.greenBright.bold(
          figlet.textSync("yang-cli", {
            font: "Standard",
            horizontalLayout: "default",
            verticalLayout: "default",
            width: 80,
            whitespaceBreak: true,
          })
        )
    );

    console.log(
      `\r\n Run ${chalk.cyan(
        `yang-cli <command> --help`
      )} for detailed usage of given command.`
    );
  });

program
  .command("create <project-name>")
  .description("创建一个新的项目")
  .option("-f, --force", "覆盖同名项目")
  .option("-t, --template <template>", "指定项目模板")
  .action((projectName, options) => {
    initAction(projectName, options);
  });

program
  .command("list")
  .description("列出可用的项目模板")
  .action(() => {
    // 转换为二维数组
    const data = templates.map((item) => [
      chalk.bold.yellowBright(item.name),
      item.value,
      item.description,
    ]);
    data.unshift([
      chalk.yellowBright("模板名称"),
      chalk.yellowBright("模板地址"),
      chalk.yellowBright("模板描述"),
    ]);
    const config = {
      header: {
        alignment: "center",
        content: chalk.yellowBright(logSymbols.star + " 模板列表"),
      },
    };
    console.log(table(data, config));
  });

program.parse(process.argv);
