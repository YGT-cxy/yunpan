import css from './../less/edit-pass.less';
import $ from 'jquery';

$(function() {

// 初始化
(function() {
    $.ajaxSetup({  // 设置全局ajax请求的token配置
        beforeSend: function(xhr) {
            xhr.setRequestHeader('token', localStorage.getItem('token'));
        },
        type: 'POST'
    });
} ());

// 校验所有字段是否为空
function checkForm() {
    var flag = true;
    $('input', '#form').each(function(key, ele) {
        var element = $(ele);
        if(!element.val()) {
            element.parent().next().text('输入框不能为空!');
            element.focus();
            flag = false;
            return false;
        }
    });
    return flag;
}

// 校验两次密码是否一致
function checkPassword() {
    var pass = $('#repassword'),
        pass2 = $('#repassword2'),
        passVal = $('#repassword').val();
    if(passVal.length < 6) {
        pass.parent().next().text('密码长度不能少于6位!');
        return false;
    }
    if(passVal === pass2.val()) {
        return true;
    } else {
        pass2.parent().next().text('两次密码输入不一致，请重新输入!');
        return false;
    }
}

// 输入框失去焦点时输入不为空，清空提示信息
$('#form').on('blur', 'input', function() {
    var $this = $(this);
    if($this.val() !== '') {
        $this.parent().next().text('');
    }
});

// 提交表单
$('#sub').on('click', function() {
    if(checkForm() && checkPassword()) {
        var formData = {
            'password': $('#password').val(),
            'repassword': $('#repassword').val()
        };
        $.ajax({
            url: 'http://kcloud.vowcloud.cn/api/v1/user/edit_pass',
            data: formData,
            success: function(res) {
                if(res.isValid) {  // TODO:修改成功后原来的Token会失效，需要通知父框架注销重新登录
                    console.log('修改成功!');
                    top.$.logout();
                }
            },
            error: function(error) {
                console.log(error);
            }
        });
    }
});

});