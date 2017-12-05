<template>
<div class="gantt_demo">
    <p>甘特图范例2: Base on <code>Frappé Gantt</code>，https://frappe.github.io/gantt/</p>
    <div class="gantt_wrap">
        <svg id="gantt"></svg>
    </div>
    <div class="tags">
        <span v-for="(r,i) in range" :key="i" @click="changeMode(r)">
            {{ r }}
        </span>
    </div>
    <p class="code">
        <pre>
            {{ this.tasks }}
        </pre>
    </p>
</div>
</template>

<script>
import Gantt from 'z_gantt/Gantt'
export default {
    data () {
        return {
            gantt: null,
            range: ['Quarter Day', 'Half Day', 'Day', 'Week', 'Month' ],
            tasks: [
                {
                    id: 'Task 1',
                    name: 'Develop Tool',
                    start: '2017-10-11',
                    end: '2017-12-10',
                    progress: 20,
                },
                {
                    id: 'item 1',
                    name: 'Develop Tool phase01',
                    start: '2017-10-11',
                    end: '2017-11-10',
                    progress: 30,
                    dependencies: 'Task 1'
                },
                {
                    id: 'item 2',
                    name: 'Develop Tool phase02',
                    start: '2017-11-11',
                    end: '2017-12-10',
                    progress: 30,
                    dependencies: 'item 1'
                },
                {
                    id: 'Task 2',
                    name: 'Test Tool',
                    start: '2017-12-11',
                    end: '2018-02-10',
                    progress: 1,
                },
            ],
        }
    },
    mounted() {
        this.genGantt()
    },
    methods: {
        genGantt() {
            this.gantt = new Gantt('#gantt', this.tasks)
            this.gantt.change_view_mode('Week')
        },
        changeMode(v) {
            this.gantt.change_view_mode(v)
        }
    }
}
</script>

<style lang="scss" scoped>
.gantt_demo {
    height: 100%;
    overflow-y: auto;
}
.gantt_wrap {
    width: 100%;
    padding: 10px;
    overflow: auto;
}
.tags {
    margin: 10px;
    height: 36px;
    line-height: 36px;
    span {
        display: inline-block;
        padding: 0 8px;
        margin: 0 5px;
        cursor: pointer;
    }
}
</style>
