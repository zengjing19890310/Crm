<template>
    <!--客户管理-->
    <div class="outer-container">
        <section class="main" v-loading="getDataLock" element-loading-text="加载中...">
            <filter-component :data-count="dataTotal" filter-type="onlyCount"
                              route-name="customerInformation"
                              @search-keyword="searchKeyword" :user-name="userName"
                              @clear-username="clearUserName"></filter-component>
            <div class="customer-container">
                <div class="left-panel" id="customer-table">
                    <!--左边客户列表-->
                    <el-table
                            ref="customerList"
                            :data="customerList"
                            size="small"
                            style="width: 100%;font-size: 12px;"
                            highlight-current-row
                            @current-change="handleCurrentChange"
                            :height="tableHeight">
                        <!--<el-table-column-->
                        <!--prop="checkStatus"-->
                        <!--label="选择"-->
                        <!--width="60"-->
                        <!--align="center">-->
                        <!--<template slot-scope="scope">-->
                        <!--<el-checkbox v-model="scope.row.checkStatus"></el-checkbox>-->
                        <!--</template>-->
                        <!--</el-table-column>-->
                        <!--prop="name"-->
                        <el-table-column
                                type="index"
                                label="序号"
                                width="50">

                        </el-table-column>
                        <el-table-column
                                prop="nickname"
                                label="姓名">
                            <template slot-scope="scope">
                                <span>{{scope.row.nickname || "-"}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="mobile"
                                label="手机号码">
                            <template slot-scope="scope">
                                <span>{{scope.row.mobile || "-"}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="qq"
                                label="QQ">
                            <template slot-scope="scope">
                                <span>{{scope.row.qq || "-"}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="weixin"
                                label="微信">
                            <template slot-scope="scope">
                                <span>{{scope.row.weixin || "-"}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="weibo"
                                label="微博">
                            <template slot-scope="scope">
                                <span>{{scope.row.weibo || "-"}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="invitationtor"
                                label="邀约人">
                            <template slot-scope="scope">
                                <span>{{scope.row.invitationtor || "-"}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="levelName"
                                label="客户等级">
                            <template slot-scope="scope">
                                <div @click.stop>
                                    <el-row>
                                        <el-col class="permissionHidden"
                                                v-permission="{buttonId:75,buttonName:'修改客户等级'}">
                                            <!--如果有权限,应该显示下拉菜单-->
                                            <el-select v-model="scope.row.vipLevel" size="small"
                                                       @change="handleLevelChange($event,scope.row)">
                                                <el-option v-for="(level,index) in customerLevelList" :value="level.id"
                                                           :label="level.levelName" :key="level.id"></el-option>
                                            </el-select>
                                        </el-col>
                                        <el-col class="permissionHidden"
                                                v-no-permission-show="{buttonId:75,buttonName:'修改客户等级'}">
                                            <!--没有权限,则显示名称信息-->
                                            <span>{{scope.row.levelName}}</span>
                                        </el-col>
                                    </el-row>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="right-panel">
                    <!--右边当前客户关联信息-->
                    <div class="sharer text-control" v-loading="levelLoading" element-loading-text="加载中...">
                        <header>上层关系</header>
                        <div class="level-wrapper">
                            <div class="up-level-information">
                                <p>
                                    <span>姓名: {{upLevelInformation.nickname || "-"}}</span>
                                </p>
                                <p>
                                    <span>佣金: {{upLevelInformation.money || "-"}}</span>
                                </p>
                                <p>
                                    <span>等级: {{upLevelInformation.levelName || "-"}}</span>
                                </p>
                                <p>
                                    <span>积分: {{upLevelInformation.points || "-"}}</span>
                                </p>
                                <p>
                                    <span>邀约人: {{upLevelInformation.invitationtor || "-"}}</span>
                                </p>
                                <p>
                                    <span>信用评分: -</span>
                                </p>
                            </div>
                            <footer class="more">
                                <div class="more-share">
                                    <span>他的更多分享:</span>
                                    <div v-if="upLevelInformation.shares&&upLevelInformation.shares.length!==0">
                                        <img class="head-img" v-for="(share,index) in upLevelInformation.shares"
                                             :key="index"
                                             :src="share.headImg" alt="">
                                    </div>
                                    <span v-if="upLevelInformation.count>4">...</span>
                                </div>
                                <div class="count-share" @click="fetchShareList(upLevelInformation)">
                                    <i class="share-icon"></i>{{upLevelInformation.count || "-"}}
                                </div>
                            </footer>
                        </div>
                    </div>
                    <div class="my-share text-control" v-loading="levelLoading" element-loading-text="加载中...">
                        <header>{{currentCustomer.nickname || "-"}}的分享</header>
                        <div class="level-wrapper">
                            <div class="down-level-information">
                                <p>
                                    <span>APP分享: {{currentCustomer.rank || "-"}}</span>
                                </p>
                                <p>
                                    <span>转化用户: {{currentCustomer.invitation || "-"}}</span>
                                </p>
                            </div>
                            <footer class="more">
                                <div class="more-share">
                                    <span>他的更多分享:</span>
                                    <div v-if="currentCustomer.shares&&currentCustomer.shares.length!==0">
                                        <img class="head-img" v-for="(share,index) in currentCustomer.shares"
                                             :src="share.headImg" alt="" :key="index">
                                    </div>
                                </div>
                                <div class="count-share" @click="fetchShareList(currentCustomer)">
                                    <i class="share-icon"></i>{{currentCustomer.count || "-"}}
                                </div>
                            </footer>
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
                getDataLock: false,
                page: 1,
                size: 20,
                dataTotal: 0,
                customerList: [],
                tableHeight: 100,
                currentCustomer: {},
                upLevelInformation: {},
                levelLoading: false,
                customerLevelList: [],
                userId: "",
                userName: ""
            }
        },
        created() {
            //获取客户列表
            this.fetchCustomerList();
            //获取客户等级下拉列表
            this.fetchCustomerLevelList();
        },
        mounted() {
            let customerTable = document.getElementById('customer-table'),
                scrollView = document.getElementsByClassName('el-table__body-wrapper')[0],
                scrollTable = document.querySelector('.el-table__body-wrapper table'),
                _this = this;
            this.tableHeight = customerTable.clientHeight;

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
                    _this.fetchCustomerList("more");
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
        },
        methods: {
            //清除选中的上下级关键字
            clearUserName() {
                this.userName = "";
                this.userId = "";
                this.upLevelInformation = {};
                this.page = 1;
                this.fetchCustomerList();
            },
            //关键字查找
            searchKeyword(keyword) {
                this.keyword = keyword;
                this.page = 1;
                this.fetchCustomerList();
            },
            //通过分享上下级,获取包含上下级条件的
            fetchShareList(user) {
                this.keyword = "";
                window.Bus.$emit("clean-keyword");
                this.userName = user.nickname || user.mobile;
                this.userId = user.id;
                this.upLevelInformation = {};
                this.page = 1;
                this.fetchCustomerList();
            },
            //客户等级修改成功
            handleLevelChange(vipLevel, val) {
                if (this.customerLevelList && this.customerLevelList.length !== 0) {
                    _.forEach(this.customerLevelList, (level, index) => {
                        if (level.id === vipLevel) {
                            val.levelName = level.levelName;
                        }
                    });
                }
//                console.log("改变用户VIP等级", val);
                //将VIP等级改变发送到服务器
                let editObj = {
                    userId: val.id,
                    levelId: val.vipLevel
                };
                this.$http({
                    url: API("/customer"),
                    method: "put",
                    params: editObj
                }).then(
                    (res) => {
                        console.log(res);
                        let response = res.body;
                        if (response && response.code === 0 && response.msg === "成功") {
                            this.$message({
                                type: "success",
                                message: "修改客户等级成功"
                            });
                        } else {
                            this.$message({
                                type: "success",
                                message: "修改客户等级失败"
                            });
                            this.fetchCustomerList();
                        }
                    },
                    (res) => {
                        this.$message({
                            type: "success",
                            message: "修改客户等级失败"
                        });
                        this.fetchCustomerList();
                    }
                )

            },
            //获取客户等级下拉框选项,有权限时提供编辑功能
            fetchCustomerLevelList() {
                this.$http({
                    url: API("/customer/level"),
                    method: "get"
                }).then(
                    (res) => {
                        let response = res.body;
                        if (response && response.code === 0 && response.msg === "成功") {
                            this.customerLevelList = response.data;
                        }
                    },
                    (res) => {
                        console.error(res);
                    }
                )
            },
            //获取客户列表分页
            fetchCustomerList(type) {
                this.getDataLock = true;
                let url, method, page, size, keyword = this.keyword, userId = this.userId;
                url = API("/customer");
                method = "get";
                page = this.page;
                size = this.size;

                if (type === "newCustomer") {
                    page = 1;
                    size = this.customerList.length + 1;
                } else if (type === "more") {
                    this.page++;
                    page = this.page;
                } else if (!type) {
                    page = 1;
                }

                this.$http({
                    url: url,
                    method: method,
                    params: {
                        page: page,
                        size: size,
                        userId: userId,
                        key: keyword
                    }
                }).then(
                    (res) => {
                        let response = res.body;
                        if (response && response.code === 0 && response.msg === "成功") {
                            let data = response.data,
                                list = data.list;
                            this.dataTotal = data.total;
                            if (!type || type === "newCustomer") {
                                this.customerList = data.list;
                            } else if (type === "more") {
                                if (this.page <= data.lastPage) {
                                    this.customerList = this.customerList.concat(list);
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
            },
            //左侧表格选中行变化
            handleCurrentChange(val) {
                if (val) {
                    this.currentCustomer = val;
                    let pid = val.pid;
                    if (pid) {
                        this.fetchUpLevel(pid);
                    } else {
                        this.upLevelInformation = {};
//                        this.$message({
//                            type: "error",
//                            message: "获取上级ID失败"
//                        });
                    }
                }
            },
            //根据表格选中行pid获取右侧上级信息
            fetchUpLevel(pid) {
                this.levelLoading = true;
                this.$http({
                    url: API(`/customer/up/${pid}`),
                    method: "get"
                }).then(
                    (res) => {
                        let response = res.body;
                        if (response && response.code === 0 && response.msg === "成功") {
                            if (response.data) {
                                this.upLevelInformation = response.data;
                            }
                        } else {
                            this.$message({
                                type: "error",
                                message: "获取上级信息失败"
                            });
                        }
                        this.levelLoading = false;
                    },
                    (res) => {
                        this.$message({
                            type: "error",
                            message: "获取上级信息失败"
                        });
                        this.levelLoading = false;
                    }
                );
            }
        },
        components: {
            "filter-component": filterComponent
        }
    }
</script>

<style lang="scss" scoped>
    @import "common/style/customerCommon";

    .level-wrapper {
        flex-direction: column;
        .up-level-information, .down-level-information {
            flex-grow: 1;
            flex-shrink: 0;
            display: flex;
            flex-wrap: wrap;
            justify-content: flex-start;
            align-items: center;
            border-bottom: 1px solid #ddd;
            p {
                width: 50%;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
            }
        }
        .more {
            width: 100%;
            height: 60px;
            flex-shrink: 0;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .more-share {
                display: flex;
                flex-grow: 3;
                flex-shrink: 0;
                align-items: center;
                .head-img {
                    width: 36px;
                    height: 36px;
                    vertical-align: middle;
                    -webkit-border-radius: 50%;
                    -moz-border-radius: 50%;
                    border-radius: 50%;
                    margin-left: 0.2rem;
                }
            }
            .count-share {
                flex-grow: 1;
                flex-shrink: 0;
                display: flex;
                align-items: center;
                cursor: pointer;
                .share-icon {
                    display: inline-block;
                    width: 22px;
                    height: 22px;
                    background: #fff url("../../../common/images/user-management.png") no-repeat 0 0;
                }
            }
        }
    }
</style>