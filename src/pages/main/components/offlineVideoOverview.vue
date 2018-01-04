<template>
    <div class="outer-container">
        <section class="main">
            <video-overview :overview-data="courseData">
                <template slot="intro">
                    <footer class="overview-information">
                        <div class="left-information">
                            <h4>{{courseData.title}}</h4>
                            <p>&yen; : {{courseData.money}}</p>
                        </div>
                        <div class="right-information">
                            <p class="apply-status">
                                <span>报名: {{courseData.signUpPerson}}人</span>
                                <span class="short-line"></span>
                                <span>已缴费: {{courseData.signUpPerson}}人</span>
                            </p>
                            <p>
                                开课时间: {{courseData.startTime}}
                            </p>
                            <p>
                                地址: {{courseData.address}}
                            </p>
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
                    url: API(`/course/${this.courseId}`),
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

    .overview-information {
        width: 60%;
        margin: 0 auto;
        padding: 1rem 0;
        display: flex;
        justify-content: space-between;
        align-items: stretch;
        .left-information {
            color: #999;
            h4 {
                color: #333;
                font-size: 1rem;
                line-height: 1.4rem;
            }
            p {
                color: #FF5918;
                font-size: 0.9rem;
                line-height: 1rem;
            }
        }
        .right-information {
            color: #aaa;
            font-size: 0.8rem;
            line-height: 1.2rem;
            .apply-status {
                display: flex;
                align-items: center;
                .short-line {
                    display: inline-block;
                    height: 0.6rem;
                    margin: 0 15px;
                    border-left: 1px solid #aaa;
                }
            }
        }
    }
</style>