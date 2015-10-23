var Juicer = require('juicer');
var $ = require('zepto');
var Bridge = require('Bridge');
var utils = require('ui/utils/index');
var Notification = require('ui/notification/index');
var Tracker = require('Tracker');

function <%=config.widgetName%>Ctl() {
    this._init(arguments && arguments[0]);
}

$.extend(<%=config.widgetName%>Ctl.prototype, {

    /**
     * 初始化函数，自动调用
     * @private
     */
    _init: function(config){
        this._initTracker();
        this._bind();
        this._getData();
    },

    /**
     * 初始化tracker组件
     * @private
     */
    _initTracker: function(){
        //初始化track组件，重要
        Tracker.init({
            module: '',
            page: '<%=config.widgetName%>'
        });
        //发送pv统计
        Tracker.pvLog();
    },

    /**
     * 事件绑定相关函数
     * @private
     */
    _bind: function(){
        var self = this;
        //如果数据请求报错
        $(self).on('event-error-load', function(){
            Bridge.Util.hideLoading();
            $('.J_Wrap').html($('#errorMsgTpl').html());
        });
        $('.J_Wrap').on('tap', '.m-error-btn', function(){
            self._getData();
        });
        //以下是业务相关的点击事件
        $('.J_Wrap').on('tap', '', function(){

        });
    },

    /**
     * 加载页面数据
     * @private
     */
    _getData: function(){
        var self = this;
        var url = '';
        Bridge.Util.showLoading({
            type: 'big'
        });
        Bridge.Loader.get({
            url: url,
            success: function(data){
                if(data.errno == 0) {
                    Bridge.Util.hideLoading();
                    //返回数据处理逻辑
                }
                else {
                    $(self).trigger('event-error-load');
                }
            },
            error: function(){
                $(self).trigger('event-error-load');
            }
        });
    }
});

module.exports = <%=config.widgetName%>Ctl;
