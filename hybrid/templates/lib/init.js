(function() {
    /**
     * 加载script
     * @param {Object} url
     * @param {Object} callback
     */
    function loadScript(url, callback) {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        script.onload = function() {
            callback();
        }
        document.head.appendChild(script);
    }

    /**
     * Ready
     * @param {Object} callback
     */
    window.onAppReady = function(callback) {
        var path;
        if(/baidutravel/i.test(navigator.userAgent)) {
            if (/\(i[^;]+;( U;)? CPU.+Mac OS X/.test(navigator.userAgent)) {
                path = __uri('/lib/cordova-lib/cordova-ios.js');
                document.body.classList.add('ios-wrap');
            }
            else {
                path = __uri('/lib/cordova-lib/cordova-android.js');
                document.body.classList.add('android-wrap');
            }
            loadScript(path, function() {
                require.async('Bridge', function() {
                    callback = callback || function(){};
                    document.addEventListener('deviceready', callback, false);
                })
            }); 
        } else {
            window.cordova = {};
            require.async('Bridge', function() {
                callback = callback || function(){};
                window.addEventListener('load', callback, false);
            })
        }
    }
})();