//除了登录页面,所有的页面都必须要获取access_token,验证登录状态

function checkToken() {
	if (!window["localStorage"]) {
		window.Bus.$message({
			type: "error",
			message: "当前浏览器不能使用本地存储,请更换浏览器"
		});
		return false;
	}
	let access_token = window.localStorage.getItem("access_token");

	if (access_token) {
		return true;
	} else {
		window.Bus.$message({
			type: "error",
			message: "token获取失败,请重新登录...",
			duration: 1500,
			onClose: function () {
				window.location.href = "../login";
			}
		});
		return false;
	}
}

exports.checkToken = checkToken;