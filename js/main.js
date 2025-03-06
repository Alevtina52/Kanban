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
        completedTasks: [], // Выполненные задачи
        showReturnForm: false, // Флаг для формы возврата
        returnTaskIndex: null, // Индекс задачи для возврата
        returnReason: '' // Причина возврата
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
            // Копируем данные задачи в форму для редактирования
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
            const task = this.tasks.splice(index, 1)[0]; // Удаляем задачу из "Запланированные задачи"
            this.inProgressTasks.push(task); // Добавляем задачу в "Задачи в работе"
        },
        moveToTesting(index) {
            const task = this.inProgressTasks.splice(index, 1)[0]; // Удаляем задачу из "Задачи в работе"
            this.testingTasks.push(task); // Добавляем задачу в "Тестирование"
        },
        moveToCompleted(index) {
            const task = this.testingTasks.splice(index, 1)[0]; // Удаляем задачу из "Тестирование"

            // Проверяем дедлайн
            const deadlineDate = new Date(task.deadline);
            const currentDate = new Date();

            if (currentDate > deadlineDate) {
                task.status = 'просрочена'; // Если текущая дата больше дедлайна
            } else {
                task.status = 'выполнена в срок'; // Если задача выполнена в срок
            }

            this.completedTasks.push(task); // Добавляем задачу в "Выполненные задачи"
        },
        openReturnForm(index) {
            this.showReturnForm = true; // Показываем форму возврата
            this.returnTaskIndex = index; // Сохраняем индекс задачи для возврата
            this.returnReason = ''; // Очищаем причину возврата
        },
        closeReturnForm() {
            this.showReturnForm = false; // Скрываем форму возврата
            this.returnTaskIndex = null; // Сбрасываем индекс задачи
            this.returnReason = ''; // Очищаем причину возврата
        },
        returnTaskToInProgress() {
            if (!this.returnReason.trim()) {
                alert('Укажите причину возврата!');
                return;
            }

            const task = this.testingTasks.splice(this.returnTaskIndex, 1)[0]; // Удаляем задачу из "Тестирование"
            task.returnReason = this.returnReason; // Добавляем причину возврата к задаче
            this.inProgressTasks.push(task); // Добавляем задачу в "Задачи в работе"
            this.closeReturnForm(); // Закрываем форму
        }
    }
});