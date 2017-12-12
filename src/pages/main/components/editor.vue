<template>
    <div class="outer-container">
        <section class="main" v-loading="postLoading" element-loading-text="加载中...">
            <header class="post-title">
                <div class="label">标题</div>
                <el-input v-model="postContent.title" size="small" style="width:400px;"></el-input>
            </header>
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
                <div class="editor-overview" v-html="postContent.content">

                    <!--<quill-editor-->
                    <!--v-model="postContent.content"-->
                    <!--ref="editor"-->
                    <!--:options="{}"-->
                    <!--:style="{height:editorHeight+'px',width:'100%'}">-->
                    <!--</quill-editor>-->
                </div>
            </div>
            <footer style="margin:20px 0; text-align: right">
                <el-button type="primary" size="small" @click="submit" :loading="submitButtonLoading"> 确 认 </el-button>
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
                submitButtonLoading: false
            }
        },
        created() {
            this.postId = this.$route.params.id;
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
                this.postLoading = false;
            }
        },
        mounted() {
            //获取编辑框包裹的高度
            let wrapper = document.getElementsByClassName("editor-wrapper"),
                //获取上方工具条的高度
                toolbar = document.getElementsByClassName("ql-toolbar");
            this.editorHeight = wrapper[0].clientHeight - toolbar[0].clientHeight - 2;

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
            beforeUpload(file) {
                this.submitButtonLoading = true;
                this.$message({
                    type: "warning",
                    message: "图片上传中,请耐心等待...",
                    duration: 0
                })
//                console.log('上传前', file);
            },
            handleSuccess(res, file) {
                this.$message.close();
                this.submitButtonLoading = false;
//                console.log('上传成功', res, file);
                if (res.code === 0 && res.msg === '成功') {
                    if (this.uploadType === 'image') {
                        this.quill.insertEmbed(this.embedIndex, 'image', `http://${res.data}`);
                        this.embedIndex++;
                    }
                }
            },
            handleError() {
                this.submitButtonLoading = false;
            },
            imgHandler(e) {
                this.$refs.selectImage.click();
                this.uploadType = 'image';
            },
            cancel() {
                this.$router.go(-1);
            },
            submit() {
                if (!this.postContent.title.trim()) {
                    this.$message({
                        type: "error",
                        message: "请填写帖子标题!"
                    });
                    return;
                }
                console.log();
                this.$http({
                    url: API("/circle/article"),
                    method: "put",
                    body: this.postContent
                }).then(
                    (res) => {
                        let data = res.data;
                        if (data.code === 0 && data.msg === '成功') {
                            this.$message({
                                message: '编辑成功,即将返回帖子列表...',
                                type: 'success',
                                duration: 1500,
                                onClose: () => {
                                    this.embedIndex = 0;
                                    this.$router.go(-1);
                                }
                            });
                        }
                    },
                    (res) => {

                    }
                );
            }
        }
    }
</script>

<style lang="scss" scoped>
    .main {
        position: absolute;
        background-color: #fff;
        top: 2rem;
        left: 1rem;
        bottom: 3.4rem;
        right: 1rem;
        padding: 0 1rem 1rem 1rem;
        display: flex;
        flex-direction: column;
        .post-title {
            flex-shrink: 0;
            height: 5rem;
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
            .editor-overview {
                width: 320px;
                margin-left: 1rem;
                border: 1px solid red;
                overflow: auto;
                word-break: break-all;
                flex-shrink: 0;
                line-height: normal;
            }
        }
        .label {
            width: 55px;
            color: #7a8190;
            font-size: 0.9rem;
            flex-shrink: 0;
        }
    }
</style>