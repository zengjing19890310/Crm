<template>
    <div class="path-container">
        <el-breadcrumb separator="/" v-if="navList && navList.length!==0">
            <el-breadcrumb-item v-for="(nav,index) in navList" :to="{ path: nav.path }" :key="index">{{nav.name}}</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                navList: []
            }
        },
        props: {
            currentNav: Array
        },
        watch: {
            currentNav(val) {
                this.navList = val;
            }
        },
        mounted() {

        }
    }
</script>

<style lang="scss" scoped>
    .path-container {
        height: 50px;
        box-sizing: border-box;
        font-size: 0.9rem;
        color: #7a8190;
        display: flex;
        flex-direction: row;
        align-items: center;
        padding-left: 20px;
    }
</style>