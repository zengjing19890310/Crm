//除了登录页面,所有的页面都必须要获取access_token,验证登录状态
let util = require("../common/util");

function checkToken(keep) {
	if (!window["sessionStorage"]) {
		window.Bus.$message({
			type: "error",
			message: "当前浏览器不能使用本地存储,请更换浏览器"
		});
		return false;
	}
	let token = window.sessionStorage.getItem("token");

	if (token) {
		//对token进行效验?
		//如果有token,并且token没有被设置在全局设置请求头,将access_token放入请求头
		if(!Vue.http.headers.common["token"]){
			Vue.http.headers.common["token"] = token;
		}
	} else if(!keep){
		//没有token,则通过util之中的登出方法返回登录页面
		util.logout("access_token");
	}
}

exports.checkToken = checkToken;