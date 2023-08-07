const todoForm = document.getElementById('add-todo-form');
const titleInput = document.getElementById('title-input');
const descriptionInput = document.getElementById('description-input');
const todoList = document.getElementById('todo-list');

// Function to fetch todos from the server and update the UI
async function fetchTodos() {
    const response = await fetch('/todos');
    const todos = await response.json();

    todoList.innerHTML = '';
    todos.forEach(todo => {
        const li = document.createElement('li');
        li.textContent = `${todo.title}: ${todo.description}`;
        todoList.appendChild(li);
    });
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

// Fetch todos when the page loads
fetchTodos();
