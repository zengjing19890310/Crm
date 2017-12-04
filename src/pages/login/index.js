require("./index.scss");
require("../../common/common");
let loginCheck = require("../../../static/loginCheck");

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
		appName: "好融易客户管理系统",
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
		qrCodeUrl: require("../../common/images/baidu.png")
	},
	components: {

	},
	methods: {
		login(formName) {
			// console.log('登录');
			this.$refs[formName].validate((valid) => {
				if (valid) {
					if (loginCheck(this.loginForm)) {
						this.$message({
							message: "登录成功",
							type: "success",
							duration: 3000,
							onClose: () => {
								window.location.href = "../main";
							}
						});
					} else {
						this.$message({
							message: "登录失败!",
							type: "error",
							duration: 3000
						});
					}
				} else {
					this.$message({
						message: "输入有误!",
						type: "error",
						duration: 3000
					});
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