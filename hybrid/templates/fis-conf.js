var deploy = 'http://cp01-qa-lvyou-001.cp01.baidu.com:8080';

var cdndomain = ['http://lvyou0.bdimg.com', 'http://lvyou1.bdimg.com', 'http://lvyou2.bdimg.com', 'http://lvyou3.bdimg.com', 'http://lvyou4.bdimg.com'];


fis.config.merge({
    modules : {
        postprocessor : {
            js : 'jswrapper,require-async',
            html: 'require-async'
        },
        postpackager : ['autoload', 'simple']
    },
    settings : {
        postprocessor : {
            jswrapper : {
                type : 'amd'
            }
        },
        spriter: {
            csssprites: {
                margin: 50
            }
        }
    },
    roadmap : {
        domain: {
            '**.js': cdndomain,
            '**.css': cdndomain,
            'image': cdndomain,
            '**.less': cdndomain
        }
    },
    pack:{
        'pkg/modules-combine.js': [
            '/modules/**.js', '/widgets/ui/**.js'
        ]
    },
    deploy: {
        remote: [{
            receiver: deploy + '/static/receiver.php',
            from: '/static',
            subOnly : true,
            to: '/home/lv/webroot/static/<%=config.preName%>/static',
            exclude: /.*\.(?:svn|cvs|tar|rar|psd).*/
        },{
            receiver: deploy + '/static/receiver.php',
            from: '/page',
            subOnly : true,
            to: '/home/lv/webroot/static/<%=config.preName%>/page',
            exclude: /.*\.(?:svn|cvs|tar|rar|psd).*/
        }]
    }
});

fis.config.set('roadmap.path',  [
    {
        reg : /^\/pkg\/(.*\.(?:css|js))$/i,
        isMod:false,
        release: '/static/pkg/$1',
        url: '/static/<%=config.preName%>/static/pkg/$1'
    },{
        reg: /^\/lib\/(.*\.js)$/i,
        isMod : false,
        release: '/static/lib/$1',
        url: '/static/<%=config.preName%>/static/lib/$1'
    },{
        //一级同名组件，可以引用短路径，比如modules/jquery/juqery.js
        //直接引用为var $ = require('jquery');
        reg : /^\/modules\/([^\/]+)\/\1\.(js)$/i,
        //是组件化的，会被jswrapper包装
        isMod : true,
        //id为文件夹名
        id : '$1',
        release: '/static/modules/$1/$1' + '.js',
        url: '/static/<%=config.preName%>/static/modules/$1/$1' + '.js'
    },{
        //modules目录下的其他文件
        reg : /^\/modules\/(.*)\.(js)$/i,
        //是组件化的，会被jswrapper包装
        isMod : true,
        //id是去掉modules和.js后缀中间的部分
        id : '$1',
        release: '/static/modules/$1' + '.js',
        url: '/static/<%=config.preName%>/static/modules/$1' + '.js'
    },{
        //widgets
        reg : /^\/widgets\/(.*)\.(js)$/i,
        //是组件化的，会被jswrapper包装
        isMod : true,
        //id是去掉modules和.js后缀中间的部分
        id : '$1',
        release: '/static/widgets/$1' + '.js',
        url: '/static/<%=config.preName%>/static/widgets/$1' + '.js',
    },{
        //图片
        reg : /^\/widgets\/(.*\.(?:png|gif|webp))$/i,
        isMod:false,
        release: '/static/widgets/$1',
        url: '/static/<%=config.preName%>/static/widgets/$1'
    },{
        reg : /^\/widgets\/(.*)\.(?:css|less)$/i,
        release: '/static/widgets/$1' + '.css',
        url: '/static/<%=config.preName%>/static/widgets/$1' + '.css',
    },{
        reg : /^\/widgets\/(.*)\.(?:html)$/i,
        release: '/static/widgets/$1' + '.html',
        url: '/static/<%=config.preName%>/static/widgets/$1' + '.html',
    },{
        reg : /^\/widgets\/(.*)\.(?:json)$/i,
        release: '/static/widgets/$1' + '.json',
        url: '/static/<%=config.preName%>/static/widgets/$1' + '.json',
    },{
        reg:/^\/widgets\/(.*)\.(eot|svg|ttf|woff)$/i,
        release: '/static/widgets/$1' + '.$2',
        url: '/static/<%=config.preName%>/static/widgets/$1' + '.$2',
        useDomain: false
    },{
        //其他css文件
        reg : "**.css",
        //css文件会做csssprite处理
        useSprite : true
    }, {
        //readme文件，不要发布
        reg : /\/readme.md$/i,
        release : false
    }
]);

//将资源依赖文件map.js内联输出
fis.config.set('settings.postpackager.autoload.useInlineMap', true);

fis.config.set('modules.parser.less', 'less');
//将less文件编译为css
fis.config.set('roadmap.ext.less', 'css');
fis.config.set('modules.spriter', 'csssprites');