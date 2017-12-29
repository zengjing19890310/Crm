require("./index.scss");
require("../../common/common");
let util = require("../../common/util");
//验证手机
let checkPhone = (rule, value, callback) => {
	let reg = /^[1][3,4,5,7,8][0-9]{9}$/;
	if (value === "" || value.trim() === "") {
		callback(new Error("请输入手机号!"));
	} else if (!reg.test(value)) {
		console.log(value);
		callback(new Error("手机号格式错误!"));
	} else {
		callback();
	}
};
//验证验证码
let checkCode = (rule, value, callback) => {
	if (value === "") {
		callback(new Error("请输入验证码!"));
	} else {
		callback();
	}
};
let invite = new Vue({
	el: "#app",
	data: {
		message: "App分享H5页面",
		downUrl: "",
		logoUrl: require("../../common/images/invite-logo.png"),
		phoneUrl: require("../../common/images/invite-phone.png"),
		downloadUrl: require("../../common/images/invite-button.png"),
		topBgUrl: require("../../common/images/invite-bg.png"),
		modalVisible: false,
		shareForm: {
			mobile: "",
			code: "",
			pid: ""
		},
		rules: {
			mobile: [
				{validator: checkPhone, trigger: "blur"}
			],
			code: [
				{validator: checkCode, trigger: "blur"}
			],
		},
		sendCodeStatus: {
			text: "发送验证码",
			time: 0,
			buttonDisabled: true
		},
		//倒计时计时器
		timer: null
	},
	created() {
		let search = window.location.search;
		let pid = util.fetchParam(search, "pid");
		if (pid) {
			this.shareForm.pid = pid;
		} else {
			this.$message({
				type: "error",
				message: "获取分享人信息失败,请重新打开分享链接..."
			});
		}
		let userAgent = navigator.userAgent, app = navigator.appVersion;
		let isAndroid = userAgent.indexOf("Android") > -1 || userAgent.indexOf("Linux") > -1;
		let isIOS = !!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
		if (isAndroid) {
			// console.log("安卓机！");
			this.downUrl = "http://app.lichijituan.cn/release/rongkaixin-1.0.0.apk";
		}
		if (isIOS) {
			// console.log("苹果机！");
			this.downUrl = "#";
		}
	},
	methods: {
		sendCode() {
			//先验证手机字段是否正确
			this.$refs.shareForm.validateField("mobile", (error) => {
				console.error(error);
			});
			this.$http.get(API(`/code/sms?mobile=${this.shareForm.mobile}`)).then(
				(res) => {
					let response = res.body;
					if (response && response.code === 0 && response.msg === "成功") {
						this.$message({
							type: "success",
							message: "请查收验证码..."
						});
					} else {
						this.$message({
							type: "error",
							message: response.msg
						});
					}
				},
				(res) => {
					console.error(res);
				}
			);
		},
		share() {
			this.modalVisible = !this.modalVisible;
		},
		done() {
			this.$refs.shareForm.validate((result) => {
				if (result) {
					//调用注册接口
					this.$http({
						url: API("/customer"),
						method: "post",
						body: this.shareForm
					}).then(
						(res) => {
							let response = res.body;
							if (response && response.code === 0 && response.msg === "成功") {
								this.$message({
									type: "success",
									message: "分享成功"
								});
								//打开地址下载App
								if (this.downUrl) {
									location.href = this.downUrl;
								} else {
									this.$message({
										type: "warning",
										message: "下载地址异常,请联系管理员"
									});
								}
								this.modalVisible = false;
							} else {
								this.$message({
									type: "error",
									message: `分享失败,${response.msg}`
								});
								this.modalVisible = false;
							}
						},
						(res) => {
							this.$message({
								type: "error",
								message: "分享失败"
							});
							this.modalVisible = false;
						}
					);
				}
			});
		}
	}
});