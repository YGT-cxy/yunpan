/******************************************************************************************************/
// 文件操作和目录操作的ajax请求公共的部分
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
                // console.log(txt);
                // console.log(error.responseText);
            }
        }
    });
}
/******************************************************************************************************/
// 文件操作或目录操作ajax请求类
export function FileOrDir() {
    // this.path = localStorage.getItem('path');
    this.path = treePath;
    this.ajax = ajaxCommon;
}
// 删除文件
FileOrDir.prototype.delFile = function(fileName) {
    var data = {
        'type': 'file',
        'path': this.path,
        'name': fileName
    };
    this.ajax('del', data, function(res) {
        if(res.isVaild) {
            showLoading(fileName + '文件删除成功!');
            FileOrDir.showDir(data.path);
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
        // FileOrDir.showDir(localStorage.getItem('path'));
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
        // FileOrDir.showDir(localStorage.getItem('path'));
        FileOrDir.showDir(treePath);
    });
};

// 静态方法查看某个目录
FileOrDir.showDir = function(path) {
    var data = {
        'path': path,
        'type': 'dir'
    };
    new FileOrDir().ajax('tree', data, function(res) {
        var txtHtml = applyDataTemplate(res);
        $('#file table tbody').html(txtHtml);
    }, function(error) {
        var errorText = JSON.parse(error.responseText);
        showLoading(errorCode(errorText.errorCode));
    });
};

// 删除目录
FileOrDir.prototype.delDir = function(dirName) {
    var data = {
        'type': 'dir',
        'path': this.path,
        'name': dirName
    };
    this.ajax('del', data, function(res) {
        if(res.isVaild) {
            showLoading(dirName + '文件夹删除成功!');
            FileOrDir.showDir(data.type);  // TODO:不请求接口，删除当前的选项
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
        // FileOrDir.showDir(localStorage.getItem('path'));
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
        // FileOrDir.showDir(localStorage.getItem('path'));
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