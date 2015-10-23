var generators = require('yeoman-generator');
var yosay = require('yosay');
var mkdirp = require('mkdirp');
var chalk = require('chalk');

module.exports = generators.Base.extend({
    constructor: function () {
        generators.Base.apply(this, arguments);
    },
    ask: function(){
        var done = this.async();

        this.log(yosay('百度旅游通用脚手架工具.'));

        var prompts = [{
            name: 'name',
            message: 'Name of Project?(e.g. fis2-plan)：'
        }];

        this.prompt(prompts, function (answers) {
            this.config = answers;
            done();
        }.bind(this));
    },
    write: function(){
        this.fs.copy([
                this.templatePath() + "/**",
            ],
            this.destinationPath()
        );
        //重写fis的各个config文件
        //首先提取fis的目录前缀，如fis2-event-hybrid，提取出event-hybrid
        this.config.preName = this.config.name.replace(/^fis2-/g, "");

        this.fs.copyTpl([
                this.templatePath('build.sh'),
                this.templatePath('fis-conf.js')
            ],
            this.destinationPath(),
            {
                config: this.config
            }
        );

        mkdirp('page');
        mkdirp('static');
        mkdirp('widget');
        mkdirp('test/ajax');
        mkdirp('test/page');
        chalk.red('Enjoy it.');
    }
});
