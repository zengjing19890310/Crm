<template>
    <div class="outer-container">
        <section class="main" v-loading="getDataLock" element-loading-text="加载中...">
            <filter-component :data-count="dataTotal" filter-type="noSelect"
                              @add-item="addItem" @search-keyword="searchKeyword"></filter-component>
            <div class="circle-detail-container" id="circle-detail-container">
                <header class="top">
                    <div class="circle-image">
                        <img :src="circleData.url" alt="圈子图片无法正常显示">
                    </div>
                    <div class="circle-title">
                        <h4>{{circleData.name}}</h4>
                        <div class="circle-information">
                            <p>创建者:{{circleData.nickname}}</p>
                            <p>创建时间:{{circleData.createTime}}</p>
                        </div>
                    </div>
                </header>
                <div class="post-container" id="post-container">
                    <div class="post-wrapper">
                        <post-item v-for="(post,index) in postsList"
                                   :index="index"
                                   :key="post.id"
                                   :post-data.once="post"
                                   @edit-post="editPost"
                                   @delete-post="deletePost"></post-item>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
    import postItem from "./common/postItem.vue";
    import filterComponent from "./common/filterComponent.vue";

    export default {
        data() {
            return {
                circleId: null,
                getDataLock: false,
                page: 1,
                size: 20,
                circleData: {},
                postsList: [],
                currentPost: {},
                keyword: "",
                dataTotal: 0
            }
        },
        beforeRouteEnter(to, from, next) {
            let params = to.params,
                circleId;
            if (params.id) {
                circleId = params.id;
            }
            next(vm => vm.fetchId(circleId));
        },
        created() {

        },
        mounted() {
            //获取视窗容器
            let postContainer = document.getElementById("post-container"),
                //获取内部包裹容器高度
                postWrapper = document.getElementsByClassName("post-wrapper")[0];

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
                if (postWrapper.clientHeight <= postContainer.clientHeight + postContainer.scrollTop) {
                    this.fetchPosts("more");
                }
            };

            //首次加载数据后，内表高度如果小于视窗高度，则不出现滚动条
            /*IE注册事件*/
            if (postContainer.attachEvent) {
                postContainer.attachEvent('onmousewheel', handler);
            }
            /*Firefox注册事件*/
            if (postContainer.addEventListener) {
//                postContainer.addEventListener('DOMMouseScroll', handler, false);
                postContainer.addEventListener('scroll', handler);
            }
        },
        methods: {
            addItem() {
//                console.log("添加一个帖子", this.circleId);
                this.$router.push({
                    name: "addEditor",
                    params: {
                        circleId: this.circleId
                    }
                });
            },
            editPost(id, post) {
//                console.log("编辑帖子", id, post);
                this.$router.push({
                    name: "editor",
                    params: {
                        postId: id,
                        post: post
                    }
                });
            },
            deletePost(id, index) {
                if (id) {
                    this.$confirm(`确定删除圈子?`, "删除圈子", {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(
                        () => {
                            this.$http({
                                url: API(`/circle/article/${id}`),
                                method: "delete"
                            }).then(
                                (res) => {
                                    if (res.ok && res.status === 200) {
                                        let data = res.body;
                                        if (data.code === 0 && data.msg === "成功") {
                                            this.$message({
                                                type: "success",
                                                message: `删除帖子成功`
                                            });
                                            this.postsList.splice(index, 1);
                                        } else {
                                            let message = `删除帖子失败`;
                                            if (res.body) {
                                                if (res.body.msg) {
                                                    message = res.body.msg;
                                                }
                                            }
                                            this.$message({
                                                type: "error",
                                                message: message
                                            })
                                        }
                                    }
                                },
                                (res) => {
                                    let message = `删除帖子失败`;
                                    if (res.body) {
                                        if (res.body.msg) {
                                            message = res.body.msg;
                                        }
                                    }
                                    this.$message({
                                        type: "error",
                                        message: message
                                    })
                                }
                            )
                        }
                    ).catch(
                        () => {

                        }
                    )
                }
            },
            fetchId(circleId) {
                if (circleId) {
                    this.circleId = circleId;
                    this.fetchCircle();
                    this.fetchPosts();
                }
            },
            //获取圈子信息
            fetchCircle() {
                this.$http({
                    url: API(`/circle/${this.circleId}`),
                    method: 'get'
                }).then(
                    (res) => {
                        if (res.ok && res.status === 200) {
                            let data = res.body;
                            if (data.code === 0 && data.msg === "成功") {
                                this.circleData = data.data;
                            }
                        } else {
                            this.$message({
                                type: "error",
                                message: "请求圈子数据失败"
                            });
                        }
                    },
                    (res) => {
                        this.$message({
                            type: "error",
                            message: "请求圈子数据失败"
                        });
                    }
                )
            },
            //获取帖子列表
            fetchPosts(type) {
                this.getDataLock = true;
                let page = this.page,
                    size = this.size,
                    url;

                if (type === "newPost") {
                    //插入1条新帖子数据,位置处于顶置
                    page = 1;
                    size = this.postsList.length + 1;
                } else if (type === "more") {
                    //获取更多条数据
                    this.page++;
                    page = this.page;
                }

                url = API(`/circle/article?page=${page}&size=${size}&circleId=${this.circleId}`);

                //如果有关键字,获取更多页时需要调用其他接口
                if (this.keyword && this.keyword.trim()) {
                    url = API(`/circle/article/get/${this.keyword}/${this.circleId}?page=${page}&size=${size}`);
                }
                this.$http({
                    url: url,
                    method: 'get'
                }).then(
                    (res) => {
                        let response = res.data;
                        if (response.code === 0 && response.msg === "成功") {
                            if (response.data) {
                                let data = response.data,
                                    list = data.list;

                                //获取数据总条数
                                this.dataTotal = data.total;

                                if (!type || type === "newPost") {
                                    this.postsList = list;
                                } else if (type === "more") {
                                    if (this.page <= data.lastPage) {
                                        this.postsList = this.postsList.concat(list);
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
                                type: 'error',
                                message: response.msg
                            })
                        }
                        this.getDataLock = false;
                    },
                    (res) => {
                        this.$message({
                            type: 'error',
                            message: '请求异常!'
                        });
                        this.getDataLock = false;
                    }
                )
            },
            searchKeyword(keyword) {
                this.keyword = keyword;
                //翻回第一页
                this.page = 1;
                this.fetchPosts();
            }
        },
        components: {
            'filter-component': filterComponent,
            'post-item': postItem
        }
    }
</script>

<style lang="scss" scoped>
    @import "common/style/main";

    .main {
        .circle-detail-container {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            position: relative;
            .post-container {
                flex-grow: 1;
                overflow: auto;
                margin-top: 40px;
                /*display: flex;*/
                .post-wrapper {
                    display: flex;
                    flex-direction: row;
                    flex-wrap: wrap;
                    justify-content: flex-start;
                    align-content: flex-start;
                    align-items: center;
                }
            }
            .top {
                flex-grow: 0;
                flex-shrink: 0;
                height: 150px;
                display: flex;
                .circle-image {
                    width: 280px;
                    flex-grow: 0;
                    align-items: stretch;
                    img {
                        width: 100%;
                        height: 100%;
                    }
                    -webkit-box-shadow: 0 2px 5px 1px rgba(0, 0, 0, .1);
                    -moz-box-shadow: 0 2px 5px 1px rgba(0, 0, 0, .1);
                    box-shadow: 0 2px 5px 1px rgba(0, 0, 0, .1);
                }
                .circle-title {
                    flex-grow: 1;
                    margin-left: 40px;
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-end;
                    border-bottom: 1px solid #d8dce5;
                    color: #7a8190;
                    h4 {
                        font-size: 1.5rem;
                        margin-bottom: 25px;
                        font-weight: normal;
                    }
                    .circle-information {
                        display: flex;
                        margin-bottom: 30px;
                        font-size: 0.9rem;
                        p:first-child {
                            margin-right: 25px;
                        }
                    }
                }
            }
        }
    }
</style>