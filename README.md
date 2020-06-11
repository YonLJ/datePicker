# datePicker
使用方法：
	引入datePicker.css文件和datePicker.js文件，创建datePicker对象
	@param  {String} input 绑定的input元素id 必填
 	@param  {String} div 日历组件的id 必填
 	@param  {Number} year 初始化年份 选填
	@param  {Number} month 初始化月份 选填

	const picker = new datePicker(input, div, 2020, 6, 'yyyy-MM-dd');
