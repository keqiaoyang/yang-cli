import download from "download-git-repo";
import ora from "ora";
import chalk from "chalk";
export const clone = (repo, target) => {
  const spinner = ora("正在拉取项目，请稍候......").start();
  return new Promise((resolve, reject) => {
    download(repo, target, (err) => {
      if (err) {
        spinner.fail(chalk.red(err));
        reject(err);
      } else {
        spinner.succeed(chalk.green("项目拉取成功"));
        resolve();
      }
    });
  });
};
