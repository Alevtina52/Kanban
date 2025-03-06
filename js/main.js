new Vue({
    el: '#app',
    data: {
        showForm: false,
        showSearchModal: false, // Флаг для отображения модального окна с результатами поиска
        returnReason: '',
        editIndex: null,
        newTask: {
            title: '',
            description: '',
            deadline: ''
        },
        searchQuery: '', // Строка для поиска
        tasks: [], // Запланированные задачи
        inProgressTasks: [], // Задачи в работе
        testingTasks: [], // Тестирование
        completedTasks: [], // Выполненные задачи
        deletedTasks: [] // Удалённые задачи
    },
    computed: {
        // Фильтрация задач по запросу поиска
        filteredTasks() {
            return (tasks) => {
                if (!this.searchQuery) return tasks;
                const query = this.searchQuery.toLowerCase();
                return tasks.filter(task =>
                    task.title.toLowerCase().includes(query) ||
                    task.description.toLowerCase().includes(query)
                );
            };
        }
    },
    methods: {
        // Открытие формы для добавления задачи
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

        // Метод для активации поиска и открытия модального окна
        activateSearch() {
            Vue.nextTick(() => {
                if (this.searchQuery) {
                    this.showSearchModal = true;
                }
            });
        },

        // Закрытие модального окна
        closeSearchModal() {
            this.showSearchModal = false;
            this.searchQuery = ''; // Очистить поле поиска после закрытия
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
                this.inProgressTasks.push(task);
                this.tasks.splice(index, 1);
            }
        },

        startEdit(index) {
            this.editIndex = index;
        },

        saveEdit(index) {
            if (this.editIndex !== null) {
                const task = this.tasks[this.editIndex] || this.inProgressTasks[this.editIndex];
                if (task) {
                    task.lastEditedAt = new Date().toLocaleString();
                }
            }
            this.editIndex = null;
        },

        cancelEdit() {
            this.editIndex = null;
        },
    }
});
