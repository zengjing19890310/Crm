require("../../common/common");
require("./index.scss");

let checkPhone = (rule, value, callback) => {
	let reg = /^[1][3,4,5,7,8][0-9]{9}$/;
	if (value === "") {
		callback(new Error("请输入手机号!"));
		register.sendCodeStatus.buttonDisabled = true;
	} else if (!reg.test(value)) {
		callback(new Error("手机号格式错误!"));
		register.sendCodeStatus.buttonDisabled = true;
	} else {
		callback();
		//如果当前没有倒计时在走,则把发送按钮变为可用
		if (!register.timer) {
			register.sendCodeStatus.buttonDisabled = false;
		}
	}
};
let validatePassword = (rule, value, callback) => {
	if (value === "") {
		callback(new Error("请输入密码!"));
	} else if (value.length < 6) {
		callback(new Error("密码至少6位!"));
	} else {
		if (register.registerForm.checkPassword !== "") {
			register.$refs.registerForm.validateField("checkPassword");
		}
		callback();
	}
};
let validateCheckPassword = (rule, value, callback) => {
	if (value === "") {
		callback(new Error("请确认密码!"));
	} else if (value !== register.registerForm.password) {
		callback(new Error("两次密码输入不一致!"));
	} else {
		callback();
	}
};
let checkCode = (rule, value, callback) => {
	if (value === "") {
		callback(new Error("请输入验证码!"));
	} else {
		callback();
	}
};

let register = new Vue({
	el: "#app",
	data: {
		logoUrl: require("../../common/images/logo.png"),
		registerText: "亲！还没有马甲，赶紧的穿上",
		registerForm: {
			phone: "",
			code: "",
			password: "",
			checkPassword: ""
		},
		rules: {
			phone: [
				{validator: checkPhone, trigger: "blur"}
			],
			code: [
				{validator: checkCode, trigger: "blur"}
			],
			password: [
				{validator: validatePassword, trigger: "blur"}
			],
			checkPassword: [
				{validator: validateCheckPassword, trigger: "blur"}
			]
		},
		sendCodeStatus: {
			text: "发送验证码",
			time: 0,
			buttonDisabled: false
		},
		//倒计时计时器
		timer: null
	},
	methods: {
		done(formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
					//发送注册请求
					let obj = {
						mobile: this.registerForm.phone,
						code: this.registerForm.code,
						password: this.registerForm.password
					};
					this.$http.post(API("/sysuser/regiter"), obj)
						.then(
							(res) => {
								if (res.body) {
									let data = res.body;
									if (data && data.code === 0 && data.msg === "成功") {
										this.$message({
											message: "注册成功,即将自动跳转...",
											type: "success",
											duration: 1500,
											onClose: () => {
												this.$http({
													url: API(`/authentication/form?username=${this.registerForm.phone}&password=${this.registerForm.password}`),
													method: "POST",
													headers: {
														"Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
														"Authorization": "Basic bGljaGk6YWJjZGVm",
														"deviceId": this.registerForm.phone
													}
												}).then(
													(res) => {
														//请求成功
														if (res.ok && res.status === 200) {
															let data = res.body;
															if (data.code === 1) {
																this.$message({
																	type: "error",
																	message: data.msg
																});
															} else {
																//获取token并存储在本地
																let access_token = data.access_token;
																if (access_token) {
																	window.sessionStorage.setItem("access_token", access_token);
																	window.location.href = "../main";
																}
															}
														}
													},
													(res) => {

													}
												);
											}
										});
									} else {
										this.$message({
											message: `注册失败:${data.msg}!`,
											type: "error",
											duration: 1500
										});
									}
								}

							},
							(res) => {
								console.error(res);
							}
						);
				} else {
					this.$message({
						message: "输入有误!",
						type: "error",
						duration: 3000
					});
					return false;
				}
			});
		},
		sendCode() {
			// 单独验证电话号字段
			this.$refs["registerForm"].validateField("phone", (error) => {
				// if(error){
				// 	console.error(error);
				// }
			});
			if (!this.sendCodeStatus.buttonDisabled) {
				this.$http.get(API(`/code/sms?mobile=${this.registerForm.phone}`))
					.then(
						(res) => {
							if (res.ok && res.status === 200) {
								console.log(res);
							}
						},
						(res) => {
							console.error(res);
						}
					);

				this.sendCodeStatus = {
					buttonDisabled: true,
					text: "重新发送",
					time: 60
				};
				this.timer = setInterval(() => {
					if (this.sendCodeStatus.time > 1) {
						this.sendCodeStatus.time--;
					} else {
						clearInterval(this.timer);
						this.timer = null;
						this.sendCodeStatus.time = 0;
						this.sendCodeStatus.buttonDisabled = false;
					}
				}, 1000);
			}
		}
	},
	components: {}
});