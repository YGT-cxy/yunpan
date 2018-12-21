import css from './../less/ace.less';
import font from  './../less/font.less';
import $ from 'jquery';

$(function() {

var searchObj = {};  // 设置读取的文件参数数据
var editor = null;  // 编辑器变量

$.ajaxSetup({  // 设置全局ajax请求的token配置
    beforeSend: function(xhr) {
        xhr.setRequestHeader('token', localStorage.getItem('token'));
    },
    type: 'POST'
});

// 写入文件
function writeFile(content) {
    $.ajax({
        url: 'http://kcloud.vowcloud.cn/api/v1/file/write',
        data: {
            'type': 'file',
            'name': searchObj.name,
            'path': searchObj.path,
            'content': content
        },
        success: function(res) {
            // console.log(res);
            if(res.size) {
                showLoading('保存成功!');
            }
        }
    });
}

// 读取文件
function readFile(fn) {
    $.ajax({
        url: 'http://kcloud.vowcloud.cn/api/v1/file/read',
        data: {
            'type': 'file',
            'name': searchObj.name,
            'path': searchObj.path
        },
        success: function(res) {
            if(res.content) {
                fn(res);
            }
        }
    });
}

// 执行读取文件操作
(function() {
    var search = decodeURI(location.search).slice(1).split('&');
    // console.log(search);
    for(var i = 0, leng = search.length; i < leng; i++) {
        var temp = search[i].split('=');
        searchObj[temp[0]] = temp[1];
    }

    // 发起读取文件的网络请求
    readFile(function(res) {
        createAce(res.content);
    });
} ());

// 创建编辑器
function createAce(data) {
    editor = ace.edit('editor');

    // 设置默认主题
    editor.setTheme("ace/theme/monokai");

    // 设置默认编辑语言
    editor.getSession().setMode("ace/mode/" + searchObj.type);

    // 语法提示和tab补全，需要引入ext-language_tools.js文件
    editor.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true
    });

    // 显示空格
    editor.setOptions({
        showInvisibles: true
    });

    // 设置线条突出显示
    editor.setHighlightActiveLine(false);

    // 为自定义函数指定键绑定 -- 裁切
    editor.commands.addCommand({
        name: 'myCommand',
        bindKey: {win: 'Ctrl-X',  mac: 'Command-X'},
        exec: function(editor) {
            console.log(editor.selection.getCursor());
            editor.removeLines(editor.selection.getCursor().row);
        },
        readOnly: true // false if this command should not apply in readOnly mode
    });

    // 为自定义函数指定键绑定 -- 保存
    editor.commands.addCommand({
        name: 'myCommand',
        bindKey: {win: 'Ctrl-S',  mac: 'Command-S'},
        exec: function(editor) {
            writeFile(editor.getValue());
        },
        readOnly: true // false if this command should not apply in readOnly mode
    });

    // 设置默认选项卡大小：
    editor.session.setTabSize(4);

    // 翻转自动换行
    editor.session.setUseWrapMode(true);

    // 设置编辑内容
    editor.setValue(data);
}

// 光标改变事件
// editor.session.selection.on('changeCursor', function(e) {
//     console.log(editor.session.getLength());
// });

$('#tools').on('click', 'i', function() {
    var operation = $(this).attr('data-operation');
    $('.select').hide();
    switch(operation) {
        case 'font':  // 字体
            $('.select-font').show();
            break;
        case 'theme':  // 代码风格
            $('.select-theme').show();
            break;
        case 'undo':  // 撤销
            editor.undo();
            break;
        case 'redo':  // 重做
            editor.redo();
            break;
        case 'refresh':  // 刷新 DOTO:确认提示框
            readFile(function(res) {
                editor.setValue(res.content);
            });
            break;
        case 'save':  // 保存
            writeFile(editor.getValue());
            break;
        default:  // 取消tools的下拉显示
            // $('.select').hide();
            console.log('没有定义方法!');
    }
});

// 取消tools的下拉显示
$('#editor').on('click', function() {
    $('.select').hide();
});

// 设置字体大小
$('.select-font').on('click', 'li', function() {
    var $this = $(this);
    $this.addClass('select-active').siblings().removeClass('select-active');
    $('#editor').css('font-size', $this.attr('title'));
});

// 设置主题
$('.select-theme').on('click', 'li', function() {
    var $this = $(this);
    $this.addClass('select-active').siblings().removeClass('select-active');
    editor.setTheme('ace/theme/' + $this.attr('title'));
});

// 提示框
function showLoading(txt) {
    $('body').append('<div class="loading">' + txt + '</div>');
    setTimeout(function() {
        $('.loading').remove();
    }, 1000);
}

});