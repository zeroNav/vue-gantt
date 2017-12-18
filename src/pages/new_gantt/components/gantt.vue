<template>
    <div class="gantt_body">
        <p>
            <button @click="renewChart('week')">Week</button>
            <button @click="renewChart('month')">Month</button>
            <button @click="renewChart('year')">Year</button>
        </p>
        <div ref="gantt_chart"></div>
    </div>
</template>

<script>
    import 'dhtmlx-gantt'
    import 'dhtmlx-gantt/codebase/ext/dhtmlxgantt_marker'
    export default {
        name: 'gantt',
        props: {
            tasks: {
                type: Object,
                default() {
                    return {
                        data: [],
                        links: []
                    }
                }
            }
        },
        data () {
            return {
                config: {
                    readonly: true,
                    scale_unit: 'month',
                    date_scale: '%m',
                    subscales: [
                        {
                            unit: 'year',
                            step: 1,
                            date: '%Y'
                        }
                    ]
                },
                week: {
                    /* week */
                    scale_unit: 'day',
                    date_scale: '%D',
                    scale_height: 60,
                    min_column_width: 30,
                    subscales: [
                        {
                            unit: 'week',
                            step: 1,
                            date: '(%M) Week #%W'
                        }
                    ]
                },
                month: {
                    /* month */
                    scale_unit: 'week',
                    date_scale: 'Week %W',
                    scale_height: 60,
                    min_column_width: 70,
                    subscales: [
                        {
                            unit: 'month',
                            step: 1,
                            date: '%m'
                        }
                    ]
                },
                year: {
                    /* year */
                    scale_unit: 'month',
                    date_scale: '%M',
                    scale_height: 60,
                    min_column_width: 70,
                    subscales: [
                        {
                            unit: 'year',
                            step: 1,
                            date: '%Y'
                        }
                    ]
                }      
            }
        },
        mounted() {
            this.initChart()
        },
        methods: {
            initChart() {
                // console.log('gantt',JSON.stringify(gantt))
                gantt.attachEvent('onTaskSelected', id => {
                    let task = gantt.getTask(id)
                    this.$emit('task-selected', task)
                })
                gantt.attachEvent('onAfterTaskAdd', (id, task) => {
                    this.$emit('task-updated', id, 'inserted', task)
                    task.progress = task.progress || 0
                    if (gantt.getSelectedId() == id) {
                        this.$emit('task-selected', task)
                    }
                })
                /* 忽略部分方法 */
                gantt.attachEvent('onAfterLinkAdd', (id, link) => {
                    this.$emit('link-updated', id, 'inserted', link)
                })
                /* 初始化 */
                this.resetChart()
                gantt.init(this.$refs.gantt_chart)
                gantt.parse(this.$props.tasks)
                /* 标记当前日期 */
                let markerId = gantt.addMarker({
                    start_date: new Date(),
                    css: 'today',
                    text: 'Now',
                    title: ''
                })
            },
            resetChart() {
                Object.entries(this.config).forEach(r => {
                    gantt.config[r[0]] = r[1]
                })
            },
            renewChart(mode) {
                if (['week','month','year'].includes(mode)) {
                    console.log('configs',gantt.config)
                    Object.entries(this[mode]).forEach(r => {
                        console.log('chart', r)
                        gantt.config[r[0]] = r[1]
                    })
                }
                gantt.render()
            }
        }
    }
</script>
<style lang="css">
    @import "~style/dhtmlxgantt.css";
</style>

<style lang="scss">
.gantt_body {
    height: 100%;
    >div {
        height: 100%;
        min-height: 800px;
        position: relative;
        overflow: hidden;
    }
}
</style>
