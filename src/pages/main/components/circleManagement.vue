<template>
    <!--圈子管理-->
    <div class="outer-container">
        <section class="main">
            <filter-component :data-count="dataTotal"></filter-component>
            <div class="circle-container">
                <circle-item v-for="circle in circleList"
                             :key="circle.id"
                             :circle-data="circle" ref="circleItem" @upload-item-image="uploadItemImage"></circle-item>
            </div>
        </section>
        <div @click.stop>
            <el-dialog
                    title="点击上传图片"
                    :visible.sync="uploadItemImageVisible"
                    width="30%">
                <el-upload
                        :action="uploadUrl"
                        :before-upload="beforeUpload"
                        :on-success="handleSuccess"
                        :show-file-list="false"
                        style="text-align: center"
                        accept="image/*">
                    <el-button type="primary" style="min-width: 200px;">选择文件</el-button>
                </el-upload>
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
            }
        },
        mounted() {
            this.getData();
        },
        methods: {
            getData() {
                this.$http.get(API(`/circle?page=${this.page}&size=${this.size}`)).then(
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
            beforeUpload(file) {
//                console.log('上传前', file);
            },
            handleSuccess(res, file) {
                console.log('上传成功', res, file);
                this.uploadItemImageVisible = false;
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
            uploadItemImage(id) {
//                console.log('上传圈子图片', id);
                this.uploadItemImageVisible = true;
                this.circleId = id;
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

    .el-upload.el-upload--text {
        width: 100%;
    }
</style>