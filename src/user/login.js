import font from  './../less/font.less';
import css from './login.less';
import $ from 'jquery';
import {serData, checkUserName, checkEmail, checkDomain, checkPassword, clearForm} from './form-check.js';
import {errorCode} from './../js/errorCode.js';  // 引入errorCode

$(function () {

// 定义一个错误提示信息类
function loading(text, fn) {
    var msgHtml = $(`<div class="shade" style="display: block;">
                        <p class="text-center">${text}</p>
                    </div>`);
    $('body').append(msgHtml);

    if(fn) {
        fn();
    } else {
        setTimeout(function() {
            msgHtml.remove();
        }, 500);
    }
}

// 缓存数据
function setUserLocalStorage(data) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('time', JSON.stringify({ 'createTime': $.now(), 'pastTime': ($.now() + 7200000)}));
}

// 校验所有字段是否为空
function checkForm() {
    var flag = true,
        fieleName = '';
    $('input', '#form').each(function(key, ele) {
        var element = $(ele);

        if(!element.val()) {
            element.parent().next().addClass('text-error').text('不能为空!');
            element.focus();
            flag = false;
            fieleName = element.attr('placeholder') || '';
            return false;
        }
    });
    return {'flag': flag, 'fieleName': fieleName};
}

// 下一步
$('#next_step').on('click', function() {
    if(checkUserName() && checkPassword()) {
        $('.step').hide();
        $('.step2').show();
    }
});

// 上一步
$('#last_step').on('click', function() {
    $('.step2').hide();
    $('.step').show();
});

// 获取焦点事件
$('.js_register input').on('focus', function() {
    var value = this.value,
        inputName = this.name,
        msg = '';

    if(value === '') {
        switch(inputName) {
            case 'username':
                msg = '小写英文或数字组合';
                break;
            case 'password':
            case 'notpassword':
                msg = '密码长度为6位以上';
                break;
            case 'domain':
                msg = '域名需要输入英文';
                break;
            case 'email':
                msg = '填写常用邮箱';
                break;
            default:
                console.log('找不到匹配项');
        }

        $(this).parent().next().show().text(msg).removeClass('text-error');
    }
});

// 失去焦点事件，校验数据输入是否正确
$('.js_register input').on('blur', function(e) {
    var value = $.trim(this.value),
        inputName = this.name,
        msg = '',
        parentNext = $(this).parent().next();
    if(value === '') {
        msg = '填写不能为空';
    } else {
        switch(inputName) {
            case 'username':
                if(!checkUserName()) {
                    msg = '小写英文或数字组合';
                }
                break;
            case 'password':
                if(value.length < 6) {
                    msg = '密码长度过短，至少6位以上!';
                }
                break;
            case 'notpassword':
                if(!checkPassword()) {
                    msg = '两次密码填写不一致!';
                }
                break;
            case 'domain':
                if(!checkDomain()) {
                    msg = '只能输入英文';
                }
                break;
            case 'email':
                if(!checkEmail()) {
                    msg = '邮箱格式不对';
                }
                break;
            default:
                console.log('找不到匹配项');
        }
    }

    if(msg === '') {
        parentNext.hide();
    } else {
        parentNext.show().text(msg).addClass('text-error');
    }
});

// 登录
function login($el) {
    var data = serData($('#form').serializeArray());
    $.ajax({
        url: 'http://kcloud.vowcloud.cn/api/v1/token/user',
        type: 'POST',
        data: data,
        success: function(res) {
            setUserLocalStorage(res);
            loading('登录成功!', function() {
                setTimeout(function() {
                    window.location.href = 'index.html';
                }, 200);
            });
        },
        error: function(error) {
            var txt = errorCode(JSON.parse(error.responseText).errorCode);
            loading(txt);
            $el.removeAttr('disabled').removeClass('btn-disabled');
        }
    });
}

// 注册
function register() {
    var data = serData($('#form').serializeArray());
    data.domain = data.domain + '.vowcloud.cn';
    delete data.notpassword;

    $.ajax({
        url: 'http://kcloud.vowcloud.cn/api/v1/user/register',
        type: 'POST',
        data: data,
        success: function(res) {
            loading('注册成功！！！！', function() {
                clearForm();
            });
        },
        error: function(error) {
            var msg = errorCode(JSON.parse(error.responseText).errorCode);
            loading(msg);
        }
    });
}

// 提交表单
$('#sub').on('click', function() {
    var $this = $(this),
        option = $this.attr('data-option'),
        res = checkForm();
    if(!res.flag) {  // 校验是否填写完毕
        loading(res.fieleName + '没有输入');
        return false;
    } else {
        $this.attr('disabled', 'disabled').addClass('btn-disabled');

        if(option === 'login') {  // 登陆事件
            login($this);

        } else if (option === 'register') {  // 注册事件

            if(checkUserName() && checkPassword() && checkEmail() && checkDomain()) {
                register(data);
            }
        }
    }
});

// 监听回车键
$('body').on('keyup', function(e) {
    if(e.keyCode === 13) {
        $("#sub").trigger("click");
    }
});

});
