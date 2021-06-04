# qwy

> A Vue.js project

## 使用方式

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8089
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

## 使用淘宝镜像
由于国内网络原因，经常会导致npm 安装不成功，这个时候只能切换到国内的淘宝镜像解决安装失败的问题   

``` bash
# 临时使用
npm --registry https://registry.npm.taobao.org <your command>

# 持久使用
npm config set registry https://registry.npm.taobao.org

# 查看npm源地址
npm config get registry

# 使用cnpm（不推荐）
npm install -g cnpm --registry=https://registry.npm.taobao.org
```

## 解决node-sass无法正常编译安装

如果你在安装npm包的时候出现node-sass无法被正常安装，可尝试使用下面命令解决：
``` bash
# 使用管理员身份运行cmd
npm install --global windows-build-tools
```


