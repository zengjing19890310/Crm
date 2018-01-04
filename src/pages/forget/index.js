require("../../common/common");
require("./index.scss");

let checkPhone = (rule, value, callback) => {
	let reg = /^[1][3,4,5,7,8][0-9]{9}$/;
	if (value === "") {
		callback(new Error("请输入手机号!"));
		forgetView.sendCodeStatus.buttonDisabled = true;
	} else if (!reg.test(value)) {
		callback(new Error("手机号格式错误!"));
		forgetView.sendCodeStatus.buttonDisabled = true;
	} else {
		callback();
		//如果当前没有倒计时在走,则把发送按钮变为可用
		if (!forgetView.timer) {
			forgetView.sendCodeStatus.buttonDisabled = false;
		}
	}
};
let validatePassword = (rule, value, callback) => {
	if (value === "") {
		callback(new Error("请输入密码!"));
	} else if (value.length < 6) {
		callback(new Error("密码至少6位!"));
	} else {
		if (forgetView.forgetForm.checkPassword !== "") {
			forgetView.$refs.forgetForm.validateField("checkPassword");
		}
		callback();
	}
};
let validateCheckPassword = (rule, value, callback) => {
	if (value === "") {
		callback(new Error("请确认密码!"));
	} else if (value !== forgetView.forgetForm.password) {
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

let forgetView = new Vue({
	el: "#app",
	data: {
		title: "忘记密码",
		forgetLoading: false,
		logoUrl: require("../../common/images/logo.png"),
		logoText: "亲！忘记了，不怕用手机直接找回",
		forgetForm: {
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
			buttonDisabled: true
		},
		//倒计时计时器
		timer: null
	},
	methods: {
		done(formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
					this.forgetLoading = true;
					let obj = {
						mobile: this.forgetForm.phone,
						code: this.forgetForm.code,
						password: this.forgetForm.password
					};

					this.$http({
						method: "put",
						url: API("/sysuser"),
						body: obj
					}).then(
						(res) => {
							if (res.body) {
								let data = res.body;
								if (data && data.code === 0 && data.msg === "成功") {
									this.$message({
										type: "success",
										message: "修改密码成功,即将返回登录页...",
										duration: 1500,
										onClose: () => {
											this.forgetLoading = false;
											window.location.href = "../login";
										}
									});
								} else {
									this.$message({
										type: "error",
										message: data.msg,
										duration: 1500
									});
								}
							}
							this.forgetLoading = false;
						},
						(res) => {
							if(res){
								this.$message({
									type:"error",
									message:"请求失败"
								});
							}
							this.forgetLoading = false;
						}
					);

					// this.$message({
					// 	message: "找回密码成功,请重新登录!",
					// 	type: "success",
					// 	duration: 1500,
					// 	onClose: () => {
					// 		window.location.href = "../login";
					// 	}
					// });
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
			this.$refs["forgetForm"].validateField("phone", (error) => {
				if(!error){
					if (!this.sendCodeStatus.buttonDisabled) {
						this.$http.get(API(`/code/sms?mobile=${this.forgetForm.phone}`))
							.then(
								() => {
									
								},
								() => {
									
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
			});
		}
	},
	components: {}
});