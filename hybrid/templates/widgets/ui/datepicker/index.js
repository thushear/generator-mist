/**
 * 价格日历组件
 * @author 闫斌(yanbin01@baidu.com)
 * @version 0.1.0
 * @date 2015-6-30
 */


var priceCalendar = function(){
    this.config = arguments && arguments[0];
};

$.extend(priceCalendar.prototype, {

    /**
     * 初始化函数，暴露给外部启动模块
     */
    init: function() {
        this._bindEvent();
        this._loadPrice();
    },

    /**
     * 加载价格数据
     * @private
     */
    _loadPrice: function(){
        var self = this;
        self.priceMap = this.config.map;
        $(self).trigger('data-ready');
    },
    /**
     * 绘制日历
     */
    _render: function(){
        $(this.config.ctn).html(this.tpl);
        this._renderCurrentMonth(this.config.firstDate);
    },

    /**
     * 当前月是否是时间范围的第一个月
     * @param c_Month
     * @param c_Year
     * @returns {boolean}
     * @private
     */
    _isFirstMonth: function(c_Month, c_Year){
        var firstDate = new Date(this.config.firstDate);
        return firstDate.getFullYear() == c_Year && firstDate.getMonth() == c_Month;
    },

    /**
     * 当前月是否是时间范围的最后一个月
     * @param c_Month
     * @param c_Year
     * @returns {boolean}
     * @private
     */
    _isLastMonth: function(c_Month, c_Year){
        var lastDate = new Date(this.config.lastDate);
        return lastDate.getFullYear() == c_Year && lastDate.getMonth() == c_Month;
    },

    /**
     * 通过给出一个日期，在当前日历跳转到这个月份，然后把这天高亮
     * @param date
     */
    selectDate: function(date) {
        //如果date不在始止范围之内，返回
        var firstDate = this.config.firstDate;
        if(date.getTime() < firstDate.getTime() || date.getTime() > this.config.lastDate.getTime()) {
            return;
        }
        $(this).trigger('selectBy', {teamId: this.priceMap[this._dateToStandardTime(date)].teamId});
        if(firstDate.getMonth() == date.getMonth()) {
            this._renderCurrentMonth(firstDate, date);
            //$(this).trigger('select', {date: this._dateToStandardTime(date), price: this._getPriceByMonth(date)});
        }
        else {
            this._renderCurrentMonth(new Date(date.getFullYear(), date.getMonth(), 1), date);
        }

    },
    /**
     * 通过日期，把当天的价格找出来
     * @param date
     * @returns {string|XML|void|jQuery}
     * @private
     */
    _getPriceByMonth: function(date){
        var str = this._dateToStandardTime(date),
            tmp = "";
        $(this.config.ctn).find("td").each(function(idx,td){
            if($(td).attr("date") == str){
                var str = $(td).find('.price').html();
                tmp = str ? str.replace('¥', '') : null;
            }
        })
        return tmp;
    },

    /**
     * 根据起始日期，绘制某一个月份的日历
     * @param firstDate
     * @private
     */
    _renderCurrentMonth: function(firstDate, selectDate) {

        var self = this;
        var tableBodyFragment = this.tableBodyFragment = document.createDocumentFragment();

        var firstDate =  new Date(firstDate);
        var c_Month = this.c_Month = firstDate.getMonth(),
            c_Day = this.c_Day = firstDate.getDay() % 7,
            c_Date = this.c_Date = firstDate.getDate(),
            c_Year = this.c_Year = firstDate.getFullYear();

        var c_tr = document.createElement('tr'),
            c_index = 0;

        //得到上一个月的最后一天
        var lastMonthLastDay = (new Date(c_Year, c_Month, 1).getTime() - new Date(c_Year, c_Month - 1, 1).getTime()) / (1000 * 3600 * 24);
        //得到本月的最后一天
        var currentMonthLastDay = (new Date(c_Year, c_Month+1, 1).getTime() - new Date(c_Year, c_Month, 1).getTime()) / (1000 * 3600 * 24);

        var isFirstMonth = this._isFirstMonth(c_Month, c_Year);
        var isLastMonth = this._isLastMonth(c_Month, c_Year);

        function insertIntoFragment() {
            c_index++;
            if(c_index % 7 == 0) {
                tableBodyFragment.appendChild(c_tr);
                c_tr = document.createElement('tr');
            }
        }

        //首先绘制第一天之前的天数，计算要循环的次数
        var c_month_day = new Date(c_Year, c_Month, 1).getDay();
        var tmp_date = new Date(c_Year, c_Month - 1, 1);
        for(var i = c_month_day; i > 0; i--) {
            c_tr.appendChild(this._createDateItem(tmp_date.getFullYear(),tmp_date.getMonth(),(lastMonthLastDay - i + 1), isFirstMonth?'disable':'notcur'));
            c_index++;
        }

        //绘制第一天到开始天
        for(var i = 0; i < (c_Date - 1); i++) {
            c_tr.appendChild(this._createDateItem(c_Year, c_Month, (i + 1), 'disable'));
            insertIntoFragment();
        }

        var last_date = new Date(this.config.lastDate),
            currentMonthLastValidDay = last_date.getDate();

        if(isLastMonth) {
            //如果截止有效期的最后一天，恰巧在当前月中，还需要做处理
            for(var i = 0; i < (currentMonthLastValidDay - c_Date + 1); i++) {
                c_tr.appendChild(this._createDateItem(c_Year, c_Month,(c_Date + i), 'normal'));
                insertIntoFragment();
            }

            //开始绘制本月份剩余天数
            for(var i = 0; i < (currentMonthLastDay - currentMonthLastValidDay); i++) {
                c_tr.appendChild(this._createDateItem(c_Year, c_Month,(currentMonthLastValidDay + i + 1), 'disable'));
                insertIntoFragment();
            }
        }
        else {
            //开始绘制本月份剩余天数
            for(var i = 0; i < (currentMonthLastDay - c_Date + 1); i++) {
                c_tr.appendChild(this._createDateItem(c_Year, c_Month,(c_Date + i), 'normal'));
                insertIntoFragment();
            }
        }
        //计算下个月的天数
        var c_index_1 = c_index;
        var tmp_date = new Date(c_Year, c_Month + 1, 1);
        for(var i = 0; i < (6*7 - c_index_1); i++) {
            c_tr.appendChild(this._createDateItem(tmp_date.getFullYear(),tmp_date.getMonth(),(i + 1), isLastMonth?'disable':'notcur'));
            insertIntoFragment();
        }

        this._clearTableBody();

        $('#price-calendar-table .price-calendar-body').append(this.tableBodyFragment);
        $(this).trigger('content', {year: c_Year, month: c_Month});
        if(selectDate) {
            $(this).trigger('select', {date: self._dateToStandardTime(selectDate), price: this._getPriceByMonth(selectDate)});
        }
    },

    _dateToStandardTime: function(date){
        var selectDate = new Date(date);
        var m = selectDate.getMonth() + 1,
            d = selectDate.getDate();
        if(m < 10) {
            m = '0' + m;
        }
        if(d< 10) {
            d = '0' + d;
        }
        return selectDate.getFullYear() + '-' + m + '-' + d;
    },



    /**
     * 清空日历内容
     * @private
     */
    _clearTableBody: function(){
        var table_body = $(".price-table")[0];
        var tableLength = table_body.rows.length - 1;
        //清空table的内容，由于ie不支持在table中使用innerHTML，所以只能使用deleteRow
        for(var k = 0; k < tableLength; k++){
            table_body.deleteRow(1);
        }
    },

    /**
     * 事件绑定
     * @private
     */
    _bindEvent: function(){
        var self = this;
        $(this.config.ctn).delegate('.prev', 'tap', function(e){
            //获取下一个月的第一天
            var target = $(e.target);
            if(target.hasClass('disable')){
                return;
            }
            var next_month = new Date(self.c_Year, self.c_Month-1, 1);
            if(self.config.firstDate.getFullYear() == next_month.getFullYear() && self.config.firstDate.getMonth() == next_month.getMonth()) {
                self._renderCurrentMonth(self.config.firstDate);
            }
            else {
                self._renderCurrentMonth(next_month);
            }
            $(self).trigger('content', {year: self.c_Year, month: self.c_Month});
        });
        $(this.config.ctn).delegate('.next', 'tap', function(e){
            //获取上一个月的第一天
            var target = $(e.target);
            if(target.hasClass('disable')){
                return;
            }
            var prev_month = new Date(self.c_Year, self.c_Month+1, 1);
            if(self.config.firstDate.getFullYear() == prev_month.getFullYear() && self.config.firstDate.getMonth() == prev_month.getMonth()) {
                self._renderCurrentMonth(self.config.firstDate);
            }
            else {
                self._renderCurrentMonth(prev_month);
            }
            $(self).trigger('content', {year: self.c_Year, month: self.c_Month});
        });
        $(self).bind('content', function(e, data){
            $(this.config.ctn).find('.ymd').html(data.year + '年' + (data.month+1) + '月');
        });
        $(self).bind('show', function(e, data){
            $("#price-calendar-table").show();
        });
        $(self).bind('content', self._handelTopBar);
        //每个日期的点击事件
        $(this.config.ctn).delegate('td.normal-item, td.notcur-item', 'tap', function(e){
            self._handleItemClick(e, self);
        });
        $(self).bind('select', self._handleSelect);
        $(self).bind('data-ready', function(){
            self._render();
            $(self).trigger('show');
        });
    },

    /**
     * 处理select事件
     * @private
     */
    _handleSelect: function(e, data){
        var self = this;
        $(self.config.ctn).find('td').removeClass('active-item');
        $(this.config.ctn).find('td').each(function(idx,item){
            if($(item).attr("date") == data.date){
                $(item).addClass('active-item');
            }
        })
    },

    /**
     * 每一个日期单元格的点击事件
     * @private
     */
    _handleItemClick: function(e, selfObj){
        var self = selfObj;
        var item =  $(e.currentTarget);
        var selectDateArr = item.attr('date').split('-');
        var teamId = self.priceMap[selectDateArr[0] + '-' + selectDateArr[1] + '-' + selectDateArr[2]].teamId;
        //if(item.hasClass('normal-item')) {
        $(self).trigger('select', {teamId:teamId,date: selectDateArr[0] + '-' + selectDateArr[1] + '-' + selectDateArr[2], price: item.find('.price').html() ? item.find('.price').html().replace('¥',''):null});
        //}
        if(item.hasClass('notcur-item')) {
            //400ms之后跳转到下一个月份
            setTimeout(function(){
                if(self.config.firstDate.getFullYear() == selectDateArr[0] && self.config.firstDate.getMonth() == parseInt(selectDateArr[1]-1)) {
                    self._renderCurrentMonth(self.config.firstDate, new Date(selectDateArr[0], parseInt(selectDateArr[1]-1), selectDateArr[2]));
                }
                else {
                    self._renderCurrentMonth(new Date(selectDateArr[0], parseInt(selectDateArr[1]-1), 1), new Date(selectDateArr[0], parseInt(selectDateArr[1]-1), selectDateArr[2]));
                }
            }, 400);
        }
},

    /**
     * 重新计算上一个月下一个月的有效状态
     * @private
     */
    _handelTopBar: function(){
        var self = this;
        if(self._isFirstMonth(self.c_Month, self.c_Year)) {
            $(self.config.ctn).find('.prev').addClass('disable');
        }
        else {
            $(self.config.ctn).find('.prev').removeClass('disable');
        }
        if(self._isLastMonth(self.c_Month, self.c_Year)) {
            $(self.config.ctn).find('.next').addClass('disable');
        }
        else {
            $(self.config.ctn).find('.next').removeClass('disable');
        }
    },


    /**
     *
     * @param strDate
     * @param status
     * @returns {Element}
     * @private
     */
    _createDateItem: function(strYear, strMonth, strDate, status){
        var self = this;
        var c_td = document.createElement('td');
        switch(status) {
            case 'disable':
                $(c_td).addClass('disable-item');
                break;
            case 'notcur':
                $(c_td).addClass('notcur-item');
                break;
            default:
                $(c_td).addClass('normal-item');
                break;
        }
        strMonth++;
        (strMonth < 10) && (strMonth = '0' + strMonth);
        (strDate < 10) && (strDate = '0' + strDate);
        var strFormatDay = strYear + '-' + strMonth + '-' + strDate;
        $(c_td).attr('date', strFormatDay);
        if(this.priceMap[strFormatDay] && (this.priceMap[strFormatDay].adultprice || this.priceMap[strFormatDay].taocanprice) && (this.priceMap[strFormatDay].availablecount)) {
            //如果当天有价格,这里要注意月份可能和rd返回的正常月份相差1
            var tpl = $(self.enableItemTpl);
            tpl.find('.price').html('¥' + (this.priceMap[strFormatDay].adultprice || this.priceMap[strFormatDay].taocanprice));//当天有价格就用当天的价格
            tpl.find('.tip').html('余' + this.priceMap[strFormatDay].availablecount + '');
        }
        else if(this.priceMap[strFormatDay]) {
            var tpl = $('<div class="item-ctn"><div class="date" style="margin-top: 9px;text-align: center;"></div></div>');
            tpl.find('.date').html(strDate);
        }
        else {
            var tpl = $('<div class="item-ctn"><div class="date" style="margin-top: 9px;text-align: center;"></div></div>');
            tpl.find('.date').html(strDate);
            if($(c_td).hasClass('normal-item')) {
                $(c_td).removeClass('normal-item').addClass('disable-item');
            }
            else if($(c_td).hasClass('notcur-item')) {
                $(c_td).removeClass('notcur-item').addClass('disable-item');
            }
        }
        $(c_td).append(tpl);
        return c_td;
    }

},{
    tpl:['<div style="display: none;" id="price-calendar-table" class="prCd" onselectstart="return false;">',
        '<h3>',
        '<span id="pcDown" class="prev disable globel-iconfont arrow-left">&#xe609;</span>',
        '<span class="next disable globel-iconfont arrow-right"  id="pcUp">&#xe608;</span>',
        '<span class="ymd">加载中...</span>',
        '</h3>',
        '<table cellspacing="0" cellpadding="0" border="0" class="price-table">',
        '<thead>',
        '<tr>',
        '<th class="sday">周日</th>',
        '<th>周一</th>',
        '<th>周二</th>',
        '<th>周三</th>',
        '<th>周四</th>',
        '<th>周五</th>',
        '<th class="sday">周六</th>',
        '</tr>',
        '</thead>',
        '<tbody class="price-calendar-body">',
        '</tbody>',
        '</table>',
        '</div>'].join(''),
    enableItemTpl: '<div class="item-ctn"><div><span class="date"></span><span class="price"></span></div><div class="tip"></div></div>',
    disableItemTpl: '<div></div>'
});



module.exports = priceCalendar;