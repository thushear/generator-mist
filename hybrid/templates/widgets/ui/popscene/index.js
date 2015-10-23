var Juicer = require('juicer');

function PopScene(opt){
	this.init(opt);
}
PopScene.prototype = {
	class_name:"",
	tpl:['<div class="popscene">',
		'</div>'].join(''),
	has_header:false,
	init:function(opt){
		this.container = $(document.body);
		this.width = $(window).width();
		this.height= $(window).height();
		$.extend(this,opt);
		this.dom = $(this.render());
		this.dom.css({
			width:this.width,
			height:this.height,
			left:0
		})
		this.container.append(this.dom);
	},
	show:function(){
		this.dom.css("left",this.width).css("display","block").animate({
			left:0
		},200,"easing")
	},
	hide:function(){
		var me = this;
		this.dom.animate({
			left:this.width
		},200,"easing",function(){
			me.dom.css("display","none").css("left",0);
		})
	},
	render:function(){
		return Juicer(this.tpl,this);
	}
}
module.exports = PopScene;