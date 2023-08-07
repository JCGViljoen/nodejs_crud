const todoForm = document.getElementById('add-todo-form');
const titleInput = document.getElementById('title-input');
const descriptionInput = document.getElementById('description-input');
const todoList = document.getElementById('todo-list');

// Function to create update and delete buttons for each todo
function createTodoItem(todo) {
    const li = document.createElement('li');
    li.textContent = `${todo.title}: ${todo.description}`;

    const updateButton = document.createElement('button');
    updateButton.textContent = 'Update';
    updateButton.classList.add('update-button');
    updateButton.dataset.id = todo.id;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete-button');
    deleteButton.dataset.id = todo.id;

    li.appendChild(updateButton);
    li.appendChild(deleteButton);

    return li;
}

// Add event listener to the form for creating new todos
todoForm.addEventListener('submit', async event => {
    event.preventDefault();

    const title = titleInput.value;
    const description = descriptionInput.value;

    if (title && description) {
        const response = await fetch('/todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, description })
        });

        if (response.ok) {
            titleInput.value = '';
            descriptionInput.value = '';
            fetchTodos();
        }
    }
});

// Add event listener to the todo list for updating and deleting
todoList.addEventListener('click', async event => {
    const target = event.target;

    if (target.classList.contains('update-button')) {
        const todoId = target.dataset.id;
        const newTitle = prompt('Enter the new title:');
        if (newTitle !== null) {
            const response = await fetch(`/todos/${todoId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title: newTitle })
            });

            if (response.ok) {
                fetchTodos();
            }
        }
    } else if (target.classList.contains('delete-button')) {
        const todoId = target.dataset.id;
        const confirmDelete = confirm('Are you sure you want to delete this todo?');
        if (confirmDelete) {
            const response = await fetch(`/todos/${todoId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                fetchTodos();
            }
        }
    }
});

// Fetch todos and update the UI when the page loads
async function fetchTodos() {
    const response = await fetch('/todos');
    const todos = await response.json();

    todoList.innerHTML = '';
    todos.forEach(todo => {
        const li = createTodoItem(todo);
        todoList.appendChild(li);
    });
}

// Fetch todos when the page loads
fetchTodos();
