<template>
    <!--圈子管理-->
    <div class="outer-container">
        <section class="main" v-loading="getDataLock" element-loading-text="加载中...">
            <filter-component :data-count="dataTotal" filter-type="noSelect"
                              @add-item="addItem" @search-keyword="searchKeyword"></filter-component>
            <div class="circle-container" id="circle-container">
                <div class="circle-wrapper">
                    <circle-item v-for="(circle,index) in circleList"
                                 :index="index"
                                 :key="circle.id"
                                 :circle-data.once="circle"
                                 ref="circleItem"
                                 @edit-circle="editCircle"
                                 @delete-circle="deleteCircle"
                                 @circle-detail="goCircleDetail"></circle-item>

                </div>
            </div>
        </section>
        <!--编辑圈子弹框-->
        <div @click.stop>
            <el-dialog
                    :visible.sync="editModalVisible"
                    :before-close="handleEditClose"
                    :close-on-click-modal="false"
                    :close-on-press-escape="false"
                    width="30%">
                <!--title	Dialog 标题区的内容-->
                <div slot="title">
                    <h4>编辑圈子信息</h4>
                </div>
                <div class="dialog-container">
                    <div style="margin-bottom: 1rem;">
                        <span>圈子名称</span>
                        <el-input type="text" placeholder="请输入圈子名称" v-model="currentCircle.name"></el-input>
                    </div>
                    <div>
                        <span>圈子图片</span>
                        <el-upload
                                ref="editUpload"
                                :action="uploadUrl"
                                :headers="headers"
                                :show-file-list="true"
                                :multiple="false"
                                :auto-upload="false"

                                :on-success="handleEditSuccess"
                                :on-change="handleEditChange"
                                :on-error="handleError"
                                style="text-align: center"
                                accept="image/*">
                            <el-button slot="trigger" style="min-width: 200px;" type="primary">更改圈子图片</el-button>
                        </el-upload>
                    </div>
                </div>
                <!--footer	Dialog 按钮操作区的内容-->
                <div slot="footer">
                    <el-button type="primary" @click="submitEdit" :loading="submitButtonLoading">提交</el-button>
                    <el-button @click="handleEditClose">取消</el-button>
                </div>
            </el-dialog>
        </div>
        <!--添加圈子弹框-->
        <div @click.stop>
            <el-dialog
                    :visible.sync="newModalVisible"
                    :before-close="handleNewClose"
                    :close-on-click-modal="false"
                    :close-on-press-escape="false"
                    width="30%">
                <!--title	Dialog 标题区的内容-->
                <div slot="title">
                    <h4>添加圈子</h4>
                </div>
                <div class="dialog-container">
                    <div style="margin-bottom: 1rem;">
                        <span>圈子名称</span>
                        <el-input type="text" placeholder="请输入圈子名称" v-model="newCircle.name"></el-input>
                    </div>
                    <div>
                        <span>圈子图片</span>
                        <el-upload
                                ref="newUpload"
                                :action="uploadUrl"
                                :headers="headers"
                                :show-file-list="true"
                                :multiple="false"
                                :auto-upload="false"

                                :on-success="handleNewSuccess"
                                :on-change="handleNewChange"
                                :on-error="handleError"
                                style="text-align: center"
                                accept="image/*">
                            <el-button slot="trigger" style="min-width: 200px;" type="primary">上传圈子图片</el-button>
                        </el-upload>
                    </div>
                </div>
                <!--footer	Dialog 按钮操作区的内容-->
                <div slot="footer">
                    <el-button type="primary" @click="submitNew" :loading="submitButtonLoading">添加</el-button>
                    <el-button @click="handleNewClose">取消</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import circleItem from "./common/circleItem.vue";
    import filterComponent from "./common/filterComponent.vue";

    export default {
        data() {
            return {
                circleList: [],
                //分页每页加载数量
                size: 20,
                //当前页
                page: 1,
                uploadUrl: API('/file/upload'),
                editModalVisible: false,

                circleId: null,
                currentCircle: {},

                newModalVisible: false,
                //新增一个圈子信息
                newCircle: {
                    createUserId: "",
                    introduce: "",
                    name: "",
                    url: "",
                    sort1: 0
                },
                //按钮loading控制
                submitButtonLoading: false,

                //用户信息获取
                userInformation: {},

                getDataLock: false,
                //搜索关键字
                keyword: "",
                dataTotal: 0
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
        mounted() {
            this.fetchCirclesList();
            //获取视窗容器
            let circleContainer = document.getElementById("circle-container"),
                //获取内部包裹容器高度
                circleWrapper = document.getElementsByClassName("circle-wrapper")[0];

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
                if (circleWrapper.clientHeight <= circleContainer.clientHeight + circleContainer.scrollTop) {
                    this.fetchCirclesList("more");
                }
            };

            //首次加载数据后，内表高度如果小于视窗高度，则不出现滚动条
            /*IE注册事件*/
            if (circleContainer.attachEvent) {
                circleContainer.attachEvent('onmousewheel', handler);
            }
            /*Firefox注册事件*/
            if (circleContainer.addEventListener) {
                circleContainer.addEventListener('DOMMouseScroll', handler, false);
                circleContainer.addEventListener('scroll', handler);
            }
        },
        methods: {
            //关键字搜索
            searchKeyword(keyword, moduleName) {
//                console.log("关键字搜索", keyword, moduleName);
                this.keyword = keyword;
                //翻回第一页
                this.page = 1;
                this.fetchCirclesList();
            },
            //跳转圈子详情页面
            goCircleDetail(id) {
//                console.log(`跳转到圈子详情${id}`);
                this.$router.push({
                    path: `/circleDetail/${id}`
                });
            },
            //获取圈子列表
            fetchCirclesList(type) {
                this.getDataLock = true;
                let size = this.size,
                    page = this.page;

                if (type === "newCircle") {
                    //插入1条新圈子数据,位置处于顶置
                    page = 1;
                    size = this.circleList.length + 1;
                } else if (type === "more") {
                    //获取更多条数据
                    this.page++;
                    page = this.page;
                }

                let url = API(`/circle?page=${page}&size=${size}`);

                //如果有关键字,获取更多页时
                if (this.keyword && this.keyword.trim()) {
                    url = API(`/circle/get/${this.keyword}?page=${page}&size=${size}`);
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
                                this.dataTotal = data.total;
                                if (!type || type === "newCircle") {
                                    this.circleList = list;
                                } else if (type === "more") {
                                    if (this.page <= data.lastPage) {
                                        this.circleList = this.circleList.concat(list);
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
                );
            },
            //处理模态框处理
            handleEditClose() {
//                console.log("关闭窗口");
                this.editModalVisible = false;
                this.submitButtonLoading = false;
                this.circleId = null;
                this.currentCircle = {};
                //清除上传队列
                this.$refs.editUpload.clearFiles();

                //清除圈子子组件模态框
                window.Bus.$emit("clear-modal");
            },
            submitEdit() {
                if (!this.currentCircle.name.trim()) {
                    this.$message({
                        type: "error",
                        message: "圈子名称不能为空"
                    });
                    this.currentCircle.name = null;
                    return;
                }
                this.submitButtonLoading = true;
                let upload = this.$refs.editUpload;
                let uploadFiles = upload.uploadFiles;
                //获取上传的文件
                if (uploadFiles && uploadFiles.length !== 0) {
                    //上传图片,然后更新圈子
                    upload.submit();
                } else {
                    //直接更新圈子
                    this.handleEditUpdate(this.currentCircle);
                }
            },
            handleEditChange(file, fileList) {
                if (fileList.length === 2) {
                    fileList.shift();
                }
            },
            //更新图片成功
            handleEditSuccess(res, file, fileList) {
                if (res.code === 0 && res.msg === '成功') {
                    //遍历圈子列表,获取更多的
                    if (this.circleList && this.circleList.length !== 0) {
                        if (res.data) {
                            this.currentCircle.url = res.data;
                        }
                        //向后台更新圈子数据
                        this.handleEditUpdate(this.currentCircle);
                    }
                }
            },
            //更新图片失败
            handleError(err, file, fileList) {
                console.log(err);
//                this.handleUpdate(this.currentCircle);
            },
            handleEditUpdate(currentCircle) {
                //向后台提交更新
                this.$http({
                    url: API("/circle"),
                    method: "put",
                    body: currentCircle
                }).then(
                    (res) => {
                        if (res.ok && res.status === 200) {
                            //更新页面圈子的信息
                            if (res.body) {
                                let data = res.body;
                                if (data.code === 0 && data.msg === "成功") {
                                    this.$message({
                                        type: 'success',
                                        message: `更新圈子成功`
                                    });
                                    //前端更圈子数据
                                    this.circleList.forEach((circle, index) => {
                                        if (circle.id === currentCircle.id) {
                                            this.circleList.splice(index, 1, currentCircle);
                                        }
                                    });
                                } else {
                                    this.$message({
                                        type: 'error',
                                        message: `更新圈子失败:${data.msg}`
                                    });
                                }
                            }
                        } else {
                            this.$message({
                                type: "error",
                                message: "更新圈子失败"
                            })
                        }
                        this.handleEditClose();
                    },
                    (res) => {
//                        console.error(res);
                        let message = "";
                        if (res.error) {
                            switch (res.error) {
                                case 'invalid_token':
                                    message = "无效的token";
                                    break;
                            }
                        }
                        this.$message({
                            type: 'error',
                            message: `更新圈子失败${message}`,
                            onClose: () => {

                            }
                        });
                        this.handleEditClose();
                    }
                )
            },
            editCircle(id, circle) {
                this.editModalVisible = true;
                this.circleId = id;
                this.currentCircle = JSON.parse(JSON.stringify(circle));
            },
            deleteCircle(id, index) {
                if (id) {
                    this.$confirm(`确定删除圈子?`, "删除圈子", {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(
                        () => {
                            this.$http({
                                url: API(`/circle/${id}`),
                                method: "delete"
                            }).then(
                                (res) => {
                                    if (res.ok && res.status === 200) {
                                        let data = res.body;
                                        if (data.code === 0 && data.msg === "成功") {
                                            this.$message({
                                                type: "success",
                                                message: `删除成功圈子`
                                            });
                                            this.circleList.splice(index, 1);
                                        } else {
                                            let message = `删除圈子失败`;
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
                                    let message = `删除圈子失败`;
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
                            );
                        }
                    ).catch(
                        () => {

                        }
                    );
                } else {
                    this.$message({
                        type: 'error',
                        message: '获取要删除的圈子ID失败'
                    })
                }
            },
            //添加一个圈子
            addItem() {
                this.newModalVisible = true;
            },
            submitNew() {
                if (!this.newCircle.name.trim()) {
                    this.$message({
                        type: "error",
                        message: "圈子名称不能为空"
                    });
                    this.newCircle.name = null;
                    return;
                }
                this.submitButtonLoading = true;
                let upload = this.$refs.newUpload;
                let uploadFiles = upload.uploadFiles;
                //获取上传的文件
                if (uploadFiles && uploadFiles.length !== 0) {
                    //上传图片,然后更新圈子
                    upload.submit();
                } else {
                    //直接更新圈子
                    this.handleNewUpdate(this.newCircle);
                }
            },
            //关闭添加圈子模态框
            handleNewClose() {
                this.newModalVisible = false;
                this.submitButtonLoading = false;
                this.newCircle = {
                    createUserId: "",
                    introduce: "",
                    name: "",
                    url: ""
                };
                //清除上传队列
                this.$refs.newUpload.clearFiles();
            },
            //上传队列变更
            handleNewChange(file, fileList) {
                if (fileList.length === 2) {
                    fileList.shift();
                }
            },
            //上传成功
            handleNewSuccess(res, file, fileList) {
                if (res.code === 0 && res.msg === '成功') {
                    if (res.data) {
                        this.newCircle.url = res.data;
                    }
                    this.handleNewUpdate(this.newCircle);
                }
            },
            //处理添加圈子逻辑
            handleNewUpdate(newCircle) {
                //向后台提交添加请求
                //通过数据总线向header组件获取用户信息
                window.Bus.$emit('getUserInformation', this);
                newCircle.createUserId = this.userInformation.id;
                //获取把新增圈子顶置的sort1字段值,新圈子sort1字段为新值
                if (this.circleList && this.circleList.length !== 0) {
                    newCircle.sort1 = this.circleList[0].sort1;
                }
                this.$http({
                    url: API("/circle"),
                    method: "post",
                    body: newCircle
                }).then(
                    (res) => {
                        if (res.ok && res.status === 200) {
                            if (res.body) {
                                let data = res.body;
                                if (data.code === 0 && data.msg === "成功") {
                                    this.$message({
                                        type: "success",
                                        message: "添加圈子成功"
                                    });
                                    this.fetchCirclesList("newCircle");
                                } else {
                                    this.$message({
                                        type: "error",
                                        message: data.msg
                                    })
                                }
                            } else {
                                this.$message({
                                    type: "error",
                                    message: "请求错误,添加圈子失败"
                                })
                            }
                        } else {
                            this.$message({
                                type: "error",
                                message: "添加圈子失败"
                            })
                        }
                        this.handleNewClose();
                    },
                    (res) => {
                        this.$message({
                            type: "error",
                            message: "添加圈子失败"
                        });
                        this.handleNewClose();
                    }
                )
            }

        },
        components: {
            "circle-item": circleItem,
            "filter-component": filterComponent
        }
    }
</script>

<style lang="scss" scoped>
    @import "common/style/main";

    .main {
        .circle-container {
            flex-grow: 1;
            overflow: auto;
            .circle-wrapper {
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
                justify-content: flex-start;
                align-content: flex-start;
                align-items: center;
            }
        }
    }
</style>