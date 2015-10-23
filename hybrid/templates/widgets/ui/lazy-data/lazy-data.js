/**
 * 延迟加载数据的组件
 * @author 闫斌(yanbin01@baidu.com)
 * @date 2015-7-26
 */
var $ = require('zepto');

function lazy() {
    this.config = arguments && arguments[0];
};

$.extend(lazy.prototype, {

    /**
     * 初始化函数，暴露给外部使用
     */
    init: function(){
        this._bind();
        this.loadConfig = {
            status: 'init' //'init','loading','end','over'四种状态
        };

    },

    /**
     * 事件绑定
     * @private
     */
    _bind: function(){
        var self = this,
            pageHeight,scrollHeight,bodyHeight;
        $(window).on('scroll', function(){
            this.bodyHeight = bodyHeight = $(document).height();
            this.pageHeight = pageHeight = $(window).height();
            self._handleLazyload(self, bodyHeight, pageHeight);
        });
        //根据self.loadConfig.status的当前状态，判断是否加载数据
        $(self).on('loadingEvent', function(){
            self.loadConfig.status = 'loading';
        });
        $(self).on('endLoadingEvent', function(){
            self.loadConfig.status = 'end';
        });
        $(self).on('overEvent', function(){
            self._detach(self);
        });
    },

    /**
     * 数据全部加载之后，设置状态位
     * @private
     */
    _detach: function(self){
        self.loadConfig.status = 'over';
    },

    /**
     * 处理窗口滚动的事件
     * @param self
     * @param bodyHeight
     * @param pageHeight
     * @private
     */
    _handleLazyload: function(self, bodyHeight, pageHeight){
        if($(window).scrollTop() + pageHeight + (self.config.offset || 50) >= bodyHeight) {
            //上次数据加载完成或者出错，或者第一次加载数据，才会加载下一次数据
            if(self.loadConfig.status == 'init' || self.loadConfig.status == 'end') {
                $(self).trigger('startLoadEvent');
            }
        }
    }
});

module.exports = lazy;