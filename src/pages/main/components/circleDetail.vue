<template>
    <div class="outer-container">
        <section class="main" v-loading="getDataLock" element-loading-text="加载中...">
            <filter-component :data-count="dataTotal" filter-name="circleManagement"
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
                                   @edit-circle="editCircle"
                                   @delete-circle="deleteCircle"></post-item>
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
                url = API(`/circle/article?page=${page}&size=${size}&circleId=${this.circleId}`);
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