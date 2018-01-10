require("../../common/common");
require("./index.scss");

let checkUrl = (rule, value, callback) => {
    if (!value || !value.trim()) {
        callback(new Error("下载地址不能为空"))
    } else {
        callback();
    }
};

let checkVersion = (rule, value, callback) => {
    if (!value || !value.trim()) {
        callback(new Error("版本号不能为空"))
    } else {
        callback();
    }
};

let checkInformation = (rule, value, callback) => {
    if (!value || !value.trim()) {
        callback(new Error("版本信息不能为空"))
    } else {
        callback();
    }
};

let apkUploaderView = new Vue({
    el: "#app",
    data: {
        title: "上传融开心",
        uploadForm: {
            url: "",
            //版本信息
            information: "",
            //强制更新
            status: 1,
            //操作系统
            type: 0,
            //版本号
            version: ""
        },
        uploadUrl: "http://122.114.109.199:8888/version/upload",
        rules: {
            url: [
                {validator: checkUrl, trigger: 'blur'}
            ],
            version: [
                {validator: checkVersion, trigger: 'blur'}
            ],
            information: [
                {validator: checkInformation, trigger: 'blur'}
            ]
        }
        // API("/version")
    },
    created() {

    },
    mounted() {

    },
    methods: {
        //提交版本信息
        submitHandler() {
            this.$refs.uploadForm.validate((result) => {
                if (result) {
                    // console.log("提交信息");
                    this.$http({
                        method: "post",
                        url: "http://122.114.109.199:8888/version",
                        body: this.uploadForm
                    }).then(
                        (res) => {
                            // console.log(res);
                            let response = res.body;
                            if (response && response.code === 0 && response.msg === "成功") {
                                this.$message({
                                    type: "success",
                                    message: "提交版本信息成功"
                                });
                                //提交成功后清空表单信息和验证结果,可以直接调用reset方法
                                this.resetHandler();
                            }else {
                                this.$message({
                                    type: "error",
                                    message: `提交版本信息失败,${response.msg}`
                                });
                            }
                        },
                        () => {
                            this.$message({
                                type: "error",
                                message: "提交版本信息失败"
                            });
                        }
                    )
                } else {
                    this.$message({
                        type: "error",
                        message: "请按提示补全信息"
                    })
                }
            });
        },
        //重置表单
        resetHandler() {
            // console.log("重置表单");
            //将表单信息还原
            this.uploadForm = {
                url: "",
                //版本信息
                information: "",
                //强制更新
                status: 1,
                //操作系统
                type: 0,
                //版本号
                version: ""
            };
            //将表单验证效果取消
            this.$refs.uploadForm.clearValidate();
            //清空上传列表
            this.$refs.uploader.clearFiles();
        },
        //安装包上传
        handleSuccess(res, file, fileList) {
            if (res.code === 0 && res.msg === "成功") {
                this.$message({
                    type: "success",
                    message: "文件上传成功"
                });
                let uploadForm = JSON.parse(JSON.stringify(this.uploadForm));
                uploadForm.url = res.data;

                //通过file对象获取版本信息
                if (file.name) {
                    //目前仅针对安卓获取版本信息
                    let name = file.name,
                        isAndroid = /\.apk$/i,
                        isIOS = /\.ipa$/i,
                        regAndroidVersion = /^rongkaixin-([\s\S]*)\.apk$/i;
                    // regIOS = //
                    if (isAndroid.test(name)) {
                        uploadForm.version = name.match(regAndroidVersion)[1];
                        // console.log("安卓安装包");
                    } else if (isIOS.test(name)) {
                        uploadForm.version = "";
                        // console.log("苹果安装包");
                    } else {
                        uploadForm.version = "";
                        // console.error("安装包格式错误");
                    }
                }
                this.uploadForm = uploadForm;

                //重新验证url和version字段
                this.$nextTick(() => {
                    this.$refs.uploadForm.validateField("url");
                    this.$refs.uploadForm.validateField("version");
                });
            }
        },
        //上传列表变化
        handleChange(file, fileList) {
            if (fileList.length === 2) {
                fileList.shift();
            }
        },
        handleError() {

        }
    }
});