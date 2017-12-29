<template>
    <div class="post-item" @click.stop="showModal">
        <header class="post-title">
            {{postData.title}}
        </header>
        <!--<div class="post-digest ql-editor" v-html="postData.content">-->
        <!--&lt;!&ndash;显示摘要&ndash;&gt;-->
        <!--&lt;!&ndash;{{postData.content}}&ndash;&gt;-->
        <!--</div>-->
        <div class="post-overview">
            <div class="post-url">
                <img :src="postData.articleImg" alt="">
            </div>
            <!--<div class="post-digest">-->
                <!--&lt;!&ndash;显示摘要&ndash;&gt;-->
                <!--{{postData.content}}-->
            <!--</div>-->
        </div>

        <footer class="post-information">
            <span style="margin-right: 20px;">撰稿: {{postData.nickname || '-'}}</span>
            <span>创建时间: {{postData.createTime || '-'}}</span>
        </footer>
        <modal-component @edit="editPost" @delete="deletePost" :modal="modal">
            <template slot="overview">
                <i class="modal-overview el-icon-view" size="24" @click="overviewPost"></i>
            </template>
        </modal-component>
    </div>
</template>

<script>
    import modalComponent from "./modal.vue";

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
//            console.log(this.postData);
            window.Bus.$on('clear-modal', () => {
                this.modal = false;
            });
        },
        methods: {
            showModal() {
                window.Bus.$emit("clear-modal");
                this.modal = true;
            },
            editPost() {
                this.$emit("edit-post", this.postData.id, this.postData);
            },
            deletePost() {
                this.$emit("delete-post", this.postData.id, this.index);
            },
            overviewPost() {
                window.open(`../overview/index.html?id=${this.postData.id}`, `预览帖子${this.postData.id}`, `height=667, width=375, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no`)
            }
        },
        components: {
            "modal-component": modalComponent
        }
    }
</script>

<style lang="scss" scoped>
    .post-item {
        box-sizing: border-box;
        width: 18%;
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
        .post-overview {
            display: flex;
            flex-grow: 1;
            flex-shrink: 0;
            .post-url {
                width: 150px;
                flex-grow: 0;
                flex-shrink: 0;
                overflow: hidden;
                img {
                    display: block;
                    height: 100px;
                    width: 150px;
                }
                margin-right:0.5rem;
            }
            /*.post-digest {*/
                /*word-break: break-all;*/
                /*font-size: 0.8rem;*/
                /*line-height: 1rem;*/
                /*flex-grow: 1;*/
                /*color: #7a8190;*/
                /*text-overflow: ellipsis;*/
                /*margin-top: 10px;*/
                /*padding-bottom: 10px;*/
                /*overflow: auto;*/
            /*}*/
        }

        .post-information {
            flex-shrink: 0;
            height: 40px;
            font-size: 0.6rem;
            border-top: 1px solid #d8dce5;
            color: #7a8190;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
        }
        .modal {
            .modal-overview {
                cursor: pointer;
                display: inline-block;
                text-align: center;
                width: 40px;
                height: 40px;
                line-height: 40px;
                border-radius: 5px;
                font-size: 24px;
                background-color: #fff;
                color: #999999;
            }
        }
        .post-digest.ql-editor {
            overflow: hidden;
            word-break: break-all;
            font-size: 0.8rem;
            line-height: 1rem;
            flex-grow: 0;
            flex-shrink: 1;
            padding: 0;
            white-space: normal;
            .overview-content {
                padding: 0 .8rem;
            }
            p {
                font-family: Helvetica;
                font-size: 18px;
                line-height: 32px;
                color: rgb(96, 96, 96);
                //text-align: justify;
                word-wrap: break-word;
            }

            img {
                max-width: 100%;
            }
        }
    }
</style>