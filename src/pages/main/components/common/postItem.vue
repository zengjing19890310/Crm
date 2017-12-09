<template>
    <div class="post-item">
        <header class="post-title">
            {{postData.title}}
        </header>
        <div class="post-digest">
            <!--显示摘要-->
            {{postData.content}}
        </div>
        <footer class="post-information">
            <span>撰稿:{{postData.nickname || '-'}}</span>
            <span>创建时间:{{postData.createTime || '-'}}</span>
        </footer>
    </div>
</template>

<script>
    export default {
        data() {
            return {}
        },
        props: {
            'post-data': Object,
            index: Number
        },
        mounted() {
            console.log(this.postData);
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
        padding: 10px;
        .post-title {
            font-size: 0.8rem;
            color: #303641;
            line-height: 1rem;
        }
        .post-digest {
            word-break: break-all;
        }
    }
</style>