//var baseUrl = "http://lc.empire/";
var baseUrl = "http://app.ukacoin.com/";
var itemUrl ={
	sign:"6e4e1b9ebbb615869deee9f69bdad912",
	mfrom:"app",
	login:"signin",//登录
	forgot:"forgot",//忘记密码
	center:"account/profile",//用户中心
	nikeName:"account/editnickname",
	reset:"account/reset",
	eth:"account/eth",
	inviter:"team/inviter",
	notice:"news",//公告
	noticeDetail:"article",
	member :"team/member",
	transfer :"transfer/index",
	exchange:"transfer/exchange",
	post:"transfer/post",
	withdrawash:"transfer/withdraw_cash",
	home:"home",
	prizemember:"Gathering/prizemember",
	prize:"Gathering/prize",//抽奖
	log:"Gathering/log",
	record:"wallet/record",
	invest:"Gathering/invest",//投注
    itemList:"Gathering/list"//项目列表
}
var getUserInfo = function(){
	return JSON.parse(plus.storage.getItem("userInfo"));
}
var getToken = function(){
	return plus.storage.getItem("token");
}

//  复制方法
function copy_fun(copy){//参数copy是要复制的文本内容
	mui.plusReady(function(){
		//判断是安卓还是ios
		if(mui.os.ios){
			//ios
			var UIPasteboard = plus.ios.importClass("UIPasteboard");
		    var generalPasteboard = UIPasteboard.generalPasteboard();
		    //设置/获取文本内容:
		    generalPasteboard.plusCallMethod({
		        setValue:copy,
		        forPasteboardType: "public.utf8-plain-text"
		    });
		    generalPasteboard.plusCallMethod({
		        valueForPasteboardType: "public.utf8-plain-text"
		    });
		    mui.toast("已成功复制到剪贴板");
		}else{
			//安卓
			var context = plus.android.importClass("android.content.Context");
			var main = plus.android.runtimeMainActivity();
			var clip = main.getSystemService(context.CLIPBOARD_SERVICE);
			plus.android.invoke(clip,"setText",copy);
			mui.toast("已成功复制到剪贴板");
		}
	});
}
