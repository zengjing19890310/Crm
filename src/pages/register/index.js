require("../../common/common");
require("./index.scss");

let checkPhone = (rule, value, callback) => {
	let reg = /^[1][3,4,5,7,8][0-9]{9}$/;
	if (value === "") {
		callback(new Error("请输入手机号!"));
	} else if (!reg.test(value)) {
		callback(new Error("手机号格式错误!"));
	} else {
		callback();
	}
};
let validatePassword = (rule, value, callback) => {
	if (value === "") {
		callback(new Error("请输入密码!"));
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
			time: 60,
			buttonDisabled: false
		}
	},
	methods: {
		done(formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
					this.$message({
						message: "注册成功!",
						type: "success",
						duration: 1500,
						onClose: () => {
							window.location.href = "../main";
						}
					});
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
			if (!this.sendCodeStatus.buttonDisabled) {
				this.sendCodeStatus.buttonDisabled = true;
				this.sendCodeStatus.text = "重新发送";
				let timer = setInterval(() => {
					if (this.sendCodeStatus.time > 1) {
						this.sendCodeStatus.time--;
					} else {
						clearInterval(timer);
						timer = null;
						this.sendCodeStatus.time = 60;
						this.sendCodeStatus.buttonDisabled = false;
					}
				}, 1000);
			}
		}
	},
	components: {

	}
});