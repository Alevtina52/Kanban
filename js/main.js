new Vue({
    el: '#app',
    data: {
        showForm: false,
        isEditing: false, // Флаг для редактирования
        editIndex: null, // Индекс задачи для редактирования
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
            this.isEditing = false; // Сбрасываем режим редактирования
            this.newTask = { title: '', description: '', deadline: '' }; // Очищаем форму
        },
        closeForm() {
            this.showForm = false;
            this.isEditing = false; // Сбрасываем режим редактирования
            this.newTask = { title: '', description: '', deadline: '' }; // Очищаем форму
        },
        addTask() {
            if (this.isEditing) {
                // Если режим редактирования
                const editedTask = {
                    title: this.newTask.title,
                    description: this.newTask.description,
                    deadline: this.newTask.deadline,
                    createdAt: this.tasks[this.editIndex].createdAt // Сохраняем старую дату создания
                };
                this.tasks.splice(this.editIndex, 1, editedTask); // Обновляем задачу
                this.closeForm();
            } else {
                // Если новая задача
                const task = {
                    title: this.newTask.title,
                    description: this.newTask.description,
                    deadline: this.newTask.deadline,
                    createdAt: new Date().toLocaleDateString()
                };
                this.tasks.push(task); // Добавляем задачу в первый столбец
                this.closeForm();
            }
        },
        editTask(index) {
            this.isEditing = true; // Включаем режим редактирования
            this.editIndex = index; // Сохраняем индекс задачи для редактирования
            const taskToEdit = this.tasks[index];
            this.newTask = {
                title: taskToEdit.title,
                description: taskToEdit.description,
                deadline: taskToEdit.deadline
            };
            this.openForm(); // Открываем форму
        },
        deleteTask(index) {
            this.tasks.splice(index, 1); // Удаляем задачу из первого столбца
        },
        moveToInProgress(index) {
            const task = this.tasks.splice(index, 1)[0]; // Удаляем задачу из первого столбца
            this.inProgressTasks.push(task); // Добавляем задачу во второй столбец
        }
    }
});