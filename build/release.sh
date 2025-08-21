#! /usr/bin/env sh
# 在任何命令出错的时候立即退出
set -e
# 输出提示信息
echo "输入新发布的版本号:"
# 等待用户输入，并将用户在终端输入的内容赋值给变量 VERSION
read VERSION
# 输出信息并且让用户输入信息
# -p 选项用于在输出前显示提示信息， -n1 选项表示只接受一个字符的输入
read -p "确认发布 $VERSION ? (y/n)" -n1

# echo "\r\n----$VERSION----$REPLY\r\n"
# 直接输出一个空行
echo

# if []是直接判断 if [[]]是模糊判断
if [[ $REPLY =~ ^[Yy]$ ]];
then
  if [[ `git status --porcelain` ]]; # 如果有未提交的文件
  then
    echo "\r\n工作目存在未提交的内容，需要提交\r\n"
    git add -A
    git commit -m "[commit]: $VERSION" # 提交版本信息log
  else
    echo "\r\n工作目录没有任何需要提交的内容，不建议发布新的版本\r\n"
    exit 1
  fi

  # 修改package.json中的版本号
  npm version $VERSION --message "[release]: $VERSION"

  # 提交修改到远程仓库main分支
  git push origin main

  # 提交tag到仓库
  git push origin refs/tags/v$VERSION

  # 发布到npm
  npm publish
else
  echo "取消发布"
fi