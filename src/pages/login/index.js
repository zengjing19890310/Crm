//如果位于登录页面,则将token抹除
if (!window["sessionStorage"]) {
    window.Bus.$message({
        type: "error",
        message: "当前浏览器不能使用本地存储,请更换浏览器"
    });
}

//删除token
window.sessionStorage.removeItem("token");

require("./index.scss");
require("../../common/common");

let checkPhone = (rule, value, callback) => {
	let reg = /^[1][3,4,5,7,8][0-9]{9}$/;
	if (value === "") {
		callback(new Error("手机号不能为空!"));
	} else if (!reg.test(value)) {
		callback(new Error("手机号格式错误!"));
	} else {
		callback();
	}
};

let checkPassword = (rule, value, callback) => {
	if (value === "") {
		callback(new Error("密码不能为空!"));
	} else {
		callback();
	}
};

let loginView = new Vue({
	el: "#app",
	data: {
		appName: "融开心客户管理系统",
		logoUrl: require("../../common/images/logo.png"),
		loginForm: {
			phone: "",
			password: ""
		},
		rules: {
			phone: [
				{validator: checkPhone, trigger: "blur"}
			],
			password: [
				{validator: checkPassword, trigger: "blur"}
			]
		},
		rememberMe: false,
		loginButtonLoading: false
	},
	components: {},
	http: {
		//登录请求头
		headers: {
			"Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
			"Authorization": "Basic bGljaGk6YWJjZGVm"
		}
	},
	methods: {
		onSubmit() {
			this.$refs.loginForm.validate((valid) => {
				if (valid) {
					this.loginButtonLoading = true;
					this.$http({
						// url:`http://mengcan.vicp.io/authentication/form?username=${this.loginForm.phone}&password=${this.loginForm.password}`,
						url: API(`/authentication/form?username=${this.loginForm.phone}&password=${this.loginForm.password}`),
						method: "POST",
						headers: {
							"Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
							"Authorization": "Basic bGljaGk6YWJjZGVm",
							"deviceId": this.loginForm.phone
						}
					}).then(
						(res) => {
							// console.log(res);
							//请求成功
							if (res.ok && res.status === 200) {
								let data = res.body;
								if (data.code !== 0) {
									this.$message({
										type: "error",
										message: data.msg
									});
									this.loginButtonLoading = false;
								} else {
									//获取username并存储在本地
									let token = data.data.token;
									// let token = data.data.username,
									// 	nickname = data.data.nickname,
									// 	userId = data.data.id;
									if (token) {
										window.sessionStorage.setItem("token", token);
										// window.sessionStorage.setItem("userId", userId);
										// window.sessionStorage.setItem("nickname", nickname);
										// window.sessionStorage.setItem("userInformation", JSON.stringify(data.data));
										this.$message({
											type: "success",
											message: "登陆成功,即将自动跳转...",
											duration: 1500,
											onClose: () => {
												this.loginButtonLoading = false;
												window.location.href = "../main";
											}
										});
									}
								}
							}
						},
						() => {
							this.$message({
								type: "error",
								message: "网络异常...",
								duration: 1500
							});
							this.loginButtonLoading = false;
						}
					);
				} else {
					this.$message({
						message: "输入有误!",
						type: "error",
						duration: 1500
					});
					this.loginButtonLoading = false;
					// console.log('error submit!!');
					return false;
				}
			});
		},
		reset(formName) {
			this.$refs[formName].resetFields();
		}
	}
});

if (!window["sessionStorage"]) {
	loginView.$message({
		type: "error",
		message: "当前浏览器不能使用本地存储,请更换浏览器"
	});
}