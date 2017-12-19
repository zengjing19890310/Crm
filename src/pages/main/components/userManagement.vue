<template>
    <div class="outer-container">
        <!--<h4>用户管理</h4>-->
        <section class="main">
            <filter-component :data-count="dataTotal" @add-item="addItem"
                              @search-keyword="searchKeyword"></filter-component>
            <div class="list-table" id="list-table">
                <el-table
                        v-loading="loading"
                        :data="userList"
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
                            prop="name"
                            label="姓名"
                            width="80"
                            sortable>
                    </el-table-column>
                    <el-table-column
                            prop="phone"
                            label="手机号码"
                            width="120">
                    </el-table-column>
                    <el-table-column
                            prop="department"
                            label="部门"
                            width="120"
                            sortable>
                    </el-table-column>
                    <el-table-column
                            prop="role"
                            label="角色"
                            width="260">
                        <template slot-scope="scope">
                            <el-tag v-if="index<3" v-for="(tag,index) in scope.row.role" size="mini"
                                    style="margin: 0.2rem;">
                                {{tag}}
                            </el-tag>
                            <el-popover placement="top"
                                        title=""
                                        width="200"
                                        trigger="click" v-if="scope.row.role.length>3">
                                <div style="font-size: 12px;">
                                    {{scope.row.role.join(',')}}
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
                                                      v-if="scope.row.handle.indexOf('删除用户')!==-1">
                                        <i class="el-icon-delete" style="color:#FA5555"></i> 删除用户
                                    </el-dropdown-item>
                                    <el-dropdown-item style="font-size: 12px;"
                                                      v-if="scope.row.handle.indexOf('修改用户')!==-1">
                                        <i class="el-icon-edit" style="color:#409EFF"></i> 修改用户
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

    export default {
        data() {
            return {
                loading: false,
                userList: [],
                colSpan: [],
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
                tableHeight: 100,
                dataTotal: 0,
                size: 20,
                page: 1
            }
        },
        methods: {
            fetchUserList() {
                let url, method,
                    size = this.size,
                    page = this.page;
                url = API("/sysuser/all");
                method = "get";
                this.$http({
                    url: url,
                    method: method,
                    params: {
                        page: page,
                        size: size
                    }
                }).then(
                    (res) => {
                        let response = res.body;
                        if (response) {
                            if (response.code === 0 && response.msg === "成功") {
                                let data = response.data,
                                    list = data.list;
                                this.dataTotal = data.total;
                                this.userList = list;
                                console.log(list);
                            }
                        }
                        console.log(res);
                    },
                    (res) => {

                    }
                )
            },
            handleSelectionChange() {

            }
        },
        components: {
            "filter-component": filterComponent
        },
        created() {
            this.fetchUserList();
        },
        mounted() {
            const TRHEIGHT = 50;//通过行高动态计算首屏的数据条数最小数，直接顶出滚动条

            let listTable = document.getElementById('list-table'),
                scrollView = document.getElementsByClassName('el-table__body-wrapper')[0],
                scrollTable = document.querySelector('.el-table__body-wrapper table'),
                _this = this;
            this.tableHeight = listTable.clientHeight;

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