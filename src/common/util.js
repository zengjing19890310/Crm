Vue.use(VueResource);
Vue.use(element);

module.exports = {
	//将从后台读取的资源树格式化
	initTree(treeData, result) {
		let nodeObject = {};
		if (treeData && treeData.length !== 0) {
			_.forEach(treeData, (node, index) => {
				nodeObject = {
					id: node.id,
					pid: node.pid,
					label: node.menuName,
					children: [],
				};
				if (node.childs && node.childs.length !== 0) {
					this.initTree(node.childs, nodeObject.children);
				}
				result.push(nodeObject);
			});
		}
	},
	//抓去iframe src字段
	fetchSrc(src) {
		let reg = /src=["']([^["']+)["']/;
		src.match(reg);
		return RegExp.$1;
	},
	//抓取URL后面的参数
	fetchParam(search, param) {
		let parseSearch = function (search) {
			let params = search.substr(1),
				paramArray = params.split("&"),
				searchObject = {};
			if (paramArray && paramArray.length !== 0) {
				let arr = [];
				paramArray.forEach(function (value, index) {
					if (value) {
						arr = value.split("=");
						if (arr[0]) {
							searchObject[arr[0]] = arr[1];
						}
					}
				});
			}
			return searchObject;
		};
		let searchObject = parseSearch(search);
		return searchObject[param] ? searchObject[param] : "";
	},
	//处理时间格式
	timeFormatter(timeStamp) {
		let prependZero = (value) => {
			return value < 10 ? "0" + value : value;
		};
		let date = new Date(timeStamp);
		return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDay()} ${prependZero(date.getHours())}:${prependZero(date.getMinutes())}`;
	},
	//处理各种需要登出的情况
	logout(type, message, alert) {
		console.log(alert);
		let vm = new Vue(),
			// statusCode = null,
			status = "error";
		switch (type) {
		case "access_token":
			message = "token校验失败,请重新登录...";
			// statusCode = 1;
			break;
		case "error":
			message = "请求结果错误,可能是因为请求错误";
			// statusCode = 2;
			break;
		case "normal":
			message = "成功登出,即将跳转到登录页面";
			status = "warning";
			// statusCode = 3;
			break;
		default:
			if (!message) {
				message = "未知错误,请重新登录...";
			}
			// statusCode = 9;
		}
		if(!alert){
			vm.$message({
				type: status,
				message: message,
				duration: 1500,
				// onClose: function () {
				// window.sessionStorage.removeItem("access_token");
				// window.location.href = "../login";
				//可能某些情况不需要跳转到登录,需要进行特殊处理
				// if (statusCode !== 9 && statusCode !== 2) {
				// 	window.location.href = "../login";
				// }
				// }
			});
		}
		window.sessionStorage.removeItem("token");
		window.sessionStorage.removeItem("userId");
		window.sessionStorage.removeItem("nickname");
		window.sessionStorage.removeItem("userInformation");
		window.location.href = "../login";
	}
};