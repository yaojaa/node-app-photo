require.config({paths:{jquery:"static/js/lib/jquery-1.11.1.min",doT:"static/js/lib/doT.min",bootbox:"static/js/bootbox/bootbox"}}),define(["jquery","doT","bootbox"],function(a,b,c){var d=require("static/tpl/login.tpl");return console.log(d),{init:function(){c.msg("bootbox")}}});