webpackJsonp([6],{19:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var o=n(20),r=(n.n(o),n(0)),a=n.n(r);a()(function(){function t(){var t=!0;return a()("input","#form").each(function(e,n){var o=a()(n);if(!o.val())return o.parent().next().text("输入框不能为空!"),o.focus(),t=!1,!1}),t}function e(){var t=a()("#repassword"),e=a()("#repassword2"),n=a()("#repassword").val();return n.length<6?(t.parent().next().text("密码长度不能少于6位!"),!1):n===e.val()||(e.parent().next().text("两次密码输入不一致，请重新输入!"),!1)}!function(){a.a.ajaxSetup({beforeSend:function(t){t.setRequestHeader("token",localStorage.getItem("token"))},type:"POST"})}(),a()("#form").on("blur","input",function(){var t=a()(this);""!==t.val()&&t.parent().next().text("")}),a()("#sub").on("click",function(){if(t()&&e()){var n={password:a()("#password").val(),repassword:a()("#repassword").val()};a.a.ajax({url:"http://kcloud.vowcloud.cn/api/v1/user/edit_pass",data:n,success:function(t){t.isValid&&(console.log("修改成功!"),top.$.logout())},error:function(t){console.log(t)}})}})})},20:function(t,e){}},[19]);