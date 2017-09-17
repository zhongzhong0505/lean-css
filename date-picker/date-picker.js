(function () {
  var DatePicker = function (eleCls) {
    this.init(eleCls);
  };
  var year, month, day,
    isOpen = false, //标识日期选择器是否打开
    ele; //日期输入框对象
  const getDateData = (y, m) => {
    year = y || year, month = m || month;
    var date;
    if (year && typeof month === 'number') {
      date = new Date(year, month - 1);
    } else {
      date = new Date();
      year = date.getFullYear();
      month = date.getMonth() + 1;
      day = date.getDate();
    }
    var htmlArr = [`
    <div class="date-picker-header">
      <a href="javascript:;" class="date-picker-btn pre-year-btn">&lt;&lt;</a>
      <a href="javascript:;" class="date-picker-btn pre-month-btn">&lt;</a>
      <a href="javascript:;" class="date-picker-btn date-picker-title">${date.getFullYear()}-${paddingZero(date.getMonth()+1)}</a>
      <a href="javascript:;" class="date-picker-btn next-month-btn">&gt;</a>
      <a href="javascript:;" class="date-picker-btn next-year-btn">&gt;&gt;</a>
    </div>
    <div class="date-picker-body">
      <table class="date-picker-content">
        <thead class="date-picker-week-header">
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
        <tbody class="date-picker-day">`];

    //本月第一天的星期
    var firstDayWeekDay = new Date(year, month - 1, 1).getDay();
    //最后一天
    var lastDay = new Date(year, month, 0).getDate();

    //上一个月的最后一天
    var preMonthLastDay = new Date(year, month - 1, 0).getDate();
    var index = 1;
    var nextIndex = 1;
    var preMonthDate, nextMonthDate;
    for (let i = 0; i < 42; i++) {
      if (i % 7 === 0) {
        htmlArr.push(`<tr>`);
      }
      if (i < firstDayWeekDay) { //处理上一个月的日期
        preMonthDate = new Date(year, month - 2, preMonthLastDay - (firstDayWeekDay - i) + 1);
        htmlArr.push(`<td class="pre-month" data-date="${preMonthDate.getFullYear()}-${preMonthDate.getMonth()+1}-${preMonthDate.getDate()}">${preMonthDate.getDate()}</td>`);

      } else if (index <= lastDay) { //处理本月的日期
        htmlArr.push(`<td data-date="${year}-${month}-${index}">${index++}</td>`);

      } else { //处理下一个月的日期
        nextMonthDate = new Date(year, month, nextIndex);
        htmlArr.push(`<td class="next-month" data-date="${nextMonthDate.getFullYear()}-${nextMonthDate.getMonth()+1}-${nextIndex}">${nextIndex++}</td>`);
      }
      if (i % 7 === 6) {
        htmlArr.push(`</tr>`);
      }
    }
    htmlArr.push(`</tbody></table></div>`);
    htmlArr.push(`<div class="date-picker-footer">
      <a href="javascript:;" class="date-picker-btn current-date-btn">现在</a>
    </div>`);

    return htmlArr.join('');
  }
  const show = (top, left) => {
    var datePickerWrapper = document.querySelector('.date-picker');

    datePickerWrapper.classList.add('date-picker-show');
    datePickerWrapper.top = top + 'px';
    datePickerWrapper.left = left + 'px';

    render();

    isOpen = true;
  }
  const render = (y, m) => {
    var datePickerWrapper = document.querySelector('.date-picker');
    datePickerWrapper.innerHTML = getDateData(y, m);

    // //高亮当前输入框中的日期或者当前日期
    var val = new Date(ele.value);
    var date = val.getDate() ? val : new Date();
    var currentDate = document.querySelector(`.date-picker td[data-date="${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}"]`);
    currentDate && currentDate.classList.add('current-date');
  }
  const hide = () => {
    var datePickerWrapper = document.querySelector('.date-picker');
    datePickerWrapper.classList.remove('date-picker-show');
    isOpen = false;
  }
  DatePicker.prototype.init = eleCls => {
    var input = ele = document.querySelector(eleCls);
    input.addEventListener('click', event => {
      var top = input.offsetHeight;
      var left = input.offsetWidth;
      var height = input.height;

      //显示当前输入框中的月份
      var val = new Date(input.value);
      var initDate = val.getDate() ? val : new Date();
      year = initDate.getFullYear();
      month = initDate.getMonth() + 1;
      day = initDate.getDate();
      if (!isOpen) {
        show(top + height, left);
      } else {
        hide();
      }
    });
    input.addEventListener('blur', event => {
      // hide();
    });

    var datePickerWrapper = document.createElement('div');
    datePickerWrapper.classList.add('date-picker');
    document.body.appendChild(datePickerWrapper);

    document.querySelector('.date-picker').addEventListener('click', event => {
      var target = event.target;
      var classList = target.classList;
      if (target.tagName.toLowerCase() === 'td') {
        var date = new Date(target.dataset.date);
        input.value = format(date);
        hide();
      } else if (classList.contains('next-month-btn')) {
        render(year, month + 1);
      } else if (classList.contains('pre-month-btn')) {
        render(year, month - 1);
      } else if (classList.contains('pre-year-btn')) {
        render(year - 1, month);
      } else if (classList.contains('next-year-btn')) {
        render(year + 1, month);
      } else if (classList.contains('current-date-btn')) {
        input.value = format(new Date());
        hide();
      }
    });
  }

  const paddingZero = val => {
    if (val <= 9) {
      return '0' + val;
    }
    return val;
  }
  const format = (date) => {
    let year = date.getFullYear();
    let month = paddingZero(date.getMonth() + 1);
    let day = paddingZero(date.getDate());
    return year + '-' + (month) + '-' + day;
  }

  window.DatePicker = DatePicker;
})();
