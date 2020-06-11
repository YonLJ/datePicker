const today = new Date;

class DatePicker {
  /**
  * @param {string} input 绑定的input元素id
  * @param {string} div 日历组件的id
  * @param {string} year 初始化年份
  * @param {string} month 初始化月份
  * @param {string} format 格式化模板
  */
  constructor(input, datePickerId, year = today.getFullYear(), month = today.getMonth() + 1, format = 'yyyy-MM-dd') {
    this.initYear = this.year = year;
    this.initMonth = this.month = month;
    this.EInput = document.getElementById(input);
    this.datePickerId = datePickerId;
    this.EDatePicker = null;
    this.monthData = null;
    this.pickerShow = false;
    this.format = format;
    this.init();
  }

  init() {
    this.getMonthData();
    this.buildMonthData();
    this.addEventListener();
  }

  getMonthData() {
    const ret = [];
    const firstDay = new Date(this.year, this.month - 1, 1); //本月第一天
    const firstDayWeekDay = firstDay.getDay(); //本月第一天是星期几
    const lastDayOfLastMonth = new Date(this.year, this.month - 1, 0); //上个月最后一天
    const lastDateOfLastMonth = lastDayOfLastMonth.getDate();
    const preMonthDayCount = firstDayWeekDay; //上个月天数在本月出现的数量
    const lastDay = new Date(this.year, this.month, 0); //本月最后一天
    const lastDate = lastDay.getDate(); //
    for (let i = 0; i < 7 * 6; i++) {
      const date = i + 1 - preMonthDayCount;
      let showYear;
      let showMonth;
      let showDate;
      let color = 'inherit';
      if (date <= 0) { // i是上个月
        color = '#c0c4cc';
        showDate = lastDateOfLastMonth + date;
        showMonth = firstDay.getMonth();
        showYear = this.year;
        if (showMonth <= 0) {
          showMonth = 12;
          showYear = this.year - 1;
        }
      } else if (date > lastDate) { // i是下个月
        color = '#c0c4cc';
        showDate = date - lastDate;
        showMonth = firstDay.getMonth() + 1 + 1;
        showYear = this.year;
        if (showMonth > 12) {
          showMonth = 1;
          showYear = this.year + 1;
        }
        // const D = new Date(year, showMonth - 1, showDate);
        // if (D.getDay() == 6) {
        //   flag = true;
        // }
      } else { //i是本月
        showDate = date;
        showMonth = firstDay.getMonth() + 1;
        showYear = this.year;
        if (today.getFullYear() === showYear && today.getMonth() + 1 === showMonth && today.getDate() === showDate) {
          color = '#1abc9c';
        }
        // if (date === lastDate && lastDay.getDay() === 6) {
        //   flag = true;
        // }
      }
      ret.push({ showYear, showDate, showMonth, color });
      // if (flag) {
      //   break;
      // }
    }
    this.monthData = ret;
  }

  buildMonthData() {
    let html = `<div class="ui-datepicker-header">
                  <span>
                    <a href="#" class="ui-datepicker-btn ui-datepicker-btn-last-year">«</a>
                    <a href="#" class="ui-datepicker-btn ui-datepicker-btn-last-month">‹</a>
                  </span>
                  <span class="ui-datepicker-curmon">${this.year}年${this.month}月</span>
                  <span>
                    <a href="#" class="ui-datepicker-btn ui-datepicker-btn-next-month">›</a>
                    <a href="#" class="ui-datepicker-btn ui-datepicker-btn-next-year">»</a>
                  </span>
                </div>
                <div class="ui-datepicker-body">
                  <table>
                    <thead>
                      <tr>
                        <th>日</th>
                        <th>一</th>
                        <th>二</th>
                        <th>三</th>
                        <th>四</th>
                        <th>五</th>
                        <th>六</th>
                      </tr>
                    </thead>
                  <tbody>`;
    const weekCount = Math.ceil(this.monthData.length / 7);
    for (let i = 0; i < weekCount; i++) {
      html += `
<tr>
  <td style="color: ${this.monthData[i * 7].color}" data-month="${this.monthData[i * 7].showMonth}" data-year="${this.monthData[i * 7].showYear}">${this.monthData[i * 7].showDate}</td>
  <td style="color: ${this.monthData[i * 7 + 1].color}" data-month="${this.monthData[i * 7 + 1].showMonth}" data-year="${this.monthData[i * 7 + 1].showYear}">${this.monthData[i * 7 + 1].showDate}</td>
  <td style="color: ${this.monthData[i * 7 + 2].color}" data-month="${this.monthData[i * 7 + 2].showMonth}" data-year="${this.monthData[i * 7 + 2].showYear}">${this.monthData[i * 7 + 2].showDate}</td>
  <td style="color: ${this.monthData[i * 7 + 3].color}" data-month="${this.monthData[i * 7 + 3].showMonth}" data-year="${this.monthData[i * 7 + 3].showYear}">${this.monthData[i * 7 + 3].showDate}</td>
  <td style="color: ${this.monthData[i * 7 + 4].color}" data-month="${this.monthData[i * 7 + 4].showMonth}" data-year="${this.monthData[i * 7 + 4].showYear}">${this.monthData[i * 7 + 4].showDate}</td>
  <td style="color: ${this.monthData[i * 7 + 5].color}" data-month="${this.monthData[i * 7 + 5].showMonth}" data-year="${this.monthData[i * 7 + 5].showYear}">${this.monthData[i * 7 + 5].showDate}</td>
  <td style="color: ${this.monthData[i * 7 + 6].color}" data-month="${this.monthData[i * 7 + 6].showMonth}" data-year="${this.monthData[i * 7 + 6].showYear}">${this.monthData[i * 7 + 6].showDate}</td>
</tr>`;
    }

    html += `
    </tbody>
  </table>
</div>`;
    this.render(html);
  }

  /**
   * @param {string} html 
   */
  render(html) {
    this.EDatePicker = document.getElementById(this.datePickerId);
    if (!this.EDatePicker) {
      this.EDatePicker = document.createElement('div');
      this.EDatePicker.className = 'ui-datepicker-wrapper ui-datepicker-wrapper-hide';
      this.EDatePicker.id = this.datePickerId;
      document.body.appendChild(this.EDatePicker);
    }
    this.EDatePicker.innerHTML = html;
  }

  addEventListener() {
    this.inputAddEventListener();
    this.datePickerAddEventListener();
    this.documentAddEventListener();
  }

  documentAddEventListener() {
    document.addEventListener('click', event => {
      event.stopPropagation();
      this.hideDatePicker();
    }, false);
  }

  inputAddEventListener() {
    this.EInput.addEventListener('click', () => {
      if (this.pickerShow) {
        this.EDatePicker.className = 'ui-datepicker-wrapper ui-datepicker-wrapper-hide';
      } else {
        this.EDatePicker.className = 'ui-datepicker-wrapper';
        this.EDatePicker.style.top = `${this.EInput.offsetTop + this.EInput.offsetHeight}px`;
        this.EDatePicker.style.left = `${this.EInput.offsetLeft}px`;
      }
      this.pickerShow = !this.pickerShow;
      event.stopPropagation();
    }, false);
  }

  datePickerAddEventListener() {
    this.EDatePicker.addEventListener('click', event => {
      event.stopPropagation();
      if (event.target.className.includes('ui-datepicker-btn-last-month')) {
        this.handleLastMonthBtnClick();
      }
      if (event.target.className.includes('ui-datepicker-btn-next-month')) {
        this.handleNextMonthBtnClick();
      }
      if (event.target.className.includes('ui-datepicker-btn-last-year')) {
        this.handleLastYearBtnClick();
      }
      if (event.target.className.includes('ui-datepicker-btn-next-year')) {
        this.handleNextYearBtnClick();
      }
      if (event.target.tagName.toLowerCase() === 'td') {
        this.handleDateTdClick();
      }
    }, false);
  }

  handleLastMonthBtnClick() {
    this.month--;
    if (this.month <= 0) {
      this.month = 12;
      this.year--;
    }
    this.getMonthData();
    this.buildMonthData();
  }

  handleNextMonthBtnClick() {
    this.month++;
    if (this.month > 12) {
      this.month = 1;
      this.year++;
    }
    this.getMonthData();
    this.buildMonthData();
  }

  handleLastYearBtnClick() {
    this.year--;
    this.getMonthData();
    this.buildMonthData();
  }

  handleNextYearBtnClick() {
    this.year++;
    this.getMonthData();
    this.buildMonthData();
  }

  handleDateTdClick() {
    const td = event.target;
    this.EInput.value = this.formatDate(td.dataset.year, td.dataset.month, td.innerHTML);
    this.hideDatePicker();
  }

  hideDatePicker() {
    this.EDatePicker.className = 'ui-datepicker-wrapper ui-datepicker-wrapper-hide';
    this.pickerShow = false;
    this.year = this.initYear;
    this.month = this.initMonth;
    this.getMonthData();
    this.buildMonthData();
  }

  /**
   * 
   * @param {number} year 
   * @param {number} month 
   * @param {number} date 
   * @returns {string}
   */
  formatDate(year, month, date) {
    let result = this.format.replace('yyyy', year);
    result = result.includes('MM') ? result.replace('MM', this.formatNumber(month)) : result.replace('M', month);
    result = result.includes('dd') ? result.replace('dd', this.formatNumber(date)) : result.replace('d', date);
    return result;
  }

  formatNumber(n) {
    n = n.toString();
    return n[1] ? n : '0' + n;
  }
}
