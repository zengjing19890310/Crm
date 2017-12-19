<template>
    <div class="overview-container">
        <div class="overview-wrapper">
            <iframe width="100%" :height="videoHeight" :src="url" frameborder="0" allowfullscreen></iframe>
        </div>
        <slot name="intro">

        </slot>
    </div>
</template>

<script>
    import util from "../../../../common/util";
    export default {
        props: {
            overviewData: Object
        },
        data() {
            return {
                url: "https://v.qq.com/iframe/player.html?vid=i05108xgvsi&tiny=0&auto=0",
                videoHeight: 0,
                resizeLock: false
            }
        },
        mounted() {
            //给window添加事件监听
            window.addEventListener('resize', this.calcHeight);
        },
        watch: {
            overviewData(value) {
                if (value.url) {
                    this.url = util.fetchSrc(value.url);
                    //获取到数据后,计算一次高度
                    setTimeout(()=>{
                        this.calcHeight();
                    },0);
                }
            }
        },
        methods: {
            calcHeight() {
                if(!this.resizeLock){
                    this.resizeLock = true;
                    let overviewWrapperHeight = document.getElementsByClassName("overview-wrapper");
                    this.videoHeight = overviewWrapperHeight[0].clientHeight;
                    setTimeout(()=>{
                        this.resizeLock = false;
                    },400);
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .overview-container {
        /*border: 1px solid #ddd;*/
        flex-grow: 1;
        margin-top: 0.5rem;
        display: flex;
        flex-direction: column;
        .overview-wrapper {
            flex-grow: 1;
            margin: 0 auto;
            border: 1px solid #ddd;
            display: flex;
            justify-content: center;
            align-items: stretch;
            width: 60%;
        }
    }
</style>