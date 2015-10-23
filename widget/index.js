var generators = require('yeoman-generator');
var yosay = require('yosay');
var mkdirp = require('mkdirp');

module.exports = generators.Base.extend({
    constructor: function () {
        generators.Base.apply(this, arguments);
        this.option('h5', {
            desc: 'Create a h5 page',
            type: Boolean,
            defaults: true
        });

        this.option('tpl', {
            desc: 'Create a pc page based on smarty',
            type: Boolean,
            defaults: false
        });
    },
    ask: function(){
        var self = this;

        var done = this.async();

        this.log(yosay('百度旅游通用脚手架工具.'));

        var prompts = [{
            name: 'widgetName',
            message: '输入创建的widgets文件名：',
            default:'detail'
        }];

        this.prompt(prompts, function (answers) {
            this.config = answers;
            done();
        }.bind(this));
    },
    write: function(){
        if(this.options['h5']) {//如果创建一个hybrid的widget
            this.fs.copyTpl(
                this.templatePath('h5/controller.js'),
                this.destinationPath(this.config.widgetName + '/controller.js'),
                {
                    config: this.config
                }
            );
            this.fs.copy(
                this.templatePath('h5/index.less'),
                this.destinationPath(this.config.widgetName + '/' + this.config.widgetName + '.less')
            );
            mkdirp(this.config.widgetName + '/' + 'img');
        }
        else if(this.option('tpl')) {//创建一个基于smarty模版的widget

        }
    }
});
