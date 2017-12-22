<template>
    <div class="chartComponent"
         v-html="innerText"
         :contenteditable="canEdit"
         @focus="isLocked = true"
         @blur="isLocked = false"
         @input="changeText" @keyup.ctrl.enter="enterPress">
    </div>
</template>
<script type="text/ecmascript-6">
    export default {
        name: 'chartComponent',
        props: {
            value: {
                type: String,
                default: ''
            },
            canEdit: {
                type: Boolean,
                default: true
            }
        },
        data() {
            return {
                innerText: this.value,
                isLocked: false
            }
        },
        mounted() {
            window.Bus.$on('emoji', (emoji) => {
                let content = this.$el.innerHTML;
                content += emoji;
                this.$el.innerHTML = content;
            });
        },
        watch: {
            'value'(value) {
                if (!this.isLocked && !this.innerText) {
                    this.innerText = this.value;
                }
                //如果值为空,清除内容并更新视图
                if (!value) {
                    this.innerText = "";
                    this.$el.innerHTML = "";
                 }
            }
        },
        methods: {
            enterPress() {
                this.$emit("enter-press");
            },
            changeText() {
                this.$emit('input', this.$el.innerHTML);
            }
        }
    }
</script>
<style lang="scss" rel="stylesheet/scss">
    .chartComponent {
        padding: 0.5rem;
        /*border: 1px solid #ddd;*/
        outline: none;
        flex-grow: 1;
        font-size: 0.8rem;
        line-height: 1rem;
        overflow-y: auto;
        word-break: break-all;
    }
</style>