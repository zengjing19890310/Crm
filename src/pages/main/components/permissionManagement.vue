<template>
    <div class="outer-container">
        <header class="module-title">
            权限资源
        </header>
        <section class="main">
            <header class="filter-container">
                <div class="title">
                    <p>菜单和按钮</p>
                    <span>
                        数据权限
                        {{checkedHomepageManagement}}
                        {{checkedUserManagement}}
                        {{checkedSystemManagement}}
                    </span>
                </div>
                <div class="handle-wrapper">
                    <el-button type="primary" icon="el-icon-circle-plus-outline" size="mini">
                        新增
                    </el-button>
                    <el-dropdown trigger="click">
                        <span class="el-dropdown-link el-icon-more"
                              style="background-color:rgba(199, 230, 249, 1);color:rgba(0, 153, 255, 1);padding:7px 15px;">

                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item style="font-size: 12px;">
                                <i class="el-icon-delete"
                                   style="color:#FA5555"></i> 删除
                            </el-dropdown-item>
                            <el-dropdown-item style="font-size: 12px;">
                                <i class="el-icon-edit"
                                   style="color:#409EFF"></i> 修改
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </header>
            <div class="main-panel">
                <div class="sub-menu">
                    <div>
                        <div class="sub-menu-item">
                            <el-checkbox
                                    v-model="checkAllHomepageManagement"
                                    @change="handleCheckedAllHomepageManagementChange"></el-checkbox>
                            <div @click="slideToggle('homepage')">
                                首页
                                <span :class="['transition','el-icon-arrow-right',{'rotate90':collapse.homepage}]"></span>
                            </div>
                        </div>
                        <el-collapse-transition>
                            <div class="sub-menu-item-child" v-show="collapse.homepage">
                                <el-checkbox-group v-model="checkedHomepageManagement">
                                    <div v-for="(item,index) in homepageManagement" :key="index"
                                         @change="handleCheckedHomepageManagementChange">
                                        <el-checkbox :label="item.name"></el-checkbox>
                                    </div>
                                </el-checkbox-group>
                            </div>
                        </el-collapse-transition>
                    </div>
                    <div>
                        <div class="sub-menu-item">
                            <el-checkbox
                                    v-model="checkAllUserManagement"
                                    :indeterminate="checkPartUserManagement"
                                    @change="handleCheckedAllUserManagementChange"></el-checkbox>
                            <div @click="slideToggle('userManagement')">
                                客户管理
                                <span :class="['transition','el-icon-arrow-right',{'rotate90':collapse.userManagement}]"></span>
                            </div>
                        </div>
                        <el-collapse-transition>
                            <div class="sub-menu-item-child" v-show="collapse.userManagement">
                                <el-checkbox-group v-model="checkedUserManagement">
                                    <div v-for="(item,index) in userManagement" :key="index"
                                         @change="handleCheckedUserManagementChange">
                                        <el-checkbox :label="item.name"></el-checkbox>
                                    </div>
                                </el-checkbox-group>
                            </div>
                        </el-collapse-transition>
                    </div>
                    <div>
                        <div class="sub-menu-item">
                            <el-checkbox
                                    v-model="checkAllSystemManagement"
                                    :indeterminate="checkPartSystemManagement"
                                    @change="handleCheckedAllSystemManagementChange"></el-checkbox>
                            <div @click="slideToggle('systemManagement')">
                                系统设置
                                <span :class="['transition','el-icon-arrow-right',{'rotate90':collapse.systemManagement}]"></span>
                            </div>
                        </div>
                        <el-collapse-transition>
                            <div class="sub-menu-item-child" v-show="collapse.systemManagement">
                                <el-checkbox-group v-model="checkedSystemManagement"
                                                   @change="handleCheckedSystemManagementChange">
                                    <div v-for="(item,index) in systemManagement" :key="index">
                                        <el-checkbox :label="item.name"></el-checkbox>
                                    </div>
                                </el-checkbox-group>
                            </div>
                        </el-collapse-transition>
                    </div>
                </div>
                <div class="right-panel" id="permission-table">
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
                                prop="resourcesName"
                                label="资源类型"
                                width="200">
                        </el-table-column>
                        <el-table-column
                                prop="url"
                                label="URL"
                                width="200">
                        </el-table-column>
                        <el-table-column
                                prop="remark"
                                label="备注"
                                width="200">
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
                                                          v-if="scope.row.handle.indexOf('删除')!==-1">
                                            <i class="el-icon-delete"
                                               style="color:#FA5555"></i> 删除
                                        </el-dropdown-item>
                                        <el-dropdown-item style="font-size: 12px;"
                                                          v-if="scope.row.handle.indexOf('修改')!==-1">
                                            <i class="el-icon-edit"
                                               style="color:#409EFF"></i> 修改
                                        </el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                tableHeight: 100,
                loading: false,
                //折叠下拉框状态
                collapse: {
                    homepage: false,
                    userManagement: false,
                    systemManagement: false
                },

                //首页管理模块
                homepageManagement: [
                    {name: '首页'}
                ],
                checkedHomepageManagement: [],
                checkAllHomepageManagement: false,
                checkPartHomepageManagement: false,

                //用户管理模块
                userManagement: [
                    {name: '客户信息'},
                    {name: '分享数据'}
                ],
                checkedUserManagement: [],
                checkAllUserManagement: false,
                checkPartUserManagement: false,

                //系统管理模块
                systemManagement: [
                    {name: '用户管理'},
                    {name: '角色管理'}
                ],
                checkedSystemManagement: [],
                checkAllSystemManagement: false,
                checkPartSystemManagement: false,

                //右侧数据表格
                tableData: [
                    {
                        checkStatus: false,
                        resourcesName: '按钮',
                        url: '/usermanage/add',
                        remark: '这里是用户新增',
                        handle: [
                            '删除', '修改'
                        ]
                    }
                ],
            }
        },
        mounted() {
            let permissionTable = document.getElementById('permission-table'),
                scrollView = document.getElementsByClassName('el-table__body-wrapper')[0],
                scrollTable = document.querySelector('.el-table__body-wrapper table'),
                _this = this;
            this.tableHeight = permissionTable.clientHeight;
        },
        methods: {
            slideToggle(key) {
                this.collapse[key] = !this.collapse[key];
            },

            handleCheckedAllHomepageManagementChange() {
                let _this = this;
                if (this.checkPartHomepageManagement) {
                    this.checkPartHomepageManagement = false;
                }
                if (this.checkAllHomepageManagement) {
                    if (this.homepageManagement) {
                        this.homepageManagement.forEach(function (value, index) {
                            if (_this.checkedHomepageManagement.indexOf(value.name) === -1) {
                                _this.checkedHomepageManagement.push(value.name);
                            }
                        });
                    }
                } else {
                    this.checkedHomepageManagement = [];
                }
            },
            handleCheckedHomepageManagementChange() {
                let select = this.checkedHomepageManagement.length;
                if (select && select === this.homepageManagement.length) {
                    //全部选中
                    this.checkAllHomepageManagement = true;
                    this.checkPartSystemManagement = false;
                } else if (!select) {
                    //没有选中
                    this.checkAllHomepageManagement = false;
                    this.checkPartHomepageManagement = false;
                } else {
                    //选中部分
                    this.checkAllHomepageManagement = false;
                    this.checkPartHomepageManagement = true;
                }
            },

            handleCheckedAllSystemManagementChange() {
                let _this = this;
                if (this.checkPartSystemManagement) {
                    this.checkPartSystemManagement = false;
                }
                if (this.checkAllSystemManagement) {
                    if (this.systemManagement) {
                        this.systemManagement.forEach(function (value, index) {
                            if (_this.checkedSystemManagement.indexOf(value.name) === -1) {
                                _this.checkedSystemManagement.push(value.name);
                            }
                        });
                    }
                } else {
                    this.checkedSystemManagement = [];
                }
            },
            handleCheckedSystemManagementChange() {
                let select = this.checkedSystemManagement.length;
                if (select && select === this.systemManagement.length) {
                    //全部选中
                    this.checkAllSystemManagement = true;
                    this.checkPartSystemManagement = false;
                } else if (!select) {
                    //没有选中
                    this.checkAllSystemManagement = false;
                    this.checkPartSystemManagement = false;
                } else {
                    //选中部分
                    this.checkAllSystemManagement = false;
                    this.checkPartSystemManagement = true;
                }
            },

            handleCheckedAllUserManagementChange() {
                let _this = this;
                if (this.checkPartUserManagement) {
                    this.checkPartUserManagement = false;
                }
                if (this.checkAllUserManagement) {
                    if (this.userManagement) {
                        this.userManagement.forEach(function (value, index) {
                            if (_this.checkedUserManagement.indexOf(value.name) === -1) {
                                _this.checkedUserManagement.push(value.name);
                            }
                        });
                    }
                } else {
                    this.checkedUserManagement = [];
                }
            },
            handleCheckedUserManagementChange() {
                let select = this.checkedUserManagement.length;
                if (select && select === this.userManagement.length) {
                    //全部选中
                    this.checkAllUserManagement = true;
                    this.checkPartUserManagement = false;
                } else if (!select) {
                    //没有选中
                    this.checkAllUserManagement = false;
                    this.checkPartUserManagement = false;
                } else {
                    //选中部分
                    this.checkAllUserManagement = false;
                    this.checkPartUserManagement = true;
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .module-title {
        height: 2.4rem;
        line-height: 2.4rem;
        padding-left: 2rem;
        background-color: rgba(153, 153, 153, 1);
        color: #fff;
    }

    .main {
        position: absolute;
        top: 2.9rem;
        left: 0.5rem;
        bottom: 0;
        right: 0;
        background-color: #efefef;
        font-size: 0.8rem;
        .filter-container {
            height: 4rem;
            display: flex;
            padding: 0 1rem;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            flex-flow: nowrap;
            .title {
                font-size: inherit;
                display: flex;
                flex-direction: row;
                align-items: center;
                p {
                    padding: 0.5rem 1rem;
                    background-color: rgba(228, 228, 228, 1);
                    margin-right: 1rem;
                    color: #333;
                    font-weight: bold;
                }
            }
            .handle-wrapper {
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
                width: 20%;
            }
        }
        .main-panel {
            /*border: 1px solid red;*/
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            top: 4rem;
            overflow: hidden;
            margin: 0 1rem 1rem 1rem;
            display: flex;
            flex-direction: row;
            align-items: stretch;
            justify-content: space-between;
            flex-wrap: nowrap;
            .sub-menu {
                width: 11rem;
                background-color: #fff;
                overflow: auto;
                .sub-menu-item {
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    align-items: center;
                    height: 3rem;
                    padding-left: 1rem;
                    > div {
                        width: 100%;
                        padding-left: 0.5rem;
                        padding-right: 0.5rem;
                        position: relative;
                        top: -0.1rem;
                        display: flex;
                        flex-direction: row;
                        justify-content: space-between;
                        align-items: center;
                        span.el-icon-arrow-right {
                            font-size: 1rem;
                        }
                    }
                }
                .sub-menu-item-child {
                    padding-left: 2rem;
                    background-color: #f1f1f1;
                    line-height: 30px;
                }
            }
            .right-panel {
                margin-left: 1rem;
                width: 100%;
                /*border: 1px solid blue;*/
                background-color: #fefefe;
            }
        }
    }
</style>