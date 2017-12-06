<template>
    <div class="circle-item">
        <div class="image-wrapper" @click.stop="showModal">
            <img :src="imageUrl(circleData.url)" alt="" class="image">
            <transition name="el-fade-in">
                <div class="modal" v-show="modal" @click.stop>
                    <!--这是模态框-->
                    <!--<i class="modal-upload"></i>-->
                    <i class="modal-edit" @click="uploadCircle(circleData.id)"></i>
                    <i class="modal-delete"></i>
                </div>
            </transition>
        </div>
        <div class="text-wrapper">
            <h4>
                {{circleData.name}}
            </h4>
            <p>
                创建者：{{circleData.createUserId}}
            </p>
            <p class="time">
                创建时间：{{circleData.createTime}}
            </p>
        </div>
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
            circleData: Object
        },
        mounted() {
            window.Bus.$on('clear-modal', () => {
                this.modal = false;
            });
        },
        methods: {
            uploadCircle(id) {
                this.$emit('upload-circle', id,this.circleData);
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
            }
        }
    }
</script>

<style lang="scss" scoped>
    .circle-item {
        width: 30%;
        margin: 1rem;
        height: 280px;
        flex-grow: 0;
        flex-shrink: 0;
        background-color: #fff;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        border-radius: 5px;
        overflow: hidden;
        -webkit-box-shadow: 0 2px 5px 1px rgba(0, 0, 0, .1);
        -moz-box-shadow: 0 2px 5px 1px rgba(0, 0, 0, .1);
        box-shadow: 0 2px 5px 1px rgba(0, 0, 0, .1);
        .image-wrapper {
            height: 160px;
            position: relative;
            .image {
                width: 100%;
                height: 100%;
                display: block;
            }
            /*模态框*/
            .modal {
                position: absolute;
                left: 0;
                right: 0;
                top: 0;
                bottom: 0;
                background-color: rgba(3, 3, 3, .8);
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-around;
                font-size: 2rem;
                > i {
                    cursor: pointer;
                    display: inline-block;
                    text-align: center;
                    width: 40px;
                    height: 40px;
                    line-height: 40px;
                    border-radius: 5px;
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