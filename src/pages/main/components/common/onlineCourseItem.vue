<template>
    <div class="course-item">
        <header @click.stop="showModal">
            <div class="image-wrapper">
                <img :src="courseData.videoUrl" alt="">
                <modal-component @edit="editCourse" @delete="deleteCourse" :modal="modal"></modal-component>
            </div>
        </header>
        <div class="course-information">
            <h4 @click="goOverview">{{courseData.description}}</h4>
            <p>&yen;: {{courseData.price}}</p>
            <p>
                视频等级: {{courseData.level}}
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
            console.log(this.courseData);
            window.Bus.$on('clear-modal', () => {
                this.modal = false;
            });
        },
        methods: {
            goOverview() {
//                this.$router.push({
//                    name: "offlineVideoOverview",
//                    params: {
//                        courseId: this.courseData.id
//                    }
//                })
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