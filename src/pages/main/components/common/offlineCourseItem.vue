<template>
    <div class="course-item">
        <header @click.stop="showModal">
            <div class="image-wrapper">
                <img :src="courseData.courseUrl" alt="">
                <modal-component @edit="editCourse" @delete="deleteCourse" :modal="modal"></modal-component>
            </div>
        </header>
        <div class="course-information">
            <h4 @click="goOverview">{{courseData.title}}</h4>
            <p>开课老师: {{courseData.teachername || "-"}}</p>
            <p>&yen;: {{courseData.money}}</p>
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
            courseData: Object,
            index: Number
        },
        mounted() {
            window.Bus.$on('clear-modal', () => {
                this.modal = false;
            });
        },
        methods: {
            goOverview() {
                this.$router.push({
                    name: "offlineVideoOverview",
                    params: {
                        courseId: this.courseData.id
                    }
                })
            },
            imageUrl(url) {
                return url ? `http://${url}` : '';
            },
            showModal() {
                window.Bus.$emit("clear-modal");
                this.modal = true;
            },
            editCourse() {
//                console.log("edit-course", this.courseData.id, this.courseData);
                this.$emit("edit-course", this.courseData.id, this.courseData);
            },
            deleteCourse() {
//                console.log("delete-course", this.courseData.id, this.index);
                this.$emit("delete-course", this.courseData.id, this.index);
            },
        },
        components: {
            "modal-component": modalComponent
        }
    }
</script>

<style lang="scss" scoped>
    @import "style/courseItemCommon";
</style>