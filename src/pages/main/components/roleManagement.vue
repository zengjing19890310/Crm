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

                            label="权限"
                            width="500">
                        <!--<template slot-scope="scope">-->
                        <!--<el-tag v-if="index<3" v-for="(permission,index) in scope.row.permissions" size="mini"-->
                        <!--style="margin: 0.2rem;">-->
                        <!--{{permission}}-->
                        <!--</el-tag>-->
                        <!--<el-popover placement="top"-->
                        <!--title=""-->
                        <!--width="200"-->
                        <!--trigger="click" v-if="scope.row.permissions.length>3">-->
                        <!--<div style="font-size: 12px;">-->
                        <!--{{scope.row.permissions.join(',')}}-->
                        <!--</div>-->
                        <!--<span class="el-icon-more" slot="reference"-->
                        <!--style="background-color:rgba(199, 230, 249, 1);color:rgba(0, 153, 255, 1);padding:4px 10px;">-->
                        <!--</span>-->
                        <!--</el-popover>-->
                        <!--</template>-->
                    </el-table-column>
                    <el-table-column
                            label="操作">
                        <template slot-scope="scope">
                            <el-dropdown trigger="click">
                                <span class="el-dropdown-link el-icon-more"
                                      style="background-color:rgb(48, 54, 65);color:#fff;padding:4px 10px; -webkit-border-radius: 2px;-moz-border-radius: 2px;border-radius: 2px;">

                                </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item style="font-size: 12px;">
                                        <i class="el-icon-delete"
                                           style="color:#FA5555"></i> 删除角色
                                    </el-dropdown-item>
                                    <el-dropdown-item style="font-size: 12px;">
                                        <i class="el-icon-edit"
                                           style="color:#409EFF"></i> 修改角色
                                    </el-dropdown-item>
                                    <el-dropdown-item style="font-size: 12px;background-color: #ddd">
                                        <i class="el-icon-warning"
                                           style="color:#666"></i> 角色赋权
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
                    <h4>{{modalType}}角色</h4>
                </div>
                <div class="form-wrapper" @click.stop>
                    <el-form ref="roleForm" :model="role" label-width="80px" size="small" :rules="rules">
                        <el-form-item label="角色名" prop="roleName">
                            <el-input v-model="role.roleName"></el-input>
                        </el-form-item>
                        <el-form-item label="权限">
                            有哪些权限显示在这里?
                        </el-form-item>
                    </el-form>
                </div>
                <footer slot="footer">
                    <el-button type="primary" size="small" @click="submitForm">确定</el-button>
                    <el-button size="small">取消</el-button>
                </footer>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import filterComponent from "./common/filterComponent.vue";

    let calcTableLimit = (height, cellHeight) => {
        return Math.floor(height / cellHeight - 1);
    };

    require('intro.js/introjs.css');
    let introJs = require('intro.js/intro').introJs;

    export default {
        data() {
            return {
                rolesList: [],
                size: 20,
                page: 1,
                dataTotal: 0,
                getDataLock: false,
                modalVisible: false,

                keyword: '',

                tableHeight: 100,
                modalType: "",
                role: {
                    roleName: ""
                },
                rules: {
                    roleName: [
                        {required: true, message: "角色名不能为空", trigger: "blur"}
                    ]
                }
            }
        },
        methods: {
            submitForm() {
                console.log("提交", this.role);
                this.$http({
                    url: API("/role"),
                    method: "post",
                    body: this.role
                }).then(
                    (res) => {
                        console.log(res);
                    },
                    (res) => {

                    }
                )
            },
            handleSelect() {

            },
            handleSelectAll() {

            },
            addItem() {
                console.log("新增");
                this.modalType = "新增";
                this.modalVisible = true;

            },
            batchRemove() {
                console.log("批量删除");
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

                url = API("/role");
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
                        if (response && response.code === 0 && response.msg === "成功") {
                            let data = response.data,
                                list = data.list;
                            this.dataTotal = data.total;
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
                scrollView.attachEvent('onmousewheel', handler);
            }
            /*Firefox注册事件*/
            if (scrollView.addEventListener) {
                scrollView.addEventListener('DOMMouseScroll', handler, false);
                scrollView.addEventListener('scroll', handler);
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
</style>