<template>
    <div class="circle-item">
        <div class="image-wrapper" @click.stop="showModal">
            <img :src="circleData.url" alt="" class="image">
            <modal-component @edit="editCircle" @delete="deleteCircle" :modal="modal"></modal-component>
        </div>
        <div class="text-wrapper">
            <h4 @click="goCircleDetail(circleData.id)">
                {{circleData.name || "-"}}
            </h4>
            <p>
                创建者：{{circleData.nickname || "-"}}
            </p>
            <p class="time">
                创建时间：{{circleData.createTime || "-"}}
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
            circleData: Object,
            index: Number
        },
        mounted() {
            window.Bus.$on('clear-modal', () => {
                this.modal = false;
            });
        },
        methods: {
            editCircle() {
                this.$emit('edit-circle', this.circleData.id, this.circleData);
            },
            deleteCircle() {
                this.$emit('delete-circle', this.circleData.id, this.index);
            },
            imageUrl(url) {
                return url ? `http://${url}` : '';
            },
            showModal() {
                window.Bus.$emit("clear-modal");
                this.modal = true;
            },
            hideModal() {
                console.log('隐藏模态框');
            },
            goCircleDetail() {
                this.$emit('circle-detail', this.circleData.id);
            }
        },
        components: {
            "modal-component": modalComponent
        }
    }
</script>

<style lang="scss" scoped>
    .circle-item {
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
        -webkit-box-shadow: 0 2px 5px 1px rgba(0, 0, 0, 0.1);
        -moz-box-shadow: 0 2px 5px 1px rgba(0, 0, 0, 0.1);
        box-shadow: 0 2px 5px 1px rgba(0, 0, 0, 0.1);
        padding: 10px;

        .image-wrapper {
            height: 120px;
            position: relative;
            .image {
                width: 100%;
                height: 100%;
                display: block;
            }
        }
        .text-wrapper {
            flex-grow: 1;
            color: #cacaca;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            align-items: stretch;
            padding: 0 1rem;
            font-size: 0.8rem;
            h4 {
                flex-grow: 2;
                display: flex;
                flex-direction: row;
                align-items: center;
                cursor: pointer;
                font-weight: normal;
                &:hover {
                    color: #303641;
                }
            }
            p {
                flex-grow: 1;
                display: flex;
                flex-direction: row;
                align-items: center;
            }
        }
    }
</style>