import css from './index.less';  // 引入less样式文件
import $ from 'jquery';

$(function() {

// 设置全局ajax请求的token配置
$.ajaxSetup({
    beforeSend: function(xhr) {
        xhr.setRequestHeader('token', localStorage.getItem('token'));
    },
    type: 'POST'
});

// 设置用户名 大写格式
$('#head .user > span').html(JSON.parse(localStorage.getItem('user')).username.toUpperCase());

// editPass修改密码
$('#editPass').on('click', function() {
    $('#nav .nav-item').eq(1).trigger('click');
});

// 侧边栏的显示与隐藏
$('#bar').on('click', function() {
    $('.content').toggleClass('content-hide');
});

// 侧边栏的事件委托
$('#nav li').on('click', function(e) {
    e.stopPropagation();  // 阻止事件冒泡
    var $this = $(this),
        srcUrl = $this.data('src'),
        srcText = $this.text(),
        tabs = $('#tab .tab-item');

    if(srcUrl === undefined) {  // 侧边栏下拉菜单的显示
           $(this).toggleClass('nav-open');
    } else {  // 添加tab和对应的框架内容
        for(var i = tabs.length - 1; i > 0; i--) {
            if(tabs.eq(i).data('src') === srcUrl) {
                activeTab(i);
                return false;
            }
        }

        $('#tab .tab-nav').append('<li><a class="tab-item" data-src="' + srcUrl + '" href="javascript:;" data-option="tab">' + srcText + '<i class="icon icon-clone" data-option="del"></i></a></li>');  // 添加选项卡
        $('#main .main-content').append('<div class="iframe-wrap iframe-show"><iframe src="' + srcUrl + '"></iframe></div>');  // 添加内容框架
        activeTab(tabs.length);
    }
});

// 选项卡  --  事件委托
$('#tab').on('click', function(e) {
    var target = e.target,
        option = target.getAttribute('data-option'),
        parent = null;

    if(option === 'del') {  // 删除选项卡
        parent = $(target).parent().parent();
        var index = parent.index(),
            siblings = parent.siblings(),
            next = parent.next(),
            iframes = $('#main .iframe-wrap');

        if(parent.hasClass('active')) {
            // 根据删除的选项位置，激活附近的选项和对应的内容
            if(next.length == 0) {  // 激活前面的
                siblings.eq(-1).addClass('active');
                iframes.eq($(siblings.eq(-1)).index()).addClass('iframe-show');
            } else {  // 激活后面的
                next.addClass('active');
                iframes.eq($(next).index()).addClass('iframe-show');
            }
        }

        // 删除tab选项和对应的内容
        parent.remove();
        iframes.eq(index).remove();
    } else if (option === 'tab') {  // 切换选项卡
        parent = $(target).parent();
        activeTab(parent.index());
    }
});

/**
 * 传入需要激活的选项卡的index
 * @param  {number} index 激活选项卡的位置
 */
function activeTab(index) {
    $('#tab li').eq(index).addClass('active').siblings().removeClass('active');
    $('#main .iframe-wrap').removeClass('iframe-show').eq(index).addClass('iframe-show');
}

// 注销退出
function logout() {
    localStorage.clear();  // 清空缓存数据
    window.location.href = 'login.html';
}

// 拓展jq方法
$.extend({
    'logout': logout
});

// 注销按钮
$('#logout').on('click', function() {
    logout();
});

// 关闭主窗口，清空粘贴数据
$(window).on('unload', function() {
    localStorage.removeItem('tempName');
    localStorage.removeItem('operation');
});

});