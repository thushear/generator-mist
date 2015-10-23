
var Juicer = require('juicer');
function MenuItem(opt){
	this.init(opt);
}
MenuItem.prototype = {
	data:{
		title:""
	},
	class_name:"menuitem",
	on_class:"on",
	tpl:['<section class="##">',
			'<div class="head">',
				'<h3>${title}<i>&nbsp;</i></h3>',
			'</div>',
			'<div class="body">${body}</div>',
		'</section>'].join(""),
	init:function(opt){
		$.extend(true,this,opt);
		this.dom = $(this._getHtml());
		this._bindEvent();
	},
	_bindEvent:function(){
		var me = this;
		this.dom.on("tap",".head",function(){
			me.dom.toggleClass(me.on_class);
		})
	},
	_getHtml:function(){
		return Juicer(this.tpl, this.data).replace(/##/ig,this.class_name);
	}
}
/**
 * @author  zhuwenxuan
 * @class SliderMenu
 * @desc   移动端所用的简单菜单切换组件
 * @params {option}
 */
function SliderMenu(opt){
	this.init(opt);
}
$.extend(SliderMenu.prototype,{
	class_name:"lv_m_slidermenu",
	container:document.body,
	items:[{
		data:{
			title:"费用包含",
			body:"asdfasdfadsf"
		}
	},{
		data:{
			title:"行程详情",
			body:"3333"
		}
	},{
		data:{
			title:"产品详情",
			body:""
		}
	}],
	tpl:'<div class="##"></div>',
	init:function(opt){
		$.extend(this,opt);
		this.dom = this._getHtml();
		this._renderItem();
		this._render();
	},
	_bindEvent:function(){

	},
	_renderItem:function(){
		var items = [];
		for(var i=0;i<this.items.length;i++){
			this.dom.append(new MenuItem(this.items[i]).dom)
		}
	},
	_getHtml:function(){
		return $(this.tpl.replace(/##/ig,this.class_name));
	},
	_render:function(){
		$(this.container).append(this.dom);
	},
	destroy:function(){

	}
})

module.exports = SliderMenu