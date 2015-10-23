/**
 * tracker组件，用于h5页面埋点、监控js报错以及性能参数
 * @author yanbin@baidu.com
 * @data 2015-9-14
 */

var zepto = require('zepto');

function Tracker() {}

$.extend(Tracker.prototype, {

    /**
     * 初始化函数
     * @private
     */
    init: function(config) {
        var self = this;
        //默认请求的1*1像素图片
        this.logUrl = "http://lvyou.baidu.com/click.gif";
        this.clientType = {
            'UNKNOWN'		: 0,  // 未知端
            'PC_WEB'		: 1,  // pc的web浏览器访问
            'WAP_COMMON'    : 2,  // 非智能机的wap浏览器访问
            'WAP_SMART'	    : 3,  // 智能机的wap浏览器访问
            'PAD_WEB'		: 4,  // pad上定制的web访问
            'PAD_APP'		: 5,  // pad上定制的app访问
            'PC_CLIENT'	    : 6,  // pc上的应用程序访问
            'MOBILE_APP'	: 7,  // 移动端的应用程序访问
            'SDK' 		    : 8,  // 通过sdk方式提供
            'API'   		: 9   // 通过api方式提供
        };
        //默认参数
        this.defaultParams = {
            "product_id":"lvyou",
            "lbs_lvyou_model": config.module,//模块名
            "da_trd": config.module, //模块名
            "da_src": config.page + "Pg", //页面名
            "lv_src": config.page, //页面名
            "da_abtest": config.abtest || '0', //是否为小流量
            "da_act": "",
            "referrer": document.referrer,
            "client_type": (self._isBaiduTravel())? self.clientType['MOBILE_APP'] : self.clientType['WAP_SMART']
        };
        var mylocation = (window.location.search).replace('?','');
        this.locationArr = mylocation.split('&');

        this._bindTap();
    },

    //判断是百度旅游客户端
    _isBaiduTravel: function(){
        return /baidutravel/i.test(navigator.userAgent);
    },

    /**
     * 模拟图片发送统计请求
     * @private
     */
    _imageReq: function(url, callback) {
        var n = 'pblog_' + (new Date()).getTime();
        //将image对象赋给全局变量，防止被当做垃圾回收，造成请求失败。
        var c = window[n] = new Image();
        c.onload = c.onerror = function(){
            window[n] = null; //垃圾回收
            callback && callback();
        };
        c.src = url;
        c = null;//垃圾回收
    },

    /**
     * 用户点击事件发送请求
     * @param config
     */
    tapLog: function(config){
        var self = this;
        if(typeof(config) == 'string'){
            var src = self.defaultParams.da_src;
            var block = config;
            config = {
                da_src: src + "." + block + 'Bk',
                lv_pos: block
            }
        }
        var params = $.extend({}, self.defaultParams,{
            "da_act": "click",
            "t": new Date().getTime()
        },config);
        $.each(self.locationArr, function(index,item){
            var itemArr = item.split('=');
            var urlField = itemArr[0];
            var urlValue = itemArr[1];
            self.defaultParams[urlField] = urlValue
        });
        self._imageReq(self.logUrl + '?' + $.param(params));
    },

    /**
     *
     * @param config
     */
    pvLog: function(config){
        var self = this;
        $.each(self.locationArr,function(index,item){
            var itemArr = item.split('=');
            var urlField = itemArr[0];
            var urlValue = itemArr[1];
            self.defaultParams[urlField] = urlValue
        });
        params = $.extend({},self.defaultParams,{
            "da_act": "pv",
            "lbs_lvyou_pv": (self._isBaiduTravel())? self.clientType["MOBILE_APP"] : self.clientType["WAP_SMART"],
            "t": new Date().getTime()
        },config);

        self._imageReq(self.logUrl + '?' + $.param(params));
    },

    /**
     * 统计和业务相关的埋点
     * @param config
     */
    showLog: function(config){
        var self = this;
        if(typeof(config) == 'string') {
            var src = self.defaultParams.da_src;
            var block = config;
            config = {
                da_src: src + "." + block + 'Bk',
                lv_pos: block
            }
        }
        var params = $.extend({}, self.defaultParams, {
            "da_act": "show",
            "t": new Date().getTime()
        }, config);
        $.each(self.locationArr, function(index,item){
            var itemArr = item.split('=');
            var urlField = itemArr[0];
            var urlValue = itemArr[1];
            self.defaultParams[urlField] = urlValue;
        });
        self._imageReq(self.logUrl + '?' + $.param(params));
    },

    _bindTap: function(){
        var self = this;
        $('body').on('tap', '[pb_id]', function(e){
            var t = e.currentTarget;
            var pbid = $(t).attr('pb_id');
            self.tapLog(pbid);
        });
    }
});

module.exports = new Tracker();
