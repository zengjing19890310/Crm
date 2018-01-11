require("./index.scss");
require("../../common/common");
//获取工具类
//在工具类中准备一个解析URL参数的方法
let util = require("../../common/util");

let overView = new Vue({
    el: "#app",
    data: {
        id: "",
        postData: {},
        navi: "",
        overviewLoading: true,
        type: "",
        downUrl: "",
        appLogoUrl: require("../../common/images/app-logo.png")
    },
    created() {
        let search = document.location.search;
        if (search) {
            //帖子详情ID
            this.id = util.fetchParam(search, "id");
            //是否展示顶部固定Banner,参数取值1
            this.navi = util.fetchParam(search, "navi");
            //获取设备类型,1为安卓,2为iPhone
            this.type = util.fetchParam(search, "type");
            if (!this.id) {
                this.$message({
                    type: "error",
                    message: "获取帖子ID失败"
                });
            }
            this.$http({
                url: API(`/circle/article/${this.id}`),
                method: "get"
            }).then(
                (res) => {
                    if (res.ok && res.status === 200) {
                        let data = res.body;
                        if (data.code === 0 && data.msg === "成功") {
                            this.postData = data.data;
                            document.title = data.data.title;
                        } else {
                            this.$message({
                                type: "error",
                                message: "获取帖子失败"
                            });
                        }
                    } else {
                        this.$message({
                            type: "error",
                            message: "获取帖子失败"
                        });
                    }
                    this.overviewLoading = false;
                    // console.log(res);
                },
                (res) => {
                    this.$message({
                        type: "error",
                        message: "获取帖子失败"
                    });
                    this.overviewLoading = false;
                    // console.error(res);
                }
            );
        }
        let userAgent = navigator.userAgent, app = navigator.appVersion;
        let isAndroid = userAgent.indexOf("Android") > -1 || userAgent.indexOf("Linux") > -1;
        let isIOS = !!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
        if (isAndroid) {
            // console.log("安卓机！");
            this.fetchDownloadUrl("android");
            // this.downUrl = "http://app.lichijituan.cn/release/rongkaixin-1.0.0.apk";
        }
        if (isIOS) {
            this.fetchDownloadUrl("ios");
            // console.log("苹果机！");
        }

        if (!isAndroid && !isIOS) {
            this.fetchDownloadUrl();
        }

        //对useragent嗅探,并确定浏览环境
        // let webkit = userAgent.match(/Web[kK]it[\/]{0,1}([\d.]+)/),
        // 	android = userAgent.match(/(Android);?[\s\/]+([\d.]+)?/),
        // 	osx = !!userAgent.match(/\(Macintosh\; Intel /),
        // 	ipad = userAgent.match(/(iPad).*OS\s([\d_]+)/),
        // 	ipod = userAgent.match(/(iPod)(.*OS\s([\d_]+))?/),
        // 	iphone = !ipad && userAgent.match(/(iPhone\sOS)\s([\d_]+)/),
        // 	webos = userAgent.match(/(webOS|hpwOS)[\s\/]([\d.]+)/),
        // 	// win = /Win\d{2}|Windows/.test(platform),
        // 	wp = userAgent.match(/Windows Phone ([\d.]+)/),
        // 	touchpad = webos && userAgent.match(/TouchPad/),
        // 	kindle = userAgent.match(/Kindle\/([\d.]+)/),
        // 	silk = userAgent.match(/Silk\/([\d._]+)/),
        // 	blackberry = userAgent.match(/(BlackBerry).*Version\/([\d.]+)/),
        // 	bb10 = userAgent.match(/(BB10).*Version\/([\d.]+)/),
        // 	rimtabletos = userAgent.match(/(RIM\sTablet\sOS)\s([\d.]+)/),
        // 	playbook = userAgent.match(/PlayBook/),
        // 	chrome = userAgent.match(/Chrome\/([\d.]+)/) || userAgent.match(/CriOS\/([\d.]+)/),
        // 	firefox = userAgent.match(/Firefox\/([\d.]+)/),
        // 	firefoxos = userAgent.match(/\((?:Mobile|Tablet); rv:([\d.]+)\).*Firefox\/[\d.]+/),
        // 	ie = userAgent.match(/MSIE\s([\d.]+)/) || userAgent.match(/Trident\/[\d](?=[^\?]+).*rv:([0-9.].)/),
        // 	webview = !chrome && userAgent.match(/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/),
        // 	safari = webview || userAgent.match(/Version\/([\d.]+)([^S](Safari)|[^M]*(Mobile)[^S]*(Safari))/);
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
        download() {
            if (this.downUrl) {
                window.location.href = this.downUrl;
            } else {
                this.$message({
                    type: "error",
                    message: "下载地址异常",
                    duration: 1500
                })
            }
        }
    },
});