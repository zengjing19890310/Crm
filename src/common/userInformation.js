function getUserInformation(vm) {
	if (!window["localStorage"]) {
		window.Bus.$message({
			type: "error",
			message: "当前浏览器不能使用本地存储,请更换浏览器"
		});
		return false;
	}
	let access_token = window.localStorage.getItem("access_token"),
		userInformation = null;
	if (access_token) {
		// console.log("传入token,获取用户信息", access_token);
		vm.$http({
			method: "get",
			url: API("/sysuser")
		}).then(
			(res) => {
				if (res.ok && res.status === 200) {
					if (res.body) {
						let data = res.body;
						if (data.code === 0 && data.msg === "成功") {
							if (data.data) {
							    // console.log(data.data);
								vm.userInformation = data.data;
							}
						}
					}
				} else {
					vm.$message({
						type: "error",
						message: "用户身份获取异常!"
					});
				}
			},
			(res) => {
				// console.error(res);
				vm.$message({
					type: "error",
					message: "用户身份获取异常!"
				});
			}
		);
	}
}

exports.getUserInformation = getUserInformation;