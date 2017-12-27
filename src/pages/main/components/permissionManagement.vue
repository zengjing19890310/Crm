<template>
    <div class="outer-container">
        <!---->
        <section class="main" v-loading="getDataLock" element-loading-text="加载中...">
            <filter-component
                    :data-count="dataTotal"
                    @add-item="addItem"
                    @search-keyword="searchKeyword"
                    filter-type="onlyCount"
                    @batch-remove="batchRemove"
                    route-name="permissionManagement"></filter-component>
            <div class="permission-wrapper">
                <div class="tree-wrapper">
                    <el-tree
                            :data="treeMenu"
                            ref="treeMenu"
                            show-checkbox
                            node-key="id"
                            :highlight-current="true"
                            :expand-on-click-node="false"
                            @current-change="handleNodeChange"
                            @check-change="handleTreeCheckedChange">
                    </el-tree>
                </div>
                <div class="table-wrapper" v-loading="resourceLock" element-loading-text="加载中..." ref="tableWrapper">
                    <el-table
                            ref="resourceList"
                            :data="resourceList"
                            style="font-size: 12px;"
                            :height="tableHeight"
                            @selection-change="handleSelectionChange">
                        <el-table-column
                                type="selection"
                                width="55">
                        </el-table-column>
                        <el-table-column label="资源名称" prop="buttonName">

                        </el-table-column>
                        <el-table-column label="资源类型">
                            <template slot-scope="scope">
                                按钮
                            </template>
                        </el-table-column>
                        <el-table-column label="请求方式" prop="method">

                        </el-table-column>
                        <el-table-column label="URL" prop="url">

                        </el-table-column>
                        <el-table-column label="备注" prop="remark">

                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
    import filterComponent from "./common/filterComponent.vue";

    import util from "../../../common/util";

    export default {
        components: {
            "filter-component": filterComponent
        },
        data() {
            return {
                //获取数据锁
                getDataLock: false,
                //载入资源锁
                resourceLock: false,
                //左侧树型菜单列表
                treeMenu: [],
                //选中的菜单节点
                checkedTreeMenu: [],
                //根据左侧菜单树选择获取右侧
                resourceList: [],
                //树型菜单列表,勾选节点ID
                treeCheckedIds: [],
                //根据左侧树型菜单,勾选子级按钮ID
//                例子:{
//                    父级菜单ID:[子级按钮1ID,子级按钮2ID....]
//                }
                resourceCheckedIds: {},
                //记录当前数据总数
                dataTotal: 0
            }
        },
        created() {
            this.fetchMenuTree();
        },
        mounted() {
            let tableWrapper = this.$refs.tableWrapper;
            this.tableHeight = tableWrapper.clientHeight;
        },
        methods: {
            fetchMenuTree() {
                this.$http({
                    url: API("/menu/tree"),
                    method: "get"
                }).then(
                    (res) => {
                        let response = res.body;
                        if (response && response.code === 0 && response.msg === "成功") {
                            //通过一个递归的方法,将treeMenu调整为可用的状态
                            let treeMenu = [];
                            util.initTree(response.data, treeMenu);
                            this.treeMenu = treeMenu;
                        }
                    },
                    (res) => {

                    }
                );
            },
            //将获取的按钮资源状态进行恢复
            setResourceCheckedStatus() {
                let menuId = this.$refs.treeMenu.getCurrentKey(),
                    checkedResource = this.resourceCheckedIds[menuId];
                if (checkedResource && checkedResource.length !== 0) {
                    _.forEach(this.resourceList, (value, index) => {
                        if (checkedResource.indexOf(value.id) !== -1) {
                            this.$nextTick(() => {
                                this.$refs.resourceList.toggleRowSelection(value);
                            });
                        }
                    });
                }
            },
            //左侧菜单树变更节点
            handleNodeChange(node) {
                this.fetchResourceData(node.id);
            },
            //获取右侧按钮资源列表
            fetchResourceData(nodeId) {
                this.resourceLock = true;
                this.$http({
                    url: API(`/button/list/${nodeId}`),
                    method: "get"
                }).then(
                    (res) => {
                        let response = res.body;
                        if (response && response.code === 0 && response.msg === "成功") {
                            this.resourceList = response.data;
                            this.dataTotal = this.resourceList.length;
//                            this.setResourceCheckedStatus();

                        }
                        this.resourceLock = false;
                    },
                    (res) => {
                        this.$message({
                            type: "error",
                            message: "获取菜单资源出错"
                        });
                        this.resourceLock = false;
                    }
                )
            },
            //左侧菜单树勾选状态变更
            handleTreeCheckedChange() {
                //获取当前被勾选中的菜单树
                this.treeCheckedIds = this.$refs.treeMenu.getCheckedKeys();
            },
            //添加一个项目
            addItem() {

            },
            //关键字查找
            searchKeyword() {

            },
            //批量删除
            batchRemove() {

            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "common/style/main";

    .main {
        .permission-wrapper {
            flex-grow: 1;
            display: flex;
            align-items: stretch;
            .tree-wrapper {
                padding: 0.5rem;
                min-width: 150px;
                /*border: 1px solid red;*/
            }
            .table-wrapper {
                margin-left: 0.5rem;
                overflow: auto;
                flex-grow: 1;
                /*border: 1px solid red;*/
            }
        }
    }
</style>