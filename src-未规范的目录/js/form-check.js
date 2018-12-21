// 处理jq获取的表单JSON对象数据，转为json字符串格式
function serData(data) {
    var res = {};
    for(var i = data.length - 1; i >= 0; i--) {
        res[data[i].name] = data[i].value;
    }
    return res;
}

// 校验用户名是否为英文
function checkUserName() {
    // var user = $('#username');
    if(/^([a-zA-Z0-9]+)$/.test($('#username').val())) {
        return true;
    } else {
        // user[0].focus();
        return false;
    }
}

// 校验邮箱是否正确
function checkEmail() {
    // var email = $('#email');
    if(/^([a-zA-Z0-9._-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/.test($('#email').val())) {
        return true;
    } else {
        // email[0].focus();
        return false;
    }
}

// 校验域名是否正确
function checkDomain() {
    // var $domain = $('#domain');
    if(/^([a-zA-Z]+)$/.test($$('#domain').val())) {
        return true;
    } else {
        // $domain[0].focus();
        return false;
    }
}

// 校验两次密码是否一致
function checkPassword() {
    var pass = $('#password').val();
    if(pass.length < 6) {
        return false;
    }
    if(pass === $('#notpassword').val()) {
        return true;
    } else {
        return false;
    }
}

// 清空表单里的字段
function clearForm(el) {
    $inputs = $(el + ' input');
    $inputs.val('');
}

export {
    serData,
    checkUserName,
    checkEmail,
    checkDomain,
    checkPassword,
    clearForm
};