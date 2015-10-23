# generator-mist


### 介绍
generator-mist是为前端工程师打造的脚手架工具，目的是帮助各位FE快速的搭建出符合标准模块开发规范的项目结构代码、组件代码、页面代码。并针对同质化的运营活动页面，generator-mist可以快速初始化运营活动的项目工程文件和公用模版，使开发成本大幅减少。
generator-mist是基于[yeoman](http://yeoman.io/)搭建的手脚架工具，命名规范是generator-xxoo的形式，我们为自己的手脚架工具取名为mist。目前业界已经有不少优秀的手脚架工具，例如[generator-angularjs](https://github.com/yeoman/generator-angular),[generator-clam](https://github.com/aloysious/generator-clam)等。

### 安装generator-mist
* 首先确保你的电脑安装了nodejs，如果没有请自行安装
	`brew install node`
* 安装yeoman
	`npm install yo -g`
* 安装generator-mist
	`npm install generator-mist -g`
在命令行运行yo mist:h，如果你能看到欢迎界面和使用帮助，那么恭喜你，你已经成功安装了generator-mist

### 如何使用
`yo mist:h` 查看帮助文档。
`yo mist:hybrid` 在新模块生成hybrid解决方案，改方案包括多端适配、代码离线、静默升级、H5组件库等技术沉淀，可直接基于此架构进行业务开发。目录如下：
`yo mist:fisp` 在新模块构建一个基于fisp的项目骨架，主要用于pc业务，其中相关目录已经自动创建好，编译脚本和fis-conf.js也自动创建。目录如下：
`yo mist:page` 新建一个h5 html文件,可以选择是否继承公用模版。
`yo mist:widget 新建一个h5 widget文件夹，其中新建的文件夹中包括一个less文件，包括一个controller.js文件。controller.js中已经集成了基本的代码功能骨架。

### 后续升级
后续0.2.0的版本，计划开发运营活动页面代码骨架的一键生成，同时需要讲generator-mist和fis的编译流程打通。0.2.0的目的是，帮助前端工程师们快速搭建页面骨架，只需要在页面中填充物料即可，无需再关注前端代码。







