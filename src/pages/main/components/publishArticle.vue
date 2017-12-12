<template>
    <div class="outer-container">
        <div>
            <quill-editor
                    v-model="content"
                    ref="editor"
                    :options="quillOptions"
                    style="height:450px;"
            >
                <!--<button>上传</button>-->
            </quill-editor>
            <el-upload
                    :action="uploadUrl"
                    :before-upload="beforeUpload"
                    :on-success="handleSuccess"
                    :show-file-list="false"
                    style="display: none"
                    accept="image/*">
                <button ref="selectImage">选择文件</button>
            </el-upload>
            <!--<el-upload-->
            <!--:action="uploadUrl"-->
            <!--:before-upload="beforeUpload"-->
            <!--:on-success="handleSuccess"-->
            <!--:show-file-list="false"-->
            <!--style="display: none"-->
            <!--accept="video/*">-->
            <!--<button ref="selectVideo">选择文件</button>-->
            <!--</el-upload>-->
        </div>
        <div>
            <button @click="getContent">获取内容</button>
            <button @click="submit">提交内容</button>
            <p>
                {{content}}
            </p>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                quillOptions: {},
                content: '',
//                API('/file/upload')
//                'http://127.0.0.1/upload'
                uploadUrl: API('/file/upload'),
                uploadType: '',
                quill: null,
                embedIndex: 0
            }
        },
        methods: {
            beforeUpload(file) {
//                console.log('上传前', file);
            },
            handleSuccess(res, file) {
//                console.log('上传成功', res, file);
                if (res.code === 0 && res.msg === '成功') {
                    if (this.uploadType === 'image') {
                        this.quill.insertEmbed(this.embedIndex, 'image', `http://${res.data}`);
                        this.embedIndex++;
                    } else if (this.uploadType === 'video') {

                    }
                }
            },
            imgHandler(e) {
                this.$refs.selectImage.click();
                this.uploadType = 'image';
            },
            videoHandler() {
                this.uploadType = 'video';
                this.$prompt('请输入视频URL', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                }).then(
                    (res) => {
                        this.quill.insertEmbed(this.embedIndex, this.uploadType, res.value);
                        this.embedIndex++;
                    }
                ).catch(
                    () => {

                    }
                )

            },
            getContent() {
                console.log(this.quill);
            },
            submit() {
                let obj = {
                    "circleId": 35,
                    "content": this.content,
                    "createUserId": 0,
                    "sort": 0,
                    "title": ''
                };
                this.$http.post(API('/circle/article'), obj).then(
                    (res) => {
                        let data = res.data;
                        if (data.code === 0 && data.msg === '成功') {
                            this.$message({
                                message: '发布成功',
                                type: 'success',
                                onClose: () => {
                                    this.resetPage();
                                }
                            });
                        }
                    },
                    (res) => {
                        console.error(res)
                    }
                )
            },
            resetPage() {
                this.content = '';
                this.uploadType = '';
                this.embedIndex = 0;
            }
        },
        mounted() {
            this.quill = this.$refs.editor.quill;
            // 为图片ICON绑定事件  getModule 为编辑器的内部属性
            this.quill.getModule('toolbar').addHandler('image', this.imgHandler);
            this.quill.getModule('toolbar').addHandler('video', this.videoHandler); // 为视频ICON绑定事件
        }
    }
</script>

<style lang="scss" scoped>
    .outer-container {
        padding: 1rem;
        display: flex;
        flex-direction: row;
        flex-flow: nowrap;
        align-items: stretch;
        justify-content: flex-start;
        > div {
            border: 1px solid #ddd;
            width: 50%;
            overflow: auto;
            background-color: #fefefe;
        }
    }
</style>