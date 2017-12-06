Vue.use(VueResource);
Vue.use(element);

module.exports = {
	//处理时间格式
	timeFormatter(timeStamp) {
		let prependZero = (value) => {
			return value < 10 ? "0" + value : value;
		};
		let date = new Date(timeStamp);
		return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDay()} ${prependZero(date.getHours())}:${prependZero(date.getMinutes())}`;
	},
	//处理各种需要登出的情况
	logout(type, message) {
		let vm = new Vue(),
			statusCode = null,
			status = "error";
		switch (type) {
		case "access_token":
			message = "token校验失败,请重新登录...";
			statusCode = 1;
			break;
		case "error":
			message = "请求结果错误,可能是因为请求错误";
			statusCode = 2;
			break;
		case "normal":
			message = "成功登出,即将跳转到登录页面";
			status = "warning";
			statusCode = 3;
			break;
		default:
			if (!message) {
				message = "未知错误,请重新登录...";
			}
			statusCode = 9;
		}

		vm.$message({
			type: status,
			message: message,
			duration: 1500,
			onClose: function () {
				window.localStorage.removeItem("access_token");
				window.location.href = "../login";
				//可能某些情况不需要跳转到登录,需要进行特殊处理
				// if (statusCode !== 9 && statusCode !== 2) {
				// 	window.location.href = "../login";
				// }
			}
		});

		return false;
	}
};