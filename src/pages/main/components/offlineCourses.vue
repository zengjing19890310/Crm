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
                    <el-form ref="courseForm" :module="courseForm" label-width="80px" size="small">
                        <el-form-item label="课程名称">
                            <el-input v-model="courseForm.title"></el-input>
                        </el-form-item>
                        <el-form-item label="开课老师">
                            <el-select v-model="courseForm.teacherId" placeholder="请选择">
                                <el-option label="张老师" value="1111111"></el-option>
                                <el-option label="王老师" value="2222222"></el-option>
                                <el-option label="李老师" value="3333333"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="开课时间">
                            <el-date-picker
                                    v-model="courseForm.startTime"
                                    type="datetime"
                                    placeholder="选择日期时间">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="结束时间">
                            <el-date-picker
                                    v-model="courseForm.endTime"
                                    type="datetime"
                                    placeholder="选择日期时间">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="课程封面">
                            {{courseForm.courseUrl}}
                            <el-upload>
                                <button>浏览</button>
                            </el-upload>
                        </el-form-item>
                        <el-form-item label="视频介绍">
                            <el-input v-model="courseForm.url"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
                <!--右侧提供预览区域-->
                <div class="right-overview">

                </div>
            </div>
            <div slot="footer">
                这是底部
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import filterComponent from "./common/filterComponent.vue";
    import courseItem from "./common/courseItem.vue";

    export default {
        data() {
            return {
                offlineCoursesList: [],
                page: 1,
                size: 20,
                getDataLock: false,
                currentCourse: {},
                dialogVisible: false,
                dialogTitle: "",
                //绑定表单内容
                courseForm: {
                    title: "",
                    teacherId: "",
                    startTime: null,
                    endTime: null,
                    url:"",
                    courseUrl:"",

                }
            }
        },
        created() {
            this.fetchCoursesList();
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
                courseContainer.addEventListener('DOMMouseScroll', handler, false);
                courseContainer.addEventListener('scroll', handler);
            }
        },
        computed: {
            dataTotal() {
                return this.offlineCoursesList ? this.offlineCoursesList.length : 0;
            }
        },
        components: {
            "filter-component": filterComponent,
            "course-item": courseItem
        },
        methods: {
            openHandle() {
                //模态框打开事件
                console.log("打开模态框");
            },
            closeHandle() {
                //模态框关闭事件
                console.log("关闭模态框,重置状态");
            },
            editCourse(id, course) {
                console.log("编辑", id, course);
            },
            deleteCourse(id, index) {
                console.log("删除", id, index);
            },
            fetchCoursesList(type) {
                this.getDataLock = true;
                let page = this.page,
                    size = this.size,
                    url, method;
                if (type === "newCourse") {
                    page = 1;
                    size = this.postsList.length + 1;
                } else if (type === "more") {
                    this.page++;
                    page = this.page;
                }

                url = API(`/course/list`);

                //如果有关键字,获取更多页时需要调用其他接口
                if (this.keyword && this.keyword.trim()) {
                    url = API(`/course/list/get/${this.keyword}`);
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
                console.log("添加课程");
                this.dialogTitle = "添加";
                this.dialogVisible = true;
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
                padding: 1rem;
            }
        }
    }

</style>