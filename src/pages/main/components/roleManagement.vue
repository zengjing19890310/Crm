<template>
    <div class="outer-container">
        <!--<h4>角色管理</h4>-->
        <section class="main" v-loading="getDataLock" element-loading-text="加载中...">
            <filter-component :data-count="dataTotal"
                              @add-item="addItem"
                              @search-keyword="searchKeyword"
                              filter-type="noSelect"
                              @batch-remove="batchRemove"
                              route-name="roleManagement"></filter-component>
            <div class="role-table" id="role-table">
                <el-table
                        ref="rolesList"
                        :data="rolesList"
                        style="width: 100%;font-size: 12px;"
                        :height="tableHeight"
                        @select="handleSelect"
                        @select-all="handleSelectAll">
                    <el-table-column
                            type="selection"
                            width="60"
                            align="center">
                        <!--prop="checkStatus"-->
                        <!--label="选择"-->
                        <!--<template slot-scope="scope">-->
                        <!--<el-checkbox v-model="scope.row.checkStatus"></el-checkbox>-->
                        <!--</template>-->
                    </el-table-column>
                    <el-table-column
                            type="index"
                            label="序号"
                            width="60">
                    </el-table-column>
                    <el-table-column
                            prop="roleName"
                            label="角色名"
                            width="80">
                    </el-table-column>
                    <!--prop="permissions"-->
                    <el-table-column
                            prop="resources"
                            label="权限"
                            width="500">
                        <template slot-scope="scope">
                            <el-tag v-if="index<3" v-for="(resource,index) in scope.row.resources" size="mini"
                                    style="margin: 0.2rem;">
                                <!--菜单-->
                                <span v-if="resource.type===0">
                                    {{resource.menuName || "-"}}
                                </span>
                                <span v-if="resource.type===1">
                                    {{resource.menuName + ">" + resource.buttonName || "-"}}
                                </span>
                            </el-tag>
                            <el-popover placement="top"
                                        title=""
                                        width="200"
                                        trigger="click" v-if="scope.row.resources.length>3">
                                <div style="font-size: 12px;">
                                    <span v-for="(resource,index) in scope.row.resources">
                                        <span v-if="index!==scope.row.resources.length-1">
                                            <span v-if="resource.type===0">
                                                {{resource.menuName || "-"}}
                                            </span>
                                            <span v-if="resource.type===1">
                                                {{resource.menuName + ">" + resource.buttonName || "-"}}
                                            </span>
                                            ,
                                        </span>
                                        <span v-else>
                                            <span v-if="resource.type===0">
                                                {{resource.menuName || "-"}}
                                            </span>
                                            <span v-if="resource.type===1">
                                                {{resource.menuName + ">" + resource.buttonName || "-"}}
                                            </span>
                                        </span>
                                    </span>
                                </div>
                                <span class="el-icon-more" slot="reference"
                                      style="background-color:rgb(48, 54, 65);color:#fff;padding:4px 10px;">
                                </span>
                            </el-popover>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="操作">
                        <template slot-scope="scope">
                            <el-dropdown trigger="click">
                                <span class="el-dropdown-link el-icon-more"
                                      style="background-color:rgb(48, 54, 65);color:#fff;padding:4px 10px; -webkit-border-radius: 2px;-moz-border-radius: 2px;border-radius: 2px;">

                                </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item style="font-size: 12px;"
                                                      @click.native="deleteRole(scope.row.id,scope.$index)">
                                        <i class="el-icon-delete"
                                           style="color:#FA5555"></i> 删除角色
                                    </el-dropdown-item>
                                    <el-dropdown-item style="font-size: 12px;" @click.native="editRole(scope.row)">
                                        <i class="el-icon-edit"
                                           style="color:#409EFF"></i> 修改赋权
                                    </el-dropdown-item>
                                    <!--<el-dropdown-item style="font-size: 12px;background-color: #ddd">-->
                                    <!--<i class="el-icon-warning"-->
                                    <!--style="color:#666"></i> 角色赋权-->
                                    <!--</el-dropdown-item>-->
                                </el-dropdown-menu>
                            </el-dropdown>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </section>
        <div @click.stop>
            <el-dialog
                    :visible.sync="modalVisible"
                    :before-close="handelClose"
                    :close-on-click-modal="false"
                    :close-on-press-escape="true"
                    width="80%">
                <div slot="title">
                    <h4>{{modalType}}角色</h4>
                </div>
                <div class="form-wrapper" @click.stop>
                    <el-form ref="roleForm" :model="role" label-width="80px" size="small" :rules="rules">
                        <el-form-item label="角色名" prop="roleName">
                            <el-input v-model="role.roleName"></el-input>
                        </el-form-item>
                    </el-form>
                    <div class="dialog-resource-container">
                        <div class="label">
                            权限
                        </div>
                        <div class="resource-wrapper">
                            <div class="tree-wrapper">
                                <!--@node-click="handleNodeClick"-->
                                <!--@check-change="handleTreeCheckedChange"-->
                                <!--:show-checkbox="false"-->
                                <el-tree
                                        :data="treeMenu"
                                        ref="treeMenu"
                                        node-key="id"
                                        :highlight-current="true"
                                        :expand-on-click-node="false"
                                        @current-change="handleNodeChange">
                                </el-tree>
                            </div>
                            <div class="table-wrapper" v-loading="resourceLock" element-loading-text="加载中...">
                                <el-table ref="resourceList"
                                          :data="resourceList"
                                          size="small"
                                          height="360"
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
                    </div>
                </div>
                <footer slot="footer">
                    <el-button type="primary" size="small" @click="submitForm">确定</el-button>
                    <el-button size="small" @click="cancel">取消</el-button>
                </footer>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import filterComponent from "./common/filterComponent.vue";

    import util from "../../../common/util";

    let calcTableLimit = (height, cellHeight) => {
        return Math.floor(height / cellHeight - 1);
    };

    require('intro.js/introjs.css');
    let introJs = require('intro.js/intro').introJs;

    export default {
        data() {
            let notNull = (rule, value, callback) => {
                if (!value || !value.trim()) {
                    callback(new Error('输入不能为空'));
                } else {
                    callback();
                }
            };
            return {
                //角色列表
                rolesList: [],
                size: 20,
                page: 1,
                dataTotal: 0,
                getDataLock: false,
                inSubmit: false,
                modalVisible: false,

                keyword: '',

                tableHeight: 100,
                modalType: "",
                role: {
                    roleName: ""
                },
                rules: {
                    roleName: [
                        {validator: notNull, trigger: "blur"}
                    ]
                },

                //勾选的角色列表信息
                checkedRolesList: [],

                submitType: "",

                //树型列表(菜单树)
                treeMenu: [],

                //选中的菜单节点
                checkedTreeMenu: [],

                //请求资源列表,请求锁
                resourceLock: false,
                //根据左侧菜单树选择获取右侧
                resourceList: [],

                //树型菜单列表,勾选节点ID
                treeCheckedIds: [],
                //根据左侧树型菜单,勾选子级按钮ID
//                例子:{
//                    父级菜单ID:[子级按钮1ID,子级按钮2ID....]
//                }
                resourceCheckedIds: {}
            }
        },
        methods: {
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
            handleSelectionChange(selection) {
                let menuId = this.$refs.treeMenu.getCurrentKey(),
                    resourceCheckedIds = JSON.parse(JSON.stringify(this.resourceCheckedIds));
                if (!resourceCheckedIds[menuId]) {
                    resourceCheckedIds[menuId] = [];
                }
                let ids = [];
                if (selection && selection.length !== 0) {
                    _.forEach(selection, (value, index) => {
                        ids.push(value.id);
                    });
                }
                resourceCheckedIds[menuId] = ids;
                this.resourceCheckedIds = resourceCheckedIds;
            },
            handleTreeCheckedChange() {
                //获取当前被勾选中的菜单树
                this.treeCheckedIds = this.$refs.treeMenu.getCheckedKeys();
            },
            handleNodeChange(node) {
                this.fetchResourceData(node.id);
            },
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
                            this.setResourceCheckedStatus();
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
            fetchMenuTree() {
                this.$http({
                    url: API("/menu/tree"),
                    method: "get"
                }).then(
                    (res) => {
                        let response = res.body;
                        if (response && response.code === 0 && response.msg === "成功") {
                            //通过一个递归的方法,将treeMenu调整为可用的状态
                            let treeMenu = [],
                                _this = this;
                            util.initTree(response.data, treeMenu);
                            this.treeMenu = treeMenu;
                        }
                    },
                    (res) => {

                    }
                );
            },
            editRole(role) {
                this.modalType = "编辑";
                this.role = JSON.parse(JSON.stringify(role));
                this.modalVisible = true;
                this.submitType = "post";

                let resources = role.resources,
                    resourceCheckedIds = {},
                    treeCheckedIds = [];
                if (resources && resources.length !== 0) {
                    let menuId, buttonId;
                    _.forEach(resources, (value, key) => {
                        menuId = value.menuId;
                        buttonId = value.buttonId;
                        if (menuId) {
                            if (!resourceCheckedIds[menuId]) {
                                resourceCheckedIds[menuId] = [];
                            }
                            if (buttonId && buttonId !== -1) {
                                resourceCheckedIds[menuId].push(buttonId);
                            } else {
                                //如果buttonId为-1,表示单独选中树中的菜单
                                treeCheckedIds.push(menuId);
                            }
                        }
                    });
                    //编辑一个角色时,首先要从role对象中获取之前的设置状态
                    this.resourceCheckedIds = resourceCheckedIds;

                    if (treeCheckedIds && treeCheckedIds.length !== 0) {
                        this.treeCheckedIds = treeCheckedIds;
                    }
                }
            },
            cancel() {
                this.handelClose();
            },
            handelClose() {
                this.checkedTreeMenu = [];
                this.resourceList = [];
                this.treeCheckedIds = [];
                this.resourceCheckedIds = {};
                this.role = {
                    roleName: ""
                };
                this.modalType = "";
                this.submitType = "";
                //表单取消效验结果
                this.$refs.roleForm.clearValidate();
                //树型列表取消选择
//                this.$refs.treeMenu.setCheckedNodes([]);
//                this.$refs.treeMenu.setCurrentNode({});
                //表格取消选择
                this.$refs.resourceList.clearSelection();
                this.modalVisible = false;
            },
            submitForm() {
                this.$refs.roleForm.validate((result) => {
                    if (result) {
                        let resources = [];
                        if (this.resourceCheckedIds) {
                            let roleId = this.role.id;
                            _.forEach(this.resourceCheckedIds, (buttonIds, menuId) => {
                                if (buttonIds && buttonIds.length !== 0) {
                                    let mid = parseInt(menuId);
                                    if (mid) {
                                        resources.push({
                                            type: 0,
                                            buttonId: -1,
                                            roleId: roleId,
                                            menuId: mid
                                        })
                                    }
                                    _.forEach(buttonIds, (buttonId, index) => {
                                        resources.push({
                                            type: 1,
                                            buttonId: buttonId,
                                            roleId: roleId,
                                            menuId: mid
                                        });
                                    })
                                }
                            });
                        }
                        this.role.list = resources;
                        this.$http({
                            url: API("/role/resource"),
                            method: this.submitType,
                            body: this.role
                        }).then(
                            (res) => {
                                let response = res.body;
                                if (response && response.code === 0 && response.msg === "成功") {
                                    this.$message({
                                        type: "success",
                                        message: `${this.modalType}成功`
                                    });
                                    this.modalType = "";
                                    this.fetchRolesList();
                                    this.modalVisible = false;
                                    this.handelClose();
                                } else {
                                    this.$message({
                                        type: "error",
                                        message: `${this.modalType}失败,${response.msg}`
                                    });
                                }
                            },
                            (res) => {
                                this.$message({
                                    type: "error",
                                    message: `${this.modalType}失败`
                                });
                            }
                        )
                    } else {
                        this.$message({
                            type: "error",
                            message: "请正确填写"
                        })
                    }
                });
            },
            handleSelect(val) {
                this.checkedRolesList = val;
//                console.log(val);
            },
            handleSelectAll(val) {
                this.checkedRolesList = val;
//                console.log(val);
            },
            addItem() {
                this.modalType = "新增";
                this.modalVisible = true;
                this.submitType = "post";
            },
            deleteRole(id, index) {
                this.$confirm("是否删除该角色?", "警告", {
                    confirmButtonText: '删除',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(
                    () => {
                        let checked = [];
                        if (id) {
                            checked.push(id);
                        } else {
                            this.$message({
                                type: "error",
                                message: "获取角色ID失败"
                            });
                            return;
                        }
                        this.$http({
                            url: API("/role"),
                            method: "delete",
                            body: JSON.stringify(checked)
                        }).then(
                            (res) => {
                                let response = res.body;
                                if (response && response.code === 0 && response.msg === "成功") {
                                    this.$message({
                                        type: "success",
                                        message: "删除角色成功"
                                    });
                                    this.rolesList.splice(index, 1);
                                    this.$refs.rolesList.clearSelection();
                                    this.fetchRolesList();
                                } else {
                                    this.$message({
                                        type: "error",
                                        message: "删除角色失败"
                                    })
                                }
                            },
                            (res) => {
                                this.$message({
                                    type: "error",
                                    message: "删除角色失败"
                                })
                            }
                        )
                    }
                ).catch(

                )
            },
            batchRemove() {
                if (this.checkedRolesList && this.checkedRolesList.length !== 0) {
                    this.$confirm("是否批量删除角色?", "警告", {
                        confirmButtonText: '删除',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(
                        () => {
                            let checked = [];
                            if (this.checkedRolesList && this.checkedRolesList.length !== 0) {
                                _.forEach(this.checkedRolesList, (value, index) => {
                                    if (checked.indexOf(value.id) === -1) {
                                        checked.push(value.id);
                                    }
                                });
                            }
                            this.$http({
                                url: API(`/role`),
                                method: "delete",
                                body: JSON.stringify(checked)
                            }).then(
                                (res) => {
                                    let response = res.body;
                                    if (response && response.code === 0 && response.msg === "成功") {
                                        this.$message({
                                            type: "success",
                                            message: "批量删除成功"
                                        });
                                        checked = [];
                                        this.checkedRolesList = [];
                                        this.$refs.rolesList.clearSelection();
                                        this.fetchRolesList();
                                    } else {
                                        this.$message({
                                            type: "error",
                                            message: "批量删除失败"
                                        })
                                    }
                                },
                                (res) => {
                                    this.$message({
                                        type: "error",
                                        message: "批量删除失败"
                                    })
                                }
                            )
                        }
                    )
                }
            },
            searchKeyword(keyword, moduleName) {
                this.keyword = keyword;
                //翻回第一页
                this.page = 1;
                this.fetchRolesList();
            },
            fetchRolesList(type) {
                this.getDataLock = true;
                let url, method,
                    key = this.keyword,
                    size = this.size,
                    page = this.page;

                if (type === "newRole") {
                    //插入1条新圈子数据,位置处于顶置
                    page = 1;
                    size = this.userList.length + 1;
                } else if (type === "more") {
                    //获取更多条数据
                    this.page++;
                    page = this.page;
                } else if (!type) {
                    page = 1;
                }

                url = API("/role/list");
                method = "get";

                this.$http({
                    url: url,
                    method: method,
                    params: {
//                        page: page,
//                        size: size,
                        name: key
                    }
                }).then(
                    (res) => {
                        let response = res.body;
                        if (response && response.code === 0 && response.msg === "成功") {
                            let list = response.data;
                            this.dataTotal = list.length;
                            if (!type || type === "newRole") {
                                this.rolesList = list;
                            } else if (type === "more") {
                                if (this.page <= data.lastPage) {
                                    this.rolesList = this.rolesList.concat(list);
                                } else {
                                    this.$message({
                                        type: "warning",
                                        message: "没有更多数据了"
                                    });
                                    this.page--;
                                }
                            }
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
            }
        },
        components: {
            'filter-component': filterComponent
        },
        created() {
            this.fetchRolesList();
            this.fetchMenuTree();
        },
        mounted() {
            const TRHEIGHT = 50;//通过行高动态计算首屏的数据条数最小数，直接顶出滚动条
            //页面介绍功能
//            let roleTable = document.getElementById('role-table'),
//                roleTableThTr = roleTable.querySelector('thead tr'),
//                roleManagementHeader = document.getElementById('roleManagementHeader');
//            this.tableHeight = roleTable.clientHeight;
//
//            let introStatus;
//
//            localStorage.getItem('intro')?
//                introStatus=JSON.parse(localStorage.getItem('intro')) :
//                introStatus={};
//
//            //从本地判断是否经过页面介绍
//            if(!introStatus.roleManagement){
//                //手动向元素添加属性
//                roleManagementHeader.setAttribute('data-step','1');
//                roleManagementHeader.setAttribute('data-intro','这是头部筛选');
//                roleManagementHeader.setAttribute('data-position','top');
//
//                roleTable.setAttribute('data-step','2');
//                roleTable.setAttribute('data-intro','这是一个表格');
//                roleTable.setAttribute('data-position','top');
//
//                roleTableThTr.setAttribute('data-step','3');
//                roleTableThTr.setAttribute('data-intro','这是一个表头');
//                roleTableThTr.setAttribute('data-position','top');
//
//                let intro = introJs();
//                intro.setOptions({
//                    nextLabel:'下一步',
//                    prevLabel:'上一步',
//                    skipLabel:'跳过',
//                    doneLabel:'我知道了'
//                });
//                intro.start();
//                introStatus.roleManagement = true;
//                localStorage.setItem('intro',JSON.stringify(introStatus));
//            }

            let roleTable = document.getElementById('role-table'),
                scrollView = document.getElementsByClassName('el-table__body-wrapper')[0],
                scrollTable = document.querySelector('.el-table__body-wrapper table'),
                _this = this;
            this.tableHeight = roleTable.clientHeight;

            let handler = function (e) {
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
                //如果滚动条抵达底部附近
                if (scrollTable.clientHeight <= scrollView.clientHeight + scrollView.scrollTop) {
                    _this.fetchRolesList("more");
                }
            };
            //首次加载数据后，内表高度如果小于视窗高度，则不出现滚动条
            //首次加载数据后，内表高度如果小于视窗高度，则不出现滚动条
            /*IE注册事件*/
            if (scrollView.attachEvent) {
//                scrollView.attachEvent('onmousewheel', handler);
            }
            /*Firefox注册事件*/
            if (scrollView.addEventListener) {
//                scrollView.addEventListener('DOMMouseScroll', handler, false);
//                scrollView.addEventListener('scroll', handler);
            }
//            scrollView.addEventListener('wheel', handler);
//            scrollView.addEventListener('scroll', handler);
        }
    }
</script>

<style lang="scss" scoped>
    @import "common/style/main";

    .main {
        .role-table {
            position: absolute;
            top: 4rem;
            left: 0;
            right: 0;
            bottom: 0;
            overflow: hidden;
            margin: 0 1rem 1rem 1rem;
            table {
                background-color: #ddd;
                font-size: 14px;
                thead {
                    tr {
                        height: 40px;
                    }
                }
                th, td {
                    vertical-align: middle;
                }
            }
        }
    }

    .dialog-resource-container {
        display: flex;
        .label {
            box-sizing: border-box;
            flex-grow: 0;
            flex-shrink: 0;
            text-align: right;
            line-height: 2rem;
            padding-right: 12px;
            width: 80px;
        }
        .resource-wrapper {
            height: 360px;
            display: flex;
            align-items: stretch;
            max-width: 100%;
            overflow: auto;
            box-sizing: border-box;
            flex-grow: 1;
            .tree-wrapper {
                padding: 0.5rem;
                min-width: 150px;
            }
            .table-wrapper {
                margin-left: 0.5rem;
                overflow: auto;
                flex-grow: 1;
            }
        }
    }
</style>