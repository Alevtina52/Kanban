new Vue({
    el: '#app',
    data: {
        showForm: false,
        showReturnForm: false,
        showDeletedTasksModal: false, // Флаг для отображения модального окна с удалёнными задачами
        returnReason: '',
        editIndex: null,
        newTask: {
            title: '',
            description: '',
            deadline: ''
        },
        tasks: [], // Запланированные задачи
        inProgressTasks: [], // Задачи в работе
        testingTasks: [], // Тестирование
        completedTasks: [], // Выполненные задачи
        deletedTasks: [] // Удалённые задачи
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
        deleteTask(index, taskStatus) {
            let task;
            // Определяем, из какого массива удаляем задачу
            if (taskStatus === 'Запланировано') {
                task = this.tasks[index];
                this.tasks.splice(index, 1);
            } else if (taskStatus === 'В работе') {
                task = this.inProgressTasks[index];
                this.inProgressTasks.splice(index, 1);
            } else if (taskStatus === 'Тестирование') {
                task = this.testingTasks[index];
                this.testingTasks.splice(index, 1);
            } else if (taskStatus === 'Выполнено') {
                task = this.completedTasks[index];
                this.completedTasks.splice(index, 1);
            }
            // Перемещаем задачу в deletedTasks
            if (task) {
                this.deletedTasks.push(task);
            }
        },
        moveToInProgress(index) {
            const task = this.tasks[index];
            if (task) {
                task.status = 'В работе';
                this.inProgressTasks.push(task); // Добавляем задачу в inProgressTasks
                this.tasks.splice(index, 1); // Удаляем задачу из tasks
            }
        },
        startEdit(index) {
            this.editIndex = index; // Переключаем задачу в режим редактирования
        },
        saveEdit(index) {
            if (this.editIndex !== null) {
                const task = this.tasks[this.editIndex] || this.inProgressTasks[this.editIndex];
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
                task.returnReason = this.returnReason; // Сохраняем причину возврата
                task.status = 'Возвращено в работу';
                task.lastEditedAt = new Date().toLocaleString(); // Добавляем временную метку при возврате
                this.inProgressTasks.push(task); // Добавляем задачу обратно в "Задачи в работе"
                this.testingTasks.splice(this.returnIndex, 1); // Удаляем задачу из "Тестирования"
            }
            this.closeReturnForm();
        },
        moveToTesting(index) {
            const task = this.inProgressTasks[index];
            if (task) {
                task.status = 'Тестирование';
                this.testingTasks.push(task); // Добавляем задачу в testingTasks
                this.inProgressTasks.splice(index, 1); // Удаляем задачу из inProgressTasks
            }
        },
        moveToCompleted(index) {
            const task = this.testingTasks[index];
            if (task) {
                const deadlineDate = new Date(task.deadline);
                const currentDate = new Date();

                if (currentDate > deadlineDate) {
                    task.status = 'Просрочено';
                } else {
                    task.status = 'Выполнено';
                }

                task.lastEditedAt = new Date().toLocaleString(); // Добавляем временную метку при завершении
                this.completedTasks.push(task); // Добавляем задачу в completedTasks
                this.testingTasks.splice(index, 1); // Удаляем задачу из testingTasks
            }
        }
    }
});