var generators = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = generators.Base.extend({
    constructor: function () {
        generators.Base.apply(this, arguments);
    },
    welcome: function(){
        this.log(yosay('百度旅游通用脚手架工具.'));
        this.log(chalk.green('yo mist:hybrid ') + chalk.bold('搭建hybrid架构'));
        this.log(chalk.green('yo mist:fisp ') + chalk.bold('初始化fisp模块'));
        this.log(chalk.green('yo mist:page ') + chalk.bold('初始化H5页面代码骨架'));
        this.log(chalk.green('yo mist:widget ') + chalk.bold('初始化一个widget'));
        this.log(chalk.green('yo mist:perfect(to do) ') + chalk.bold('初始化完美旅途运营活动的代码骨架'));
    }
});
