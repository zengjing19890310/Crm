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
    </div>
</template>

<script>
    import filterComponent from "./common/filterComponent.vue";
    import courseItem from "./common/onlineCourseItem.vue";

    export default {
        data() {
            return {
                getDataLock: false,
                page: 1,
                size: 20,
                onlineCoursesList: [],
                keyword: "",
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
                return this.onlineCoursesList ? this.onlineCoursesList.length : 0;
            }
        },
        components: {
            "filter-component": filterComponent,
            "course-item": courseItem
        },
        methods: {
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
                url = API("/video");
                method = "get";

                //如果有关键字,获取更多页时调用其他接口
//                if (this.keyword && this.keyword.trim()) {
//                    url = API(`/course/get/${this.keyword}`);
//                }

                this.$http({
                    url: url,
                    method: method,
                    params: {
                        page: page,
                        size: size
                    }
                }).then(
                    (res) => {
                        console.log(res);
                        let response = res.body;
                        if (response) {
                            if (response.code === 0 && response.msg === "成功") {
                                if (response.data) {
                                    let list = response.data.list;
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
                                            this.page--;
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
            }
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