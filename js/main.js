new Vue({
    el: '#app',
    data: {
        showForm: false,
        newTask: {
            title: '',
            description: '',
            deadline: ''
        },
        tasks: [],
        inProgressTasks: [],
        testingTasks: [],
        completedTasks: []
    },
    methods: {
        openForm() {
            this.showForm = true;
        },
        closeForm() {
            this.showForm = false;
            this.newTask = { title: '', description: '', deadline: '' };
        },
        addTask() {
            const task = {
                title: this.newTask.title,
                description: this.newTask.description,
                deadline: this.newTask.deadline,
                createdAt: new Date().toLocaleDateString()
            };
            this.tasks.push(task);
            this.closeForm();
        },
        moveTask(index, targetColumn, sourceColumn = 'tasks') {
            const sourceList = this[sourceColumn];
            const task = sourceList.splice(index, 1)[0];
            if (targetColumn === 'inProgress') {
                this.inProgressTasks.push(task);
            } else if (targetColumn === 'testing') {
                this.testingTasks.push(task);
            } else if (targetColumn === 'completed') {
                this.completedTasks.push(task);
            }
        }
    }
});