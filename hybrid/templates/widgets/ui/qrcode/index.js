var QRCode = require('./qrcode.js');
var $ = require('zepto');

function qr() {
    this._init(arguments && arguments[0]);
}

$.extend(qr.prototype, {

    options: {
        render		: "canvas",
        width		: 256,
        height		: 256,
        typeNumber	: -1,
        correctLevel	: 2,
        background      : "#ffffff",
        foreground      : "#000000"
    },

    _init: function(options){
        var self = this;
        if( typeof options === 'string' ){
            options	= { text: options };
        }
        self.options = $.extend({}, self.options , options);
    },

    render: function(){
        var element	= (this.options.render == "canvas") ? this._createCanvas() : this._createTable();
        return element;
    },

    _createCanvas: function(){
        // create the qrcode itself
        var qrcode	= new QRCode(this.options.typeNumber, this.options.correctLevel);
        qrcode.addData(this.options.text);
        qrcode.make();

        // create canvas element
        var canvas	= document.createElement('canvas');
        canvas.width	= this.options.width;
        canvas.height	= this.options.height;
        var ctx		= canvas.getContext('2d');

        // compute tileW/tileH based on options.width/options.height
        var tileW	= this.options.width  / qrcode.getModuleCount();
        var tileH	= this.options.height / qrcode.getModuleCount();

        // draw in the canvas
        for( var row = 0; row < qrcode.getModuleCount(); row++ ){
            for( var col = 0; col < qrcode.getModuleCount(); col++ ){
                ctx.fillStyle = qrcode.isDark(row, col) ? this.options.foreground : this.options.background;
                var w = (Math.ceil((col+1)*tileW) - Math.floor(col*tileW));
                var h = (Math.ceil((row+1)*tileW) - Math.floor(row*tileW));
                ctx.fillRect(Math.round(col*tileW),Math.round(row*tileH), w, h);
            }
        }
        // return just built canvas
        return canvas;
    },

    _createTable: function(){
        // create the qrcode itself
        var qrcode	= new QRCode(this.options.typeNumber, this.options.correctLevel);
        qrcode.addData(this.options.text);
        qrcode.make();

        // create table element
        var $table	= $('<table></table>')
            .css("width", this.options.width+"px")
            .css("height", this.options.height+"px")
            .css("border", "0px")
            .css("border-collapse", "collapse")
            .css('background-color', this.options.background);

        // compute tileS percentage
        var tileW	= this.options.width / qrcode.getModuleCount();
        var tileH	= this.options.height / qrcode.getModuleCount();

        // draw in the table
        for(var row = 0; row < qrcode.getModuleCount(); row++ ){
            var $row = $('<tr></tr>').css('height', tileH+"px").appendTo($table);

            for(var col = 0; col < qrcode.getModuleCount(); col++ ){
                $('<td></td>')
                    .css('width', tileW+"px")
                    .css('background-color', qrcode.isDark(row, col) ? this.options.foreground : this.options.background)
                    .appendTo($row);
            }
        }
        // return just built canvas
        return $table;
    }
});

module.exports = qr;

