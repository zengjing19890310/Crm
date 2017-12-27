<template>
    <div class="outer-container">
        <section class="main" v-loading="getDataLock" element-loading-text="加载中...">
            <filter-component :data-count="dataTotal" filter-type="noSelect"
                              @add-item="addItem" @search-keyword="searchKeyword"></filter-component>
            <div class="offline-course-container" id="offline-course-container">
                <div class="offline-course-wrapper">
                    <course-item v-for="(course,index) in offlineCoursesList" :course-data="course" :index="index"
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
                <!--主体内容是一个表单-->
                <!--{-->
                <!--"address": "string",-->
                <!--"courseUrl": "string",-->
                <!--"description": "string",-->
                <!--"endTime": "2017-12-14T09:10:28.013Z",-->
                <!--"fine": 0,-->
                <!--"id": 0,-->
                <!--"locationId": 0,-->
                <!--"money": 0,-->
                <!--"person": 0,-->
                <!--"startTime": "2017-12-14T09:10:28.013Z",-->
                <!--"teacherId": 0,-->
                <!--"times": 0,-->
                <!--"title": "string",-->
                <!--"url": "string"-->
                <!--}-->
                <div class="left-form" @click.stop>
                    <el-form ref="courseForm" :model="courseForm" label-width="80px" size="small" :rules="rules">
                        <el-form-item label="课程名称" prop="title">
                            <el-input v-model="courseForm.title" placeholder="请输入课程名称"></el-input>
                        </el-form-item>
                        <el-form-item label="开课老师" prop="teacherId">
                            <el-select v-model="courseForm.teacherId" placeholder="请选择开课老师" @change="changeTeacher">
                                <el-option v-for="(teacher,index) in teacherList" :label="teacher.teachername"
                                           :value="teacher.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="开课城市" prop="locationId">
                            <el-select v-model="courseForm.locationId" placeholder="请选择开课城市" @change="changeLocation">
                                <el-option v-for="(location,index) in locationList" :label="location.name"
                                           :value="location.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="开课地址" prop="address">
                            <el-input v-model="courseForm.address" placeholder="请输入开课地址"></el-input>
                        </el-form-item>
                        <el-form-item label="开课时间" prop="startTime">
                            <!--2017-12-11 10:31:27-->
                            <el-date-picker
                                    v-model="courseForm.startTime"
                                    type="datetime"
                                    placeholder="选择日期时间"
                                    :picker-options="startOptions"
                                    format="yyyy-MM-dd HH:mm:ss"
                                    :readonly="false"
                                    :editable="false"
                                    :clearable="false"
                                    @change="timeChange"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                            >
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="结束时间" prop="endTime">
                            <el-date-picker
                                    v-model="courseForm.endTime"
                                    type="datetime"
                                    placeholder="选择日期时间"
                                    :picker-options="endOptions"
                                    format="yyyy-MM-dd HH:mm:ss"
                                    :readonly="false"
                                    :editable="false"
                                    :clearable="false"
                                    @change="timeChange"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                            >
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="课程价格" prop="money">
                            <el-input v-model.number="courseForm.money" placeholder="请输入课程价格"></el-input>
                        </el-form-item>
                        <el-form-item label="开课人数" prop="person">
                            <el-input v-model.number="courseForm.person" placeholder="请输入开课人数"></el-input>
                        </el-form-item>
                        <el-form-item label="课程封面" prop="courseUrl">
                            <!--{{courseForm.courseUrl}}-->
                            <el-input v-model="courseForm.courseUrl" placeholder="请上传封面图片" readonly></el-input>
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
                        <el-form-item label="视频" prop="url">
                            <el-input v-model="courseForm.url" placeholder="请输入视频地址"></el-input>
                        </el-form-item>
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
                        <img v-if="courseForm.courseUrl" :src="courseForm.courseUrl" alt="">
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
    import courseItem from "./common/offlineCourseItem.vue";

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
                startOptions: {
                    firstDayOfWeek: 1,
                    disabledDate: (time) => {
//                        return time.getTime() < new Date().getTime();
                        if (this.courseForm.endTime) {
                            //如果有选中的结束时间,则起始时间在结束时间之前
                            if (time.getTime && new Date(this.courseForm.endTime).getTime) {
                                return time.getTime() > new Date(this.courseForm.endTime).getTime() || time.getTime() < new Date().getTime();
                            } else {
                                return time.getTime() < new Date().getTime();
                            }
                        } else {
                            return time.getTime() < new Date().getTime();
                        }
                    }
                },
                endOptions: {
                    firstDayOfWeek: 1,
                    disabledDate: (time) => {
//                        return time.getTime() < new Date().getTime();
                        if (this.courseForm.startTime) {
                            //如果有选中的起始时间,则结束时间在起始时间之后
                            if (time.getTime && new Date(this.courseForm.startTime).getTime) {
                                return time.getTime() < new Date(this.courseForm.startTime).getTime() || time.getTime() < new Date().getTime();
                            } else {
                                return time.getTime() < new Date().getTime();
                            }
                        } else {
                            return time.getTime() < new Date().getTime();
                        }
                    }
                },
                uploadUrl: API('/file/upload'),
                uploading: false,
                offlineCoursesList: [],
                page: 1,
                size: 20,
                getDataLock: false,
                dialogVisible: false,
                dialogTitle: "",
                //绑定表单内容
                courseForm: {
                    title: "",
                    teacherId: "",
                    locationId: "",
                    address: "",
                    startTime: "",
                    endTime: "",
                    courseUrl: "",
                    url: "",
                    description: "",
                    person: "",
                    money: ""
                },
                inSubmit: false,
                //表单验证规则
                rules: {
                    title: [
                        {required: true, message: "请输入课程名称", trigger: "blur"}
                    ],
                    teacherId: [
                        {type: 'number', required: true, message: "请选择开课老师", trigger: "change"}
                    ],
                    locationId: [
                        {type: 'number', required: true, message: "请选择开课城市", trigger: "change"}
                    ],
                    address: [
                        {required: true, message: "请输入开课地址", trigger: "blur"}
                    ],
                    startTime: [
                        {required: true, message: "请选择开课时间", trigger: "change"}
                    ],
                    endTime: [
                        {required: true, message: "请选择结束时间", trigger: "change"}
                    ],
                    description: [
                        {required: true, message: "请填写课程描述", trigger: "blur"}
                    ],
                    courseUrl: [
                        {required: true, message: "请上传封面图片", trigger: "blur"}
                    ],
                    url: [
                        {required: true, message: "请添加视频", trigger: "blur"}
                    ],
                    person: [
                        {type: 'number', required: true, message: '必须为数值', trigger: "blur"},
                        {validator: nonnegative, trigger: 'blur'}
                    ],
                    money: [
                        {type: 'number', required: true, message: '必须为数值', trigger: "blur"},
                        {validator: nonnegative, trigger: 'blur'}
                    ]
                },
                //确定模态框用途,是新增或者编辑
                modalType: "",
                //教师下拉列表
                teacherList: [],
                //城市下拉列表
//                1重庆 2成都 3广州 4武汉 ,
                locationList: [
                    {
                        id: 1,
                        name: "重庆"
                    },
                    {
                        id: 2,
                        name: "成都"
                    },
                    {
                        id: 3,
                        name: "广州"
                    },
                    {
                        id: 4,
                        name: "武汉"
                    }
                ],
                //提交表单的形式,更新put或者新增post
                method: "",
                dataTotal: 0
            }
        },
        created() {
            this.fetchCoursesList();
            this.fetchTeachList();
        },
        mounted() {
            //获取视窗容器
            let courseContainer = document.getElementById("offline-course-container"),
                //获取内部包裹容器高度
                courseWrapper = document.getElementsByClassName("offline-course-wrapper")[0];

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

            //首次加载数据后，内表高度如果小于视窗高度，则不出现滚动条
            /*IE注册事件*/
            if (courseContainer.attachEvent) {
                courseContainer.attachEvent('onmousewheel', handler);
            }
            /*Firefox注册事件*/
            if (courseContainer.addEventListener) {
//                courseContainer.addEventListener('DOMMouseScroll', handler, false);
                courseContainer.addEventListener('scroll', handler);
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
            changeTeacher(id) {
//                console.log("改变老师", id);
                _.forEach(this.teacherList, (teacher, index) => {
                    if (teacher.id === id) {
                        this.courseForm.teachername = teacher.teachername;
                    }
                });
//                this.courseForm
            },
            changeLocation(id) {
//                console.log("改变城市", id);
//                _.forEach(this.locationList, (location,index) => {
//                    if(location.id === id){
//                        this.courseForm.teachername = location.name;
//                    }
//                });
//                this.courseForm
            },
            //获取所有老师
            fetchTeachList() {
                this.$http({
                    url: API("/teacher"),
                    method: "get"
                }).then(
                    (res) => {
                        let response = res.body;
                        if (response) {
                            if (response.code === 0 && response.msg === "成功") {
                                this.teacherList = response.data;
                            }
                        }
                    },
                    (res) => {
                        this.$message({
                            type: "error",
                            message: "请求失败"
                        })
                    }
                )
            },
            //时间变化时,改变时间格式
            timeChange(value) {

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
                        this.courseForm.courseUrl = res.data;
                        this.$refs.courseForm.validateField("courseUrl");
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
                this.courseForm.courseUrl = "";
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
                    url: API("/course"),
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
                                if (this.offlineCoursesList && this.offlineCoursesList.length !== 0) {
                                    _.forEach(this.offlineCoursesList, (value, index) => {
                                        if (value.id === this.courseForm.id) {
//                                            console.log(value, index, this.courseForm);
                                            this.offlineCoursesList.splice(index, 1, this.courseForm);
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
            dialogClose() {
                this.dialogVisible = false;
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
                    title: "",
                    teacherId: "",
                    locationId: "",
                    address: "",
                    startTime: "",
                    endTime: "",
                    courseUrl: "",
                    url: "",
                    description: "",
                    person: "",
                    money: ""
                };
                //模态框关闭时,需要重置表单内容和效验状态
                this.$refs.courseForm.clearValidate();
                //清除上传队列
                this.$refs.upload.clearFiles();
                this.modalType = "";
                this.method = "";
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
                        url: API(`/course/${id}`)
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
                                    this.offlineCoursesList.splice(index, 1);
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
            fetchCoursesList(type) {
                this.getDataLock = true;
                let page = this.page,
                    size = this.size,
                    url, method;
                if (type === "newCourse") {
                    page = 1;
                    size = this.offlineCoursesList.length + 1;
                } else if (type === "more") {
                    this.page++;
                    page = this.page;
                } else if (!type) {
                    page = 1;
                }

                url = API(`/course/list`);

                //如果有关键字,获取更多页时需要调用其他接口
                if (this.keyword && this.keyword.trim()) {
                    url = API(`/course/get/${this.keyword}`);
                }
                method = "get";
                this.$http({
                    url: url,
                    method: method,
                    params: {
                        page: page,
                        size: size
                    }
                }).then(
                    (res) => {
                        if (res.ok && res.status === 200) {
                            let data = res.body;
                            if (data.code === 0 && data.msg === "成功") {
                                if (data.data) {
                                    let list = data.data.list;
                                    this.dataTotal = data.data.total;
                                    if (!type || type === "newCourse") {
                                        this.offlineCoursesList = list;
                                    } else if (type === "more") {
                                        if (this.page <= data.data.lastPage) {
                                            this.offlineCoursesList = this.offlineCoursesList.concat(list);
                                        } else {
                                            this.$message({
                                                type: "warning",
                                                message: "没有更多数据了"
                                            });
                                            this.page--;
                                        }
                                    }
                                }
                            } else {
                                this.$message({
                                    type: "error",
                                    message: data.msg
                                });
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
                );
            },
            addItem() {
//                console.log("添加课程");
                this.dialogTitle = "添加";
                this.dialogVisible = true;
                this.modalType = "add";
                this.method = "post";
            },
            searchKeyword(keyword) {
                this.keyword = keyword;
                //翻回第一页
                this.page = 1;
                this.fetchCoursesList();
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "common/style/main";

    .main {
        .offline-course-container {
            flex-grow: 1;
            overflow: auto;
            .offline-course-wrapper {
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