// 错误码
function errorCode(code) {
    var msg = '',
        msgObj = {
        1: '通用类型错误',
        2: '用户类型错误',
        3: 'token类型错误',
        4: '操作类型错误',
        1000: '参数错误',
        2000: '注册失败',
        2001: '用户已存在',
        2002: '用户名密码错误',
        2003: '密码错误',
        2005: '验证码不存在或已过期',
        3000: 'Token已过期或无效',
        3001: '服务器缓存异',
        4000: '操作错误',
        4001: '目录已存在',
        4002: '操作权限不足',
        4003: '目录不存在',
        4004: '根目录不允许修改或移动或删除',
        4005: '文件不存在'
    };

    switch((code + '')[0]) {
        case '1':
        case '2':
        case '3':
        case '4':
            msg = msgObj[code];
            break;
        case '9':
            localStorage.clear();
            window.location.href = 'login.html';
            break;
        default:
            msg = '错误未知！';
    }

    return msg;
}

export {
    errorCode
};