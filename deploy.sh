#!/bin/bash
#安装依赖
# npm install -f
yarn install
#打包
npm run build:prod
#删除 nginx 执行文件夹下的文件
rm -rf /home/frontEnd/vue-demo/*

#将打包后的文件复制进行

# mv /tmp/myvue-automation/dist/*  /home/vue-demo
cp  -r /tmp/myvue-automation/dist/*   /home/frontEnd/vue-demo/
# mv  -r /tmp/myvue-automation/dist/*   /home/frontEnd/vue-demo/

#删除克隆后的代码
rm -rf /tmp/myvue-automation
