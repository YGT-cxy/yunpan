import font from  './../less/font.less';
import css from './login.less';
import $ from 'jquery';
import {serData, checkUserName, checkEmail} from './form-check.js';
import {errorCode} from './../js/errorCode.js';

$(function() {

// 定义一个错误提示信息类  TODO:修改
function Message (text, type) {
    this.text = text;
    this.type = type || 'error';
    var msgHtml = $(`<div class="shade" style="display: block;">
                        <p class="text-center">${this.text}</p>
                    </div>`);
    $('body').append(msgHtml);

    if(this.type === 'login') {
        this.alert = function() {
            setTimeout(function() {
                window.location.href = 'index.html';
            }, 200);
        };
    } else if (this.type === 'error') {
        this.alert = function() {
            setTimeout(function() {
                msgHtml.remove();
            }, 300);
        };
    } else if (this.type === 'register') {
        this.alert = function() {
            setTimeout(function() {
                msgHtml.remove();
            }, 1000);
        };
    }
}

// 校验所有字段是否为空
function checkForm() {
    var flag = true;
    $('input', '#form').each(function(key, ele) {
        var element = $(ele);
        if(!element.val()) {
            element.parent().next().show().addClass('text-error').text('填写不能为空!');
            element.focus();
            flag = false;
            return false;
        }
    });
    return flag;
}

// 输入框失去焦点时的判断条件
$('#form').on('blur', 'input', function() {
    var thisName = this.name,
        msg = '',
        msgBox = $(this).parent().next(),
        thisValue = this.value;
    if(thisValue === '') {
        msg = '填写不能为空!';
    } else {
        switch(thisName) {
            case 'email':
                if(!checkEmail()) {
                    msg = '邮箱格式不对，请重新填写!';
                }
                break;
            case 'username':
                if(!checkUserName()) {
                    msg = '用户名格式不对，请重新填写!';
                }
                break;
            case 'code':
                if(this.value === '') {
                    msg = '验证码不能为空!';
                }
                break;
            case 'newpassword':
                if (thisValue.length < 6) {
                    msg = '密码的长度不能低于6位!';
                }
                break;
            default:
                console.log('没有定义新的方法');
        }
    }
    msgBox.text(msg).addClass('text-error');
});

// 发送验证码
$('#send_code').on('click', function() {
    if(checkEmail() && checkUserName()) {
        $(this).addClass('btn-disabled').attr('disabled', 'disabled');
        sendCode();
    } else {
        new Message('没有填写邮箱或用户名!').alert();
    }
});

// 验证码接口
function sendCode() {
    $.ajax({
        url: 'http://kcloud.vowcloud.cn/api/v1/user/send_code',
        type: 'POST',
        data: {
            'email': $('#email').val(),
            'username': $('#username').val()
        },
        dataType: 'text',
        success: function(res) {
            var index = res.indexOf('{'),
                resData = res.slice(index),
                msg = JSON.parse(resData).msg;
            console.log(msg);
            // TODO:提示  计时重新获取
            new Message(msg).alert();
        },
        error: function(error) {
            $('#send_code').text('重新发送').removeClass('btn-disabled').removeAttr('disabled');
        }
    });
}

// 修改密码
$('#sub').on('click', function() {
    if(checkForm()) {
        editPass();
        $(this).addClass('btn-disabled').attr('disabled', 'disabled');
    }
});

// 修改密码接口
function editPass() {
    var formData = serData($('#form').serializeArray());

    $.ajax({
        url: 'http://kcloud.vowcloud.cn/api/v1/user/code_edit_pass',
        type: 'POST',
        data: formData,
        success: function(res) {
            console.log(res);
            if(res.isValid) {
                new Message('修改成功').alert();
            }
        },
        error: function(error) {
            var msg = errorCode(JSON.parse(error.responseText).errorCode);
            console.log(msg);
            new Message(msg).alert();
            $('#sub').removeClass('btn-disabled').removeAttr('disabled');
        }
    });
}


});