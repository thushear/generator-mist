/*
 * Bridge (Hybrid api for h5 and baidutravel app.)
 * Created by yanbin(yanbin01@baidu.com) huangjinjin(huangjinjin@baidu.com)
 */
// Bridge是为H5和客户端交互通讯而产生的一个中间件，即一个JavaScript的SDK。负责处理H5和客户端的方法调用、通信及H5页面自身的降级处理（非内嵌在客户端的情况）。

var Loader = require('ui/loader/index');

var Bridge = function () {
    this.init.apply(this, arguments);
};

var empty = function(){}; 

Bridge.prototype = {
    // 版本号
    version: '0.0.1',

    //标记设备信息
    device: {},

    //标记客户端信息
    client: {},

    //标记网络信息
    connection: {},


    // 桥初始化
    init: function (bridgeName) {
        var that = this;
        
        that.isClient = that.isBaiduTravel();
        that.platform = that.isClient ? 'app' : 'h5';
        that.bridgeName = bridgeName || 'baidutravel_webview_bridge';
        that.bridge = window[that.bridgeName];

        that.getDeviceInfo();
        that.getPlatform();
        that.getClientInfo();

        //that._bind();

    },

    //事件挂载处理函数
    _bind: function(){
        //页面重新激活时，NA会在document上触发refresh函数
        document.addEventListener('refresh', function(){
            bridge.reActive();
        });
    },

    //判断是百度旅游客户端
    isBaiduTravel: function(){
        return /baidutravel/i.test(navigator.userAgent);
    },
    //判断是否是微信客户端
    isWechat: function() {
        return /micromessenger/.test(navigator.userAgent.toLowerCase()) ? !0 : !1
    },

    //隐藏titlebar
    hideTitle:function(){

    },

    // 客户端生存环境下设置WebView顶部的标题显示文案
    // - 对于浏览器则直接更改页面的标题文案
    // - 子标题为可选参数，只适用在客户端内嵌的情况。
    setTitle: function (title, success, fail) {
        if (bridge.isClient) {
            bridge._exec({
                module: 'LVUtils',
                method: 'SetTitle',
                parameter: [title],
                succ: success,
                fail: fail
            });
        }
        else {
            document.title = title;
        }
    },

    // 获取设备信息：IOS/Android
    getDeviceInfo: function() {
        var ua = navigator.userAgent;

        //设备类型
        if (/\(i[^;]+;( U;)? CPU.+Mac OS X/.test(ua)) {
            this.device.type = 'ios';
        } else if (/Android/i.test(ua)) {
            this.device.type = 'android';
            var match   = ua.match(/Android\s+([\d\.]+)/i);
            this.device.version = match[1];

        } else {
            this.device.type = undefined;
        }

        return this.device;
    },

    //获取平台类型
    getPlatform: function() {
        var match = navigator.userAgent.match(/baidutravel[\s\/][\d\.]+/igm);
        if (match) {
            if (this.device.type) {
                this.platform = this.device.type;
            }
            this.client.version = parseInt(match[0].match(/[\d\.]+/igm)[0].split('.').join(''), 10);
            this.client.versionStr = match[0].match(/[\d\.]+/igm)[0];
        }

        return this.platform;
    },

    //获取客户端信息
    getClientInfo: function () {

    },

    // 获取用户信息
    getUserInfo:function(){

    },

    //判断用户是否登录
    isLogin: function(){

    },

    //唤起登录页面
    login: function(){
        window.location.href = 'lv://Panel?type=login';
    },

    // 获取定位信息
    getGPSInfo:function(){

    },

    //获取网络信息 -- 主要恢复以前的功能
    getWifiInfo: function(){

    },


    // 主要API，用于页面同客户端的协议回调，通过phonegap暴露的全局变量调用NA的方法
    _exec: function (options) {
        options.parameter = options.parameter || [];
        options.succ = options.succ || empty;
        options.fail = options.fail || empty;
        cordova.exec(options.succ, options.fail, options.module, options.method, options.parameter);
    },

    // 发送uri scheme
    sendUriScheme:function(uri, newProxy, events){

    },


    //获取url参数
    getRequestParam: function (uri, param) {
        var value;
        if(!param){
            param   = uri;
            uri = window.location.href;
        }
        uri = uri || window.location.href;
        value = uri.match(new RegExp('[\?\&]' + param + '=([^\&]*)(\&?)', 'i'));
        return value ? decodeURIComponent(value[1]) : value;
    },

    //获取多个url参数
    getRequestParams: function (uri) {
        var search = location.search.substring(1);
        uri = uri || window.location.href;
        return search ? JSON.parse('{"' + search.replace(/&/g, '","').replace(/=/g, '":"') + '"}', function (key, value) {
            return key === "" ? value : decodeURIComponent(value);
        }) : {};
    },

    //下载数据离线包相关
    Offline: {
        getOfflinePackageInfo: function(callback, fallback) {
            if (bridge.isClient) {
                bridge._exec({
                    module: 'LVUtils',
                    method: 'GetOfflinePackageInfo',
                    parameter: [],
                    succ: function(ret){
                        ret = JSON.parse(ret);
                        $.isFunction(callback) && callback.call(null, ret);
                    },
                    fail: function(){}
                });
            }
        },

        downloadOfflinePackage: function(){
            bridge._exec({
                module: 'LVUtils',
                method: 'DownloadOfflinePackage',
                parameter: [],
                succ: function(){},
                fail: function(){}
            });
        }
    },

    //请求数据相关，在webview用NA作为代理，webapp走ajax异步请求
    Loader: {
        
        nativeLoadData: function(options) {
            bridge._exec({
                module: 'LVLoader',
                method: 'startFetchData',
                parameter: [options.url, options.type, options.data],
                succ: function(ret) {
                    try {
                        ret = JSON.parse(ret);
                    } catch(e) {}
                    $.isFunction(options.success) && options.success.call(null, ret);
                },
                fail: function(ret) {
                    try {
                        ret = JSON.parse(ret);
                    } catch(e) {}
                    $.isFunction(options.error) && options.error.call(null, ret);
                }
            });
        },
        
        post: function(options){
            options.type = 'post';
            if (bridge.isClient) {
                this.nativeLoadData(options);
            } else {
                options.dataType = options.contentType || 'json';
                options.timeout = options.timeout || 5000;
                $.ajax(options);
            }
        },
        get: function(options){
            options.type = 'get';
            if (bridge.isClient) {
                this.nativeLoadData(options);
            } else {
                options.dataType = options.dataType || 'json';
                options.timeout = options.timeout || 5000;
                $.ajax(options);
            }
        }
    },

    notification: {

        // alert弹框
        alert: function (message) {

        },

        // confirm确认对话框
        confirm: function (message) {

        },

        // prompt提示对话框
        prompt: function (message) {

        },

        // 弱提示
        toast: function (message, milliseconds, callback) {

        },

        // 蜂鸣
        beep: function (times) {

        },

        // 震动
        vibrate: function (milliseconds) {

        }
    },

    //当前webview被重新唤起时的处理函数
    reActive: function(func) {
        typeof func == 'function' && func.call(null);
    },

    // 新开浏览器页面
    // - 浏览器生存环境下打开新的标签页
    // - 客户端生存环境下则调用系统浏览器打开相应新的页面。
    openBrowser: function (url) {

    },

    // ***针对IOS***，跳转并打开AppStore的相应地址，对于浏览器而言则在新标签中打开对应的应用地址。
    openAppStore: function (url) {

    },

    // 打开客户端页面
    // - 客户端生存环境中直接打开
    // - 浏览器生存环境下唤起客户端并打开指定页面
    // - @param {string} pagename 页面名称
    // - @param {object} data 传递数据，入参
    openAppPage: function (pagename, data, webappConfig) {
        data = data || '';
        if(bridge.isClient) {
            if (typeof data === 'object') {
                data = JSON.stringify(data);
            }
            bridge._exec({
                module: 'LVRouter',
                method: 'webViewToNative',
                parameter: [pagename, data],
            });
        } else {
            if(webappConfig && webappConfig.url) {
                location.href = webappConfig.url;
            }
        }
    },

    pageGoTo: function () {
    },

    // 唤醒客户端，并打开指定页面
    wakeUp: function (options) {

    },

    // 将外部用户导向客户端
    // 1. 未安装：导向 IOS AppStore或 Android 下载页，下载安装
    // 2. 已安装：直接唤起客户端并打开指定页面
    router: function router(options) {

    },





    // 配置Native 标题栏左右button。
    // - `isLeft`可选，默认`false`，是否为左侧button，只适用在客户端内嵌的情况。
    setTitleButton: function (title, clickCallback, isLeft) {
        if (this.platform === 'h5') {
            return;
        }


    },

    // 跳转到相应的客户端页面
    open: function () {

    },

    // 打开一个新的窗口webview，以栈的方式来管理窗口webview
    pushWindow:function(options, callback){
        options.apperance = options.apperance || 1;
        if(this.isClient) {
            bridge._exec({
                module: 'LVRouter',
                method: 'navigateToWebView',
                parameter: [options.url, options.apperance],
                succ: callback,
                fail: callback
            });
        }
        else {
            if(options && options.webUrl) {
                location.href = options.webUrl;
            }
        }
    },

    // 把栈顶的窗口关闭，以栈的方式来管理窗口
    popWindow:function(callback){

    },

    //通过window切换页面
    goTo:function(options, noUseWV, noUseTripBridge){

    },

    // 返回上一页
    // - 对于浏览器而言，直接调用`history.back`返回上一个历史记录
    // - 对于客户端而言则通过协议调用返回上一个WebView打开的相应页面。
    back: function (pagename, params, noUseWV) {
        if(this.isClient) {
            bridge._exec({
                module: 'LVRouter',
                method: 'navigateBack',
                parameter: params || []
            });
        }
        else {
            history.back();
        }
    },

    // 关闭当前的客户端页面，如果有额外的数据则通过`ext`参数传递给客户端。
    close: function (ext) {

    },

    // 显示客户端Loading
    openLoadingView: function (params) {

    },

    // 隐藏客户端的Loading框
    closeLoadingView: function (callback) {

    },

    /**
     * 分享
     */
    share: function(succ, fail){
        bridge._exec({
            module: 'LVUtils',
            method: 'ShareTOSNS',
            parameter: [],
            succ: function(ret) {
                $.isFunction(succ) && succ.call(null, ret);
            },
            fail: function(ret) {
                $.isFunction(fail) && fail.call(null, ret);
            }
        });
    },
    /**
     * 分享此刻
     */
    shareTime: function(succ, fail){
        bridge._exec({
            module: 'LVUtils',
            method: 'photoAndShareThisMoment',
            parameter: [],
            succ: function(ret) {
                $.isFunction(succ) && succ.call(null, ret);
            },
            fail: function(ret) {
                $.isFunction(fail) && fail.call(null, ret);
            }
        });
    },
    //点评
    addComment:function(succ,fail){
        bridge._exec({
            module: 'LVUtils',
            method: 'AddComments',
            parameter: [],
            succ: function(ret) {
                $.isFunction(succ) && succ.call(null, ret);
            },
            fail: function(ret) {
                $.isFunction(fail) && fail.call(null, ret);
            }
        });
    },
    //评论列表
    commonList: function(json,succ,fail){
        //for android 传json。ios不需要参数
        var parms = json || "";
        bridge._exec({
            module: 'LVUtils',
            method: 'CommentsList',
            parameter: [parms],
            succ: function(ret) {
                $.isFunction(succ) && succ.call(null, ret);
            },
            fail: function(ret) {
                $.isFunction(fail) && fail.call(null, ret);
            }
        });
    },
    //获取当前地理信息
    getCurrentLocal: function(succ,fail){
        if(bridge.isClient) {
            bridge._exec({
                module: 'LVUtils',
                method: 'GetLocatonInfo',
                parameter: [],
                succ: function(ret) {
                    $.isFunction(succ) && succ.call(null, ret);
                },
                fail: function(ret) {
                    $.isFunction(fail) && fail.call(null, ret);
                }
            });
        }
    },
    
    //收藏
    Favorite: {
        
        TYPE: {
            'NOTES': 1,
            'PICTRAVEL': 9,
            'DESTINATION': 10,
            'SCENIC': 11,
            'ACTIVITY': 12
        },
        
        add: function(sid, type, succ, fail) {
            bridge._exec({
                module: 'LVUtils',
                method: 'AddFavorite',
                parameter: [sid, type],
                succ: function(ret) {
                    $.isFunction(succ) && succ.call(null, ret);
                },
                fail: function(ret) {
                    $.isFunction(fail) && fail.call(null, ret);
                }
            });
        },
        get: function(sid, type, succ, fail){
            if(bridge.isClient) {
                bridge._exec({
                    module:'LVUtils',
                    method:"ISFavorite",
                    parameter: [sid, type],
                    succ: function(ret) {
                        $.isFunction(succ) && succ.call(null, ret);
                    },
                    fail: function(ret) {
                        $.isFunction(fail) && fail.call(null, ret);
                    }
                })
            }
        },
        
        remove: function(sid, type, fids, succ, fail) {
            bridge._exec({
                module: 'LVUtils',
                method: 'RemoveFavorite',
                parameter: [sid, type, fids],
                succ: function(ret) {
                    $.isFunction(succ) && succ.call(null, ret);
                },
                fail: function(ret) {
                    $.isFunction(fail) && fail.call(null, ret);
                }
            });
        }
    },

    //足迹相关
    FooPrint: {
        add: function(sid, succ, fail){
            bridge._exec({
                module: 'LVUtils',
                method: 'AddFootPrint',
                parameter: [sid],
                succ: function(ret) {
                    $.isFunction(succ) && succ.call(null, ret);
                },
                fail: function(ret) {
                    $.isFunction(fail) && fail.call(null, ret);
                }
            });
        },
        remove: function(sid, succ, fail){
            bridge._exec({
                module: 'LVUtils',
                method: 'RemoveFootPrint',
                parameter: [sid],
                succ: function(ret) {
                    $.isFunction(succ) && succ.call(null, ret);
                },
                fail: function(ret) {
                    $.isFunction(fail) && fail.call(null, ret);
                }
            });
        }
    },

    //工具类
    Util: {
        //展示loading框
        showLoading: function(config) {
            if(config.type == 'big') {
                this.loader = new Loader(config);
                this.loader.show();
            }
            else if(bridge.isClient) {

            } else {
                this.loader = new Loader(config);
                this.loader.show();
            }
        },
        
        //隐藏loading框
        hideLoading: function() {
            if(this.loader) {
                this.loader.hide();
            }
            else if(bridge.isClient) {
                bridge._exec({
                    module: 'LVUtils',
                    method: 'HideLoading',
                    parameter: []
                });
            }
        },
        
        showError: function(msg) {
            if(bridge.isClient) {
                bridge._exec({
                    module: 'LVUtils',
                    method: 'ShowError',
                    parameter: [msg]
                });
            } else {

            }
        },

        //获取bdstoken，用于用户验证相关
        getToken: function(success, fail) {
            bridge._exec({
                module: 'LVUtils',
                method: 'GetToken',
                parameter: [],
                succ: success,
                fail: fail
            });
        }

    },

    //统计、埋点相关
    Log:{
        setPoint: function(config, success, fail){
            if(bridge.isClient) {
                bridge._exec({
                    module: 'LVMtj',
                    method: 'mtjLogEvent',
                    parameter: [config.page, config.label],
                    succ: success,
                    fail: fail
                });
            }
            else {
                //h5打点
            }
        }
    },
    
    //数据交互
    Data: {
        set: function(key, value, success, fail) {
            if(bridge.isClient) {
                bridge._exec({
                    module: 'LVCache',
                    method: 'SaveData',
                    parameter: [key, value],
                    succ: success,
                    fail: fail
                });
            } else {
                if (window.localStorage) {
                    localStorage.setItem(key, value);
                    success && success.call(null, [key, value]);
                }
            }
        },
        
        get: function(key, success, fail) {
            if(bridge.isClient) {
                //wtf  居然是回调，好坑爹！！
                bridge._exec({
                    module: 'LVCache',
                    method: 'GetData',
                    parameter: [key],
                    succ: success,
                    fail: fail
                });
             } else {
                if (window.localStorage) {
                    success && success.call(null, localStorage.getItem(key));
                    return localStorage.getItem(key);
                }
             }
        }
    },
    
    //图片
    getImage: function(string, success, fail) {
	    if(bridge.isClient) {
    	    if (/^http/.test(string)) {
    	        bridge._exec({
                    module: 'LVCache',
                    method: 'imageCache',
                    parameter: [string],
                    succ: success,
                    fail: fail
                });
    	    } else {
    	        bridge._exec({
                    module: 'LVCache',
                    method: 'imageNative',
                    parameter: [string],
                    succ: success,
                    fail: fail
                });
    	    }
	    } else {
	        if (success && $.isFunction(success)) {
	            success.call(null, string);
	        }
	    }
	}
    
};

//extend
function extend(oa, ob) {
    for (var k in ob) {
        if (ob.hasOwnProperty(k) && ob[k] !== undefined) {
            oa[k] = ob[k];
        }
    }
    return oa;
}


//唯一标志符生成器
function buildRandom() {
    var random = new Date().getTime() + '_' + parseInt(Math.random() * 1000000);
    return random;
}

//获取绝对地址
function getAbsoultePath(href) {
    var link = document.createElement('a');
    link.href = href;
    return (link.protocol + '//' + link.host + link.pathname + link.search + link.hash);
}


/*
 document.addEventListener('DOMContentLoaded', function () {
 Bridge.Global.closeLoadingView();
 }, false);


 window.addEventListener('load', function () {
 Bridge.Global.closeLoadingView();
 }, false);


 if (document.readyState === 'complete') {
 Bridge.Global.closeLoadingView();
 }
 */
// 在global下暴露
this.Bridge = Bridge;

// 提供全局Global桥
var bridge = new Bridge();
Bridge.Global = bridge;

module.exports = Bridge.Global;


