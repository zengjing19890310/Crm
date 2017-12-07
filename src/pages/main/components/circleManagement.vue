<template>
    <!--圈子管理-->
    <div class="outer-container">
        <section class="main">
            <filter-component :data-count="dataTotal" filter-name="circleManagement"
                              @add-item="addItem"></filter-component>
            <div class="circle-container">
                <circle-item v-for="(circle,index) in circleList"
                             :index="index"
                             :key="circle.id"
                             :circle-data.once="circle"
                             ref="circleItem"
                             @edit-circle="editCircle"
                             @delete-circle="deleteCircle"></circle-item>
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
                    url: ""
                },
                //按钮loading控制
                submitButtonLoading: false,

                //用户信息获取
                userInformation: {}
            }
        },
        computed: {
            dataTotal() {
                return this.circleList ? this.circleList.length : 0;
            }
        },
        mounted() {
            this.getData();
        },
        methods: {
            //获取圈子列表
            getData() {
                this.$http({
                    url: API(`/circle?page=${this.page}&size=${this.size}`),
                    method: 'get'
                }).then(
                    (res) => {
                        let response = res.data;
                        if (response.code === 0 && response.msg === "成功") {
                            if (response.data) {
                                this.circleList = response.data.list;
                                this.dataTotal = this.circleList.length;
                            }
                        } else {
                            this.$message({
                                type: 'error',
                                message: response.msg
                            })
                        }
                    },
                    (res) => {
//                        let response = res.data;
                        this.$message({
                            type: 'error',
                            message: '请求异常!'
                        })
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
                if (!this.currentCircle.name) {
                    this.$message({
                        type: "error",
                        message: "圈子名称不能为空"
                    });
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
                    params: currentCircle
                }).then(
                    (res) => {
                        if (res.ok && res.status === 200) {
                            //更新页面圈子的信息
                            if (res.body) {
                                let data = res.body;
                                if (data.code === 0 && data.msg === "成功") {
                                    this.$message({
                                        type: 'success',
                                        message: `成功更新圈子:${currentCircle.id}`
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
                                        message: `更新圈子失败:${currentCircle.id}`
                                    });
                                }
                            }
                            this.handleEditClose();
                        }
                    },
                    (res) => {
//                        console.error(res);
                        let message = currentCircle.id;
                        if (res.error) {
                            switch (res.error) {
                                case 'invalid_token':
                                    message = "无效的token";
                                    break;
                            }
                        }
                        this.$message({
                            type: 'error',
                            message: `更新圈子失败:${message}`,
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
                    this.$confirm(`确定删除圈子${id}?`, "删除圈子", {
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
                                                message: `成功删除圈子:${id}`
                                            });
                                            this.circleList.splice(index, 1);
                                        } else {
                                            let message = `删除圈子:${id}失败`;
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
                                    let message = `删除圈子:${id}失败`;
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
                if (!this.newCircle.name) {
                    this.$message({
                        type: "error",
                        message: "圈子名称不能为空"
                    });
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
//                console.log(this.userInformation);
                newCircle.createUserId = this.userInformation.id;
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
                                    this.getData();
                                } else {
                                    this.$message({
                                        type: "error",
                                        message: data.msg
                                    })
                                }
                            } else {
                                this.$message({
                                    type: "error",
                                    message: "返回内容错误"
                                })
                            }
                        } else {
                            this.$message({
                                type: "error",
                                message: "添加圈子失败"
                            })
                        }
                    },
                    (res) => {
                        this.$message({
                            type: "error",
                            message: "添加圈子失败"
                        })
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
        .circle-container {
            flex-grow: 1;
            overflow: auto;
            /*border: 1px solid blue;*/
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: flex-start;
            align-content: flex-start;
            align-items: center;
        }
    }
</style>