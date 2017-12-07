let util = require("../common/util");

function getUserInformation(vm) {
	if (!window["sessionStorage"]) {
		window.Bus.$message({
			type: "error",
			message: "当前浏览器不能使用本地存储,请更换浏览器"
		});
		return false;
	}
	let access_token = window.sessionStorage.getItem("access_token");
	if (access_token) {
		vm.$http({
			url: API("/sysuser"),
			method: "get",
			//请求时设置请求头
			// headers: {
			// 	Authorization:`bearer ${access_token}`
			// },
		}).then(
			(res) => {
				if (res.ok && res.status === 200) {
					if (res.body) {
						let data = res.body;
						if (data.code === 0 && data.msg === "成功") {
							if (data.data) {
								vm.userInformation = data.data;
							}
						} else {
							util.logout("access_token");
						}
					}
				} else {
					util.logout("error");
				}
			},
			(res) => {
				util.logout("error");
			}
		);
	}
}

exports.getUserInformation = getUserInformation;