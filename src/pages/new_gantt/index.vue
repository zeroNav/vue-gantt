<template>
    <div class="gantt_wrap">
        <gantt
            :tasks="tasks"
            @task-updated="logTaskUpdate"
            @link-updated="logLinkUpdate"
            @task-selected="pickTask"
        />
    </div>
</template>

<script>
    export default {
        components: {
            gantt: () => import('./components/gantt')
        },
        data () {
            return {
                tasks: {
                    data: [
                        {id: 1, text: 'Task #1', start_date: '15-04-2017', duration: 3, progress: 0.6},
                        {id: 2, text: 'Task #2', start_date: '18-11-2017', duration: 3, progress: 0.4}
                    ],
                    links: [
                        {id: 1, source: 1, target: 2, type: '0'}
                    ]
                },
                selectedTask: null,
                messages: []
            }
        },
        methods: {
            pickTask(task) {
                console.log('current task: ',task)
                this.selectedTask = task
            },
            logTaskUpdate(id, mode, task) {
                console.log('update task: ',task,mode,id)
                let text = ( task && task.text ? `(${task.text})` : '' )
                let message = `Task ${mode}: ${id} ${text}`
                this.addMessage(message)
            },
            logLinkUpdate(id, mode, link) {
                console.log('update link:',link,mode,id)
                let message = `Link ${mode}: ${id}`
                if (link) {
                    message += `( source: ${link.source}, target: ${link.target} )`
                }
                this.addMessage(message)
            },
            addMessage (message) {
                this.messages.unshift(message)
            }
        }
    }
</script>