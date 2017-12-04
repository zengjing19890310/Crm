<template>
    <div class="chart-wrapper"></div>
</template>

<script>
    import Highcharts from 'highcharts/highstock';
    import HighchartsMore from 'highcharts/highcharts-more';
    import HighchartsDrilldown from 'highcharts/modules/drilldown';
    import Highcharts3D from 'highcharts/highcharts-3d';
    import Highmaps from 'highcharts/modules/map';

    HighchartsMore(Highcharts)
    HighchartsDrilldown(Highcharts);
    Highcharts3D(Highcharts);
    Highmaps(Highcharts);
    export default {
        props: ['options', 'styles'],
        name: 'highcharts',
        data() {
            return {
                chart: null
            }
        },
        mounted() {
            this.initChart();
        },
        methods: {
            initChart() {
                this.options.credits = {
                    enabled: false
                };
                if(this.styles){
                    this.$el.style.width = (this.styles.width || 800) + 'px';
                    this.$el.style.height = (this.styles.height || 400) + 'px';
                }
                this.chart = new Highcharts.Chart(this.$el, this.options);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .chart-wrapper {
        border: 1px solid #ddd;
        margin: 1rem;
    }
</style>