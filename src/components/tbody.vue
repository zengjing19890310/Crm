<template>
    <div class="tbody">
        <div class="tr" v-for="(col,index) in tableBodyArray" :key="index">
            <div class="td" v-for="(cell,index) in col" :key="index">
                {{cell}}
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .tbody {
        border: 1px solid red;
    }
    .tr {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        flex-wrap: wrap;
        .td {
            display: flex;
            flex: 1;
            flex-direction: row;
            align-items: center;
            border:1px solid blue;
            justify-content: center;
            flex-wrap: wrap;
        }
        height: 3rem;
    }
</style>

<script>
    export default {
        props: {
            tableBodyArray: Array
        },
        data() {
            return {

            }
        },
        mounted (){
            console.log(this.tableBodyArray);
        }
    }
</script>