<template>
    <div class="outer-container">
        <section class="main" v-loading="getDataLock" element-loading-text="加载中...">
            <aside class="chart-list">
                <!--聊天列表-->
                <ul>
                    <li :class="['chart-target',{active:chatTarget.username===target.username}]"
                        v-for="(target,index) in chatList" @click="toggleTarget(target)">
                        <div class="image-wrapper">
                            <img :src="target.headImg" alt="">
                        </div>
                        <p class="username">
                            {{target.nickname}}
                        </p>
                        <!--<p class="message-count">-->
                        <!--{{target.unread > 99 ? '99+' : target.unread}}-->
                        <!--</p>-->
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
                                <div style="text-align: center;line-height: 2.4rem; color:#999;" v-if="item.showTime">
                                    {{timeFormatter(item.timeStamp)}}
                                </div>
                                <div :class="{'my-message':item.from===currentUser.id,'other-message':item.to===currentUser.id}">
                                    <!--item.to===currentUser.id-->
                                    <div v-show="item.to===currentUser.id">
                                        <!--他人头像-->
                                        <img class="icon" :src="chatTarget.headImg" alt="">
                                    </div>
                                    <!--图片消息-->
                                    <div v-if="item.type==='txt'" class="message-wrapper">
                                        <span :class="['arrow',{'my-message-arrow':item.from===currentUser.id,'other-message-arrow':item.to===currentUser.id}]"></span>
                                        <div v-html="item.message"></div>
                                    </div>
                                    <!---->
                                    <div v-if="item.type==='img'" class="message-wrapper">
                                        <span :class="['arrow',{'my-message-arrow':item.from===currentUser.id,'other-message-arrow':item.to===currentUser.id}]"></span>
                                        <img :src="item.url" alt="">
                                    </div>
                                    <div v-show="item.from===currentUser.id">
                                        <!--我的头像-->
                                        <img class="icon" :src="currentUser.headerImg" alt="">
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div class="input-wrapper">
                        <header class="controller-bar">
                            <div class="button face-button" @click.stop="selectFace">
                                <div class="emoji-wrapper" v-show="emojiVisible" @click.stop>
                                    <div v-for="(path,emoji) in emojiList">
                                        <img :src="path" :alt="emoji" @click.stop="addFace(emoji)">
                                    </div>
                                </div>
                            </div>
                            <div class="button pic-button" @click="selectImage">
                                <input type="file" ref="image" id="image" name="file" @change="sendImageMessage"
                                       v-show="false">
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
                <!--<aside class="chart-target-information">-->
                <!--聊天对象信息-->
                <!--{{currentUser.nickname}}-->
                <!--</aside>-->
            </div>
        </section>
    </div>
</template>

<script>
    let getUserInformation = require('../../../common/userInformation');
    let chartScrollToBottom = () => {
        let contentWrapper = document.getElementById('content-wrapper'),
            chartContent = document.getElementById('chart-content');
        setTimeout(function () {
            if (chartContent.clientHeight > contentWrapper.clientHeight) {
                let outerHeight = contentWrapper.clientHeight,
                    innerHeight = chartContent.clientHeight;
                //需要滚动的距离
                contentWrapper.scrollTop = innerHeight - outerHeight;
            }
        }, 300);
    };

    let util = require('../../../common/util');

    import chartComponent from "./common/chartComponent.vue";

    export default {
        computed: {
            emojiList() {
                let emoji = WebIM.Emoji,
                    list = {};
                if (emoji && emoji.map && emoji.path) {

                    _.forEach(emoji.map, (text, name) => {
                        list[name] = `${emoji.path}${text}`
                    });
                }
                return list;
            }
        },
        components: {
            "chart-component": chartComponent
        },
        data() {
            return {
                emojiVisible: false,
                //会话列表
                chatList: [
//                    {
//                        username: "user001",
//                        url: "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3787911176,2095677006&fm=27&gp=0.jpg",
//                        unread: 2,
//                        nickname: "用户001"
//                    },
//                    {
//                        username: "kefu001",
//                        url: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1513844788329&di=47755f24c1fdd90594d8571420e66a80&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fimgad%2Fpic%2Fitem%2Fd009b3de9c82d15857f46e8c8b0a19d8bc3e429c.jpg",
//                        unread: 215,
//                        nickname: "客服001"
//                    }
                ],
                //当前用户
                currentUser: {
//                    username: "kefu001",
//                    nickname: "客服001",
//                    url: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1513844788329&di=47755f24c1fdd90594d8571420e66a80&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fimgad%2Fpic%2Fitem%2Fd009b3de9c82d15857f46e8c8b0a19d8bc3e429c.jpg"
                },
                //聊天目标
                chatTarget: {
//                    username: "user001",
//                    nickname: "用户001",
//                    url: "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3787911176,2095677006&fm=27&gp=0.jpg"
                },
                getDataLock: false,
                connect: null,
                logs: [],
                message: "",

                messageType: "txt",
                canEdit: false,
                lastMessageTime: null,

                //当前用户信息
                userInformation: {}
            }
        },
        created() {
            //获取当前用户信息
            getUserInformation.getUserInformation(this);
        },
        mounted() {
            this.initConnect();
            this.addListener();
            this.fetchUserFriendList();
        },
        watch: {
            userInformation(user) {
                if (user.id) {
                    this.autoLogin(user.id);
                }
            }
        },
        methods: {
            toggleTarget(target) {
                this.chatTarget = target;
                this.logs = [];
            },
            timeFormatter: util.timeFormatter,
            fetchUserFriendList() {
                this.$http({
                    url: API("/sysuser/friends"),
                    method: "get"
                }).then(
                    (res) => {
                        console.log(res);
                    },
                    (res) => {
                        console.error(res);
                    }
                )
            },
            sendMessage() {
                if (!this.message || !this.message.trim()) {
                    this.$message({
                        type: "warning",
                        message: "不能发送空消息"
                    });
                    return;
                }
//                console.log("发送消息", this.message);
                let _this = this;
                // 生成本地消息id
                let id = this.connect.getUniqueId();
                this.messageType = "txt";
                // 创建文本消息
                let msg = new WebIM.message(this.messageType, id);

                if (this.chatTarget.id) {
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
                        to: this.chatTarget.id,
                        roomType: false,
                        success: function (id, serverMsgId) {
                            let messageParse = WebIM.utils.parseEmoji(message);
                            let obj = {
                                from: _this.currentUser.id,
                                fromNickname: _this.currentUser.nickname,
                                to: _this.chatTarget.id,
                                message: messageParse,
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
//                console.log("选择表情");
                this.emojiVisible = !this.emojiVisible;
//                let emoji = WebIM.utils.parseEmoji("[):]");
//                window.Bus.$emit('emoji', emoji);
//                this.message += emoji;
            },
            addFace(emoji) {
                window.Bus.$emit('emoji', emoji);
//                console.log(WebIM.utils.parseEmoji(emoji));
                this.message += emoji;
            },
            selectImage() {
                if (!this.canEdit) {
                    return;
                }
                this.$refs.image.click();
//                console.log("选择图片");
            },
            sendImageMessage() {
                let _this = this;
                // 生成本地消息id
                let id = this.connect.getUniqueId();
                // 创建图片消息
                let msg = new WebIM.message('img', id);
                // 选择图片的input
                let image = document.getElementById('image');
                // 将图片转化为二进制文件
                let file = WebIM.utils.getFileUrl(image);
                this.messageType = "img";
                let allowType = {
                    'jpg': true,
                    'gif': true,
                    'png': true,
                    'bmp': true
                };
                if (file.filetype.toLowerCase() in allowType) {
                    let timeStamp = Date.parse(new Date()),
                        showTime = true;
                    if (timeStamp - this.lastMessageTime < 2 * 60 * 1000) {
                        showTime = false;
                    } else {
                        this.lastMessageTime = timeStamp;
                    }
                    let option = {
                        apiUrl: WebIM.config.apiURL,
                        file: file,
                        // 接收消息对象
                        to: this.chatTarget.id,
                        roomType: false,
                        chatType: 'singleChat',
                        // 消息上传失败
                        onFileUploadError: function (e) {
                            console.error('图片消息上传失败', e);
                        },
                        // 消息上传成功
                        onFileUploadComplete: function () {
                            console.log('图片消息上传成功');
                        },
                        // 消息发送成功
                        success: function (e) {
                            let obj = {
                                from: _this.currentUser.id,
                                fromNickname: _this.currentUser.nickname,
                                to: _this.chatTarget.id,
                                url: file.url,
                                timeStamp: timeStamp,
                                type: _this.messageType,
                                showTime: showTime
                            };
                            _this.logs.push(obj);
                            _this.$nextTick(() => {
                                chartScrollToBottom();
                            });
                        },
                        flashUpload: WebIM.flashUpload
                    };
                    msg.set(option);
                    this.connect.send(msg.body);
                }
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
            checkAndSetTarget(message) {
                let fromUser = message.from;
                //监测消息来源者是否位于chatList列表中
                let checkResult = false;
                _.forEach(this.chatList, (value, index) => {

                });
                if (!checkResult) {
                    this.$http({
                        url: API(`/sysuser/friends/${fromUser}`),
                        method: "post"
                    }).then(
                        (res) => {
                            let response = res.body;
                            if (response && response.code === 0 && response.msg === "成功") {
                                //获取好友列表
                                this.fetchChatList(fromUser);
                            }
                        },
                        (res) => {
                            console.error(res);
                        }
                    )
                } else {
                    //该对话已经存在于好友列表中
//                    this.fetchChatList();
                }
            },
            //获取chatList
            fetchChatList(fromUser) {
                this.$http({
                    url: API("/sysuser/friends"),
                    method: "get"
                }).then(
                    (res) => {
                        let response = res.body;
                        if (response && response.code === 0 && response.msg === "成功") {
                            this.chatList = response.data;
                            if (fromUser) {
                                _.forEach(this.chatList, (target, index) => {
                                    if (target.id === fromUser) {
                                        this.chatTarget = target;
                                    }
                                })
                            }
                        }
                    },
                    (res) => {
                        console.error(res);
                    }
                )
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
                        console.log(message);
                        _this.checkAndSetTarget(message);
                        if (!message || !message.data.trim()) {
                            return;
                        }
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
                        let messageParse = WebIM.utils.parseEmoji(message.data);
                        _this.logs.push({
                            from: message.from,
                            to: message.to,
                            message: messageParse,
                            timeStamp: timeStamp,
                            showTime: showTime,
                            type: 'txt'
                        });
                        chartScrollToBottom();
                    },
                    //收到表情消息
                    onEmojiMessage: function (message) {
                        console.log(message);
                        _this.checkAndSetTarget(message);
                        console.log("收到表情消息", message);
                    },
                    //收到图片消息
                    onPictureMessage: function (message) {
                        console.log(message);
                        _this.checkAndSetTarget(message);
                        if (!message || !message.url.trim()) {
                            return;
                        }
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
                            url: message.url,
                            timeStamp: timeStamp,
                            showTime: showTime,
                            type: 'img'
                        });
                        _this.$nextTick(() => {
                            chartScrollToBottom();
                        });
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
            autoLogin(id) {
                let _this = this;
                let options = {
                    apiUrl: WebIM.config.apiURL,
                    user: id,
                    pwd: "123456",
                    appKey: WebIM.config.appkey,
                    success: function (res) {
                        _this.$message({
                            type: 'success',
                            message: '登录成功'
                        });
                        _this.canEdit = true;
                        //设置本地currentUser
                        _this.currentUser = _this.userInformation;
                        //获取好友列表
                        _this.fetchChatList();
                        //登录成功后,连接SOCKET
                        let token = window.sessionStorage.getItem('token');
                        if (id && token) {
                            //连接socket
                            let webSocket = new WebSocket(`ws://192.168.100.109:8888/websocket/${id}?token=${token}`);
                            webSocket.onerror = function (event) {
                                onError(event)
                            };

                            webSocket.onopen = function (event) {
                                onOpen(event)
                            };

                            webSocket.onmessage = function (event) {
                                onMessage(event)
                            };

                            function onMessage(event) {
                                console.log("onMessage", event);
                            }

                            function onOpen(event) {
                                console.log("打开socket连接", event);
                            }

                            function onError(event) {
                                console.error("onError");
                            }

                            function start() {
                                webSocket.send('hello');
                                return false;
                            }
                        }
                    },
                    error: function () {
                        console.error('登录失败');
                        _this.canEdit = false;
                        _this.autoLogin();
                    }
                };
                this.connect.open(options);
            },
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
            flex-shrink: 0;
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
                        padding: 0.5rem 0.5rem 0 0.5rem;
                    }
                    .message {
                        margin-bottom: 0.5rem;
                        > div {
                            .icon {
                                display: block;
                                height: 40px;
                                width: 40px;
                                border-radius: 20px;
                                background-color: #d7d7d7;
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
                                margin: 0 1rem;
                                padding: 0.8rem;
                                max-width: 30%;
                                background-color: #fff;
                                border-radius: 5px;
                                position: relative;
                                div {
                                    word-break: break-all;
                                    font-size: 0.8rem;
                                    line-height: 1rem;
                                }
                                img {
                                    max-width: 100%;
                                }
                                .arrow {
                                    position: absolute;
                                    top: 0.8rem;
                                    width: 0.6rem;
                                    height: 0.6rem;
                                    background-color: #fff;
                                    -webkit-transform: rotate(45deg);
                                    -moz-transform: rotate(45deg);
                                    -ms-transform: rotate(45deg);
                                    -o-transform: rotate(45deg);
                                    transform: rotate(45deg);
                                    &.my-message-arrow {
                                        right: -4px;
                                    }
                                    &.other-message-arrow {
                                        left: -4px;
                                    }
                                }
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
                                position: relative;
                                .emoji-wrapper {
                                    position: absolute;
                                    left: 0;
                                    bottom: 32px;
                                    padding: 0.5rem;
                                    background-color: #fff;
                                    width: 256px;
                                    display: flex;
                                    flex-wrap: wrap;
                                    align-items: center;
                                    justify-content: flex-start;
                                }
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