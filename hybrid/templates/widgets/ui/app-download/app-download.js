var appDownload = {
    init: function(){
        function isweixin() {
        var a = navigator.userAgent.toLowerCase();
        return /micromessenger/.test(a) ? !0 : !1
    }
    
    var link = $.os.ios ? 'https://itunes.apple.com/cn/app/id467046753?mt=8' : 'http://lvyou.baidu.com/event/s/app/baidutrip_andr_1000.apk';
    
    //微信内置浏览器使用前缀
    if (isweixin()){
        link = 'http://lvyou.baidu.com/app/baidulvyou?fr=webappplan';
    }
    
      var adwrap =$('<div class="fixed-app-download">'+
                //'<a class="close common-iconfont common-icon-close" pb-id="4744421"></a>'+
                '<a class="down-pic" href="'+link+'" pb-id="4744420">'+
                    '<img src="http://b.hiphotos.baidu.com/baidu/pic/item/738b4710b912c8fc800c4385fa039245d78821fe.png" width="35">'+
                '</a>'+
                '<a class="down-btn common-iconfont common-icon-download" href="'+link+'" pb-id="4744420">'+
                '</a>'+
                '<a href="'+link+'" pb-id="4744420">更多详情攻略</br>下载百度旅游</a>'+
            '</div>');
        adwrap.appendTo('body');
    //统计点击
    var id = 'ad-apps-download';
    var wrapper = $('.fixed-app-download');
    wrapper.on('touchend', '.close', function (e) {
        wrapper.animate({
            opacity: 0.2
        }, 500, 'ease-out', function () {
            wrapper.remove();
        });
         try{
            if (sessionStorage && !sessionStorage[id]) {
                sessionStorage[id] = '1';
            }
        }catch(e){

        }
                
        });
            
        try{
            if (sessionStorage && !sessionStorage[id]) {
             $('.fixed-app-download').show();
        }
        }catch(e){

        }
    }
	
            
};

module.exports = appDownload;