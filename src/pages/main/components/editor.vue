<template>
    <div class="outer-container">
        <section class="main" v-loading="postLoading" element-loading-text="加载中...">
            <div class="cover-overview" v-show="postContent.articleImg">
                <img :src="postContent.articleImg" alt="">
            </div>
            <!--<header class="post-title">-->
            <!--<div class="label">标题</div>-->
            <!--<el-input v-model="postContent.title" size="small" style="width:400px;"></el-input>-->
            <!--</header>-->
            <div class="post-uploader">
                <!--:rules="rules"-->
                <el-form ref="postForm" :model="postContent" label-width="80px" size="small" label-position="left"
                         :rules="rules">
                    <el-form-item label="帖子标题" prop="title">
                        <el-input v-model="postContent.title" size="small" style="width:400px;"></el-input>
                    </el-form-item>
                    <el-form-item label="帖子封面" prop="articleImg">
                        <el-input v-show="false" v-model="postContent.articleImg"></el-input>
                        <el-upload
                                ref="upload"
                                :action="uploadUrl"
                                :headers="headers"
                                :show-file-list="false"
                                :multiple="false"
                                :auto-upload="true"

                                :on-change="handleCoverChange"
                                :before-upload="beforeCoverUpload"
                                :on-success="handleCoverSuccess"
                                :on-error="handleError"

                                accept="image/*">
                            <el-button slot="trigger" type="primary" :loading="uploading">上传封面图片</el-button>
                        </el-upload>
                    </el-form-item>
                </el-form>
            </div>
            <div class="post-content">
                <div class="label">内容</div>
                <div class="editor-wrapper">
                    <quill-editor
                            v-model="postContent.content"
                            ref="editor"
                            :options="quillOptions"
                            :style="{height:editorHeight+'px',width:'100%'}">
                    </quill-editor>
                    <el-upload
                            :action="uploadUrl"
                            :headers="headers"
                            :before-upload="beforeUpload"
                            :on-success="handleSuccess"
                            :on-error="handleError"
                            :show-file-list="false"
                            style="display: none"
                            accept="image/*">
                        <button ref="selectImage">选择文件</button>
                    </el-upload>
                </div>
                <div class="editor-overview ql-editor">
                    <header>
                        <div class="title">
                            {{postContent.title}}
                        </div>
                        <div class="nickname">
                            {{postContent.nickname}}
                        </div>
                    </header>
                    <div class="overview-content" v-html="postContent.content"></div>
                </div>
            </div>
            <footer style="margin:20px 0; text-align: right">
                <el-button type="primary" size="small" @click="submit" :loading="submitButtonLoading||uploading">
                    确 认
                </el-button>
                <el-button size="small" @click="cancel"> 取 消 </el-button>
            </footer>
        </section>
    </div>
</template>

<script>
    let toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['blockquote', 'code-block'],

        [{'header': 1}, {'header': 2}],               // custom button values
        [{'list': 'ordered'}, {'list': 'bullet'}],
//        [{'script': 'sub'}, {'script': 'super'}],      // superscript/subscript
        [{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
//        [{'direction': 'rtl'}],                         // text direction

        [{'size': ['small', false, 'large', 'huge']}],  // custom dropdown
        [{'header': [1, 2, 3, 4, 5, 6, false]}],

        [{'color': []}, {'background': []}],          // dropdown with defaults from theme
        [{'font': []}],
        [{'align': []}],

        ['link', 'image'],
        ['clean']                                         // remove formatting button
    ];
    export default {
        data() {
            let notEmpty = (rule, value, callback) => {
                if (!value || !value.trim()) {
                    callback(new Error("不能为空"));
                } else {
                    callback();
                }
            };
            return {
                postId: null,
                postLoading: true,
                postContent: {},
                editorHeight: 100,
                quill: null,
                quillOptions: {
                    modules: {
                        toolbar: toolbarOptions
                    }
                },
                uploadUrl: API('/file/upload'),
                embedIndex: 0,
                submitButtonLoading: false,
                //存放一个上传图片时的消息提示实例
                message: null,
                userInformation: null,
                resizeLock: false,
                rules: {
                    articleImg: [
                        {required: true, message: "请上传封面图片", trigger: "blur"},
                        {validator: notEmpty, trigger: "blur"}
                    ],
                    title: [
                        {required: true, message: "请输入标题", trigger: "blur"},
                        {validator: notEmpty, trigger: "blur"}
                    ]

                },
                uploading: false
            }
        },
        created() {
            //如果传入了postId,则是修改帖子内容
            this.postId = this.$route.params.postId;
            if (this.postId) {
                //获取帖子Id和帖子内容
                this.$http({
                    url: API(`/circle/article/${this.postId}`),
                    method: "get"
                }).then(
                    (res) => {
                        if (res.ok && res.status === 200) {
                            let data = res.body;
                            if (data.code === 0 && data.msg === "成功") {
                                this.postContent = data.data;
                            }
                        }
                        this.postLoading = false;
                    },
                    (res) => {
                        console.error(res);
                        this.postLoading = false;
                    }
                );
            } else {
//                {
//                    "circleId": 0,
//                    "content": "string",
//                    "createUserId": "string",
//                    "id": 0,
//                    "sort": 0,
//                    "title": "string"
//                }
                //新增帖子,从本地存储中获取nickname
                this.postContent.nickname = window.sessionStorage.getItem("nickname");
                this.postContent.createUserId = window.sessionStorage.getItem("userId");
                this.postContent.circleId = this.$route.params.circleId;
                this.postLoading = false;
            }
        },
        mounted() {
            this.calcHeight();
            //给window添加事件监听
            window.addEventListener('resize', this.calcHeight);
            this.quill = this.$refs.editor.quill;
            // 为图片ICON绑定事件  getModule 为编辑器的内部属性
            this.quill.getModule('toolbar').addHandler('image', this.imgHandler);
        },
        computed: {
            headers() {
                let headers = {};
                if (sessionStorage.getItem('token')) {
                    headers.token = sessionStorage.getItem('token');
                }
                return headers;
            }
        },
        methods: {
            calcHeight() {
                if (!this.resizeLock) {
                    this.resizeLock = true;
                    //获取编辑框包裹的高度
                    let wrapper = document.getElementsByClassName("editor-wrapper"),
                        //获取上方工具条的高度
                        toolbar = document.getElementsByClassName("ql-toolbar");
                    this.editorHeight = wrapper[0].clientHeight - toolbar[0].clientHeight - 2;
                    console.log(wrapper[0].clientHeight,toolbar[0].clientHeight,this.editorHeight);
                    setTimeout(() => {
                        this.resizeLock = false;
                    }, 400);
                }
            },
            handleCoverChange(file, fileList) {
                if (fileList.length === 2) {
                    fileList.shift();
                }
            },
            beforeCoverUpload(file) {
                this.uploading = true;
                this.message = this.$message({
                    type: "warning",
                    message: "封面上传中,请耐心等待...",
                    duration: 0
                });
            },
            beforeUpload(file) {
                this.submitButtonLoading = true;
                this.message = this.$message({
                    type: "warning",
                    message: "图片上传中,请耐心等待...",
                    duration: 0
                });
//                console.log('上传前', file);
            },
            handleCoverSuccess(res, file) {
                this.message.close();
                this.uploading = false;
                if (res.code === 0 && res.msg === '成功') {
                    this.$message({
                        type: "success",
                        message: "封面上传成功",
                        duration: 1500
                    });
                    this.postContent.articleImg = res.data;
                    this.$refs.postForm.validateField("articleImg");
                }
            },
            handleSuccess(res, file) {
                this.message.close();
//                console.log("期待被执行");
                this.submitButtonLoading = false;
//                console.log('上传成功', res, file);
                if (res.code === 0 && res.msg === '成功') {
                    if (this.uploadType === 'image') {
//                        this.quill.insertEmbed(15, 'image', `http://${res.data}`);
                        this.quill.insertEmbed(15, 'image', res.data);
                        this.embedIndex++;
                    }
                }
            },
            handleError() {
                this.message.close();
                this.submitButtonLoading = false;
                this.uploading = false;
                this.$message({
                    type: "error",
                    message: "图片上传失败",
                    duration: 1500
                });
            },
            imgHandler(e) {
                this.$refs.selectImage.click();
                this.uploadType = 'image';
            },
            cancel() {
                this.$router.go(-1);
            },
            submit() {
                this.$refs.postForm.validate((result) => {
                    if (result) {
                        this.submitButtonLoading = true;
                        let method,
                            message;
                        if (this.postId) { //编辑某个帖子
                            method = "put";
                            message = "编辑";
                        } else { //新增一个帖子
                            method = "post";
                            message = "发帖";
                        }
                        this.$http({
                            url: API("/circle/article"),
                            method: method,
                            body: this.postContent
                        }).then(
                            (res) => {
                                let data = res.data;
                                if (data.code === 0 && data.msg === '成功') {
                                    this.$message({
                                        message: `${message}成功,即将返回帖子列表...`,
                                        type: "success",
                                        duration: 1500,
                                        onClose: () => {
                                            this.embedIndex = 0;
                                            this.submitButtonLoading = false;
                                            this.$router.go(-1);
                                        }
                                    });
                                } else {
                                    this.$message({
                                        message: data.msg,
                                        type: "error"
                                    });
                                    this.submitButtonLoading = false;
                                }
                            },
                            (res) => {
                                this.$message({
                                    message: "请求错误",
                                    type: "error"
                                });
                                this.submitButtonLoading = false;
                            }
                        );
                    }else {
                        let method,
                            message;
                        if (this.postId) { //编辑某个帖子
                            method = "put";
                            message = "编辑";
                        } else { //新增一个帖子
                            method = "post";
                            message = "发帖";
                        }
                        this.$message({
                            type: "error",
                            message: `${message}失败`,
                            duration: 1500
                        })
                    }
                });
//                if (!this.postContent.title || !this.postContent.title.trim()) {
//                    this.$message({
//                        type: "error",
//                        message: "请填写帖子标题!"
//                    });
//                    return;
//                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "common/style/main";

    .main {
        padding: 0.5rem;
        overflow: hidden;
        .cover-overview {
            width: 150px;
            height: 100px;
            position: absolute;
            top: 0;
            right: 0.5rem;
            img {
                display: block;
                width: 100%;
                height: 100%;
            }
        }
        .post-title {
            flex-shrink: 0;
            height: 3.75rem;
            display: flex;
            justify-content: flex-start;
            align-items: center;
        }
        .post-content {
            display: flex;
            justify-content: flex-start;
            align-items: stretch;
            flex-grow: 1;
            .editor-wrapper {
                width: 50%;
                flex-grow: 1;
                flex-shrink: 0;
                /*overflow: hidden;*/
                /*overflow: auto;*/
            }
            .editor-overview.ql-editor {
                width: 320px;
                margin-left: 0.5rem;
                border: 1px solid #ddd;
                overflow: auto;
                word-break: break-all;
                flex-shrink: 0;
                height: auto;
                padding: 0;
                white-space: normal;
                header {
                    padding: 1.2rem .8rem 1.35rem;
                    .title {
                        color: rgb(48, 48, 48);
                        font-size: 22px;
                        font-weight: bold;
                    }
                    .nickname {
                        color: #303030;
                        font-size: 14px;
                    }
                }
                .overview-content {
                    padding: 0 .8rem;
                }
                p {
                    font-family: Helvetica;
                    font-size: 18px;
                    line-height: 32px;
                    color: rgb(96, 96, 96);
                    //text-align: justify;
                    word-wrap: break-word;
                }

                img {
                    max-width: 100%;
                }
            }
        }
        .post-uploader {
            display: flex;
            min-height: 3.75rem;
            flex-shrink: 0;
            justify-content: flex-start;
            align-items: center;
        }
        .label {
            width: 80px;
            color: #7a8190;
            font-size: 0.8rem;
            flex-shrink: 0;
        }
    }
</style>