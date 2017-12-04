<template>
    <div class="outer-container">
        <section class="main">
            <header style="line-height:50px;">
                {{title}}
            </header>
            <div class="form-container">
                <div>
                    <header>
                        测试注册
                    </header>
                    <el-form :label-position="left" label-width="80px" :model="userRegister">
                        <el-form-item label="用户名">
                            <el-input v-model="userRegister.username" required></el-input>
                        </el-form-item>
                        <el-form-item label="密码">
                            <el-input v-model="userRegister.password" required></el-input>
                        </el-form-item>
                        <el-form-item label="密码">
                            <el-button type="primary" @click="submitForm('userRegister')">注册</el-button>
                            <el-button @click="resetForm('userRegister')">重置</el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <div>
                    <header>
                        测试登录
                    </header>
                    <el-form :label-position="left" label-width="80px" :model="userLogin">
                        <el-form-item label="用户名">
                            <el-input v-model="userLogin.username" required></el-input>
                        </el-form-item>
                        <el-form-item label="密码">
                            <el-input v-model="userLogin.password" required></el-input>
                        </el-form-item>
                        <el-form-item label="密码">
                            <el-button type="primary" @click="submitForm('userLogin')">登录</el-button>
                            <el-button @click="resetForm('userLogin')">重置</el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <div>
                    <header>
                        发送消息
                    </header>
                    <div>
                        <el-input type="textarea" v-model="message"></el-input>
                        <el-button type="primary" style="margin-top:1rem;" @click="sendMessage">
                            发送消息
                        </el-button>
                    </div>
                </div>
                <div class="message-panel">
                    <header>
                        接收消息
                    </header>
                    <div class="message-wrapper">
                        <!--一条文字消息包含from,to,message,timeStamp四个要素-->
                        <!--from字段要与本地当前登录用户比对，确定这条消息是自己发出还是从其他人处收到-->
                        <div v-for="(log,index) in logs" :key="index"
                             :class="['message',{'my-message':log.from===userLogin.username,'other-message':log.to===userLogin.username}]">
                            <div :class="{'my-message':log.from===userLogin.username,'other-message':log.to===userLogin.username}">
                                {{timeFormatter(log.timeStamp)}}
                                <div>
                                    <span v-if="log.from===userLogin.username">我</span>
                                    <span v-else>{{log.from}}</span>
                                    对
                                    <span v-if="log.to===userLogin.username">我</span>
                                    <span v-else>{{log.to}}</span>
                                    说:
                                </div>
                                <div v-if="log.type==='text'">
                                    {{log.message}}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
    let util = require('../../../common/util');
    export default {
        data() {
            return {
                logs: [],
                //测试user1和user123之间对发消息
                title: '测试环信IM',
                connect: null,
                userRegister: {
                    username: '',
                    password: ''
                },
                userLogin: {
                    username: '',
                    password: ''
                },
                message: '',
                targetUser: null,
            }
        },
        methods: {
            timeFormatter: util.timeFormatter,
            sendMessage() {
                let _this = this;
                // 生成本地消息id
                let id = this.connect.getUniqueId();
                // 创建文本消息
                let msg = new WebIM.message('txt', id);

                if (this.targetUser) {
                    //消息时间
                    let timeStamp = Date.parse(new Date()),
                        type = 'text';
                    msg.set({
                        // 消息内容
                        msg: this.message,
                        // 接收消息对象（用户id）
                        to: this.targetUser,
                        roomType: false,
                        success: function (id, serverMsgId) {
//                            console.log('send private text Success');
//                            console.log(id, serverMsgId);
                            let obj = {
                                from: _this.userLogin.username,
                                to: _this.targetUser,
                                message: _this.message,
                                timeStamp: timeStamp,
                                type: type
                            };
                            _this.logs.push(obj);
                            _this.message = '';
                        },
                        fail: function (e) {
//                            console.log("Send private text error");
                        }
                    });
                    msg.body.chatType = 'singleChat';
                    msg.body.ext.timeStamp = timeStamp;
                    //文字消息
                    msg.body.ext.type = type;
                    this.connect.send(msg.body);
                } else {
                    this.$message({
                        type: 'error',
                        message: '消息没有可到达的目标'
                    })
                }
            },
            reigster(user) {
                let options = {
                    username: user.username,
                    password: user.password,
                    nickname: user.username,
                    appKey: WebIM.config.appkey,
                    success: function () {
                        console.log('注册成功')
                    },
                    error: function () {
                        console.error('注册失败');
                    },
                    apiUrl: WebIM.config.apiURL
                };
                if (this.connect) {
                    this.connect.registerUser(options);
                }
            },
            login(user) {
                let _this = this;
                let options = {
                    apiUrl: WebIM.config.apiURL,
                    user: user.username,
                    pwd: user.password,
                    appKey: WebIM.config.appkey,
                    success: function (res) {
                        console.log('登录成功');
//                        console.log(_this，res);

                        //设置消息传达的目标
                        if (_this.userLogin.username === "user1") {
                            _this.targetUser = "user123";
                        } else if (_this.userLogin.username === "user123") {
                            _this.targetUser = "user1";
                        }
                    },
                    error: function () {
                        console.error('登录失败');
                    }
                };
                this.connect.open(options);
            },
            submitForm(key) {
//                console.log('提交表单', key);
                if (key === "userRegister") {
                    this.reigster(this.userRegister);
                } else if (key === "userLogin") {
                    this.login(this.userLogin);
                }
            },
            resetForm(key) {
                if (key === "userRegister") {
                    this.userRegister = {
                        username: '',
                        password: ''
                    }
                } else if (key === "userLogin") {
                    this.userLogin = {
                        username: '',
                        password: ''
                    }
                }
            }
        },
        mounted() {
            let _this = this;
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

            this.connect.listen({
                onOpened: function (res) {          //连接成功回调
                    // 如果isAutoLogin设置为false，那么必须手动设置上线，否则无法收消息
                    // 手动上线指的是调用conn.setPresence(); 如果conn初始化时已将isAutoLogin设置为true
                    // 则无需调用conn.setPresence();
//                    console.log('成功打开连接', res);
//                    console.log('登录返回的token为:', res.accessToken);
                },
                onClosed: function (message) {
                },         //连接关闭回调
                onTextMessage: function (message) {
                    console.log(message);
                    _this.logs.push({
                        from: message.from,
                        to: message.to,
                        message: message.data,
                        timeStamp: message.ext.timeStamp,
                        type: message.ext.type
                    })
                },    //收到文本消息
                onEmojiMessage: function (message) {
                },   //收到表情消息
                onPictureMessage: function (message) {
                }, //收到图片消息
                onCmdMessage: function (message) {
                },     //收到命令消息
                onAudioMessage: function (message) {
                },   //收到音频消息
                onLocationMessage: function (message) {
                },//收到位置消息
                onFileMessage: function (message) {
                },    //收到文件消息
                onVideoMessage: function (message) {
                    var node = document.getElementById('privateVideo');
                    var option = {
                        url: message.url,
                        headers: {
                            'Accept': 'audio/mp4'
                        },
                        onFileDownloadComplete: function (response) {
                            var objectURL = WebIM.utils.parseDownloadResponse.call(conn, response);
                            node.src = objectURL;
                        },
                        onFileDownloadError: function () {
                            console.log('File down load error.')
                        }
                    };
                    WebIM.utils.download.call(conn, option);
                },   //收到视频消息
                onPresence: function (message) {
                },       //处理“广播”或“发布-订阅”消息，如联系人订阅请求、处理群组、聊天室被踢解散等消息
                onRoster: function (message) {
                },         //处理好友申请
                onInviteMessage: function (message) {
                },  //处理群组邀请
                onOnline: function () {
                },                  //本机网络连接成功
                onOffline: function () {
                },                 //本机网络掉线
                onError: function (message) {
                },          //失败回调
                onBlacklistUpdate: function (list) {       //黑名单变动
                    // 查询黑名单，将好友拉黑，将好友从黑名单移除都会回调这个函数，list则是黑名单现有的所有好友信息
                    console.log(list);
                },
                onReceivedMessage: function (message) {
                },    //收到消息送达服务器回执
                onDeliveredMessage: function (message) {
                },   //收到消息送达客户端回执
                onReadMessage: function (message) {
                },        //收到消息已读回执
                onCreateGroup: function (message) {
                },        //创建群组成功回执（需调用createGroupNew）
                onMutedMessage: function (message) {
                }        //如果用户在A群组被禁言，在A群发消息会走这个回调并且消息不会传递给群其它成员
            });
        }
    }
</script>

<style lang="scss" scoped>
    .main {
        position: absolute;
        top: 2rem;
        left: 1rem;
        bottom: 3.4rem;
        right: 1rem;
        padding: 0 1rem 1rem 1rem;
        background-color: #fff;
        overflow: auto;
        .form-container {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            > div {
                border: 1px solid #ddd;
                padding: 1rem;
                margin: 1rem;
                flex-grow: 1;
                header {
                    line-height: 30px;
                    text-align: center;
                }
            }
        }
        .message-panel {
            display: flex;
            flex-direction: column;
            .message {
                display: flex;
                &.my-message {
                    justify-content: flex-start;
                }
                &.other-message {
                    justify-content: flex-end;
                }
                & > div {
                    width: 50%;
                }
                .my-message {
                    text-align: left;
                }
                .other-message {
                    text-align: right;
                }
            }
        }
    }
</style>