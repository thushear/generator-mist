var getImg = function(pic_url, webmapimg, limit_width, limit_height, quality) {
    if (!pic_url) {
        return "";
    }
    var is_full_pic = pic_url.indexOf("http");
    if(is_full_pic === -1){
        var fullurl = ["http://hiphotos.baidu.com/", "lvpics", "/pic/item/", pic_url, ".jpg"].join("");
    } else {
        var fullurl = pic_url;
    }

    if(webmapimg !== undefined && limit_width && limit_height){
        !quality && (quality = 100);
        if(window.devicePixelRatio && window.devicePixelRatio > 1){
            limit_width = 2 * limit_width;
            limit_height = 2 * limit_height;
        }
        return ["http://webmap", webmapimg, ".map.bdimg.com/maps/services/thumbnails",
            "?width=", limit_width,
            "&height=", limit_height,
            "&quality=", quality,
            "&align=middle,middle",
            "&src=", fullurl].join("");
    } else {
        return fullurl;
    }
};
module.exports.getImg = getImg;

var getAbImg = function(pic_url, webmapimg, limit_width, limit_height, quality) {
    if (!pic_url) {
        return "";
    }
    var is_full_pic = pic_url.indexOf("http");
    if(is_full_pic === -1){
        var fullurl = ["http://hiphotos.baidu.com/", "lvpics", "/abpic/item/", pic_url, ".jpg"].join("");
    } else {
        var fullurl = pic_url;
    }

    if(webmapimg !== undefined && limit_width && limit_height){
        !quality && (quality = 100);
        return ["http://webmap", webmapimg, ".map.bdimg.com/maps/services/thumbnails",
            "?width=", limit_width,
            "&height=", limit_height,
            "&quality=", quality,
            "&align=middle,middle",
            "&src=", fullurl].join("");
    } else {
        return fullurl;
    }
};
module.exports.getAbImg = getAbImg;
module.exports.createImage = function($href, $url, $originalWidth, $originalHeight, $limitWidth, $limitHeight, $big, $withoutTarget, $lazyload, $webmapimg, $quality) {
    !$originalWidth && ($originalWidth = 0);
    !$originalHeight && ($originalHeight = 0);
    var $width = 1;
    var $height = 1;
    if ($big) {
        $url = getImg($url, $webmapimg, $limitWidth, $limitHeight, $quality);
    } else {
        $url = getAbImg($url, $webmapimg, $limitWidth, $limitHeight, $quality);
    }

    var $targetAttr = '';
    if (!$withoutTarget) {
        $targetAttr = 'target="_blank"';
    }
    var $result = {};

    var $marginTop = 0,
        $marginLeft = 0;
    if ($originalWidth == 0) {
        $width = 1;
    } else {
        $width = $originalWidth;
    }

    if ($originalHeight == 0) {
        $height = 1;
    } else {
        $height = $originalHeight;
    }

    if($webmapimg !== undefined && $limitWidth && $limitHeight){
        if($limitWidth > $originalWidth && $originalWidth){
            //原图大小已知且小于容器大小时，“裁切后”图大小设为原图大小
            $width = $originalWidth;
        } else {
            //原图大小未知，反正是会被拉伸的，使用小图服务可以拼下运气，很可能切的大小就是容器大小
            $width = $limitWidth;
        }

        if($limitHeight > $originalHeight && $originalHeight){
            $height = $originalHeight;
        } else {
            $height = $limitHeight;
        }
    }


    var $rate_width = $limitWidth / $width;
    var $rate_height = $limitHeight / $height;
    if ($rate_width > $rate_height) { //压的比例越小则说明限制越明显
        $result["width"] = $limitWidth;
        $result["height"] = Math.round($height * $rate_width);
        $marginTop = -Math.round(($result["height"] - $limitHeight) / 2);
    } else {
        $result["height"] = $limitHeight;
        $result["width"] = Math.round($width * $rate_height);
        $marginLeft = -Math.round(($result["width"] - $limitWidth) / 2);
    }
    var $newWidth = $result['width'];
    var $newHeight = $result['height'];
    var linkStart = "";
    var linkEnd = "";
    if ($href) {
        linkStart = '<a ' + $targetAttr + ' href="' + $href + '">';
        linkEnd = "</a>";
    }
    //var $imageDom = '<table class="filled-image" style="margin-top: '+ baseMargin +'px;"><tr><td style="height: '+ tdHeight +'px;width: '+tdWidth+'px;">'+ linkStart +'<img class="center-img" width="' + $newWidth + '" height="' + $newHeight + '" src="'+ $url + '"/>' + linkEnd + '</td></tr></table>';
    var $imageDom = linkStart + '<img width="' + $newWidth + '" height="' + $newHeight + '" style="margin:' + $marginTop + 'px 0px 0px ' + $marginLeft + 'px" src="' + $url + '"/>' + linkEnd;
    //把src 换成 data-src
    if ($lazyload) {
        $imageDom = linkStart + '<img width="' + $newWidth + '" height="' + $newHeight + '" style="margin:' + $marginTop + 'px 0px 0px ' + $marginLeft + 'px" data-src="' + $url + '" ' + 'src="' + $lazyload + '"/>' + linkEnd;
    }

    return $imageDom;
};
