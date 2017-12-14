<template>
    <div class="course-item">
        <header @click.stop="showModal">
            <div class="image-wrapper">
                <img :src="imageUrl(courseData.url)" alt="">
                <modal-component @edit="editCourse" @delete="deleteCourse" :modal="modal"></modal-component>
            </div>
        </header>
        <div class="course-information">
            <h4>{{courseData.title}}</h4>
            <p>开课老师: {{courseData.teachername || "-"}}</p>
            <p>&yen;: {{courseData.money}}</p>
            <p class="apply-status">
                <span>报名: {{courseData.signUpPerson}}</span>
                <span class="short-line"></span>
                <span>已缴费: {{courseData.signUpPerson}}</span>
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
    .course-item {
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        width: 20%;
        min-width: 285px;
        height: 240px;
        margin: 5px;
        border: 1px solid #d8dce5;
        flex-shrink: 0;
        flex-grow: 0;
        background-color: #fff;
        border-radius: 5px;
        overflow: hidden;
        -webkit-box-shadow: 0 2px 5px 1px rgba(0, 0, 0, .1);
        -moz-box-shadow: 0 2px 5px 1px rgba(0, 0, 0, .1);
        box-shadow: 0 2px 5px 1px rgba(0, 0, 0, .1);
        padding: 10px;
        header {
            width: 100%;
            height: 100px;
            flex-shrink: 0;
            .image-wrapper {
                width: 100%;
                height: 100%;
                position: relative;
                img {
                    display: block;
                    width: 100%;
                    height: 100%;
                    background-color: #ddd;
                }
            }
        }
        .course-information {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            font-size: 0.7rem;
            color: #999;
            h4 {
                cursor: pointer;
                font-size: 0.9rem;
                line-height: 1.2rem;
                &:hover {
                    color: #303641;
                }
            }
            .apply-status {
                display: flex;
                .short-line {
                    display: inline-block;
                    margin: 0 15px;
                    border-left: 1px solid #aaa;
                }
            }
        }
    }
</style>