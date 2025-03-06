new Vue({
    el: '#app',
    data: {
        showForm: false,
        showReturnForm: false,
        returnReason: '',
        editIndex: null, // Индекс задачи, которая сейчас редактируется
        newTask: {
            title: '',
            description: '',
            deadline: ''
        },
        tasks: [], // Запланированные задачи
        inProgressTasks: [], // Задачи в работе
        testingTasks: [], // Тестирование
        completedTasks: [] // Выполненные задачи
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
            const newTask = {
                title: this.newTask.title,
                description: this.newTask.description,
                deadline: this.newTask.deadline,
                createdAt: new Date().toLocaleString(),
                status: 'Запланировано'
            };
            this.tasks.push(newTask);
            this.closeForm();
        },
        deleteTask(index) {
            this.tasks = [...this.tasks.slice(0, index), ...this.tasks.slice(index + 1)];
        },
        moveToInProgress(index) {
            const task = this.tasks[index];
            if (task) {
                task.status = 'В работе';
                this.inProgressTasks = [...this.inProgressTasks, task];
                this.tasks = [...this.tasks.slice(0, index), ...this.tasks.slice(index + 1)];
            }
        },
        startEdit(index) {
            this.editIndex = index; // Переключаем задачу в режим редактирования
        },
        saveEdit(index) {
            if (this.editIndex !== null) {
                const task = this.tasks[this.editIndex];
                if (task) {
                    task.lastEditedAt = new Date().toLocaleString(); // Добавляем временную метку редактирования
                }
            }
            this.editIndex = null; // Выходим из режима редактирования
        },
        cancelEdit() {
            this.editIndex = null; // Отменяем редактирование
        },
        openReturnForm(index) {
            this.returnIndex = index;
            this.showReturnForm = true;
        },
        closeReturnForm() {
            this.showReturnForm = false;
            this.returnReason = '';
        },
        returnTaskToInProgress() {
            const task = this.testingTasks[this.returnIndex];
            if (task) {
                task.returnReason = this.returnReason;
                task.status = 'Возвращено в работу';
                task.lastEditedAt = new Date().toLocaleString(); // Добавляем временную метку при возврате
                this.inProgressTasks = [...this.inProgressTasks, task];
                this.testingTasks = [
                    ...this.testingTasks.slice(0, this.returnIndex),
                    ...this.testingTasks.slice(this.returnIndex + 1)
                ];
            }
            this.closeReturnForm();
        },
        moveToTesting(index) {
            const task = this.inProgressTasks[index];
            if (task) {
                task.status = 'Тестирование';
                this.testingTasks = [...this.testingTasks, task];
                this.inProgressTasks = [
                    ...this.inProgressTasks.slice(0, index),
                    ...this.inProgressTasks.slice(index + 1)
                ];
            }
        },
        moveToCompleted(index) {
            const task = this.testingTasks[index];
            if (task) {
                task.status = 'Выполнено';
                task.lastEditedAt = new Date().toLocaleString(); // Добавляем временную метку при завершении
                this.completedTasks = [...this.completedTasks, task];
                this.testingTasks = [
                    ...this.testingTasks.slice(0, index),
                    ...this.testingTasks.slice(index + 1)
                ];
            }
        }
    }
});