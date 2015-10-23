/**
 * <input type='number' />组件
 * @author 闫斌(yanbin01@baidu.com)
 * @version 0.1.0
 * @date 2015-7-4
 */
var $ = require('zepto');

var inputNumber = function(){
    this.config = arguments && arguments[0];
}

$.extend(inputNumber.prototype, {

    /**
     * 初始化函数，暴露给外部
     */
    init: function() {
        this.ctn = $(this.config.ctn);
        this.decrease = this.ctn.find('.decrease');
        this.increase = this.ctn.find('.increase');
        this.inputField = this.ctn.find('.num-input');
        this.max = parseInt(this.config.max);
        this.min = parseInt(this.config.min);
        this.step = parseInt(this.config.step || 1);
        this.tip = this.config.tip || '';
        this._bind();
        this.setValue(this.config.defaultValue || 0);
    },

    _bind: function(){
        var self = this;
        this.ctn.on('tap', '.decrease, .increase', function(e){
            self._handleClick(e, self);
        });
        this.inputField.on('change', function(e){
            self._handleInputChange(e, self);
        });
        $(self).bind('maxValue', self._handleErrMsg);
        $(self).bind('minValue', self._handleErrMsg);
        $(self).bind('invalidValue', self._handleErrMsg)
        $(self).bind('decreaseValue', self._decrease);
        $(self).bind('increaseValue', self._increase);
        $(self).bind('changeValue', self._handleChangeValue);
    },

    _handleInputChange: function(e, self){
        var v = parseInt(self.inputField.html());
        if(isNaN(v)) {
            $(self).trigger('invalidValue');
            setTimeout(function(){
                self.setValue(self._val);
            }, 1000);
            return;
        }
        if(v > this.max) {
            $(self).trigger('maxValue');
            setTimeout(function(){
                self.setValue(self._val);
            }, 1000);
        }
        else if(v < this.min) {
            $(self).trigger('minValue');
            setTimeout(function(){
                self.setValue(self._val);
            }, 1000);
        }
        else {
            self.setValue(v);
            $(self).trigger('changeValue', {value: v});
        }
    },

    _handleChangeValue: function(e){
        if(this.ctn.find('.tip')[0]) {
            this.ctn.find('.tip').remove();
        }
    },
    _handleErrMsg: function(e){
        var msg;
        if(e.type == 'invalidValue') {
            msg = '输入格式错误';
        }
        else {
            msg = (e.type === 'minValue' ? (this.tip + '不能低于' + this.min): '数量已超过可以购买的最大值');
        }
        $(this).trigger('errorValue', msg);
    },

    _handleClick: function(e, self){
        var target = $(e.currentTarget);
        if(target.hasClass('decrease')) {
            $(self).trigger('decreaseValue');
        }
        else if(target.hasClass('increase')) {
            $(self).trigger('increaseValue');
        }
    },

    _increase: function() {
        var v = parseInt(this.inputField.html());
        if(v + this.step > this.max) {
            $(this).trigger('maxValue');
            return;
        }
        this.setValue(v + this.step);
    },

    _decrease: function(e) {
        var v = parseInt(this.inputField.html());
        if(v - this.step < this.min) {
            $(this).trigger('minValue');
            return;
        }
        this.setValue(v - this.step);
    },

    setValue: function(v){
        var v = parseInt(v);
        if(v > this.max) {
            $(this).trigger('maxValue');
        }
        else if(v < this.min) {
            $(this).trigger('minValue');
        }
        else {
            this.inputField.html(v);
            this._val = v;
            $(this).trigger('changeValue', {value: v});
        }
    },

    getValue: function(){
        return parseInt(this.inputField.html());
    },

    setMax: function(max){
        this.max = max;
    },

    setMin: function(min){
        this.min = min;
    }


});

module.exports = inputNumber;