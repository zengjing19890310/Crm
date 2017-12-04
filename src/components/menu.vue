<template>
    <div class="menu-container" @click.stop>
        <div class="menu-top">
            <div class="logo" v-show="!isCollapse">
                <img :src="logoUrl" alt="">
                <p>{{menuTitle}}</p>
            </div>

            <span class="collapse-icon" @click="collapseMenu">

            </span>
        </div>
        <ul>
            <li>
                <div :class="['menu-parent',{'collapse-menu':isCollapse}]">
                    <div :class="['menu-item',{'collapse-menu':isCollapse}]" @click="toggleMenu('1')">
                        <router-link to="/homepage" class="homepage">
                            <!--<i class="el-icon-menu"></i>-->
                            <div class="wrapper">
                                <span class="menu-icon homepage-icon"></span>
                                <p v-show="!isCollapse">首页</p>
                            </div>
                            <div class="wrapper arrow-wrapper">
                                <i :class="['el-icon-arrow-right',{'rotate-down':curr==='1'}]"></i>
                            </div>
                        </router-link>
                    </div>
                </div>
            </li>
            <li>
                <div :class="['menu-parent',{'collapse-menu':isCollapse}]">
                    <div :class="['menu-item',{'collapse-menu':isCollapse}]" @click="toggleMenu('2')">
                        <!--<i class="el-icon-service"></i>-->
                        <div class="wrapper">
                            <span class="menu-icon customer-management-icon"></span>
                            <p v-show="!isCollapse">客户管理</p>
                        </div>
                        <div class="wrapper arrow-wrapper">
                            <i :class="['el-icon-arrow-right',{'rotate-down':curr==='2'}]"></i>
                        </div>
                    </div>
                    <el-collapse-transition>
                        <ul :class="['child-menu',{'collapse-menu':isCollapse}]" v-show="curr==='2'"
                            @click="clearChildMenu">
                            <li>
                                <router-link to="/customerInformation">
                                    <!--<i class="el-icon-info"></i>-->
                                    <p>客户信息</p>
                                </router-link>
                            </li>
                            <li>
                                <router-link to="/customerShare">
                                    <!--<i class="el-icon-share"></i>-->
                                    <p>分享关系</p>
                                </router-link>
                            </li>
                        </ul>
                    </el-collapse-transition>
                </div>
            </li>
            <li>
                <div :class="['menu-parent',{'collapse-menu':isCollapse}]">
                    <div :class="['menu-item',{'collapse-menu':isCollapse}]" @click="toggleMenu('3')">
                        <!--<i class="el-icon-setting"></i>-->
                        <div class="wrapper">
                            <span class="menu-icon content-management-icon"></span>
                            <p v-show="!isCollapse">内容管理</p>
                        </div>
                        <div class="wrapper arrow-wrapper">
                            <i :class="['el-icon-arrow-right',{'rotate-down':curr==='3'}]"></i>
                        </div>
                    </div>
                    <el-collapse-transition>
                        <ul :class="['child-menu',{'collapse-menu':isCollapse}]" v-show="curr==='3'"
                            @click="clearChildMenu">
                            <li>
                                <router-link to="/publishArticle">
                                    <!--<i class="el-icon-edit"></i>-->
                                    <p>发布文章</p>
                                </router-link>
                            </li>
                            <li>
                                <router-link to="/circleManagement">
                                    <!--<i class="el-icon-edit"></i>-->
                                    <p>圈子管理</p>
                                </router-link>
                            </li>
                        </ul>
                    </el-collapse-transition>
                </div>
            </li>
            <li>
                <div :class="['menu-parent',{'collapse-menu':isCollapse}]">
                    <div :class="['menu-item',{'collapse-menu':isCollapse}]" @click="toggleMenu('4')">
                        <!--<i class="el-icon-setting"></i>-->
                        <div class="wrapper">
                            <span class="menu-icon system-management-icon"></span>
                            <p v-show="!isCollapse">系统管理</p>
                        </div>
                        <div class="wrapper arrow-wrapper">
                            <i :class="['el-icon-arrow-right',{'rotate-down':curr==='4'}]"></i>
                        </div>
                    </div>
                    <el-collapse-transition>
                        <ul :class="['child-menu',{'collapse-menu':isCollapse}]" v-show="curr==='4'"
                            @click="clearChildMenu">
                            <li>
                                <router-link to="/userManagement">
                                    <!--<i class="el-icon-success"></i>-->
                                    <p>用户管理</p>
                                </router-link>
                            </li>
                            <li>
                                <router-link to="/roleManagement">
                                    <!--<i class="el-icon-success"></i>-->
                                    <p>角色管理</p>
                                </router-link>
                            </li>
                            <li>
                                <router-link to="/permissionManagement">
                                    <!--<i class="el-icon-error"></i>-->
                                    <p>权限资源</p>
                                </router-link>
                            </li>
                        </ul>
                    </el-collapse-transition>
                </div>
            </li>
        </ul>
    </div>
</template>
<style lang="scss" scoped>
    .menu-container {
        .menu-top {
            height: 145px;
            border-bottom: 1px solid #3e444e;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            .logo {
                margin-left: 20px;
                p {
                    font-size: 0.9rem;
                    text-align: center;
                }
            }
            .collapse-icon {
                width: 30px;
                height: 30px;
                margin: 0 15px;
                -webkit-border-radius: 5px;
                -moz-border-radius: 5px;
                border-radius: 5px;
                background: #2b303a url(../common/images/collapse.png) no-repeat;
                cursor: pointer;
            }
        }
        .menu-parent {
            &.collapse-menu {
                position: relative;
            }
        }
        .menu-item {
            color: #c1c1c1;
            line-height: 2.6rem;
            height: 2.6rem;
            border-bottom: 1px solid #3e444e;
            text-indent: 1rem;
            font-size: 0.9rem;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            position: relative;

            .wrapper {
                flex-grow: 1;
                display: flex;
                align-items: center;
                justify-content: flex-start;

                &.arrow-wrapper {
                    flex-grow: 0;
                    margin-right: 15px;
                }
            }
            .menu-icon {
                display: inline-block;
                width: 22px;
                height: 22px;
                margin: 0 0 0 20px;
                /*border: 1px solid red;*/
                &.homepage-icon, &.content-management-icon {
                    background: url(../common/images/content-management.png) no-repeat 0 0;
                }
                &.customer-management-icon {
                    background: url(../common/images/user-management.png) no-repeat 0 0;
                }
                &.system-management-icon {
                    background: url(../common/images/system-management.png) no-repeat 0 0;
                }
            }
        }
        .child-menu {
            color: #c1c1c1;
            line-height: 2.6rem;
            font-size: 0.9rem;
            background-color: #2b303a;
            text-indent: 58px;
            li {
                border-bottom: 1px solid #3e444e;
                white-space: nowrap;
            }

            &.collapse-menu {
                position: absolute;
                left: 60px;
                top: 0;
                z-index: 100;
                text-indent: 0;
                li {
                    padding: 0 15px;
                }
            }
        }
        a {
            color: #c1c1c1;
            text-decoration: none;
            flex-grow: 1;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-start;
        }
    }
</style>
<script>
    export default {
        data() {
            return {
                curr: null,
                logoUrl: require('../common/images/logo.png'),
                menuTitle: '客户管理系统-CRM',
                isCollapse: false
            }
        },
        mounted() {
            let _this = this;

            window.Bus.$on('resize-window', function (isCollapse) {
                //如果是折叠的小菜单，则把子菜单浮层收起
                _this.isCollapse = isCollapse;
            });
            window.Bus.$on('clear-child-menu', function () {
                //如果是折叠的小菜单，则把子菜单浮层收起
                if (_this.isCollapse) {
                    _this.curr = null;
                }
            });
            window.Bus.$on('clear-child-menu', function () {
                //如果是折叠的小菜单，则把子菜单浮层收起
                if (_this.isCollapse) {
                    _this.curr = null;
                }
            });
        },
        methods: {
            toggleMenu(curr) {
                if (this.curr === curr) {
                    this.curr = null;
                } else {
                    this.curr = curr;
                }
            },
            collapseMenu() {
                this.isCollapse = !this.isCollapse;
                this.$emit('collapse-menu', this.isCollapse);
            },
            clearChildMenu() {
                window.Bus.$emit("clear-child-menu");
            }
        }
    }
</script>