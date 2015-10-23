// 沙盒
var deploy = "http://cp01-qa-lvyou-001.cp01.baidu.com:8080";

var cdndomain = ['http://lvyou0.bdimg.com', 'http://lvyou1.bdimg.com', 'http://lvyou2.bdimg.com', 'http://lvyou3.bdimg.com', 'http://lvyou4.bdimg.com'];
fis.config.merge({
    namespace : '<%=config.preName%>',
    roadmap : {
        domain: {
            '**.js': cdndomain,
            '**.css': cdndomain,
            'image' : cdndomain
        }
    },
    pack : {

    },
    modules : {
        optimizer : {
            js: 'uglify-js',
            css: 'clean-css'
        }
    },
    settings: {
        spriter: {
            csssprites: {
                margin: 50
            }
        }
    },
    deploy: {
        remote: [{
            //如果配置了receiver，fis会把文件逐个post到接收端上
            receiver : deploy + '/static/receiver.php',
            //从产出的结果的static目录下找文件
            from : '/static/<%=config.preName%>',
            //上传目录从static下一级开始不包括static目录
            subOnly : true,
            //保存到远端机器的/home/fis/www/static目录下
            //这个参数会跟随post请求一起发送
            to : '/home/lv/webroot/static/<%=config.preName%>',
            //某些后缀的文件不进行上传
            exclude : /.*\.(?:svn|cvs|tar|rar|psd).*/
        },
        {
            //如果配置了receiver，fis会把文件逐个post到接收端上
            receiver : deploy + '/static/receiver.php',
            //从产出的结果的config目录下找文件
            from : '/config',
            subOnly: true,
            //保存到远端机器的/home/fis/www/config目录下
            //这个参数会跟随post请求一起发送
            to : '/home/lv/template/config',
            //某些后缀的文件不进行上传
            exclude : /.*\.(?:svn|cvs|tar|rar|psd).*/
        },{
            //如果配置了receiver，fis会把文件逐个post到接收端上
            receiver : deploy + '/static/receiver.php',
            //从产出的结果的template目录下找文件
            from : '/template/<%=config.preName%>',
            subOnly: true,
            //保存到远端机器的/home/fis/www/template目录下
            //这个参数会跟随post请求一起发送
            to : '/home/lv/template/<%=config.preName%>',
            //某些后缀的文件不进行上传
            exclude : /.*\.(?:svn|cvs|tar|rar|psd).*/
        }]
    }
});

fis.config.get('roadmap.path').unshift(
    {
        reg: /\/widget\/(.*)\.html$/i,
        release: "/static/${namespace}/widget/$1.html",
        useHash: true
    },
    {
        reg: /\/widget\/(.*)\.ejs$/i,
        release: "/static/${namespace}/widget/$1.ejs",
        useHash: true
    },{
        reg : '**.swf',
        release: '${statics}/${namespace}$&',
        useDomain: false
    }
);
