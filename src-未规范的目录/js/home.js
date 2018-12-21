import css from './../less/home.less';  // 引入css样式
import $ from 'jquery';

$(function () {

    // 计时器
    $('#time').text(getDateTime());
    setInterval(function() {
        $('#time').text(getDateTime());
    }, 1000);

    // 刷新
    $('#reset').on('click', function() {
        window.location.reload();
    });

    /**
     * 返回序列化后的时间格式
     * @return {String} 2018-10-2 10:12:12
     */
    function getDateTime() {
        var date = new Date(),
            year = date.getFullYear(),
            month = date.getMonth(),
            day = date.getDate(),
            hours = date.getHours(),
            min = date.getMinutes(),
            seconds = date.getSeconds();

        return year + '-' + month + '-' + day + ' ' + hours + ':' + min + ':' + seconds;
    }
});