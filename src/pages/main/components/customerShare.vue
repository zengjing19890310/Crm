<template>
    <div class="outer-container">
        <section class="main">
            <filter-component></filter-component>
            <div class="customer-container">
                <div class="left-panel" id="customer-table">
                    <!--左边客户列表-->
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
                                prop="name"
                                label="姓名"
                                width="80">
                        </el-table-column>
                        <el-table-column
                                prop="qq"
                                label="QQ"
                                width="150">
                        </el-table-column>
                        <el-table-column
                                prop="weChat"
                                label="微信"
                                width="150">
                        </el-table-column>
                        <el-table-column
                                prop="blog"
                                label="微博"
                                width="150">
                        </el-table-column>
                        <el-table-column
                                prop="phone"
                                label="手机号码"
                                width="150">
                        </el-table-column>
                        <el-table-column
                                prop="department"
                                label="部门">
                        </el-table-column>
                        <el-table-column
                                prop="handle"
                                label="操作">
                            <template slot-scope="scope">
                                <span v-if="scope.row.handle.indexOf('删除')!==-1"
                                      :class="['handleButton',{'删除':scope.row.handle.indexOf('删除')!==-1}]"> 删除 </span>
                                <span v-if="scope.row.handle.indexOf('修改')!==-1"
                                      :class="['handleButton',{'修改':scope.row.handle.indexOf('修改')!==-1}]"> 修改 </span>
                                <!--<el-dropdown trigger="click">-->
                                <!--<span class="el-dropdown-link el-icon-more"-->
                                <!--style="background-color:rgba(199, 230, 249, 1);color:rgba(0, 153, 255, 1);padding:4px 10px;">-->

                                <!--</span>-->
                                <!--<el-dropdown-menu slot="dropdown">-->
                                <!--<el-dropdown-item style="font-size: 12px;"-->
                                <!--v-if="scope.row.handle.indexOf('删除')!==-1">-->
                                <!--<i class="el-icon-delete"-->
                                <!--style="color:#FA5555"></i> 删除-->
                                <!--</el-dropdown-item>-->
                                <!--<el-dropdown-item style="font-size: 12px;"-->
                                <!--v-if="scope.row.handle.indexOf('修改')!==-1">-->
                                <!--<i class="el-icon-edit"-->
                                <!--style="color:#409EFF"></i> 修改-->
                                <!--</el-dropdown-item>-->
                                <!--</el-dropdown-menu>-->
                                <!--</el-dropdown>-->
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="right-panel">
                    <!--右边当前客户关联信息-->
                    <div class="sharer text-control">
                        <header>上层关系</header>
                        <div>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab accusamus adipisci aspernatur aut cum cupiditate deleniti eveniet, illum molestiae nam nobis, non possimus praesentium quasi recusandae saepe tempora, tempore vitae?
                        </div>
                    </div>
                    <div class="my-share text-control">
                        <header>下层关系</header>
                        <div>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. A alias, assumenda ducimus error exercitationem expedita illo inventore iusto maxime molestias nemo placeat, quos rem sed sequi temporibus ullam veritatis voluptatem!
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
    import filterComponent from "./common/filterComponent.vue";
    export default {
        data() {
            return {
                keyword: "",
                currentPage: 1,
                limit: 10,
                total: 62,
                dataTotal: 0,
                tableData: [
                    {
                        checkStatus: false,
                        name: '张小刚',
                        qq: '350242',
                        weChat: 'bibobibo',
                        blog: 'bibobibo',
                        phone: '13342343333',
                        department: 'K团',
                        handle: [
                            '删除',
                            '修改'
                        ]
                    }
                ],
                loading: false,
                tableHeight: 100
            }
        },
        mounted() {
            let customerTable = document.getElementById('customer-table'),
                scrollView = document.getElementsByClassName('el-table__body-wrapper')[0],
                scrollTable = document.querySelector('.el-table__body-wrapper table'),
                _this = this;
            this.tableHeight = customerTable.clientHeight;
            this.dataTotal = this.tableData.length;
        },
        components: {
            "filter-component": filterComponent
        }
    }
</script>

<style lang="scss" scoped>
    @import "common/customerCommon";
</style>