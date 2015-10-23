var generators = require('yeoman-generator');
var yosay = require('yosay');

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
            name: 'name',
            message: '输入创建的html文件名：',
            default:'index.html'
        },{
            type: 'confirm',
            name: 'extend',
            message: '是否继承自公用页面模版？',
            default: true,
            when: function (answers) {
                return self.option('h5');
            }
        }];

        this.prompt(prompts, function (answers) {
            this.config = answers;
            done();
        }.bind(this));
    },
    write: function(){
        console.log(this.options['h5']);
        if(this.options['h5']) {//如果创建一个h5页面
            var template_page = '';
            if(this.config.extend) {
                template_page = 'index-extend.html';
            }
            else {
                template_page = 'index-original.html';
            }
            this.fs.copy(
                this.templatePath(template_page),
                this.destinationPath(this.config.name)
            );
        }
        else if(this.option('tpl')) {//创建一个基于smarty模版的pc页面

        }
    }
});
