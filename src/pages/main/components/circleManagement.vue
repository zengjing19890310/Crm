<template>
    <!--圈子管理-->
    <div class="outer-container">
        <section class="main">
            <filter-component :data-count="dataTotal"></filter-component>
            <div class="circle-container">
                <circle-item v-for="circle in circleList"
                             :key="circle.id"
                             :circle-data="circle" ref="circleItem" @upload-circle="uploadCircle"></circle-item>
            </div>
        </section>
        <div @click.stop>
            <el-dialog
                    :visible.sync="uploadItemImageVisible"
                    :before-close="handleClose"
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
                                ref="upload"
                                :action="uploadUrl"

                                :show-file-list="true"
                                :multiple="false"
                                :auto-upload="false"

                                :on-success="handleSuccess"
                                :on-change="handleChange"
                                style="text-align: center"
                                accept="image/*">
                            <el-button slot="trigger" style="min-width: 200px;" type="primary">更改圈子图片</el-button>
                        </el-upload>
                    </div>
                </div>
                <!--footer	Dialog 按钮操作区的内容-->
                <div slot="footer">
                    <el-button type="primary" @click="submitUpdate" :loading="false">提交</el-button>
                    <el-button @click="handleClose">取消</el-button>
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
                dataTotal: 0,
                circleList: [],
                //分页每页加载数量
                size: 20,
                //当前页
                page: 1,
                uploadItemImageVisible: false,
                uploadUrl: API('/file/upload'),
                circleId: null,
                currentCircle: {
                    id: null,
                    name: null,
                    url: null
                },
            }
        },
        mounted() {
            this.getData();
        },
        methods: {
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
                        }
                    },
                    (res) => {

                    }
                );
            },
            //处理模态框处理
            handleClose() {
                this.uploadItemImageVisible = false;
                this.currentCircle = {
                    id: null,
                    name: null,
                    url: null
                }
            },
            //点击上传按钮时,清空队列
            submitUpdate() {
                console.log('提交修改');
                //获取上传的文件
                console.log(this.$refs.upload.uploadFiles);
            },
            handleChange(file, fileList) {
                if (fileList.length === 2) {
                    fileList.shift();
                }
            },

            handleSuccess(res, file) {
                console.log('上传成功', res, file);
//                this.uploadItemImageVisible = false;
                if (res.code === 0 && res.msg === '成功') {
                    //遍历圈子列表,获取更多的
                    if (this.circleList && this.circleList.length !== 0) {
                        this.circleList.forEach((circle, index) => {
                            if (circle.id === this.circleId) {
                                console.log(circle, this.circleId);

                                let obj = {
                                    id: circle.id,
                                    url: res.data
                                };

                                //向后台提交更新
                                this.$http({
                                    url: API("/circle"),
                                    method: 'put',
                                    params: obj
                                }).then(
                                    (res) => {
                                        if (res.ok && res.status === 200) {
                                            //更新页面圈子的信息
                                            if (res.body) {
                                                let data = res.body;
                                                if (data.code === 0 && data.msg === "成功") {

                                                    this.$message({
                                                        type: 'success',
                                                        message: `成功更新圈子:${circle.id}`
                                                    });
                                                    circle.url = obj.url;
                                                }
                                            }
                                        }
                                    },
                                    (res) => {
                                        console.error(res);
                                    }
                                )
                            }
                        });
                    }
                }
            },
            uploadCircle(id, circle) {
                console.log('选中圈子', id, circle);
                this.uploadItemImageVisible = true;
                this.circleId = id;
                this.currentCircle = circle;
            },
            newCircle() {
                let obj = {
                    "createUserId": "曾竞",
                    "id": 0,
                    "introduce": "这是一段手动写的介绍",
                    "name": "",
                    "sort1": 0,
                    "sort2": 0,
                    "url": ""
                };
                this.$prompt('请输入圈子名称', '圈子信息', {
                    confirmButtonText: '添加圈子',
                    cancelButtonText: '取消',
                    inputPlaceholder: '请输入圈子名称',
                    inputErrorMessage: '圈子名称不能为空',
                    inputValidator: function (value) {
                        if (!value) {
                            return false;
                        }
                    }
                })
                    .then((data) => {
                        obj.name = data.value;
                        this.$http.post(API('/circle'), obj)
                            .then(
                                (res) => {
                                    console.log(res);
                                },
                                (res) => {
                                    console.error(res);
                                }
                            )
                    })
                    .catch(() => {

                    });
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