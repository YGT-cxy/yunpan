webpackJsonp([1,8],[,function(e,t){},function(e,t,n){"use strict";function a(e){var t="",n={1:"通用类型错误",2:"用户类型错误",3:"token类型错误",4:"操作类型错误",1e3:"参数错误",2e3:"注册失败",2001:"用户已存在",2002:"用户名密码错误",2003:"密码错误",2005:"验证码不存在或已过期",3e3:"Token已过期或无效",3001:"服务器缓存异",4e3:"操作错误",4001:"目录已存在",4002:"操作权限不足，请联系管理员!",4003:"目录不存在",4004:"根目录不允许修改或移动或删除",4005:"文件不存在"};switch((e+"")[0]){case"1":case"2":case"3":case"4":t=n[e];break;case"9":localStorage.clear(),window.location.href="login.html";break;default:t="错误未知！"}return t}n.d(t,"a",function(){return a})},function(e,t){},function(e,t,n){"use strict";function a(e){for(var t={},n=e.length-1;n>=0;n--)t[e[n].name]=e[n].value;return t}function r(){return!!/^([a-zA-Z0-9]+)$/.test($("#username").val())}function s(){return!!/^([a-zA-Z0-9._-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/.test($("#email").val())}function o(){return!!/^([a-zA-Z]+)$/.test($$("#domain").val())}function i(){var e=$("#password").val();return!(e.length<6)&&e===$("#notpassword").val()}function c(e){$inputs=$(e+" input"),$inputs.val("")}n.d(t,"f",function(){return a}),n.d(t,"d",function(){return r}),n.d(t,"b",function(){return s}),n.d(t,"a",function(){return o}),n.d(t,"c",function(){return i}),n.d(t,"e",function(){return c})},,,,,,function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=n(1),r=(n.n(a),n(3)),s=(n.n(r),n(0)),o=n.n(s),i=n(4),c=n(2);o()(function(){function e(e,t){this.text=e,this.type=t||"error";var n=o()('<div class="shade" style="display: block;">\n                        <p class="text-center">'.concat(this.text,"</p>\n                    </div>"));o()("body").append(n),"login"===this.type?this.alert=function(){setTimeout(function(){window.location.href="index.html"},200)}:"error"===this.type?this.alert=function(){setTimeout(function(){n.remove()},300)}:"register"===this.type&&(this.alert=function(){setTimeout(function(){n.remove()},1e3)})}function t(){var e=!0;return o()("input","#form").each(function(t,n){var a=o()(n);if(!a.val())return a.parent().next().show().addClass("text-error").text("填写不能为空!"),a.focus(),e=!1,!1}),e}function n(){o.a.ajax({url:"http://kcloud.vowcloud.cn/api/v1/user/send_code",type:"POST",data:{email:o()("#email").val(),username:o()("#username").val()},dataType:"text",success:function(t){var n=t.indexOf("{"),a=t.slice(n),r=JSON.parse(a).msg;console.log(r),new e(r).alert()},error:function(e){o()("#send_code").text("重新发送").removeClass("btn-disabled").removeAttr("disabled")}})}function a(){var t=Object(i.f)(o()("#form").serializeArray());o.a.ajax({url:"http://kcloud.vowcloud.cn/api/v1/user/code_edit_pass",type:"POST",data:t,success:function(t){console.log(t),t.isValid&&new e("修改成功").alert()},error:function(t){var n=Object(c.a)(JSON.parse(t.responseText).errorCode);console.log(n),new e(n).alert(),o()("#sub").removeClass("btn-disabled").removeAttr("disabled")}})}o()("#form").on("blur","input",function(){var e=this.name,t="",n=o()(this).parent().next(),a=this.value;if(""===a)t="填写不能为空!";else switch(e){case"email":Object(i.b)()||(t="邮箱格式不对，请重新填写!");break;case"username":Object(i.d)()||(t="用户名格式不对，请重新填写!");break;case"code":""===this.value&&(t="验证码不能为空!");break;case"newpassword":a.length<6&&(t="密码的长度不能低于6位!");break;default:console.log("没有定义新的方法")}n.text(t).addClass("text-error")}),o()("#send_code").on("click",function(){Object(i.b)()&&Object(i.d)()?(o()(this).addClass("btn-disabled").attr("disabled","disabled"),n()):new e("没有填写邮箱或用户名!").alert()}),o()("#sub").on("click",function(){t()&&(a(),o()(this).addClass("btn-disabled").attr("disabled","disabled"))})})}],[10]);