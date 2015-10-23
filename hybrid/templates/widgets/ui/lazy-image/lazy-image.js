/**
 * @file         懒加载图片
 * @author       huangjinjin<huangjinjin@baidu.com>
 * @description  
 */

/**
 * 用于页面图片懒加载，并可以对图片进行裁剪
 * 实例：
 * 一、使用： 
 *  var lazyImageLoader = require('ui/lazy-image/lazy-image');
 *  在页面渲染完之后，执行：
 *  lazyImageLoader.init();
 * 二、实例
 * 1. 
 *  <img src="默认图片路径" data-lazy-src="实际图片路径" width="100%" height="100">
 * =》 加载之后
 *  <div class="thumb-image-wrap" style="overflow:hidden; width:320px; height:100px; display:inline-block;">
 *     <img src="实际图片路径" width="320" height="140" style="opacity: 1; transition: opacity 1.5s linear; margin-top:-20px;">
 *  </div>
 * 
 * 2.
 *  <div class="image-wrap">
 *     <img src="默认图片路径" data-lazy-src="实际图片路径" data-lazy-wrap=true width="100" height="100"> 
 *  </div>
 * =》加载之后
 *  <div class="image-wrap">
 *     <img src="实际图片路径" width="140" height="100" style="opacity: 1; transition: opacity 1.5s linear; margin-left: 20px;"> 
 *  </div>
 */

var $ = require('zepto');

function LazyImageLoader() {
    this.config = arguments && arguments[0];
};

$.extend(LazyImageLoader.prototype, {
    
    init: function() {
        
        this.loaderVisible();
        
        this.listenerScroll();
    },
    
    /**
     * 加载可视区域中未被加载过的图片
     */
    loaderVisible: function(){
        var me = this;
        var h = $(window).height();
        $('[data-lazy-src]').each(function(i, e){
            var box = e.getBoundingClientRect();
            var t = box.top; 
            var b = box.bottom;
            if ((t<0&&b>0) ||(t>0&&t-h<0)) {
                me.loader(e);
            }
        });
    },
    
    /**
     * 监听页面滚动事件
     */
    listenerScroll: function() {
        var me = this;
        //监听滚动
        $(window).on('scroll', function(){
            me.loaderVisible();
        });
    },
    
    //创建wrap
    fixImage: function(image, width, height) {
        var $div = $('<div class="thumb-image-wrap"></div>');
        var $image = $(image);
        $div.css({
           display: 'inline-block',
           width: width,
           height: height,
           overflow: 'hidden',
        });
        $div.addClass($image.attr('class'));
        $div.append(image); 
        return $div;
    },
    
    //加载，裁剪，替换图片
    loader: function(defImage) {
        var me = this;
        var $defImage = $(defImage);
        var $p = $(defImage).parent();
        var url = $defImage.data('lazy-src');
        $defImage.removeAttr('data-lazy-src');
        this.loaderItem(url, function(){
            var $image = $(this);
            $image.css({
                'opacity': '.1',
                '-webkit-transition': 'opacity 1.2s linear',
                'transition': 'opacity 1.2s linear'
            });
            me.thumbImage(this, defImage.width, defImage.height);
            if(!$defImage.data('lazy-wrap')) {
                $image = me.fixImage(this, defImage.width, defImage.height);
                $p = $image;
            }
            $defImage.replaceWith($image);
            setTimeout(function () {
                $image.css('opacity', 1);
            },0)
        });
    },
    
    thumbImage: function (image, width, height) {
        if (image.width/image.height >= width/height) {
            image.width = image.width * height / image.height;
            image.height = height;
            image.style.marginLeft = '-' + (image.width - width)/2 + 'px';
        } else {
            image.height = image.height * width / image.width;
            image.width = width;
            image.style.marginTop = '-' + (image.height - height)/2 + 'px';
        }
    },
    
    loaderItem: function(url, sucess, fail) {
        var img = new Image();
        
        img.src = url;
        if (img.complete) { // 如果图片已经存在于浏览器缓存，直接调用回调函数
            $.isFunction(sucess) && sucess.call(img);
            return; // 直接返回，不用再处理onload事件
        }

        img.onload = function() {
            img.onload = null;
            $.isFunction(sucess) && sucess.call(img);
        };
        
        img.onerror = function () {
            img.onerror = null;
            $.isFunction(fail) && fail.call(img);
        }
    }
});

module.exports = new LazyImageLoader();
