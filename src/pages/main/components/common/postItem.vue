<template>
    <div class="post-item" @click.stop="showModal">
        <header class="post-title">
            {{postData.title}}
        </header>
        <div class="post-digest">
            <!--显示摘要-->
            {{postData.content}}
        </div>
        <footer class="post-information">
            <span style="margin-right: 20px;">撰稿:{{postData.nickname || '-'}}</span>
            <span>创建时间:{{postData.createTime || '-'}}</span>
        </footer>
        <transition name="el-fade-in">
            <div class="post-modal" @click.stop v-show="modal">
                <i class="modal-edit" @click="editPost(postData.id)"></i>
                <i class="modal-overview el-icon-view" size="36" @click="overviewPost(postData.id)"></i>
                <i class="modal-delete" @click="deletePost(postData.id)"></i>
            </div>
        </transition>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                modal: false
            }
        },
        props: {
            'post-data': Object,
            index: Number
        },
        mounted() {
            console.log(this.postData);
            window.Bus.$on('clear-modal', () => {
                this.modal = false;
            });
        },
        methods: {
            showModal() {
                window.Bus.$emit("clear-modal");
                this.modal = true;
            },
            editPost(id) {
                this.$emit("edit-post", id, this.postData);
            },
            deletePost(id) {
                this.$emit("delete-post", id, this.index);
            },
            overviewPost(id) {
//                console.log("查看帖子预览", id);
//                let Top = (window.screen.availHeight-667)/2, //获得窗口的垂直位置;
//                    Left = (window.screen.availWidth-375)/2; //获得窗口的水平位置;
                window.open(`../overview/index.html?id=${id}`, `预览帖子${id}`, `height=667, width=375, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no`)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .post-item {
        box-sizing: border-box;
        width: 24%;
        min-width: 285px;
        height: 195px;
        margin: 5px;
        border: 1px solid #d8dce5;
        flex-shrink: 0;
        flex-grow: 0;
        background-color: #fff;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        border-radius: 5px;
        overflow: hidden;
        -webkit-box-shadow: 0 2px 5px 1px rgba(0, 0, 0, .1);
        -moz-box-shadow: 0 2px 5px 1px rgba(0, 0, 0, .1);
        box-shadow: 0 2px 5px 1px rgba(0, 0, 0, .1);
        padding: 15px;
        position: relative;
        .post-title {
            flex-shrink: 0;
            font-size: 1rem;
            color: #303641;
            line-height: 30px;
            height: 30px;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
        }
        .post-digest {
            word-break: break-all;
            font-size: 0.8rem;
            line-height: 1rem;
            flex-grow: 1;
            color: #7a8190;
            text-overflow: ellipsis;
            margin-top: 10px;
            padding-bottom: 10px;
            overflow: auto;
        }
        .post-information {
            height: 40px;
            font-size: 0.8rem;
            line-height: 50px;
            border-top: 1px solid #d8dce5;
            color: #7a8190;
        }
        /*模态框样式*/
        .post-modal {
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            background-color: rgba(48, 54, 65, .5);
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-around;
            > i {
                cursor: pointer;
                display: inline-block;
                text-align: center;
                width: 40px;
                height: 40px;
                line-height: 40px;
                border-radius: 5px;
            }
            .modal-overview {
                background-color: #fff;
                color:#999999;
            }
            .modal-upload {
                background: #fff url(../../../../common/images/modal-upload.png) no-repeat center;
            }
            .modal-edit {
                background: #fff url(../../../../common/images/modal-edit.png) no-repeat center;
            }
            .modal-delete {
                background: #fff url(../../../../common/images/modal-delete.png) no-repeat center;
            }
        }
    }
</style>