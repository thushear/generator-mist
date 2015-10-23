var Juicer = require('juicer');
var Bridge = require('Bridge');
var $ = require('zepto');

function head(opt) {
    this.init(opt);
};

$.extend(head.prototype, {
    tpl: ["{@if hasHead}",
    	"<div class='base-nav'>",
        "<a href='${cback}' class=''></a>",
        "<h1 class='bn-title'>${title}</h1>",
        "</div>",
        "{@/if}"
    ].join(""),
    container: "document.body",
    cback: "javascript:history.go(-1);",
    title: "",
    hasHead:true,
    hasBack:true,
    init:function(opt){
		$.extend(this,opt);
		this.render();
        this.checkHead();
        this.initTitle();
	},
    checkHead:function(){
        var un = Bridge.getPlatform();
        if(un=="h5"){
            this.hasHead?this.show():this.hide();
        }else{
            this.hide();
        }
    },
    initTitle:function(){
        this.setTitle(this.title||document.title);
        !this.hasBack&&this.dom.find("a").hide();
    },
	getHtml:function(){
		return $(Juicer(this.tpl,this));
	},
	render:function(){
		this.dom = this.getHtml();
		$(this.container).append(this.dom);
	},
    show:function(){
        this.dom.show();
    },
    hide: function() {
        this.dom.hide();
    },
    setTitle: function(title) {
    	this.dom.find(".bn-title").html(title);
    }

});

module.exports = head;