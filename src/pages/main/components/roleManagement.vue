<template>
    <div class="outer-container">
        <!--<h4>角色管理</h4>-->
        <section class="main">
            <filter-component></filter-component>
            <div class="role-table" id="role-table">
                <el-table
                        v-loading="loading"
                        :data="tableData"
                        style="width: 100%;font-size: 12px;"
                        :height="tableHeight">
                    <el-table-column
                            prop="checkStatus"
                            label="选择"
                            width="60"
                            align="center">
                        <template slot-scope="scope">
                            <el-checkbox v-model="scope.row.checkStatus"></el-checkbox>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="index"
                            label="序号"
                            width="60">
                    </el-table-column>
                    <el-table-column
                            prop="roleName"
                            label="角色名"
                            width="80">
                    </el-table-column>
                    <el-table-column
                            prop="permissions"
                            label="权限"
                            width="500">
                        <template slot-scope="scope">
                            <el-tag v-if="index<3" v-for="(permission,index) in scope.row.permissions" size="mini"
                                    style="margin: 0.2rem;">
                                {{permission}}
                            </el-tag>
                            <el-popover placement="top"
                                        title=""
                                        width="200"
                                        trigger="click" v-if="scope.row.permissions.length>3">
                                <div style="font-size: 12px;">
                                    {{scope.row.permissions.join(',')}}
                                </div>
                                <span class="el-icon-more" slot="reference"
                                      style="background-color:rgba(199, 230, 249, 1);color:rgba(0, 153, 255, 1);padding:4px 10px;">
                                </span>
                            </el-popover>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="handle"
                            label="操作">
                        <template slot-scope="scope">
                            <el-dropdown trigger="click">
                                <span class="el-dropdown-link el-icon-more"
                                      style="background-color:rgba(199, 230, 249, 1);color:rgba(0, 153, 255, 1);padding:4px 10px;">

                                </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item style="font-size: 12px;"
                                                      v-if="scope.row.handle.indexOf('删除角色')!==-1">
                                        <i class="el-icon-delete"
                                           style="color:#FA5555"></i> 删除角色
                                    </el-dropdown-item>
                                    <el-dropdown-item style="font-size: 12px;"
                                                      v-if="scope.row.handle.indexOf('修改角色')!==-1">
                                        <i class="el-icon-edit"
                                           style="color:#409EFF"></i> 修改角色
                                    </el-dropdown-item>
                                    <el-dropdown-item style="font-size: 12px;background-color: #ddd"
                                                      v-if="scope.row.handle.indexOf('角色赋权')!==-1">
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
        methods: {
            loadMore() {
                let _this = this;
                setTimeout(function () {
                    _this.tableData = _this.tableData.concat(
                        [{
                            checkStatus: false,
                            index: 1,
                            roleName: '团长',
                            permissions: [
                                '首页',
                                '客户信息',
                                '分享数据',
                                '所有权限'
                            ],
                            handle: [
                                '删除角色',
                                '修改角色',
                                '角色赋权'
                            ]
                        }, {
                            checkStatus: false,
                            index: 1,
                            roleName: '团长',
                            permissions: [
                                '首页',
                                '客户信息',
                                '分享数据',
                                '所有权限'
                            ],
                            handle: [
                                '删除角色',
                                '修改角色',
                                '角色赋权'
                            ]
                        }]
                    );
                    _this.loading = false;
                }, 3000);
            },
            handleSelectionChange() {

            }
        },
        data() {
            return {
                loading: false,
                colSpan: [],
                dataTotal: 0,
                keyword: '',
                department: '',
                departments: [
                    'K团',
                    '招兵部',
                    '开发部',
                    '野狼团'
                ],
                role: '',
                roles: [
                    '团长',
                    '经理',
                    '销售人员'
                ],
                tableData: [
                    {
                        checkStatus: false,
                        index: 1,
                        roleName: '团长',
                        permissions: [
                            '首页',
                            '客户信息',
                            '分享数据',
                            '所有权限'
                        ],
                        handle: [
                            '删除角色',
                            '修改角色',
                            '角色赋权'
                        ]
                    },
                    {
                        checkStatus: false,
                        index: 2,
                        roleName: '销售人员',
                        permissions: [
                            '客户信息',
                        ],
                        handle: [
                            '删除角色',
                            '修改角色',
                            '角色赋权'
                        ]
                    },
                    {
                        checkStatus: false,
                        index: 3,
                        roleName: '电销人员',
                        permissions: [
                            '客户信息',
                        ],
                        handle: [
                            '删除角色',
                            '修改角色',
                            '角色赋权'
                        ]
                    },
                    {
                        checkStatus: false,
                        index: 4,
                        roleName: '经理',
                        permissions: [
                            '客户信息',
                        ],
                        handle: [
                            '删除角色',
                            '修改角色',
                            '角色赋权'
                        ]
                    }
                ],
                tableHeight: 100
            }
        },
        components: {
            'filter-component': filterComponent
        },
        created() {
            this.dataTotal = this.tableData.length;

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
                console.log('视窗高度', scrollView.clientHeight);
                console.log('视窗距离顶部高度', scrollView.scrollTop);
                console.log('内表高度', scrollTable.clientHeight);
                //如果滚动条抵达底部附近
                if (scrollTable.clientHeight <= scrollView.clientHeight + scrollView.scrollTop) {
                    _this.loading = true;
                    _this.loadMore();
                }
            };
            //首次加载数据后，内表高度如果小于视窗高度，则不出现滚动条
            scrollView.addEventListener('wheel', handler);
            scrollView.addEventListener('scroll', handler);
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