<template>
    <div class="table">
        <div class="thead">
            <table>
                <colgroup>
                    <col width="300">
                    <col width="300">
                    <col width="300">
                    <col width="300">
                    <col width="300">
                    <col width="300">
                    <col width="100">
                </colgroup>
                <thead>
                <tr>
                    <th v-for="(col,index) in tableHeadArray" :key="index">
                        {{changeChineseName(col.columnKey)}} <i class="el-icon-arrow-down"
                                                                v-show="col.orderType==='desc'"></i>
                        <i class="el-icon-arrow-up" v-show="col.orderType==='asc'"></i>
                    </th>
                </tr>
                </thead>
            </table>
        </div>
        <div class="tbody">
            <table v-for="(col,index) in tableData" :key="index">
                <colgroup>
                    <col width="300">
                    <col width="300">
                    <col width="300">
                    <col width="300">
                    <col width="300">
                    <col width="300">
                    <col width="100">
                </colgroup>
                <tbody>
                <tr>
                    <td v-for="(cell,key) in col" :key="key">
                        <div style="height:30px;">{{cell}}</div>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>

        <!--<t-head :table-head-array="tableHeadArray"></t-head>-->
        <!--<t-body :table-body-array="tableData"></t-body>-->
    </div>
</template>

<style lang="scss" scoped>
    .table {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
    }

    table {
        min-width: 100%;
    }

    th, td {
        vertical-align: middle;
        border: 1px solid red;
        height: 3rem;
        text-align: center;
        font-size: 0.8rem;
    }

    .tbody {
        position: absolute;
        top: 4rem;
        left: 0;
        right: 0;
        bottom: 0;
        overflow-y: scroll;
        /*border: 1px solid red;*/
        table:not(:first-child) {
            margin-top: 1rem;
        }
    }

    .thead {

    }
</style>

<script>
    import tHead from './thead.vue';
    import tBody from './tbody.vue';

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
            tableData: Array
        },
        data() {
            return {
                tableHeadArray: [],
            }
        },
        created() {
            let tableData = this.tableData;
            if (tableData && tableData.length !== 0) {
                if (tableData[0]) {
                    let column;
                    for (let key in tableData[0]) {
                        if (this.tableHeadArray.indexOf(key) === -1) {
                            column = {};
                            column.columnKey = key;
                            if (key === 'index' || key === 'name' || key === 'department' || key === 'phone') {
                                column.canOrder = true;
                                column.orderType = 'asc';
                            }

                            this.tableHeadArray.push(column);
                        }
                    }
                }
            }
        },
        mounted() {

        },
        methods: {
            changeChineseName(key) {
                return columnNameMap[key];
            }
        },
        components: {
            't-head': tHead,
            't-body': tBody
        }
    }
</script>