var Juicer = require('juicer');
/**
 * 固底组件
 * @class
 */

 /**
  * @constructs   FixBottom
  * @param    {object}    opt    配置属性
  * @property  {string}   opt.class_name    扩展类名
  * @property   {array}    opt.data     数据
  */
function FixBottom(opt){
	this.init(opt);
}
$.extend(FixBottom.prototype,{
	class_name:"",
	data:[],
	tpl:['<div class="lv_m_fixbottom ${class_name}">',
			'{@each data as item}',
			'<div class="lv_m_fixbottom-item">$${item.content}</div>',
			'{@/each}',
		'</div>'].join(""),
	init:function(opt){
		$.extend(this,opt);
		this.dom = this.getHtml();
		this.render();
	},
	getHtml:function(){
		return $(Juicer(this.tpl,this));
	},
	render:function(){
		$(document.body).append(this.dom);
	}
})
module.exports = FixBottom;