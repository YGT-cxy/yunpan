import font from  './../less/font.less';  // 字体样式
import iconCss from './icon-file.less';  // 文件图标样式
import css from './user-file.less';  // 本页面的样式
import $ from 'jquery';  // 引入jquery
import WebUploader from './../lib/webuploader-0.1.5/dist/webuploader.js';  // 引入webuploader上传文件插件
import {errorCode} from './../js/errorCode.js';  // 错误码

$(function() {

/******************************************************************************************************/
/**
 * [ajaxCommon 文件操作和目录操作的二次ajax请求封装]
 * @param  {String}   opt  执行何种操作
 * @param  {Object}   data POST到后端的数据
 * @param  {Function} fn   成功执行的函数
 * @param  {Function}   fn2  失败执行的函数
 */
function ajaxCommon(opt, data, fn, fn2) {
    $.ajax({
        url: 'http://kcloud.vowcloud.cn/api/v1/' + data.type + '/' + opt,
        data: data,
        success: function(res) {
            fn(res);
        },
        error: function(error) {
            if(fn2) {
                fn2(error);
            } else {
                var txt = errorCode(JSON.parse(error.responseText).errorCode);
                showLoading(txt);
            }
        }
    });
}
/******************************************************************************************************/
// 文件操作或目录操作ajax请求类
function FileOrDir() {
    this.path = treePath;
    this.ajax = ajaxCommon;
}
// 删除文件
FileOrDir.prototype.delFile = function(fileName, fn) {
    var data = {
        'type': 'file',
        'path': this.path,
        'name': fileName
    };
    this.ajax('del', data, function(res) {
        if(res.isVaild) {
            showLoading(fileName + '文件删除成功!');
            if(fn) {
                fn();
            }
        }
    });
};

// 创建文件
FileOrDir.prototype.createFile = function(fileName) {
    var data = {
        'type': 'file',
        'path': this.path,
        'name': fileName
    };
    this.ajax('create', data, function() {
        showLoading(fileName + '创建成功！');
        FileOrDir.showDir(data.path);
    });
};

// 重命名文件
FileOrDir.prototype.renameFile = function(fileName, FileRename) {
    var data = {
        'type': 'file',
        'path': this.path,
        'name': fileName,
        'rename': FileRename
    };
    this.ajax('rename', data, function(res) {
        $('#rename .message').html('重命名成功!');
        FileOrDir.showDir(data.path);
    }, function(error) {
        var errorText = JSON.parse(error.responseText);
        $('#rename .message').html(errorCode(errorText.errorCode));
    });
};

// 移动文件
FileOrDir.prototype.moveFile = function(fileName, FileRename) {
    var data = {
        'type': 'file',
        'name': fileName,
        'rename': FileRename
    };
    this.ajax('move', data, function() {
        FileOrDir.showDir(treePath);
    });
};

// 复制文件
FileOrDir.prototype.copyFile = function(fileName, FileRename) {
    var data = {
        'type': 'file',
        'name': fileName,
        'rename': FileRename
    };
    this.ajax('copy', data, function() {
        FileOrDir.showDir(treePath);
    });
};

// 静态方法查看某个目录
FileOrDir.showDir = function(path) {
    var data = {
        'path': path,
        'type': 'dir'
    };

    $(document).ajaxStart(function(){
        $('.load').show(200);
    });

    $(document).ajaxSuccess(function(){
        $('.load').hide(200);
    });

    new FileOrDir().ajax('tree', data, function(res) {
        var txtHtml = applyDataTemplate(res);
        $('.file-content').html(txtHtml);
    }, function(error) {
        var errorText = JSON.parse(error.responseText);
        showLoading(errorCode(errorText.errorCode));
    });
};

// 删除目录
FileOrDir.prototype.delDir = function(dirName, fn) {
    var data = {
        'type': 'dir',
        'path': this.path,
        'name': dirName
    };
    this.ajax('del', data, function(res) {
        if(res.isVaild) {
            showLoading(dirName + '文件夹删除成功!');
            if(fn) {
                fn();
            }
        }
    });
};

// 创建目录
FileOrDir.prototype.createDir = function(dirName) {
    var data = {
        'type': 'dir',
        'path': this.path,
        'name': dirName
    };
    this.ajax('create', data, function(res) {
        if(res.isValid) {
            $('#create_file .message').html(dirName + '文件夹创建成功！');
            FileOrDir.showDir(data.path);
        }
    }, function(error) {
        var errorText = JSON.parse(error.responseText);
        $('#create_file .message').html(errorCode(errorText.errorCode));
    });
};

// 剪切目录
FileOrDir.prototype.moveDir = function(dirName, dirRename) {
    var data = {
        'type': 'dir',
        'name': dirName,
        'rename': dirRename
    };
    this.ajax('move', data, function() {
        FileOrDir.showDir(treePath);
    });
};

// 复制目录
FileOrDir.prototype.copyDir = function(dirName, dirRename) {
    var data = {
        'type': 'dir',
        'name': dirName,
        'rename': dirRename
    };
    this.ajax('copy', data, function() {
        FileOrDir.showDir(treePath);
    });
};

// 重命名目录
FileOrDir.prototype.renameDir = function(dirName, dirRename) {
    var data = {
        'type': 'dir',
        'path': this.path,
        'name': dirName,
        'rename': dirRename
    };
    this.ajax('rename', data, function(){
        $('#rename .message').html('重命名成功!');
        FileOrDir.showDir(data.path);
    }, function() {
        var errorText = JSON.parse(error.responseText);
        $('#rename .message').html(errorCode(errorText.errorCode));
    });
};
/******************************************************************************************************/

/**
 * [changeTime 将序列化格式的时间转为特定格式的时间格式]
 * @param  {String} serializeTime 毫秒数
 * @return {String}               年月日 时分秒 格式的时间 例：2018-12-5 15:14:23
 */
function changeTime(serializeTime) {
    var date = new Date(serializeTime * 1000),
        year = date.getFullYear(),
        month = date.getMonth() + 1,
        day = date.getDate(),
        hours = date.getHours(),
        min = date.getMinutes(),
        seconds = date.getSeconds() + 1;

        month = month < 10 ? '0' + month : month;
        day = day < 10 ? '0' + day : day;
        hours = hours < 10 ? '0' + hours : hours;
        min = min < 10 ? '0' + min : min;
        seconds = seconds < 10 ? '0' + seconds : seconds;

    return year + '-' + month + '-' + day + ' ' + hours + ':' + min + ':' + seconds;
}

/**
 * [bitToByte 位转字节]
 * @param  {String} bitSize 位的大小
 * @return {String}         字节格式的显示
 */
function bitToByte(bitSize) {
    var leng = (bitSize + '').length;
    if(leng < 6) {  // KB
        if(bitSize === 0) {  // 0KB
            return '0KB';
        } else {
            return (bitSize / 1024).toFixed(2) + 'KB';
        }
    } else if (leng < 9) {  // MB
        return (bitSize / 1024 / 1024).toFixed(2) + 'MB';
    } else {  // GB
        return (bitSize / 1024 / 1024 / 1024).toFixed(2) + 'G';
    }
}

/**
 * [applyDataTemplate 渲染数据模版]
 * @param  {JSON} data 后端返回的用户文件(夹)数据
 * @return {String}    HTML字符串
 */
function applyDataTemplate(data) {
    if(typeof data === 'string') {
        data = JSON.parse(data);
    }
    var txtHtml = '',
        extension,
        filetype,
        basename,
        time,
        filesize;
    for(var i = 0, leng = data.length; i < leng; i++) {
        extension = data[i].extension;
        filetype = data[i].type;
        basename = data[i].basename;
        time = changeTime(data[i].filemtime);
        filesize = bitToByte(data[i].size);
        txtHtml += `<div id="${'file' + i}" class="file-item" data-type="${filetype}" data-basename="${basename}" data-extension="${extension}">
                        <div class="file-name">
                            <i class="icon-file icon-${extension ? extension: 'dir'}"></i>
                            <span title="双击名称重命名">${basename}</span>
                        </div>
                        <div class="file-type">${filetype === 'dir'? '文件夹' : extension + ' 文件'}</div>
                        <div class="file-size">${filetype === 'dir' ? '': filesize}</div>
                        <div class="file-time">${time}</div>
                        <div class="file-select"></div>
                    </div>`;
    }
    $('#file-amount').text(i + '个项目');

    return txtHtml;
}

// 模态弹窗
/**
 * [showModal 模态弹窗]
 * @param  {String}   title 标题
 * @param  {String}   text  内容文本
 * @param  {Function} fn    成功执行的函数
 * @param  {Function} fn2   失败执行的函数
 */
function showModal(title, text, fn, fn2) {
    var modalBox = $(document.createElement('div')),
        headline = title || '是否执行操作';

    modalBox.addClass('shade').show()
            .html(`<div class="modal box-center">
                    <div class="modal-head">
                        <h2 class="modal-title">${headline}<i class="icon icon-close" title="关闭"></i></h2>
                    </div>
                    <div class="modal-body">
                        <p>${text}</p>
                    </div>
                    <div class="modal-foot text-center">
                        <button class="btn" type="button" data-operation="true">确认</button>
                        <button class="btn" type="button" data-operation="false">取消</button>
                    </div>
                </div>`);

    $('body').append(modalBox);
    modalBox.on('click', 'button', function() {
        var operation = $(this).attr('data-operation');
        if (operation === 'true') {
            fn();
        } else if (operation === 'false') {
            if(fn2) {  // 存在失败执行的函数
                fn2();
            }
        }
        modalBox.remove();
    });

    modalBox.on('click', '.icon-close', function() {
        modalBox.remove();
    });

    modalBox.on('click', function(e) {
        if(this === e.target) {
            this.remove();
        }
    });
}

/**
 * [showLoading 模态提示框]
 * @param  {String} txt 提示的文本
 */
function showLoading(txt) {
    var loading = $(`<div class="loading box-center">${txt}</div>`);
    $('body').append(loading);
    setTimeout(function() {
        loading.remove();
    }, 1000);
}

// 下拉选择框
/**
 * [showSelect 下拉选择框]
 * @param  {Element} target 目标元素
 * @param  {Array|Object} data   需要生成的选择项值
 */
function showSelect(target, data) {
    var parent = target.parent(),
        tWidth = target.css('width'),
        tHeight = target.css('height'),
        nextElemnts = '';
    nextElemnts = '<div class="select-model">' +
                        '<ul>' +
                            '<li>请选择类型</li>';
    // 遍历传入的数据
    if(data) {
        for(var i = 0, leng = data.length; i < leng; i++) {
            nextElemnts += '<li>' + data[i] + '</li>';
        }
    }

    nextElemnts += '</ul></div>';

    parent.addClass('file-select-focus').after(nextElemnts);

    // 处理下拉选择框里的事件
    $('.select-model').css({'width': tWidth, 'top': tHeight, 'left': target.position().left})  // 添加样式
    .on('click', 'li', function() {  // 点击的下拉选择项
        var $this = $(this);

        if($this.index() === 0) {
            target.val('');
        } else {
            target.val($this.html());
        }
        parent.nextAll().remove();
    });
}

// 解压文件  TODO
function unZipFile() {}

/******************************************************************************************************/

// 全局变量
var treePath = '',  // 当前目录路径
    TOKEN = localStorage.getItem('token');  // token

// 初始化
(function() {
    $.ajaxSetup({  // 设置全局ajax请求的token配置
        beforeSend: function(xhr) {
            xhr.setRequestHeader('token', TOKEN);
        },
        type: 'POST'
    });

    // return ;

    var catalogType = location.search.slice(1).split('=')[1] || 'user',  // 默认是用户目录
        treePathTxt = '';

    // 首次加载根目录数据
    if(catalogType === 'user') {
        $.ajax({
            url: 'http://kcloud.vowcloud.cn/api/v1/dir/root?token='+ TOKEN,
            type: 'GET',
            success: function(res) {
                $('.file-content').append($(applyDataTemplate(res.dir)));
            },
            error: function(error) {
                errorCode(JSON.parse(error.responseText).errorCode);
            }
        });
        treePath = JSON.parse(localStorage.getItem('user')).root;  // 设置初始化根目录
        treePathTxt = '用户目录';
    } else if(catalogType === 'public'){
        treePath = 'public';
        treePathTxt = '公共目录';
        FileOrDir.showDir('public');
    }

    // 设置导航栏数据
    $('#nav ul').attr('data-path', treePath)
    .find('li').eq(0).attr('data-path', treePath).text(treePathTxt);

    // 判断是否有粘贴数据
    if(localStorage.getItem('tempName')) {
        $('#btn_stickup').show().attr('title', '粘贴数据:' + localStorage.getItem('tempName'));
    } else {
        $('#btn_stickup').hide();
    }


} ());

// 重新加载页面
$('#reset').on('click', function() {
    window.location.reload();
});

// 面包屑读取目录下文件
$('#nav').on('click', 'li', function() {
    var $this = $(this),
        targetPath = $this.attr('data-path');

    if(treePath === targetPath) {  // 目录相同时不重新加载
        return false;
    }

    $('.file-content').html('');  // 清空文件列表
    $this.nextAll().remove();  // // 删除最后的元素
    treePath = targetPath;  // 更新激活目录的path
    FileOrDir.showDir(targetPath);  // 发起读取目录请求
});

// 文件列表的头部tools的宽度
$('#file-head').on('mousedown', '.resize', function(e) {
    var $this = $(this),
        lastNode = $this.prev(),
        lastClass = lastNode.attr('class'),
        siblingsNode = $this.siblings().not(lastNode),
        mouseOffsetX = e.pageX;

    var minWidth = parseInt(lastNode.css('min-width')),  // 最小宽度是元素css样式设置的min-width加上前面的几个元素宽度
        lastWidth = parseInt(lastNode.css('width')),  // 栏目当前的宽度
        moveX = 0;

    // 判断是否有宽度样式的Style
    if($('#tools_class').length === 0) {
        $('head').append('<style id="tools_class"></style>');
    }

    document.onmousemove = function(e) {
            moveX = e.pageX - mouseOffsetX;  // 鼠标当前的移动位置 - 开始点击的位置  左 - 负  右 - 正
        var width = lastWidth + moveX,  // 当前鼠标移动后元素变化的宽度
            maxWidth = parseInt($this.parent().css('width')) - getNodeWidth(siblingsNode);  // 最大宽度是整个容器宽度减去另外几个元素的宽度
        // 判断条件，限制拖动的范围
        moveX = Math.min(maxWidth, Math.max(minWidth, width));
        lastNode.css('width', moveX);
        // 设置列表的总宽度
        setToolsStyleSheet('file-item', getNodeWidth($('#file-head').find('div[class^="file-"]')));
        // 设置列表里的各个栏目宽度  栏目的宽度设置需要写入CSS规则  1、写在本地存储 2、写在styleSheets,通过正则匹配来处理  选择2来写入
        setToolsStyleSheet(lastClass, moveX);
    };

    document.onmouseup = function() {
        document.onmousemove = null;
        document.onmouseup = null;
    };
});

// 设置文件列表的栏目的宽度样式
/**
 * 设置文件列表的栏目的宽度样式
 * @param {String} className 类名的样式名
 * @param {Number} w         移动后的宽度
 */
function setToolsStyleSheet(className, w) {
    var tools_class = $('#tools_class'),
        stylesheet = tools_class.html(),
        reg = new RegExp('\.' + className + '{width: [0-9]+px;}'),
        cssStyle = '.' + className + '{width: ' + w + 'px;}';
    if(reg.test(stylesheet)) {  // 有则直接替换
        stylesheet = stylesheet.replace(reg, cssStyle);
    } else {  // 否则增加一个样式
        stylesheet += ' .file-list-list ' + cssStyle;
    }

    tools_class.html(stylesheet);
}

/**
 * 计算元素的宽度总和
 * @param  {Array | jQuery} els 需要计算的元素的宽度
 * @return {Number}     元素的宽度总和
 */
function getNodeWidth(els) {
    var res = 0;
    for(var i = 0, len = els.length; i < len; i++) {
        res += parseInt($(els[i]).css('width'));
    }
    return res;
}

/**
 * 计算菜单栏显示时的top和left，防止超出页面
 * @param  {Element} el 菜单栏元素
 * @param  {Event} ev Event
 * @return {Object}    返回一个对象，包括top和left。{top: top, left: left}
 */
function getElTop(el, ev) {
    var $document = $(document),
        $el = $(el),
        w = parseInt($el.css('width')),
        top, left;
    if($document.height() - ev.pageY <= (parseInt($el.css('height')) + 20)){
        top = ev.offsetY;
    } else {
        top = ev.pageY;
    }

    if($document.width() - ev.pageX <= w) {
        left = ev.pageX - w;
    } else {
        left = ev.pageX;
    }

    return {
        'top': top,
        'left': left
    };
}

// TODO:开启文件列表内容区的右键菜单栏
$('.file-content').on('contextmenu', function(e) {
    var position = getElTop('#menu', e);

    $('#menu').show().css({
        'top': position.top,
        'left': position.left
    });
    $('#context_menu').remove();
    return false;
});

// 文件列表内容区的右键菜单栏
$('#menu').on('click', 'li', function(e) {
    $('#menu').hide();
    var option = $(this).attr('data-option');
    switch(option) {
        case 'refresh':
            FileOrDir.showDir(treePath);
            break;
        case 'upload':
            $('#btn_update').trigger('click');
            break;
        case 'create-dir':
        case 'create-file':
            $('#btn_create').trigger('click');
            break;
        case 'paste':
            try {
                $('#btn_stickup').trigger('click');
            } catch(err) {
                showLoading('没有粘贴内容');
            }
            break;
        default:
            console.log('未定义');
    }

});

// 在文件列表里双击文件名字触发重命名事件
$('.file-content').on('dblclick', '.file-name span', function(e) {
    e.stopPropagation();
    var $this = $(this),
        fileName = $this.text(),
        $elements = $(`<div class="textarea">
                        <textarea>${fileName}</textarea>
                    </div>`);
    $this.html($elements);
    $elements.find('textarea').focus().on('blur', function() {
        var rename = $(this).html();
        $this.text(rename);
    });
});

// 在文件列表里双击文件触发的事件
$('.file-content').on('dblclick', '.file-item', function(e) {
    openDirFile(this);
}).on('selectstart', function(e) {  // 取消点击选中文件列表里的文本  (BUG：无法点击选中文本)
    return false;
});

// 进入下一级目录或打开文件(txt|php|html|js|css)或预览文件(pdf|images)
function openDirFile(target) {
    var $this = $(target),
        fileName = $this.attr('data-basename');

    if($this.attr('data-type') === 'dir') {  // 进入目录
        treePath = treePath + '/' + fileName;  // 设置当前的目录路径

        $('#nav ul').append('<li class="nav-item" data-path="' + treePath + '">' + fileName + '</li>');
        $('.file-content').html('');
        // 发起查询目录请求
        FileOrDir.showDir(treePath);

    } else {  // 打开文件
        var extension = $this.attr('data-extension'),  // 获取文件的后缀名类型
            fileData = {
                'path': treePath,
                'name': fileName,
                'type': extension
            },
            extensionType = {
                'txt': 'text',
                'md': 'markdown',
                'html': 'html',
                'php': 'php',
                'css': 'css',
                'js': 'javascript'
            };

        if(extensionType[extension]) {
            fileData.type = extensionType[extension];
            openAceEditor(fileData);
        } else {
            showLoading('未知类型，请联系开发者处理!');
        }
    }
}

// 打开编辑器
function openAceEditor(data) {
    var templateBox = $(document.createElement('div'));

    templateBox.html(`<div class="editor-box">
                                    <div class="head">
                                        <h4 class="head-title">${data.name}</h4>
                                        <div class="head-btn">
                                            <span  class="icon icon-full" title="全屏"></span>
                                            <span  class="icon icon-close" title="关闭编辑器"></span>
                                        </div>
                                    </div>
                                    <div class="con">
                                        <iframe src="ace.html?path=${data.path}&name=${data.name}&type=${data.type}"></iframe>
                                    </div>
                                </div>`)
                .addClass('shade').show();
    $('body').append(templateBox);

    // 关闭编辑器
    templateBox.on('click', '.icon-close', function() {
        templateBox.remove();
    });

    // 全屏
    templateBox.on('click', '.icon-full', function() {
        $(this).removeClass('icon-full').addClass('icon-min');
        templateBox.find('.editor-box').addClass('editor-full');
    });

    // 退出全屏
    templateBox.on('click', '.icon-min', function() {
        $(this).removeClass('icon-min').addClass('icon-full');
        templateBox.find('.editor-box').removeClass('editor-full');
    });
}

// 显示右键菜单
$('.file-content').on('contextmenu', '.file-item', function(e) {
    // $('#context_menu').remove();
    var $this = $(this),
        file_menu = $('#file_menu');
        // menu = $(`<div id="context_menu">
        //             <ul>
        //                 <li class="item">下载</li>
        //                 <li class="item">复制</li>
        //                 <li class="item">剪切</li>
        //                 <li class="item" style="display: none;">粘贴</li>
        //                 <li class="item">重命名</li>
        //                 <li class="item">删除</li>
        //             </ul>
        //         </div>`);
    // $('body').append(menu);
    // 计算右键菜单栏出现的位置
    var pageY = e.pageY,
        top = null,
        menu_height = file_menu.height();

    if($(document).height() - pageY <= (menu_height + 20)){
        top = pageY - menu_height;
    } else {
        top = pageY;
    }

    file_menu.css({'top': top, 'left': e.clientX}).show()  // 显示菜单栏
        .attr('data-id', $this.attr('id'));  // 添加数据

    // 判断是否显示粘贴功能
    // if(localStorage.getItem('tempName')) {
    //     menu.find('li').eq(2).show();
    // } else {
    //     menu.find('li').eq(2).hide();
    // }

    return false;
});

// 取消右键菜单
$(document).on('mouseup', function(e) {
    $('.menu-list').hide();
    // if(e.button === 0 && ($('#file_menu').css('display') === 'block') && e.target.className !== 'item') {
    //     $('#file_menu').hide();
    // }
});

// 右键菜单里的事件
$('#file_menu').on('click', 'li', function(e) {
    var $this = $(this),
        parent = $this.parent(),
        option = $this.attr('data-option'),
        $fileid = $('#' + parent.attr('data-id')),  // 获取文件列表里的的ID，找到操作的文件项
        basename = $fileid.attr('data-basename'),  // 获取文件(夹)的名字
        type = $fileid.attr('data-type'),  // 获取是文件类型还是文件夹类型
        extension = $fileid.attr('data-extension');  // 获取后缀名

    $('.menu-list').hide();  // 隐藏模拟上下文菜单
    switch(option) {
        case 'open':
            $fileid.trigger('dblclick');
            break;
        case 'download':
            downloadFile(type, basename);
            break;
        case 'copy':
            setStickupData('copy', basename, type);
            break;
        case 'cute':
            setStickupData('move', basename, type);
            break;
        case 'paste':
            stickupFileDir();
            break;
        case 'rename':
            showRename({
                'basename': basename,
                'type': type,
                'extension': extension
            });
            break;
        case 'remove':
            if(type === 'dir') {  // 删除目录
                showModal('删除文件', '是否删除' + basename + ' 文件夹', function() {
                    new FileOrDir().delDir(basename, function() {
                        $fileid.remove();
                    });
                });
            } else {  // 删除文件
                showModal('删除文件', '是否删除' + basename + ' 文件', function() {
                    new FileOrDir().delFile(basename, function() {
                        $fileid.remove();
                    });
                });
            }
            break;
        default:
            console.log('没有定义');
    }
});

/**
 * 缓存复制或剪切的数据
 * @param {String} stickup 参数说明：copy(复制)|move(剪切)
 * @param {String} basename 文件(夹)名字，文件名需要携带后缀名
 * @param {String} filetype dir(文件夹)|file(文件)
 */
function setStickupData(stickup, basename, filetype) {
    localStorage.setItem('tempName', treePath + '/' + basename);
    localStorage.setItem('operation', '{"stickup": "' + stickup + '", "type":"' + filetype + '"}');
    $('#btn_stickup').show();
}

/**
 * 下载文件或文件夹
 * @param  {String} parentType 下载的类型，dir：文件夹|file：文件
 * @param  {String} fileName   文件(夹)名字
 */
function downloadFile(parentType, fileName) {
    if(parentType === 'dir') {  // 下载目录
        location.href = 'http://kcloud.vowcloud.cn/api/v1/dir/download?token=' + TOKEN + '&type=dir&name=' + fileName + '&path=' + treePath;
    } else {  // 下载文件
        location.href = 'http://kcloud.vowcloud.cn/api/v1/file/download?token=' + TOKEN + '&type=file&name=' + fileName + '&path=' + treePath;
    }
}

// 给粘贴文件(夹)的按钮添加粘贴事件
$('#btn_stickup').on('click', function() {
    stickupFileDir();
});

// 粘贴文件(夹)功能
function stickupFileDir() {
    var operation = JSON.parse(localStorage.getItem('operation')),
        fileName = localStorage.getItem('tempName'),  // 原文件(夹)的目录路径
        reName = treePath + '/' + fileName.split('/').reverse()[0];  // 需要粘贴到的新的目录路径

    if(operation.stickup === 'copy') {  // 复制

        if(operation.type === 'dir') {  // 复制文件夹
            new FileOrDir().copyDir(fileName, reName);
        } else {  // 复制文件
            new FileOrDir().copyFile(fileName, reName);
        }

    } else if(operation.stickup === 'move') {  // 剪切

        if(operation.type === 'dir') {  // 剪切文件夹
            new FileOrDir().moveDir(fileName, reName);
        } else {  // 剪切文件
            new FileOrDir().moveFile(fileName, reName);
        }
    }
    localStorage.removeItem('tempName');
    localStorage.removeItem('operation');
    $('#btn_stickup').hide();
}

// 打开创建文件面板
$('#btn_create').on('click', function() {
    $('#create_file').show();
});

// 创建文件面板的事件
$('#create_file').on('click', function(e) {
    var operation = $(e.target).attr('data-operation'),
        con = $('#create_file .panel-body'),
        msg = $('#create_file .text-message');

    if(!operation) {  // 没有操作时，停止下一步判断
        $('.select-model', this).remove();
        $('.file-select', this).removeClass('file-select-focus');
        return false;
    }

    switch(operation) {
        case 'close':  // 关闭面板
            $(this).hide();
            msg.html('');
            break;
        case 'file':  // 切换到文件
            con.removeClass('dir-active').addClass('file-active');
            break;
        case 'dir':  // 切换到文件夹
            con.removeClass('file-active').addClass('dir-active');
            break;
        case 'create_file': // 创建文件
            var file_type = $('#file_type').val().toLowerCase(),  // 文件类型
                file_name = $('#file_name').val(),  // 文件名
                fileName = file_name + '.' + file_type;  // 带后缀名的文件名

            if(!file_type) {
                msg.html('文件类型不能为空！');
            } else if (!file_name) {
                msg.html('文件名不能为空！');
            } else {
                showModal('创建文件', '是否要创建' + fileName + '文件', function() {
                    new FileOrDir().createFile(fileName);
                });
            }
            break;
        case 'create_dir': // 创建文件夹
            var dir_name = $('#dir_name').val();
            if(!dir_name) {
                msg.html('文件夹名字不能为空！');
            } else {
                showModal('创建文件夹', '是否要创建' + dir_name +'文件夹', function() {
                    new FileOrDir().createDir(dir_name);
                });
            }
            break;
        case 'input':  // 点击输入框清空提示信息
            msg.html('');
            break;
        case 'select':  // 下拉模态框
            msg.html('');
            showSelect($(e.target), ['txt', 'md', 'php', 'js', 'css', 'html']);  // 传入JQ对象类型的当前下拉框元素
            break;
        default:
            console.log('没有定义方法');
    }
});

// 打开上传文件面板
$('#btn_update').on('click', function() {
    $('#uploader').show();
    $('#thelist').html('');
    uploadFile();
});

// 上传文件
function uploadFile() {
    // 调用webuploader插件
    var uploader = WebUploader.create({

        // 文件接收服务端。
        server: 'http://kcloud.vowcloud.cn/api/v1/file/upload',

        // 设置头信息
        headers: {
            'token': TOKEN
        },

        // 设置传入的参数
        formData: {
            'type': 'file',
            'path': treePath  // 上传的路径
        },

        // 选择文件的按钮。可选。
        // 内部根据当前运行是创建，可能是input元素，也可能是flash.
        pick: '#picker',

        // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
        resize: false,

        // 是否允许在文件传输时提前把下一个文件准备好
        prepareNextFile: true,

        // 设置文件上传域的name，默认：file
        fileVal: 'files[]'
    });

    // 文件被添加进队列前触发的事件
    uploader.on( 'beforeFileQueued', function(file) {
        if(file.size === 0) {
            showLoading(file.name + ' 零字节文件无法上传!');
        }
    });

    // 当有文件被添加进队列的时候
    uploader.on( 'fileQueued', function( file ) {
        $('#thelist').append(`
            <tr id="${file.id}">
                <td class="file-name">${file.name}</td>
                <td class="file-size">${bitToByte(file.size)}</td>
                <td class="file-status">
                    <div class="rate-module">
                        <div class="rate-bj">
                            <span class="rate-text">0%</span>
                            <span class="rate" style="width: 0%;"></span>
                        </div>
                    </div>
                </td>
                <td class="file-operation">
                    <button class="btn-img btn-img-start" type="button" title="开始上传" data-operation="start">开始</button>
                    <button class="btn-img btn-img-reset" style="display: none;" type="button" title="重新上传文件" data-operation="reset">重新</button>
                    <button class="btn-img btn-img-stop" type="button" title="停止上传" data-operation="stop">停止</button>
                    <button class="btn-img btn-img-del" type="button" title="删除上传文件" data-operation="del">删除</button>
                </td>
            </tr>
            `);
    });

    // 开始上传
    $("#ctlBtn").click(function () {
        uploader.upload();
    });

    // 文件上传过程中创建进度条实时显示。
    uploader.on( 'uploadProgress', function( file, percentage ) {
        var $li = $( '#'+file.id ),
            $percent = $li.find('.rate');

        $li.find('.file-operation').removeClass('file-operation-error').addClass('file-operation-stop');
        $li.find('.rate-text').text(percentage * 100 + '%');
        $percent.css('width', percentage * 100 + '%');
    });

    // 成功则派送uploadSuccess事件
    uploader.on('uploadSuccess', function( file ) {
        $('#'+file.id).find('.file-operation').text('已上传').css({'font-size': '14px', 'text-align': 'center'});
    });

    // 文件上传失败会派送uploadError事件
    uploader.on( 'uploadError', function( file ) {
        var $li = $('#'+file.id);
        $li.find('.rate-text').text('上传出错');

        if(file.error === 'error') {  // 判断是否能重新上传
            $li.find('.file-operation').removeClass('file-operation-stop').addClass('file-operation-error');
        }
    });

    // 不管成功或者失败，在文件上传完后都会触发uploadComplete事件
    // uploader.on( 'uploadComplete', function( file ) {
    //     $( '#'+file.id ).find('.progress').fadeOut();
    // });

    // 关闭面板，重新刷新当前目录
    function hideUploader() {
        var queueNum = uploader.getStats().queueNum;

        if(queueNum === 0 || queueNum === undefined) {
            $('#uploader').hide();
            uploader.destroy();
        } else {  // 队列中有排队的上传文件
            console.log(queueNum);
            showModal('取消上传', '是否取消上传文件？', function() {
                $('#uploader').hide();
                uploader.destroy();
            });
        }
        FileOrDir.showDir(treePath);
    }
    // 关闭上传
    $('#uploader .icon-close').on('click', function() {
        hideUploader();
    });
    $('#uploader').on('click', function(e) {
        if(e.target === this) {
            hideUploader();
        }
    });

    // 上传文件列表里的按钮事件
    $('#thelist').on('click', 'button', function() {
        var $this = $(this),
            operation = $this.attr('data-operation'),
            parent = $this.parent().parent(),
            parentId = parent.attr('id');

        switch(operation) {
            case 'start':  // 上传文件
                // uploader.retry(parentId);
                uploader.upload(parentId);
                console.log(uploader.getStats().queueNum);
                break;
            case 'stop':  // 停止上传,标记文件状态为已取消, 同时将中断文件传输
                uploader.cancelFile(parentId);
                $('#'+parentId).find('.file-operation').removeClass('file-operation-stop');
                break;
            case 'del':  // 删除上传文件
                uploader.removeFile(parentId);
                parent.remove();
                break;
            case 'reset':  // 重新上传
                uploader.retry(parentId);
                break;
            default:
                // console.log('没有定义方法dls');
        }
    });
}

// 打开重命名的面板
function showRename(fileData) {
    // 清空上一次的输入内容
    $('#rename .file-name').html(fileData.basename);
    $('#rename input').val('');

    $('#rename').show().on('click', function(e) {
        var operation = $(e.target).attr('data-operation'),
            fileRename = $('input', this).val(),
            fileType = fileData.extension,
            $this = $(this),
            msg = $this.find('.text-message');

        if(operation === 'close') {
            $this.hide().off('click');
            msg.html('');
        } else if (operation === 'sub') {

            if(!fileRename) {  // 输入框为空
                msg.html('重命名的文件名不能为空!');
            } else {
                if(fileData.type === 'dir') {  // 重命名文件夹
                    showModal('重命名', '重命名文件夹', function() {
                        new FileOrDir().renameDir(fileData.basename, fileRename);
                    });
                } else if (fileData.type === 'file') {  // 重命名文件
                    fileRename = fileRename + '.' + fileType;
                    showModal('重命名', '重命名文件', function() {
                        new FileOrDir().renameFile(fileData.basename, fileRename);
                    });
                }
            }
        }
    });
}

// F5刷新 重新加载当前目录的数据
$('body').on('keydown', function(e) {
    if(e.which === 116){
        FileOrDir.showDir(treePath);
        return false;
     }
});

});