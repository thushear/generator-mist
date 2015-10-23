var $ = require('zepto');

var defaults = {
    type        : 'big',    //native,big,small,text
    content     : '',
    wrap        : 'body',
    autoDestroy : false,
    disableWrap : true
};

var LoadingClass = function() {
    this.init(arguments[0]);
};



$.extend(LoadingClass.prototype, {

    init: function(config) {
        var that = this;
        $.extend(defaults, config);
        that._config = defaults;
        that.loadingInit();
    },

    loadingInit: function() {
        var that =this;

        if(that._config.wrap == 'body'){
            that.wrap = document.createElement('div');
            that.wrap.id = 'loading';
            that.wrap.style.cssText = [
                'display: none',
                'background: transparent',
                'position: fixed',
                'width: 100%',
                'height: 100%',
                'left: 0',
                'top: 0',
                'overflow: hidden',
                //'z-index: 99999',
                '-webkit-box-pack:center',
                '-webkit-box-align:center'
            ].join(';');
        }else{
            that.wrap = document.createElement('div');
            that.wrap.id = 'loading';
            that.wrap.style.display = 'none';
        }

        that._config.disableWrap && (that.wrap.style.zIndex = '99999');
    },

    _showLoading: function(text) {
        var that = this,
            container  = that._config.wrap;

        //避免loading重复append
        if($('div#loading').length){
            $('div#loading').remove();
        }
        that.wrap.innerHTML = text;
        document.querySelector(container).appendChild(that.wrap);
        if(that.wrap.style.display == 'none')
            that.wrap.style.display = container == 'body'?'-webkit-box' : 'block';
        // hack for GT-I9000, fuck I9000, #744645
        that.wrap.style.zIndex = 99999;
        setTimeout(function() {
            that.wrap.style.zIndex = 99999;
        }, 0);

//            var now = Date.now();
//            ids.push(now);
//            return now;
    },

    show: function() {

        var that = this,
            content = that._config.content,
            html;
        switch (that._config.type){
            case 'big':
                html = '<div class="m-page-loading" style=' + (that._config.width ? ('width:' + that._config.width + 'px;margin-left:-' + that._config.width/2 + 'px;'):'')
                + (that._config.height?('height:' + that._config.height + 'px;margin-top:-' + that._config.height/2 + 'px;') : '')
                + '><div></div><span class="base-loading-text">' + (content ? content : '加载中...') + '</span></div>';
                break;
            case 'small':
                html = '<span class="m-loading-icon"></span>';
                break;
            case 'text':
                html= ['<div class="m-loading">',
                    '<span class="m-loading-icon"></span>',
                    '<span class="m-loading-txt">'+content+'</span>',
                    '</div>'].join('');
                break;
        }
        if(that._config.type !='native')
            that._showLoading(html);
    },

    hide: function() {
        var that = this;

        switch (that._config.type){
            case 'big':
            case 'small':
            case 'text':
                that.wrap.style.display = 'none';
                break;
        }

        that._config.autoDestroy && that.destory();
    },


    destory: function(){
        var that = this,
            container  = that._config.wrap;

        $(that.wrap).empty();
        document.querySelector(container).removeChild(that.wrap);
    }
});

module.exports =  LoadingClass;

