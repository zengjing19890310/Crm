<template>
    <div class="outer-container">
        <section class="main" v-loading="getDataLock" element-loading-text="加载中...">
            <filter-component :data-count="dataTotal" filter-type="noSelect"
                              @add-item="addItem" @search-keyword="searchKeyword"></filter-component>
            <div class="circle-detail-container" id="circle-detail-container">
                <header class="top">
                    <div class="circle-image">
                        <img :src="`http://${circleData.url}`" alt="圈子图片无法正常显示">
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
                size: 10,
                circleData: {},
                postsList: [],
                currentPost: {},
                keyword:""
            }
        },
        computed: {
            dataTotal() {
                return this.postsList ? this.postsList.length : 0;
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
        methods: {
            editPost(id, post) {
//                console.log("编辑帖子", id, post);
                this.$router.push({
                    name: "editor",
                    params: {
                        id: id,
                        post: post
                    }
                });
            },
            deletePost(id, index) {
                console.log("删除帖子", id, index);
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
                if (this.keyword.trim()) {
                    url = API(`/circle/article/get/${this.keyword}?page=${page}&size=${size}`);
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
                                this.postsList = list;
                            }
                        }
                        this.getDataLock = false;
                    },
                    (res) => {
                        this.getDataLock = false;
                        console.error(res);
                    }
                )
            },
            searchKeyword(keyword) {
                this.keyword = keyword;
            }
        },
        components: {
            'filter-component': filterComponent,
            'post-item': postItem
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
        .circle-detail-container {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            .post-container {
                flex-grow: 1;
                overflow: auto;
                margin-top: 40px;
                display: flex;
                .post-wrapper {
                    flex-grow: 1;
                    display: flex;
                    flex-direction: row;
                    flex-wrap: wrap;
                    justify-content: flex-start;
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