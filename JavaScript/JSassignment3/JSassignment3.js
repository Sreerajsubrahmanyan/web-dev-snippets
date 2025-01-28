document.addEventListener('DOMContentLoaded', function () {
    loadTasksfromStorage();
    document.getElementById('search').addEventListener('input', filterTasks);
});

document.getElementById('addtask').addEventListener('click', function () {
    const taskNameInput = document.querySelector('.details[type="text"]');
    const taskDateInput = document.querySelector('.details[type="date"]');
    const taskTimeInput = document.querySelector('.details[type="time"]');

    const taskName = taskNameInput.value.trim();
    const taskDate = taskDateInput.value;
    const taskTime = taskTimeInput.value;

    if (taskName && taskDate && taskTime) {
        const formattedTime = formatTimeTo12Hour(taskTime);

        saveTask(taskName, taskDate, formattedTime);

        taskNameInput.value = '';
        taskDateInput.value = '';
        taskTimeInput.value = '';

        loadTaskToDisplay({ name: taskName, date: taskDate, time: formattedTime });
    } else {
        alert('Please fill in all fields');
    }
});

function saveTask(name, date, time) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push({ name, date, time });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasksfromStorage() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        loadTaskToDisplay(task);
    });
}

function loadTaskToDisplay(newTask = null) {
    const taskListContainer = document.getElementById('taskListContainer');
    const todayDate = new Date().toISOString().split('T')[0];

    const dueTasksContainer = document.getElementById('dueTasks') || createCategoryContainer('dueTasks', 'Due Tasks', taskListContainer);
    const upcomingTasksContainer = document.getElementById('upcomingTasks') || createCategoryContainer('upcomingTasks', 'Upcoming Tasks', taskListContainer);
    const todayTasksContainer = document.getElementById('todayTasks') || createCategoryContainer('todayTasks', 'Today Tasks', taskListContainer);

    if (newTask) {
        const { name, date, time } = newTask;

        let targetContainer;

        const taskDate = new Date(date).setHours(0, 0, 0, 0);
        const today = new Date(todayDate).setHours(0, 0, 0, 0);

        if (taskDate === today) {
            targetContainer = todayTasksContainer;
        } else if (taskDate < today) {
            targetContainer = dueTasksContainer;
        } else {
            targetContainer = upcomingTasksContainer;
        }

        let dateSection = targetContainer.querySelector(`[data-date="${date}"]`);
        if (!dateSection) {
            dateSection = document.createElement('div');
            dateSection.setAttribute('data-date', date);

            const dateHeading = document.createElement('h3');
            dateHeading.textContent = date;

            dateSection.appendChild(dateHeading);
            targetContainer.appendChild(dateSection);
        }

        const taskItem = document.createElement('p');
        taskItem.textContent = `${name} at ${time}`;

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.classList.add('edit-button');
        
        editButton.addEventListener('click', function () {
            const newTaskName = prompt('Edit task name', name);
            if (newTaskName) {
                taskItem.childNodes[0].textContent = `${newTaskName} at ${time}`;
                updateTaskInStorage(date, time, newTaskName, dateSection);
            }
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete-button');
        deleteButton.addEventListener('click', function () {
            taskItem.remove();
            deleteTaskFromStorage(date, time);

            if(!dateSection.querySelector('p')){
                dateSection.remove();
            }
        });

        taskItem.appendChild(deleteButton);
        taskItem.appendChild(editButton);
        dateSection.appendChild(taskItem);
    }
}

function createCategoryContainer(id, title, parent) {
    const container = document.createElement('div');
    container.setAttribute('id', id);
    container.innerHTML = `<h2>${title}</h2>`;
    parent.appendChild(container);
    return container;
}

function formatTimeTo12Hour(time) {
    const [hours, minutes] = time.split(':');
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes} ${period}`;
}

function updateTaskInStorage(date, oldTime, newName, dateSection) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskIndex = tasks.findIndex(task => task.date === date && task.time === oldTime);
    if (taskIndex !== -1) {
        tasks[taskIndex].name = newName;
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
}

function deleteTaskFromStorage(date, time) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskIndex = tasks.findIndex(task => task.date === date && task.time === time);
    if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
}

function filterTasks() {
    const searchQuery = document.getElementById('search').value.toLowerCase();
    const allCategories = document.querySelectorAll('#taskListContainer > div');

    allCategories.forEach(category => {
        let hasVisibleTasks = false;
        const tasks = category.querySelectorAll('p');

        tasks.forEach(task => {
            const taskName = task.textContent.toLowerCase();
            if (taskName.includes(searchQuery)) {
                task.style.display = 'block';
                hasVisibleTasks = true;
            } else {
                task.style.display = 'none';
            }
        });

        category.style.display = hasVisibleTasks ? 'block' : 'none';
    });
}
