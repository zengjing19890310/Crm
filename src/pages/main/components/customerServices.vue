<template>
    <div class="outer-container">
        <section class="main" v-loading="getDataLock" element-loading-text="加载中...">
            <aside class="chart-list">
                <!--聊天列表-->
                <ul>
                    <li :class="['chart-target',{active:chartTarget.username===target.username}]"
                        v-for="(target,index) in chartList">
                        <div class="image-wrapper">
                            <img :src="target.url" alt="">
                        </div>
                        <p class="username">
                            {{target.username}}
                        </p>
                        <p class="message-count">
                            {{target.unread > 99 ? '99+' : target.unread}}
                        </p>
                        <!--{{target.username}}-->
                    </li>
                </ul>
            </aside>
            <div class="chart-container">
                <div class="chart-content">
                    <div class="content-wrapper" id="content-wrapper">
                        <ul class="chart-content" id="chart-content">
                            <!--from: message.from,-->
                            <!--to: message.to,-->
                            <!--message: message.data,-->
                            <!--timeStamp: timeStamp,-->
                            <!--type: 'text'-->
                            <li v-for="(item,index) in logs" :key="index"
                                class="message">
                                <div style="text-align: center" v-if="item.showTime">
                                    {{timeFormatter(item.timeStamp)}}
                                </div>
                                <div :class="{'my-message':item.from===currentUser.username,'other-message':item.to===currentUser.username}">
                                    <div v-show="item.to===currentUser.username">
                                        <!--他人头像-->
                                        <img class="icon" :src="chartTarget.url" alt="">
                                    </div>
                                    <div v-if="item.type==='txt'" class="message-wrapper">
                                        <pre v-html="item.message"> {{item.message}} </pre>
                                    </div>
                                    <div v-show="item.from===currentUser.username">
                                        <!--我的头像-->
                                        <img class="icon" :src="currentUser.url" alt="">
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div class="input-wrapper">
                        <header class="controller-bar">
                            <div class="button face-button" @click="selectFace">
                                <!--<div></div>-->
                            </div>
                            <div class="button pic-button" @click="selectImage">
                                <input type="file" ref="image" id="image" name="file" @change="sendImageMessage" v-show="false">
                            </div>
                        </header>
                        <chart-component @enter-press="sendMessage" v-model="message"
                                         :canEdit="canEdit"></chart-component>
                        <footer>
                            <el-button type="primary" size="mini" @click="sendMessage">
                                发送
                            </el-button>
                        </footer>
                    </div>
                </div>
                <aside class="chart-target-information">
                    聊天对象信息
                </aside>
            </div>
        </section>
    </div>
</template>

<script>
    let chartScrollToBottom = () => {
        let contentWrapper = document.getElementById('content-wrapper'),
            chartContent = document.getElementById('chart-content');
        setTimeout(function(){
            if(chartContent.clientHeight>contentWrapper.clientHeight){
                let outerHeight = contentWrapper.clientHeight,
                    innerHeight = chartContent.clientHeight;
                //需要滚动的距离
                contentWrapper.scrollTop = innerHeight-outerHeight;
            }
        },0);
    };

    let util = require('../../../common/util');

    import chartComponent from "./common/chartComponent.vue";

    export default {
        components: {
            "chart-component": chartComponent
        },
        data() {
            return {
                chartList: [
                    {
                        username: "user001",
                        url: "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3787911176,2095677006&fm=27&gp=0.jpg",
                        unread: 2
                    },
                    {
                        username: "kefu001",
                        url: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1513844788329&di=47755f24c1fdd90594d8571420e66a80&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fimgad%2Fpic%2Fitem%2Fd009b3de9c82d15857f46e8c8b0a19d8bc3e429c.jpg",
                        unread: 215
                    }
                ],
                getDataLock: false,
                connect: null,
                logs: [],
                message: "",
                chartTarget: {
                    username: "user001",
                    nickname: "用户001",
                    url: "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3787911176,2095677006&fm=27&gp=0.jpg"
                },
                messageType: "txt",
                currentUser: {
                    username: "kefu001",
                    nickname: "客服001",
                    url: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1513844788329&di=47755f24c1fdd90594d8571420e66a80&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fimgad%2Fpic%2Fitem%2Fd009b3de9c82d15857f46e8c8b0a19d8bc3e429c.jpg"
                },
                canEdit: false,
                lastMessageTime: null
            }
        },
        methods: {
            sendImageMessage() {
                console.log("发送图片消息");
            },
            timeFormatter: util.timeFormatter,
            sendMessage() {
                if (!this.message || !this.message.trim()) {
                    this.$message({
                        type: "warning",
                        message: "不能发送空消息"
                    });
                    return;
                }
                console.log("发送消息", this.message);
                let _this = this;
                // 生成本地消息id
                let id = this.connect.getUniqueId();
                // 创建文本消息
                let msg = new WebIM.message(this.messageType, id);

                if (this.chartTarget.username) {
                    //消息时间
                    let timeStamp = Date.parse(new Date()),
                        message = this.message,
                        showTime = true;
                    if (timeStamp - this.lastMessageTime < 2 * 60 * 1000) {
                        showTime = false;
                    } else {
                        this.lastMessageTime = timeStamp;
                    }
                    msg.set({
                        // 消息内容
                        msg: this.message,
                        // 接收消息对象（用户id）
                        to: this.chartTarget.username,
                        roomType: false,
                        success: function (id, serverMsgId) {
                            let obj = {
                                from: _this.currentUser.username,
                                fromNickname: _this.currentUser.nickname,
                                to: _this.chartTarget.username,
                                message: message,
                                timeStamp: timeStamp,
                                type: _this.messageType,
                                showTime: showTime
                            };
                            _this.logs.push(obj);
                            _this.message = "";
                            chartScrollToBottom();
                        },
                        fail: function (e) {
                            _this.$message({
                                type: "error",
                                message: "消息发送失败"
                            })
                        }
                    });
                    msg.body.chatType = 'singleChat';
                    //文字消息
                    this.connect.send(msg.body);
                } else {
                    _this.$message({
                        type: "error",
                        message: "消息发送失败"
                    });
                }

            },
            selectFace() {
                console.log("选择表情");
            },
            selectImage() {
                this.$refs.image.click();
                console.log("选择图片");
            },
            initConnect() {
                this.connect = new WebIM.connection({
                    isMultiLoginSessions: WebIM.config.isMultiLoginSessions,
                    https: typeof WebIM.config.https === 'boolean' ? WebIM.config.https : location.protocol === 'https:',
                    url: WebIM.config.xmppURL,
                    heartBeatWait: WebIM.config.heartBeatWait,
                    autoReconnectNumMax: WebIM.config.autoReconnectNumMax,
                    autoReconnectInterval: WebIM.config.autoReconnectInterval,
                    apiUrl: WebIM.config.apiURL,
                    isAutoLogin: true
                });
            },
            addListener() {
                let _this = this;
                //给连接增加各种监听事件
                this.connect.listen({
                    //连接成功回调
                    onOpened: function (res) {
                        // 如果isAutoLogin设置为false，那么必须手动设置上线，否则无法收消息
                        // 手动上线指的是调用conn.setPresence(); 如果conn初始化时已将isAutoLogin设置为true
                        // 则无需调用conn.setPresence();
                    },
                    //连接关闭回调
                    onClosed: function (message) {
                        _this.$message({
                            type: "error",
                            message: "连接关闭"
                        });
                    },
                    //收到文本消息
                    onTextMessage: function (message) {
                        let timeStamp = new Date(),
                            showTime = true;
                        if (message.delay) {
                            timeStamp = message.delay;
                        }
                        if (timeStamp - _this.lastMessageTime < 2 * 60 * 1000) {
                            showTime = false;
                        } else {
                            _this.lastMessageTime = timeStamp;
                        }
                        _this.logs.push({
                            from: message.from,
                            to: message.to,
                            message: message.data,
                            timeStamp: timeStamp,
                            showTime: showTime,
                            type: 'txt'
                        });
                        chartScrollToBottom();
                    },
                    //收到表情消息
                    onEmojiMessage: function (message) {
                        console.log("收到表情消息");
                        console.log(message);
                    },
                    //收到图片消息
                    onPictureMessage: function (message) {
                        console.log("Location of Picture is ", message.url);
                    },
                    //收到命令消息
                    onCmdMessage: function (message) {
                    },
                    //收到音频消息
                    onAudioMessage: function (message) {
                    },
                    //收到位置消息
                    onLocationMessage: function (message) {
                    },
                    //收到文件消息
                    onFileMessage: function (message) {
                    },
                    //收到视频消息
                    onVideoMessage: function (message) {
                        let node = document.getElementById('privateVideo');
                        let option = {
                            url: message.url,
                            headers: {
                                'Accept': 'audio/mp4'
                            },
                            onFileDownloadComplete: function (response) {
                                let objectURL = WebIM.utils.parseDownloadResponse.call(_this.connect, response);
                                node.src = objectURL;
                            },
                            onFileDownloadError: function () {
                                console.log('File down load error.')
                            }
                        };
                        WebIM.utils.download.call(_this.connect, option);
                    },
                    //处理“广播”或“发布-订阅”消息，如联系人订阅请求、处理群组、聊天室被踢解散等消息
                    onPresence: function (message) {
                    },
                    //处理好友申请
                    onRoster: function (message) {
                    },
                    //处理群组邀请
                    onInviteMessage: function (message) {
                    },
                    //本机网络连接成功
                    onOnline: function () {
                        console.log('本机网络连接成功')
                    },
                    //本机网络掉线
                    onOffline: function () {
                        console.log('本机网络掉线');
                    },
                    //失败回调
                    onError: function (message) {
                        //console.error(message);
                    },
                    //黑名单变动
                    onBlacklistUpdate: function (list) {
                        // 查询黑名单，将好友拉黑，将好友从黑名单移除都会回调这个函数，list则是黑名单现有的所有好友信息
                        console.log(list);
                    },
                    //收到消息送达服务器回执
                    onReceivedMessage: function (message) {
                        console.log(new Date());
                        console.log('消息送达服务器', message);
                        //消息送达服务器的时间
                    },
                    //收到消息送达客户端回执
                    onDeliveredMessage: function (message) {
                        console.log('消息送达客户端', message);
                    },
                    //收到消息已读回执
                    onReadMessage: function (message) {
                        console.log('消息已读', message);
                    },
                    //创建群组成功回执（需调用createGroupNew）
                    onCreateGroup: function (message) {
                    },
                    //如果用户在A群组被禁言，在A群发消息会走这个回调并且消息不会传递给群其它成员
                    onMutedMessage: function (message) {
                    }
                });
            },
            autoLogin() {
                let _this = this;
                let options = {
                    apiUrl: WebIM.config.apiURL,
                    user: "kefu001",
                    pwd: "123",
                    appKey: WebIM.config.appkey,
                    success: function (res) {
                        _this.$message({
                            type: 'success',
                            message: '登录成功'
                        });
                        _this.canEdit = true;
//                        if (res.user.nickname) {
//                            _this.fromNickname = res.user.nickname;
//                        }
//                        //设置消息传达的目标
//                        if (_this.userLogin.username === "user001") {
//                            _this.targetUser = "kefu001";
//                        } else if (_this.userLogin.username === "kefu001") {
//                            _this.targetUser = "user001";
//                        }
                    },
                    error: function () {
                        console.error('登录失败');
                        _this.canEdit = false;
                        _this.autoLogin();
                    }
                };
                this.connect.open(options);
            }
        },
        mounted() {
            this.initConnect();
            this.addListener();
            this.autoLogin();
        }
    }
</script>

<style lang="scss" scoped>
    @import "common/style/main";

    .main {
        padding: 0.5rem;
        flex-direction: row;
        .chart-list {
            flex-grow: 0;
            width: 175px;
            align-items: stretch;
            overflow-y: auto;
            background-color: rgba(215, 215, 215, 1);
            .chart-target {
                height: 50px;
                display: flex;
                align-items: center;
                cursor: pointer;
                &.active {
                    background-color: rgba(242, 242, 242, 1);
                }
                .image-wrapper {
                    width: 50px;
                    height: 100%;
                    flex-shrink: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    img {
                        vertical-align: middle;
                        display: block;
                        width: 40px;
                        height: 40px;
                        background-color: #ddd;
                        -webkit-border-radius: 50%;
                        -moz-border-radius: 50%;
                        border-radius: 50%;
                    }
                }
                .username {
                    flex-grow: 1;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    font-size: 0.8rem;
                }
                .message-count {
                    min-width: 16px;
                    height: 16px;
                    line-height: 16px;
                    font-size: 0.7rem;
                    text-align: center;
                    margin-right: 0.5rem;
                    padding: 0 8px;
                    -webkit-border-radius: 8px;
                    -moz-border-radius: 8px;
                    border-radius: 8px;
                    color: #fff;
                    background-color: #ff7676;
                }
            }
        }
        .chart-container {
            flex-grow: 1;
            /*border: 1px solid #ddd;*/
            display: flex;
            .chart-content {
                flex-grow: 1;
                display: flex;
                flex-direction: column;
                .content-wrapper {
                    flex-grow: 1;
                    background-color: rgba(242, 242, 242, 1);
                    overflow-y: auto;
                    overflow-x: hidden;
                    .chart-content {
                        padding:0.5rem 0.5rem 0 0.5rem;
                    }
                    .message {
                        margin-bottom: 0.5rem;
                        > div {
                            .icon {
                                display: block;
                                height: 40px;
                                width: 40px;
                                border-radius: 20px;
                            }
                            &.my-message {
                                display: flex;
                                align-items: flex-start;
                                justify-content: flex-end;
                            }
                            &.other-message {
                                display: flex;
                                align-items: flex-start;
                                justify-content: flex-start;
                            }

                            .message-wrapper {
                                word-wrap: break-word;
                                margin: 0 0.5rem;
                                padding: 0.8rem;
                                background-color: #fff;
                                border-radius: 5px;
                            }
                        }

                    }
                }
                .input-wrapper {
                    height: 130px;
                    display: flex;
                    flex-direction: column;
                    flex-shrink: 0;
                    .controller-bar {
                        flex-shrink: 0;
                        display: flex;
                        .button {
                            width: 32px;
                            height: 32px;
                            margin: 0 0.5rem;
                            cursor: pointer;
                            &.face-button {
                                background: url("../images/face.png") no-repeat 0 0;
                            }
                            &.pic-button {
                                background: url("../images/image.png") no-repeat 0 0;
                            }
                        }
                    }
                    footer {
                        flex-shrink: 0;
                        text-align: right;
                    }
                }
            }
            .chart-target-information {
                flex-shrink: 0;
                margin-left: 0.5rem;
                width: 187px;
                background-color: rgba(242, 242, 242, 1);
                /*border: 1px solid #000;*/
            }
        }
    }
</style>