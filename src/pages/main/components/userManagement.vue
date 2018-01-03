<template>
    <div class="outer-container">
        <!--<h4>用户管理</h4>-->
        <section class="main" v-loading="getDataLock" element-loading-text="加载中...">
            <filter-component :data-count="dataTotal" @add-item="addItem"
                              @search-keyword="searchKeyword" filter-type="noSelect" @batch-remove="batchRemove"
                              route-name="userManagement"></filter-component>
            <div class="list-table" id="list-table">
                <el-table
                        ref="userList"
                        :data="userList"
                        style="width: 100%;font-size: 12px;"
                        :height="tableHeight"
                        @select="handleSelect"
                        @select-all="handleSelectAll">
                    <!--prop="checkStatus"-->

                    <el-table-column
                            type="selection"
                            width="60"
                            align="center">
                        <!--prop="checkStatus"-->
                        <!--label="选择"-->
                        <!--<template slot-scope="scope">-->
                        <!--<el-checkbox :checked="false"-->
                        <!--@change="checkHandel($event,scope.row.id)"></el-checkbox>-->
                        <!--</template>-->
                    </el-table-column>
                    <!--prop="index"-->
                    <el-table-column
                            label="序号"
                            type="index"
                            width="60">
                    </el-table-column>
                    <el-table-column
                            prop="nickname"
                            label="姓名"
                            width="120"
                            sortable>
                    </el-table-column>
                    <el-table-column
                            prop="mobile"
                            label="手机号码"
                            width="120"
                            sortable>
                    </el-table-column>
                    <el-table-column
                            prop="deptName"
                            label="部门"
                            width="120">
                    </el-table-column>
                    <!--prop="role"-->
                    <el-table-column
                            prop="roles"
                            label="角色"
                            width="260">
                        <template slot-scope="scope">
                            <el-tag v-if="index<3" v-for="(tag,index) in scope.row.roles" size="mini" :key="index"
                                    style="margin: 0.2rem;">
                                <!--{{tag}}-->
                                {{tag.roleName}}
                            </el-tag>
                            <el-popover placement="top"
                                        title=""
                                        width="200"
                                        trigger="click" v-if="scope.row.roles.length>3">
                                <div style="font-size: 12px;">
                                    <el-tag v-for="(tag,index) in scope.row.roles" size="mini" :key="index"
                                            style="margin: 0.2rem;">
                                        <!--{{tag}}-->
                                        {{tag.roleName}}
                                    </el-tag>
                                </div>
                                <span class="el-icon-more" slot="reference"
                                      style="background-color:rgb(48, 54, 65);color:#fff;padding:4px 10px;-webkit-border-radius: 3px;-moz-border-radius: 3px;border-radius: 3px;"></span>
                            </el-popover>
                        </template>
                    </el-table-column>

                    <el-table-column
                            prop="locked"
                            label="使用状态"
                            width="260">
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.locked" @change="handleGrant($event,scope.row)">
                                <el-option :value="1" label="启用">启用</el-option>
                                <el-option :value="0" label="停用">停用</el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <!--prop="handle"-->
                    <el-table-column

                            label="操作">
                        <template slot-scope="scope">
                            <el-dropdown trigger="click">
                                <span class="el-dropdown-link el-icon-more"
                                      style="background-color:rgb(48, 54, 65);color:#fff;padding:4px 10px; -webkit-border-radius: 2px;-moz-border-radius: 2px;border-radius: 2px;"></span>
                                <el-dropdown-menu slot="dropdown">
                                    <!--v-if="scope.row.handle.indexOf('删除用户')!==-1"-->
                                    <el-dropdown-item style="font-size: 12px;"
                                                      @click.native="deleteUser(scope.row.id,scope.$index)">
                                        <div>
                                            <i class="el-icon-delete" style="color:#FA5555"></i> 删除用户
                                        </div>
                                    </el-dropdown-item>
                                    <!--v-if="scope.row.handle.indexOf('修改用户')!==-1"-->
                                    <el-dropdown-item style="font-size: 12px;" @click.native="editUser(scope.row)">
                                        <div>
                                            <i class="el-icon-edit" style="color:#409EFF"></i> 修改用户
                                        </div>
                                    </el-dropdown-item>
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
                    width="50%">
                <div slot="title">
                    <h4>修改用户</h4>
                </div>
                <div class="form-wrapper" @click.stop>
                    <el-form ref="userForm" :model="currentEditUser" label-width="80px" size="small" :rules="rules">
                        <el-form-item label="姓名">
                            <el-input v-model="currentEditUser.nickname"></el-input>
                        </el-form-item>
                        <el-form-item label="手机号码">
                            <el-input v-model="currentEditUser.mobile" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="部门">
                            <el-select v-model="currentEditUser.deptId" @change="changeDept">
                                <el-option v-for="dept in deptList" :value="dept.id" :label="dept.deptName" :key="dept.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="角色">
                            <el-select v-model="currentEditUser.roleIds" multiple @change="changeRoles">
                                <el-option v-for="role in rolesList" :value="role.id"
                                           :label="role.roleName" :key="role.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </div>
                <footer slot="footer">
                    <el-button type="primary" size="small" @click="submitEdit">确定</el-button>
                    <el-button size="small" @click="cancel">取消</el-button>
                </footer>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import filterComponent from "./common/filterComponent.vue";

    export default {
        data() {
            return {
                modalVisible: false,
                checkedUserList: [],
                userList: [],
                colSpan: [],
                keyword: '',
                department: '',
                role: '',
                tableHeight: 100,
                dataTotal: 0,
                size: 20,
                page: 1,
                getDataLock: false,
                //保存当前操作用户对象信息,新增时为空
                currentEditUser: {
                    nickname: "",
                    mobile: "",
                    deptId: "",
                    roles: []
                },
                rules: {},
                deptList: [],
                rolesList: [],
                inSubmit: false
            }
        },
        methods: {
            handleGrant(val, current) {
                let ids = [],
                    id = current.id,
                    locked = val;
                if (id) {
                    ids.push(id);
                }

                if (ids && ids.length !== 0) {
                    this.$http({
                        url: API(`/sysuser/grant`),
                        method: "put",
                        body:{
                            ids:ids,
                            locked:locked
                        }
                    }).then(
                        (res) => {
                            let response = res.body;
                            if (response && response.code === 0 && response.msg === "成功") {
                                this.$message({
                                    type: "success",
                                    message: "使用状态变更成功"
                                });
                            }else {
                                this.$message({
                                    type: "error",
                                    message: "使用状态变更失败"
                                });
                            }
                        },
                        (res) => {
                            this.$message({
                                type: "error",
                                message: "使用状态变更失败"
                            });
                        }
                    )
                }
//                if (val === 1) {
//                    console.log("启用", id);
//                } else if (val === 0) {
//                    console.log("停用", id);
//                }
            },
            cancel() {
                this.handelClose();
            },
            changeDept(current) {

            },
            changeRoles(current) {
                this.currentEditUser.roleIds = current;
            },
            submitEdit() {
                this.inSubmit = true;
                this.$http({
                    url: API("/sysuser/info"),
                    method: "put",
                    body: this.currentEditUser
                }).then(
                    (res) => {
                        let response = res.body;
                        if (response && response.code === 0 && response.msg === "成功") {
                            this.modalVisible = false;
                            this.$message({
                                type: "success",
                                message: "编辑用户信息成功"
                            });
                            this.fetchUserList();
                        } else {
                            this.$message({
                                type: "error",
                                message: "编辑用户信息失败"
                            });
                        }
                    },
                    (res) => {
                        this.$message({
                            type: "error",
                            message: "编辑用户信息失败"
                        });
                    }
                )
            },
            fetchModalList() {
                this.$http({
                    url: API("/dept/list"),
                    method: "get"
                }).then(
                    (res) => {
                        let response = res.body;
                        if (response && response.data) {
                            this.deptList = response.data;
                        }
                    },
                    (res) => {
                        console.error("获取部门列表失败");
                    }
                );
                this.$http({
                    url: API("/role/list"),
                    method: "get"
                }).then(
                    (res) => {
                        let response = res.body;
                        if (response && response.data) {
                            this.rolesList = response.data;
                        }
                    },
                    (res) => {
                        console.error("获取角色列表失败");
                    }
                )
            },
            handleSelect(val) {
                this.checkedUserList = val;
            },
            handleSelectAll(val) {
                this.checkedUserList = val;
            },
            editUser(user) {
                let roleIds = [];
                let currentEditUser = JSON.parse(JSON.stringify(user));
                if (user.roles && user.roles.length !== 0) {
                    _.forEach(user.roles, (role, index) => {
                        roleIds.push(role.id);
                    });
                }
                currentEditUser.roleIds = roleIds;
                this.currentEditUser = currentEditUser;
                this.modalVisible = true;
            },
            //删除单个用户
            deleteUser(id, index) {
                this.$confirm('是否删除该用户?', '警告', {
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
                                message: "获取用户ID失败"
                            });
                            return;
                        }
                        this.$http({
                            url: API(`/sysuser`),
                            method: "delete",
                            body: JSON.stringify(checked)
                        }).then(
                            (res) => {
                                let response = res.body;
                                if (response.code === 0 && response.msg === "成功") {
                                    this.$message({
                                        type: "success",
                                        message: "删除用户成功"
                                    });
                                    // this.userList.splice(index, 1);
                                    // this.dataTotal--;
                                    this.$refs.userList.clearSelection();
                                    this.fetchUserList();
                                } else {
                                    this.$message({
                                        type: "error",
                                        message: "删除用户失败"
                                    })
                                }
                            },
                            (res) => {
                                this.$message({
                                    type: "error",
                                    message: "删除用户失败"
                                })
                            }
                        )
                    }
                ).catch(

                )
            },
            //批量删除用户
            batchRemove() {
//                console.log("批量删除", this.checkedUserList);
                if (this.checkedUserList && this.checkedUserList.length !== 0) {
                    this.$confirm('是否批量删除用户?', '警告', {
                        confirmButtonText: '删除',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(
                        () => {
                            let checked = [];
                            if (this.checkedUserList && this.checkedUserList.length !== 0) {
                                _.forEach(this.checkedUserList, (value, index) => {
                                    if (checked.indexOf(value.id) === -1) {
                                        checked.push(value.id);
                                    }
                                });
                            }
                            this.$http({
                                url: API(`/sysuser`),
                                method: "delete",
                                body: JSON.stringify(checked)
                            }).then(
                                (res) => {
                                    let response = res.body;
                                    if (response.code === 0 && response.msg === "成功") {
                                        this.$message({
                                            type: "success",
                                            message: "批量删除成功"
                                        });
                                        // this.dataTotal-=checked.length;
                                        checked = [];
                                        this.checkedUserList = [];
                                        this.$refs.userList.clearSelection();
                                        this.fetchUserList();
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
                            );
                        }
                    ).catch(
                        () => {
                            this.$message({
                                type: "error",
                                message: "批量删除失败"
                            })
                        }
                    );
                } else {
                    this.$message({
                        type: "warning",
                        message: "未勾选用户"
                    })
                }
            },
            addItem() {
                this.modalVisible = true;
                this.modalType = "新增";
            },
            handelClose() {
                this.modalVisible = false;
                this.currentEditUser = {
                    nickname: "",
                    mobile: "",
                    deptId: "",
                    roles: []
                };
                this.$refs.userForm.clearValidate();
            },
            searchKeyword(keyword, moduleName) {
                this.keyword = keyword;
                //翻回第一页
                this.page = 1;
                this.fetchUserList();
            },
            checkHandel(status, id) {
                if (status) {
                    if (this.checkedUserList.indexOf(id) === -1) {
                        this.checkedUserList.push(id);
                    }
                } else {
                    if (this.checkedUserList.indexOf(id) !== -1) {
                        _.remove(this.checkedUserList, (n) => {
                            return n === id;
                        });
                    }
                }
            },
            fetchUserList(type) {
                this.getDataLock = true;
                let url, method,
                    key = this.keyword,
                    size = this.size,
                    page = this.page;

                if (type === "newUser") {
                    //插入1条新圈子数据,位置处于顶置
                    page = 1;
                    size = this.userList.length + 1;
                } else if (type === "more") {
                    //获取更多条数据
                    this.page++;
                    page = this.page;
                } else if (!type) {
                    this.page = 1;
                    page = this.page;
                }

                url = API("/sysuser/all");
                method = "get";

                this.$http({
                    url: url,
                    method: method,
                    params: {
                        page: page,
                        size: size,
                        key: key
                    }
                }).then(
                    (res) => {
                        let response = res.body;
                        if (response) {
                            if (response.code === 0 && response.msg === "成功") {
                                let data = response.data,
                                    list = data.list;
                                this.dataTotal = data.total;
                                if (!type || type === "newUser") {
                                    this.userList = list;
                                } else if (type === "more") {
                                    if (this.page <= data.lastPage) {
                                        this.userList = this.userList.concat(list);
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
            handleSelectionChange() {

            }
        },
        components: {
            "filter-component": filterComponent
        }
        ,
        created() {
            //获取用户列表
            this.fetchUserList();
            //获取编辑框下的内容列表
            this.fetchModalList();
        }
        ,
        mounted() {
            const TRHEIGHT = 50;//通过行高动态计算首屏的数据条数最小数，直接顶出滚动条

            let listTable = document.getElementById('list-table'),
                scrollView = document.getElementsByClassName('el-table__body-wrapper')[0],
                scrollTable = document.querySelector('.el-table__body-wrapper table'),
                _this = this;
            this.tableHeight = listTable.clientHeight;

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
                    _this.fetchUserList("more");
                }
            };
            //首次加载数据后，内表高度如果小于视窗高度，则不出现滚动条
            /*IE注册事件*/
            if (scrollView.attachEvent) {
                scrollView.attachEvent('onmousewheel', handler);
            }
            /*Firefox注册事件*/
            if (scrollView.addEventListener) {
//                scrollView.addEventListener('DOMMouseScroll', handler, false);
                scrollView.addEventListener('scroll', handler);
            }
//            scrollView.addEventListener('wheel', handler);
//            scrollView.addEventListener('scroll',handler);
        }
    }
</script>

<style lang="scss" scoped>
    @import "common/style/main";

    .main {
        .list-table {
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
</style>