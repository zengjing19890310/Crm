<template>
    <div class="outer-container">
        <section class="main">
            <img class="bg" :src="require('../../../common/images/homepage.png')"/>
            <!--<h4>首页</h4>-->
            <!--<div class="chart-container">-->
            <!--<high-chart :options="options" :styles="styles"></high-chart>-->
            <!--<high-chart :options="options" :styles="styles"></high-chart>-->
            <!--<high-chart :options="options" :styles="styles"></high-chart>-->
            <!--<high-chart :options="options" :styles="styles"></high-chart>-->
            <!--<high-chart :options="options" :styles="styles"></high-chart>-->
            <!--<high-chart :options="options" :styles="styles"></high-chart>-->
            <!--</div>-->
        </section>
    </div>
</template>

<script>
    let options = {
        title: {
            text: '2010 ~ 2016 年太阳能行业就业人员发展情况'
        },
        subtitle: {
            text: '数据来源：thesolarfoundation.com'
        },
        yAxis: {
            title: {
                text: '就业人数'
            }
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle'
        },
        plotOptions: {
            series: {
                label: {
                    connectorAllowed: false
                },
                pointStart: 2010
            }
        },
        series: [{
            name: '安装，实施人员',
            data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175]
        }, {
            name: '工人',
            data: [24916, 24064, 29742, 29851, 32490, 30282, 38121, 40434]
        }, {
            name: '销售',
            data: [11744, 17722, 16005, 19771, 20185, 24377, 32147, 39387]
        }, {
            name: '项目开发',
            data: [null, null, 7988, 12169, 15112, 22452, 34400, 34227]
        }, {
            name: '其他',
            data: [12908, 5948, 8105, 11248, 8989, 11816, 18274, 18111]
        }],
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    legend: {
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom'
                    }
                }
            }]
        }
    };
    let styles = {
        width: 400,
        height: 300
    };
    import highChart from '../../../components/highChart.vue';

    export default {
        data() {
            return {
                options: options,
                styles: styles
            }
        },
        components: {
            'high-chart': highChart
        },
        mounted() {

        },
        methods: {}
    }
</script>

<style lang="scss" scoped>
    @import "common/style/main";

    .main {
        /*overflow: auto;*/
        overflow: hidden;
        align-items: center;
        justify-content: center;

        .bg {
            vertical-align: middle;
            max-width: 50%;
            display: block;
        }
    }

    /*.chart-container {*/
    /*display: flex;*/
    /*flex-direction: row;*/
    /*align-items: center;*/
    /*justify-content: flex-start;*/
    /*flex-flow: wrap;*/
    /*}*/
</style>