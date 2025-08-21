import shell from "shelljs";
import logSymbols from "./logSymbols.js";
import fs from "fs-extra";
import chalk from "chalk";
import {
  inquirerConfirm,
  inquirerChoose,
  inquirerInputs,
} from "./interactive.js";
import { removeDir, changePackageJson, npmInstall } from "./utils.js";
import { templates, messages } from "./constants.js";
import { clone } from "./gitClone.js";
const initAction = async (name, option) => {
  if (!shell.which("git")) {
    console.log(logSymbols.error, "运行脚本必须先安装git!");
    shell.exit(1);
  }
  // 验证name输入是否合法
  if (name.match(/[\u4E00-\u9FFF`~!@#$%&^*[\]()\\;:<.>/?]/g)) {
    console.log(logSymbols.error, "项目名称存在非法字符！");
    return;
  }

  let repository = "";
  if (option.template) {
    const template = templates.find(
      (template) => template.name === option.template
    );
    if (!template) {
      console.log(
        logSymbols.error,
        `不存在模板 ${chalk.yellow(option.template)}`
      );
      console.log(
        `\r\n运行${logSymbols.arrow} ${chalk.cyan(
          `yang-cli list`
        )} 查看所有可用模板\r\n`
      );
      return;
    }
    repository = template.value;
  } else {
    // 选择远程git项目模板
    const answer = await inquirerChoose("请选择项目模板:", templates);
    repository = answer.choose;
  }
  // 下载远程git项目模板

  // 验证是否存在${name}同名文件夹,如果存在
  // 1. 如果没有-f --force选项,提示用户是否删除同名文件夹
  // 2. 如果有-f --force选项,直接删除同名文件夹
  if (fs.existsSync(name) && !option.force) {
    console.log(
      logSymbols.warning,
      `已经存在项目文件夹${chalk.yellowBright(name)}`
    );
    //询问是否删除文件夹
    const answer = await inquirerConfirm(
      `是否删除文件夹${chalk.yellowBright(name)}?`
    );
    if (answer.confirm) {
      //删除
      await removeDir(name);
    } else {
      console.log(
        logSymbols.error,
        chalk.redBright(
          `项目创建失败,存在同名文件夹,${chalk.yellowBright(name)}`
        )
      );
      return;
    }
  } else if (fs.existsSync(name) && option.force) {
    console.log(
      logSymbols.warning,
      `已经存在项目文件夹${chalk.yellowBright(name)},强制删除`
    );
    //删除
    await removeDir(name);
  }

  try {
    await clone(repository, name);
  } catch (err) {
    console.log(logSymbols.error, err);
    shell.exit(1); // 下载失败直接退出
  }

  //判断命令行是否输入了-i --ignore选项，快速创建项目选项
  if (!option.ignore) {
    //输入提问
    const answers = await inquirerInputs(messages);
    console.log(answers);
    await changePackageJson(name, answers);
  }

  // 安装依赖
  npmInstall(name);
};

export default initAction;
