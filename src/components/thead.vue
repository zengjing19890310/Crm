<template>
    <div class="thead">
        <div class="tr">
            <div class="th" v-for="(col,index) in tableHeadArray" :key="index">
                <div>
                    {{changeChineseName(col.columnKey)}}
                </div>
                <div v-if="col.canOrder">
                    <i class="el-icon-arrow-down" v-show="col.orderType==='desc'"></i>
                    <i class="el-icon-arrow-up" v-show="col.orderType==='asc'"></i>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .thead {
        border: 1px solid red;
    }
    .tr {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        flex-wrap: nowrap;
        .th {
            display: flex;
            flex: 1;
            flex-direction: row;
            align-items: center;
            border:1px solid blue;
            text-align: center;
            justify-content: center;
        }
        height: 3rem;
    }
</style>

<script>
    let columnNameMap = {
        checkStatus: '选择',
        index: '序号',
        name: '姓名',
        phone: '手机号码',
        department: '部门',
        role: '角色',
        handle: '操作',
    };
    export default {
        props: {
            tableHeadArray: Array
        },
        data() {
            return {}
        },

        mounted() {
            console.log(this.tableHeadArray);
        },
        computed() {

        },
        methods: {
            changeChineseName(key) {
                return columnNameMap[key];
            }
        }
    }
</script>