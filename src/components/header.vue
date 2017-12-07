<template>
    <header class="header-container">
        <div class="help" @click="helpCenter">
            <span class="shot-line"></span>
            <div>帮助中心？</div>
        </div>
        <div class="message">
            <span class="shot-line"></span>
            <div @click="testIM">
                消息
                <span class="message-count" v-text="messageCount">

                </span>
            </div>
        </div>
        <div class="user-information">
            <span class="shot-line"></span>
            <div>
                <p>{{userInformation.nickname || '-'}}</p>
                <img class="user-picture" :src="userInformation.photo" alt="头像"/>
            </div>
        </div>
        <div class="logout">
            <span class="shot-line"></span>
            <div @click="logout">
                <p>退出</p>
                <span class="logout-icon"></span>
            </div>
        </div>
    </header>
</template>

<script>
    let getUserInformation = require('../common/userInformation'),
        util = require("../common/util");
    export default {
        data() {
            return {
                messageCount: 5,
                userInformation: {
                    nickname: '',
                    mobile: '',
                    photo: ''
                }
            }
        },
        mounted() {
            //获取用户信息
//            console.log("获取用户信息",this);
            getUserInformation.getUserInformation(this);
        },
        watch: {
            userInformation(userInformation) {
                window.Bus.$on('getUserInformation',(vm) =>{
                    vm.userInformation = userInformation;
                });
            }
        },
        methods: {
            helpCenter() {
                console.log('帮助中心');
            },
            testIM() {
                this.$router.push({
                    path: "/testIM",
                })
            },
            logout() {
                util.logout("normal");
//                this.$message({
//                    type: "warning",
//                    message: "正在登出...",
//                    duration: 1500,
//                    onClose: function () {
//                        window.localStorage.removeItem("access_token");
//                        window.location.href = "../login";
//                    }
//                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .header-container {
        height: 90px;
        border-bottom: 1px solid #eeeeee;
        box-sizing: border-box;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-end;
        font-size: 0.9rem;
        color: #7c7c7c;
        > div {
            position: relative;
            box-sizing: inherit;
            height: 30px;
            line-height: 30px;
            padding-left: 10px;
            .shot-line {
                display: inline-block;
                width: 1px;
                height: 12px;
                background-color: #eee;
                position: absolute;
                left: 0;
                top: 9px;
            }
        }
        .help {
            color: #303641;
            cursor: pointer;
            width: 105px;
        }
        .message {
            width: 95px;
            cursor: pointer;
            .message-count {
                display: inline-block;
                color: #fff;
                width: 26px;
                height: 26px;
                line-height: 26px;
                text-align: center;
                border-radius: 50%;
                background-color: #ff7676;
                margin: 0 5px 0 15px;
            }
        }
        .user-information {
            width: 150px;
            div {
                display: flex;
                flex-direction: row;
                align-items: center;
                p {
                    flex-grow: 1;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;
                }
                .user-picture {
                    flex-shrink: 0;
                    display: inline-block;
                    width: 26px;
                    height: 26px;
                    line-height: 26px;
                    text-align: center;
                    margin-right: 10px;
                    overflow: hidden;
                    background-color: #ddd;
                    border-radius: 50%;
                }
            }

        }
        .logout {
            width: 85px;
            margin-right: 15px;
            color: #18ad69;
            div {
                display: flex;
                flex-direction: row;
                cursor: pointer;
                align-items: center;
                .logout-icon {
                    display: inline-block;
                    flex-shrink: 0;
                    color: #fff;
                    width: 26px;
                    height: 26px;
                    line-height: 26px;
                    text-align: center;
                    border-radius: 50%;
                    background: #18ad69 url(../common/images/logout.png) no-repeat 0 0;
                    margin-left: 10px;
                }
            }
        }
    }
</style>