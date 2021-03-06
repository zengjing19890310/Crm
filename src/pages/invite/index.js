require("./index.scss");
require("../../common/common");
let util = require("../../common/util");
//验证手机
let checkPhone = (rule, value, callback) => {
    let reg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (value === "" || value.trim() === "") {
        callback(new Error("请输入手机号!"));
    } else if (!reg.test(value)) {
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
let inviteView = new Vue({
    el: "#app",
    data: {
        message: "App分享H5页面",
        downUrl: "",
        logoUrl: require("../../common/images/invite-logo.png"),
        phoneUrl: require("../../common/images/invite-phone.png"),
        downloadUrl: require("../../common/images/invite-button.png"),
        topBgUrl: require("../../common/images/invite-bg.png"),
        fullPanelArrowUrl: require("../../common/images/invite-arrow-icon.png"),
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
        timer: null,
        isBrowser: true,
        env: ""
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
        let userAgent = navigator.userAgent;
        // let app = navigator.appVersion;
        let isAndroid = userAgent.indexOf("Android") > -1 || userAgent.indexOf("Linux") > -1;
        let isIOS = !!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
        if (isAndroid) {
            // console.log("安卓机！");
            this.fetchDownloadUrl("android");
            // this.downUrl = "http://app.lichijituan.cn:8081/release/rongkaixin-1.0.0.apk";
        }
        if (isIOS) {
            // console.log("苹果机！");
            this.fetchDownloadUrl("ios");
            // this.downUrl = "https://www.pgyer.com/8D2B";
        }

        if (!isAndroid && !isIOS) {
            this.fetchDownloadUrl();
        }

        //对useragent嗅探,并确定浏览环境
        let
            // webkit = userAgent.match(/Web[kK]it[\/]{0,1}([\d.]+)/),
            // android = userAgent.match(/(Android);?[\s\/]+([\d.]+)?/),
            // osx = !!userAgent.match(/\(Macintosh\; Intel /),
            // ipad = userAgent.match(/(iPad).*OS\s([\d_]+)/),
            // ipod = userAgent.match(/(iPod)(.*OS\s([\d_]+))?/),
            // iphone = !ipad && userAgent.match(/(iPhone\sOS)\s([\d_]+)/),
            // webos = userAgent.match(/(webOS|hpwOS)[\s\/]([\d.]+)/),
            // win = /Win\d{2}|Windows/.test(platform),
            // wp = userAgent.match(/Windows Phone ([\d.]+)/),
            // touchpad = webos && userAgent.match(/TouchPad/),
            // kindle = userAgent.match(/Kindle\/([\d.]+)/),
            // silk = userAgent.match(/Silk\/([\d._]+)/),
            // blackberry = userAgent.match(/(BlackBerry).*Version\/([\d.]+)/),
            // bb10 = userAgent.match(/(BB10).*Version\/([\d.]+)/),
            // rimtabletos = userAgent.match(/(RIM\sTablet\sOS)\s([\d.]+)/),
            // playbook = userAgent.match(/PlayBook/),
            chrome = userAgent.match(/Chrome\/([\d.]+)/) || userAgent.match(/CriOS\/([\d.]+)/),
            // firefox = userAgent.match(/Firefox\/([\d.]+)/),
            // firefoxos = userAgent.match(/\((?:Mobile|Tablet); rv:([\d.]+)\).*Firefox\/[\d.]+/),
            // ie = userAgent.match(/MSIE\s([\d.]+)/) || userAgent.match(/Trident\/[\d](?=[^\?]+).*rv:([0-9.].)/),
            // safari = webview || userAgent.match(/Version\/([\d.]+)([^S](Safari)|[^M]*(Mobile)[^S]*(Safari))/),
            webview = !chrome && userAgent.match(/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/);


        let ua = navigator.userAgent.toLowerCase();
        this.env = ua.match(/MicroMessenger/i) ? "微信" : ua.match(/WeiBo/i) ? "微博" : "";
        // this.env = ua;
        // ua.match(/MQQBrowser/i) ? "QQ" :
        //如果是通过微信,QQ,微博打开的webview,需要隐藏页面并引导跳转
        if (this.env) {
            this.isBrowser = false;
        }
    },
    methods: {
        fetchDownloadUrl(type) {
            if (type === "ios") {
                this.downUrl = "https://www.pgyer.com/8D2B";
            } else if (type === "android" || !type) {
                this.$http({
                    method: "get",
                    url: "http://122.114.109.199:8888/version/new"
                    // url: API("/version/new")
                }).then(
                    (res) => {
                        let response = res.body;
                        if (response && response.code === 0 && response.msg === "成功") {
                            let data = response.data;
                            // type为0指向安卓安装包
                            this.downUrl = data.url;
                        } else {
                            this.$message({
                                type: "error",
                                message: `请求下载地址出错${response.msg}`,
                                duration: 1500
                            })
                        }
                    },
                    (res) => {
                        this.$message({
                            type: "error",
                            message: "请求下载地址出错",
                            duration: 1500
                        })
                    }
                )
            }
        },
        sendCode() {
            let checkMobile = true,
                _this = this;
            //先验证手机字段是否正确
            this.$refs.shareForm.validateField("mobile", (error) => {
                if (error) {
                    checkMobile = false;
                    _this.$message({
                        type: "error",
                        message: error
                    });
                }
            });
            if (checkMobile) {
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
                        if (res) {
                            this.$message({
                                type: "error",
                                message: "请求验证码失败"
                            });
                        }
                    }
                );
            }
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
                                    window.location.href = this.downUrl;
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