<template>
    <div class="outer-container">
        <section class="main" v-loading="getDataLock" element-loading-text="加载中...">
            <filter-component :data-count="dataTotal" filter-type="noSelect"
                              @add-item="addItem" @search-keyword="searchKeyword"></filter-component>
            <div class="online-course-container" id="online-course-container">
                <div class="online-course-wrapper">
                    <course-item v-for="(course,index) in onlineCoursesList" :course-data="course" :index="index"
                                 @edit-course="editCourse" @delete-course="deleteCourse">
                        {{course.title}}
                    </course-item>
                </div>
            </div>
        </section>
        <el-dialog :title="dialogTitle"
                   width="50%"
                   :visible.sync="dialogVisible"
                   :close-on-click-modal="false"
                   @close="closeHandle" @open="openHandle">
            <div slot="title" style="text-align: center">
                {{dialogTitle}}课程信息
            </div>
            <div class="modal-content">
                <div class="left-form" @click.stop>
                    <el-form ref="courseForm" :model="courseForm" label-width="80px" size="small" :rules="rules">
                        <!--课程封面-->
                        <el-form-item label="课程封面" prop="videoUrl">
                            <!--{"createTime": "2017-12-19T01:23:51.028Z",-->
                            <!--"description": "string",-->
                            <!--"id": 0,-->
                            <!--"level": 0,-->
                            <!--"price": 0,-->
                            <!--"updateTime": "2017-12-19T01:23:51.028Z",-->
                            <!--"url": "string",-->
                            <!--"videoUrl": "string"}-->
                            <el-input v-model="courseForm.videoUrl" placeholder="请上传课程封面" readonly></el-input>
                            <el-upload
                                    ref="upload"
                                    :action="uploadUrl"
                                    :headers="headers"
                                    :show-file-list="true"
                                    :multiple="false"
                                    :auto-upload="true"

                                    :on-success="handleSuccess"
                                    :on-change="handleChange"
                                    :on-error="handleError"
                                    :on-remove="handleRemove"
                                    :on-progress="handleProgress"
                                    accept="image/*">
                                <el-button slot="trigger" style="min-width: 100%;" type="primary"
                                           :loading="uploading">
                                    选择课程封面
                                </el-button>
                            </el-upload>
                        </el-form-item>
                        <!--课程视频-->
                        <el-form-item label="视频" prop="url">
                            <el-input v-model="courseForm.url" placeholder="请输入视频地址"></el-input>
                        </el-form-item>
                        <!--等级-->
                        <el-form-item label="等级" prop="level">
                            <!--@change="changeLocation"-->
                            <el-select v-model="courseForm.level" placeholder="请选择课程等级">
                                <el-option v-for="(level,index) in levelList" :label="level.name"
                                           :value="level.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <!--价格-->
                        <el-form-item label="价格" prop="price">
                            <el-input v-model.number="courseForm.price" placeholder="请输入课程价格"></el-input>
                        </el-form-item>
                        <!--视频描述-->
                        <el-form-item label="课程描述" prop="description">
                            <el-input type="textarea" :rows="2" placeholder="请输入课程描述"
                                      v-model="courseForm.description"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
                <!--右侧提供预览区域-->
                <div class="right-overview">
                    <div class="image-overview">
                        <!--{{courseForm.courseUrl}}-->
                        <img v-if="courseForm.videoUrl" :src="courseForm.videoUrl" alt="">
                    </div>
                    <div class="video-overview" v-html="courseForm.url">
                        <!--{{courseForm.url}}-->
                    </div>
                </div>
            </div>
            <div slot="footer">
                <el-button type="primary" @click="submit" size="small" :loading="uploading||inSubmit">
                    确定
                </el-button>
                <el-button @click="dialogClose" size="small" :loading="uploading||inSubmit">
                    取消
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import filterComponent from "./common/filterComponent.vue";
    import courseItem from "./common/onlineCourseItem.vue";

    export default {
        data() {
            let nonnegative = (rule, value, callback) => {
                if (value < 0) {
                    callback(new Error('输入不能为负值'));
                } else {
                    callback();
                }
            };
            return {
                getDataLock: false,
                page: 1,
                size: 20,
                onlineCoursesList: [],
                keyword: "",
                dialogTitle: "",
                dialogVisible: false,

                uploadUrl: API('/file/upload'),
                uploading: false,

                modalType: "",
                method: "",
                //绑定表单内容
                courseForm: {
                    description: "",
                    level: "",
                    price: "",
                    url: "",
                    videoUrl: ""
                },
                inSubmit: false,
                rules: {
                    videoUrl: [
                        {required: true, message: "请上传课程封面", trigger: "blur"}
                    ],
                    url: [
                        {required: true, message: "请添加视频", trigger: "blur"}
                    ],
                    level: [
                        {type: 'number', required: true, message: "请选择课程等级", trigger: "change"}
                    ],
                    price: [
                        {type: 'number', required: true, message: "请输入课程价格", trigger: "blur"},
                        {validator: nonnegative, trigger: 'blur'}
                    ],
                    description: [
                        {required: true, message: "请填写课程描述", trigger: "blur"}
                    ]
                },

                levelList: [
                    {id: 1, level: 1, name: "等级1"},
                    {id: 2, level: 2, name: "等级2"},
                    {id: 3, level: 3, name: "等级3"},
                    {id: 4, level: 4, name: "等级4"}
                ],
                dataTotal: 0
            }
        },
        created() {
            this.fetchCoursesList();
        },
        mounted() {
            //获取视窗容器
            let courseContainer = document.getElementById("online-course-container"),
                //获取内部包裹容器高度
                courseWrapper = document.getElementsByClassName("online-course-wrapper")[0];

            let handler = (e) => {
                //如果鼠标向上滚动,不应触发再次加载更多数据
                if (e.delayY < 0) {
                    return;
                }
                if (this.getDataLock) {
                    this.$message({
                        type: "warning",
                        message: "请耐心等待当前数据加载完成..."
                    });
                    return;
                }
                if (courseWrapper.clientHeight <= courseContainer.clientHeight + courseContainer.scrollTop) {
                    this.fetchCoursesList("more");
                }
            };

            if (courseContainer) {
                /*IE注册事件*/
                if (courseContainer.attachEvent) {
                    courseContainer.attachEvent('onmousewheel', handler);
                }
                /*Firefox注册事件*/
                if (courseContainer.addEventListener) {
//                    courseContainer.addEventListener('DOMMouseScroll', handler, false);
                    courseContainer.addEventListener('scroll', handler);
                }
            }
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
        components: {
            "filter-component": filterComponent,
            "course-item": courseItem
        },
        methods: {
            //提交表单
            submit() {
                this.$refs.courseForm.validate((result) => {
                    if (result) {
                        this.inSubmit = true;
//                        console.log("通过效验");
                        //判断上传封面图片是否已经上传
                        let upload = this.$refs.upload,
                            files = upload.uploadFiles,
                            file = files[0];
                        //当文件列表长度不为0且当中的文件未上传时
                        if (files.length !== 0 && !file.response) {
                            //上传图片,并在图片提交完成后提交作业
                            this.handleUpload();
                        }
                        this.handleSubmit();
                    } else {
//                        console.log( this.courseForm);
//                        console.log("未通过效验");
//                        console.log(this.courseForm);
                        this.$message({
                            type: "error",
                            message: "请正确填写课程信息",
                            duration: 1500
                        })
                    }
                });
            },
            //关闭模态框
            dialogClose() {
                this.dialogVisible = false;
            },
            //模态框打开事件
            openHandle() {
//                console.log("打开模态框");
//                this.$refs.courseForm.clearValidate();
            },
            //上传列表变化
            handleChange(file, fileList) {
                if (fileList.length === 2) {
                    fileList.shift();
                }
            },
            //上传图片成功
            handleSuccess(res, file, fileList) {
                if (res.code === 0 && res.msg === '成功') {
                    if (res.data) {
                        this.courseForm.videoUrl = res.data;
                        this.$refs.courseForm.validateField("videoUrl");
                    }
                    this.$message({
                        type: "success",
                        message: "封面图片上传成功"
                    });
                }
                this.uploading = false;
            },
            //上传失败
            handleError() {
                this.uploading = false;
                this.$message({
                    type: "error",
                    message: "上传图片失败"
                });
            },
            //移除上传文件时
            handleRemove() {
                this.courseForm.videoUrl = "";
            },
            //处理上传过程中
            handleProgress(event, file, fileList) {
                this.uploading = true;
            },
            //触发图片上传
            handleUpload() {
                //判断上传封面图片是否已经上传
                let upload = this.$refs.upload,
                    files = upload.uploadFiles,
                    file = files[0];
                if (files.length !== 0 && !file.response) {
                    this.uploading = true;
                    this.$refs.upload.submit();
                } else {
                    this.$message({
                        type: "error",
                        message: "请选择图片",
                        duration: 1500
                    })
                }
            },
            handleSubmit() {
                this.$http({
                    method: this.method,
                    url: API("/video"),
                    body: this.courseForm
                }).then(
                    (res) => {
                        let response = res.body,
                            message = "操作成功";
                        if (response.code === 0 && response.msg === "成功") {
                            if (this.method === "post") {
                                message = "添加课程成功";
                                this.fetchCoursesList("newCourse");
                            } else if (this.method === "put") {
                                message = "更新课程成功";
                                if (this.onlineCoursesList && this.onlineCoursesList.length !== 0) {
                                    _.forEach(this.onlineCoursesList, (value, index) => {
                                        if (value.id === this.courseForm.id) {
//                                            console.log(value, index, this.courseForm);
                                            this.onlineCoursesList.splice(index, 1, this.courseForm);
                                        }
                                    });
                                }
                            }
                            this.$message({
                                type: "success",
                                message: message
                            });
                            this.dialogClose();
                        } else {
                            this.$message({
                                type: "error",
                                message: response.msg
                            });
                        }
                        this.inSubmit = false;
                    },
                    (res) => {
                        this.$message({
                            type: "error",
                            message: "请求错误"
                        });
                        this.inSubmit = false;
                    }
                )
            },
            openHandle() {
                //模态框打开事件
//                console.log("打开模态框");
//                this.$refs.courseForm.clearValidate();
            },
            closeHandle() {
                //模态框关闭事件
//                console.log("关闭模态框,重置状态");
                this.courseForm = {
                    description: "",
                    level: "",
                    price: "",
                    url: "",
                    videoUrl: ""
                };
                //模态框关闭时,需要重置表单内容和效验状态
                this.$refs.courseForm.clearValidate();
                //清除上传队列
                this.$refs.upload.clearFiles();
                this.modalType = "";
                this.method = "";
            },
//    {
//        "createTime": "2017-12-18T03:07:22.687Z",
//        "description": "string",
//        "id": 0,
//        "level": 0,
//        "price": 0,
//        "updateTime": "2017-12-18T03:07:22.687Z",
//        "url": "string",
//        "videoUrl": "string"
//    }
            //添加课程
            addItem() {
                this.dialogTitle = "添加";
                this.dialogVisible = true;
                this.modalType = "add";
                this.method = "post";
            },
            //按关键字模糊查询
            searchKeyword(keyword) {
                this.keyword = keyword;
                //翻回第一页
                this.page = 1;
                this.fetchCoursesList();
            },
            //获取课程列表数据
            fetchCoursesList(type) {
                this.getDataLock = true;
                let page = this.page,
                    size = this.size,
                    url, method;
                if (type === "newCourse") {
                    page = 1;
                    size = this.onlineCoursesList.length + 1;
                } else if (type === "more") {
                    this.page++;
                    page = this.page;
                } else if (!type) {
                    this.page = 1;
                    page = 1;
                }
                url = API("/video");
                method = "get";

                //如果有关键字,获取更多页时调用其他接口
                if (this.keyword && this.keyword.trim()) {
                    url = API(`/video/get/${this.keyword}`);
                }

                this.$http({
                    url: url,
                    method: method,
                    params: {
                        page: page,
                        size: size
                    }
                }).then(
                    (res) => {
                        let response = res.body;
                        if (response) {
                            if (response.code === 0 && response.msg === "成功") {
                                if (response.data) {
                                    let list = response.data.list;
                                    this.dataTotal = response.data.total;
                                    if (!type || type === "newCourse") {
                                        this.onlineCoursesList = list;
                                    } else if (type === "more") {
                                        if (this.page <= response.data.lastPage) {
                                            this.onlineCoursesList = this.onlineCoursesList.concat(list);
                                        } else {
                                            this.$message({
                                                type: "warning",
                                                message: "没有更多数据了"
                                            });
                                            this.page=response.data.lastPage;
                                        }
                                    }
                                }
                            }
                        }
                        this.getDataLock = false;
                    },
                    (res) => {
                        this.$message({
                            type: "error",
                            message: "请求异常"
                        });
                        this.getDataLock = false;
                    }
                )
            },
            //编辑课程
            editCourse(id, course) {
                this.modalType = "edit";
                this.method = "put";
                this.dialogVisible = true;
                this.courseForm = JSON.parse(JSON.stringify(course));
            },
            //删除课程
            deleteCourse(id, index) {
                this.$confirm('确定删除?', '删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http({
                        method: "delete",
                        url: API(`/video/${id}`)
                    }).then(
                        (res) => {
                            let response = res.body;
                            if (response) {
                                if (response.code === 0 && response.msg === "成功") {
                                    this.$message({
                                        type: "success",
                                        message: "删除成功",
                                        duration: 1500
                                    });
                                    this.onlineCoursesList.splice(index, 1);
                                    this.dataTotal--;
                                } else {
                                    this.$message({
                                        type: "error",
                                        message: "删除失败",
                                        duration: 1500
                                    });
                                }
                            }
                        },
                        (res) => {
                            this.$message({
                                type: "error",
                                message: "删除失败",
                                duration: 1500
                            });
                        }
                    );
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
        }
    }
</script>

<style lang="scss" scoped>
    @import "common/style/main";

    .main {
        .online-course-container {
            flex-grow: 1;
            overflow: auto;
            .online-course-wrapper {
                display: flex;
                flex-wrap: wrap;
            }
        }
        .modal-content {
            display: flex;
            > div {
                width: 50%;
                box-sizing: border-box;
                flex-grow: 1;
                flex-shrink: 0;
                min-height: 100px;
                border: 1px solid #ddd;
                padding: 0.5rem;
                max-height: 380px;
                overflow-y: auto;
            }
            .left-form {

            }
            .right-overview {
                display: flex;
                flex-direction: column;
                .image-overview {
                    flex-grow: 1;
                    flex-shrink: 0;
                    img {
                        max-width: 100%;
                        max-height: 190px;
                        vertical-align: middle;
                    }
                }
                .video-overview {
                    flex-grow: 1;
                    flex-shrink: 0;
                    iframe {
                        vertical-align: middle;
                    }
                }
            }
        }
    }
</style>