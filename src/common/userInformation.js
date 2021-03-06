let util = require("../common/util");

function getUserInformation(vm) {
	if (!window["sessionStorage"]) {
		window.Bus.$message({
			type: "error",
			message: "当前浏览器不能使用本地存储,请更换浏览器"
		});
		return false;
	}
	let token = window.sessionStorage.getItem("token");
	if (token) {
		vm.$http({
			url: API("/sysuser"),
			method: "get",
			headers:{
				token:token
			}
		}).then(
			(res) => {
				if (res.ok && res.status === 200) {
					if (res.body) {
						let data = res.body;
						if (data.code === 0 && data.msg === "成功") {
							if (data.data) {
								vm.userInformation = data.data;
<<<<<<< HEAD
							} else {
								//获取用户信息为空,踢出重新登录
								util.logout();
=======
>>>>>>> 00544b5aa1e3eda4037b94d1d9c52a1c1e46ac5a
							}
						} else {
							vm.$message({
								type: "error",
								message: data.msg
							});
							util.logout("access_token");
						}
					}
				} else {
					util.logout("error");
				}
			},
			(res) => {
				if(res){
					util.logout("error");
				}
			}
		);
	}
}

exports.getUserInformation = getUserInformation;