<template>
    <div class="outer-container">
        <section class="main">
            <video-overview :overview-data="courseData">
                <template slot="intro">
                    <footer class="overview-footer">
                        <h4 class="overview-description">
                            {{courseData.description}}
                        </h4>
                        <div class="overview-information">
                            <p class="price">&yen; : {{courseData.price}}</p>
                            <p class="level">视频等级 : {{courseData.level}}</p>
                        </div>
                    </footer>
                </template>
            </video-overview>
        </section>
    </div>
</template>

<script>
    import videoOverview from "./common/videoOverview.vue";

    export default {
        data() {
            return {
                courseId: null,
                courseData: {},
            }
        },
        created() {
            let params = this.$route.params;
            if (params) {
                this.courseId = params.courseId;
                this.fetchCourseData();
            }
        },
        methods: {
            fetchCourseData() {
                this.$http({
                    url: API(`/video/${this.courseId}`),
                    method: "get"
                }).then(
                    (res) => {
                        let response = res.body;
                        if (response) {
                            if (response.code === 0 && response.msg === "成功") {
                                this.courseData = response.data;
                            }
                        }
                        console.log(this.courseData);
//                        console.log(res);
                    },
                    (res) => {

                    }
                );
            }
        },
        components: {
            "video-overview": videoOverview
        }
    }
</script>

<style lang="scss" scoped>
    @import "./common/style/main";

    .overview-footer {
        width: 60%;
        margin: 0 auto;
        padding: 0.5rem 0;
        .overview-description {
            flex-shrink: 0;
            font-size: 0.9rem;
            line-height: 1.2rem;
            max-height:3.6rem;
            word-break: break-all;
            overflow-y: scroll;
        }
        .overview-information {
            display: flex;
            font-size: 0.8rem;
            line-height: 1rem;
            margin-top: 0.5rem;
            .price {
                color: #FF5918;
                margin-right:1rem;
            }
            .level {
                color: #aaa;
            }
        }
    }
</style>