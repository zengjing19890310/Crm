<template>
    <!--模态框组件-->
    <transition name="el-fade-in">
        <div class="modal" v-show="modal" @click.stop>
            <i class="modal-edit" @click="editHandle"></i>

            <!--插值,可以提供额外的预览按钮-->
            <slot name="overview"></slot>

            <i class="modal-delete" @click="deleteHandle"></i>
        </div>
    </transition>
</template>

<script>
    export default {
        props: {
            modal: Boolean
        },
        methods: {
            editHandle() {
                this.$emit("edit");
            },
            deleteHandle() {
                this.$emit("delete");
            }
        }
    }
</script>

<style lang="scss" scoped>
    /*模态框*/
    .modal {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background-color: rgba(48, 54, 65, .5);
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
        .modal-overview {
            background-color: #fff;
            color:#999999;
        }
    }
</style>