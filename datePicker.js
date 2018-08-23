/*jshint multistr: true */

/**
 * @param  {string} input 绑定的input元素id 必填
 * @param  {string} div 日历组件的id 必填
 * @param  {string} year 初始化年份 选填
 * @param  {string} month 初始化月份 选填
 */
function datePicker(input, div, year, month) {
    if (!year || !month) {
        var today = new Date();
        year = today.getFullYear();
        month = today.getMonth() + 1;
    }
    this.year = year;
    this.month = month;
    this.$input = document.getElementById(input);
    this.div = div;
}
datePicker.prototype.getMonthData = function (year, month) {

    if (!year || !month) {
        year = this.year;
        month = this.month;
    }

    var ret = [],
        flag = false,
        firstDay = new Date(year, month - 1, 1), //本月第一天
        firstDayWeekDay = firstDay.getDay(), //本月第一天是星期几
        lastDayOfLastMonth = new Date(year, month - 1, 0), //上个月最后一天
        lastDateOfLastMonth = lastDayOfLastMonth.getDate(),
        preMonthDayCount = firstDayWeekDay, //上个月天数在本月出现的数量
        lastDay = new Date(year, month, 0), //本月最后一天
        lastDate = lastDay.getDate(), //
        showYear,
        showMonth,
        showDate;
    for (var i = 0; i < 7 * 6; i++) {
        var date = i + 1 - preMonthDayCount;
        if (date <= 0) {
            showDate = lastDateOfLastMonth + date;
            showMonth = firstDay.getMonth();
            showYear = this.year;
            if (showMonth <= 0) {
                showMonth = 12;
                showYear = this.year - 1;
            }
        } else if (date > lastDate) {
            showDate = date - lastDate;
            showMonth = firstDay.getMonth() + 2;
            showYear = this.year;
            var D = new Date(year, showMonth - 1, showDate);
            if (D.getDay() == 6) {
                flag = true;
            }
            if (showMonth > 12) {
                showMonth = 1;
                showYear = this.year + 1;
            }
        } else {
            showDate = date;
            showMonth = firstDay.getMonth() + 1;
            if (date == lastDate && lastDay.getDay() == 6) {
                flag = true;
            }
            showYear = this.year;
        }
        ret.push({
            showYear: showYear,
            showDate: showDate,
            showMonth: showMonth
        });
        if (flag) {
            break;
        }
    }
    this.monthData = ret;
};

datePicker.prototype.buildMonthData = function () {
    var html = '<div class="ui-datepicker-header">\
                    <a href="#" class="ui-datepicker-btn ui-datepicker-btn-l">&lt;</a>\
                    <span class="ui-datepicker-curmon">' + this.year + '-' + this.month + '</span><!--\
                    --><a href="#" class="ui-datepicker-btn ui-datepicker-btn-r">&gt;</a>\
                </div>\
                <div class="ui-datepicker-body">\
                    <table>\
                        <thead>\
                            <tr>\
                                <th>日</th>\
                                <th>一</th>\
                                <th>二</th>\
                                <th>三</th>\
                                <th>四</th>\
                                <th>五</th>\
                                <th>六</th>\
                            </tr>\
                        </thead>\
                     <tbody>';
    var weekCount = Math.ceil(this.monthData.length / 7);
    for (var i = 0; i < weekCount; i++) {
        html += '<tr>\
                    <td data-month="' + this.monthData[i * 7].showMonth + '" data-year="' + this.monthData[i * 7].showYear + '">' + this.monthData[i * 7].showDate + '</td>\
                    <td data-month="' + this.monthData[i * 7 + 1].showMonth + '" data-year="' + this.monthData[i * 7 + 1].showYear + '">' + this.monthData[i * 7 + 1].showDate + '</td>\
                    <td data-month="' + this.monthData[i * 7 + 2].showMonth + '" data-year="' + this.monthData[i * 7 + 2].showYear + '">' + this.monthData[i * 7 + 2].showDate + '</td>\
                    <td data-month="' + this.monthData[i * 7 + 3].showMonth + '" data-year="' + this.monthData[i * 7 + 3].showYear + '">' + this.monthData[i * 7 + 3].showDate + '</td>\
                    <td data-month="' + this.monthData[i * 7 + 4].showMonth + '" data-year="' + this.monthData[i * 7 + 4].showYear + '">' + this.monthData[i * 7 + 4].showDate + '</td>\
                    <td data-month="' + this.monthData[i * 7 + 5].showMonth + '" data-year="' + this.monthData[i * 7 + 5].showYear + '">' + this.monthData[i * 7 + 5].showDate + '</td>\
                    <td data-month="' + this.monthData[i * 7 + 6].showMonth + '" data-year="' + this.monthData[i * 7 + 6].showYear + '">' + this.monthData[i * 7 + 6].showDate + '</td>\
                </tr>';
    }

    html += '</tbody>\
        </table>\
    </div>';
    this.render(html);
};

datePicker.prototype.render = function (html) {
    var picker = document.getElementById(this.div);
    if (!picker) {
        picker = document.createElement('div');
        picker.className = 'ui-datepicker-wrapper ui-datepicker-wrapper-hide';
        picker.id = this.div;
        document.body.appendChild(picker);
    }
    picker.innerHTML = html;
    this.$div = picker;
};

datePicker.prototype.addEvent = function (html) {
    var _this = this;
    var showFlag = false;
    this.$input.addEventListener('click', function (event) {
        if (showFlag) {
            _this.$div.className = 'ui-datepicker-wrapper ui-datepicker-wrapper-hide';
        } else {
            _this.$div.className = 'ui-datepicker-wrapper';
            var top = this.offsetTop;
            var left = this.offsetLeft;
            var height = this.offsetHeight;
            _this.$div.style.top = top + height + 'px';
            _this.$div.style.left = left + 2 + 'px';
        }
        showFlag = !showFlag;
        event.stopPropagation();
    }, false);

    _this.$div.addEventListener('click', function (event) {
        if (event.target.className.indexOf('ui-datepicker-btn') >= 0) {
            if (event.target.className.indexOf('ui-datepicker-btn-l') >= 0) {
                _this.month--;
                if (_this.month <= 0) {
                    _this.month = 12;
                    _this.year--;
                }
            } else {
                _this.month++;
                if (_this.month > 12) {
                    _this.month = 1;
                    _this.year++;
                }
            }
            _this.getMonthData();
            _this.buildMonthData();
        }
        console.log(event.target.tagName);
        if (event.target.tagName.toLowerCase() == 'td') {
            var td = event.target;
            _this.$input.value = td.dataset.year + '-' + td.dataset.month + '-' + td.innerHTML;
            _this.$div.className = 'ui-datepicker-wrapper ui-datepicker-wrapper-hide';
            showFlag = !showFlag;
        }
        event.stopPropagation();
    }, false);
};

datePicker.prototype.init = function () {
    this.getMonthData(this.year, this.month);
    this.buildMonthData();
    this.addEvent();
};