import { API_BASE_URL } from "./config.js";

const loginSection = document.getElementById('login-section');
const registerSection = document.getElementById('register-section');
const dashboard = document.getElementById('dashboard');
const welcomeSection = document.getElementById('welcome-section');
const completedSection = document.getElementById('completed-section');

const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');
const logoutBtn = document.getElementById('logout-btn');
const homeBtn = document.getElementById('home-btn');

const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const taskForm = document.getElementById('task-form');
const taskList = document.getElementById('task-list');

const welcomeMessage = document.getElementById('welcome-message');

function showDashboard(username) {
    welcomeMessage.textContent = `Welcome, ${username}`;
    loginSection.classList.add('hidden');
    registerSection.classList.add('hidden');
    dashboard.classList.remove('hidden');
    logoutBtn.classList.remove('hidden');
    homeBtn.classList.add('hidden');
    loginBtn.classList.add('hidden');
    registerBtn.classList.add('hidden');
    welcomeSection.classList.add('hidden');
    loadTasks();
}

function showWelcome() {
    welcomeSection.classList.remove('hidden');
    loginSection.classList.add('hidden');
    registerSection.classList.add('hidden');
    dashboard.classList.add('hidden');
    logoutBtn.classList.add('hidden');
    homeBtn.classList.remove('hidden');
    loginBtn.classList.remove('hidden');
    registerBtn.classList.remove('hidden');
}

function logoutUser() {
    localStorage.removeItem('currentUser');
    dashboard.classList.add('hidden');
    welcomeMessage.textContent = '';
    logoutBtn.classList.add('hidden');
    welcomeSection.classList.remove('hidden');
    showWelcome();
}

// Event Listeners
loginBtn.addEventListener('click', () => {
    loginSection.classList.remove('hidden');
    registerSection.classList.add('hidden');
});

registerBtn.addEventListener('click', () => {
    registerSection.classList.remove('hidden');
    loginSection.classList.add('hidden');
});

logoutBtn.addEventListener('click', () => {
    logoutUser();
});

homeBtn.addEventListener('click', () => {
    showWelcome();
});

// Register
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = registerForm.username.value;
    const email = registerForm.email.value;
    const password = registerForm.password.value;

    try {
        const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Registration failed");

        alert("Registration successful. Please log in.");
        registerForm.reset();
        showWelcome();
    } catch (err) {
        alert(err.message);
    }
});

// Login
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = loginForm.email.value;
    const password = loginForm.password.value;

    try {
        const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Login failed");

        localStorage.setItem('currentUser', JSON.stringify({
            username: data.user.username,
            email: data.user.email,
            token: data.token
        }));

        loginForm.reset();
        showDashboard(data.user.username);
    } catch (err) {
        alert(err.message);
    }
});

// Add new task
taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = taskForm.title.value;
    const description = taskForm.description.value;
    const user = JSON.parse(localStorage.getItem('currentUser'));

    try {
        const res = await fetch(`${API_BASE_URL}/api/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify({ title, description })
        });

        const task = await res.json();
        if (!res.ok) throw new Error(task.message || 'Failed to add task');

        taskForm.reset();
        loadTasks();
    } catch (err) {
        alert(err.message);
    }
});

// Load tasks from backend
async function loadTasks() {
    taskList.innerHTML = '';
    completedSection.innerHTML = '';

    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) return;

    try {
        const res = await fetch(`${API_BASE_URL}/api/tasks`, {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        });

        const tasks = await res.json();
        if (!res.ok) throw new Error("Failed to fetch tasks");

        tasks.forEach(renderTask);
    } catch (err) {
        alert(err.message);
    }
}

function renderTask(task) {
    const card = document.createElement('div');
    card.classList.add('task-card');
    if (task.completed) {
        card.classList.add('task-completed');
        card.addEventListener('mouseenter', () => card.classList.add('expanded'));
        card.addEventListener('mouseleave', () => card.classList.remove('expanded'));
    }
    card.innerHTML = `<h3>${task.title}</h3><p>${task.description}</p>`;

    const actions = document.createElement('div');
    actions.className = 'task-actions';

    const completeBtn = document.createElement('button');
    completeBtn.innerHTML = task.completed ? '↩️' : '✅';
    completeBtn.className = 'task-btn';
    completeBtn.title = task.completed ? 'Mark as incomplete' : 'Mark as complete';
    completeBtn.onclick = () => toggleComplete(task._id, !task.completed);

    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '❌';
    deleteBtn.className = 'task-btn';
    deleteBtn.title = 'Delete task';
    deleteBtn.onclick = () => deleteTask(task._id);

    actions.appendChild(completeBtn);
    actions.appendChild(deleteBtn);
    card.appendChild(actions);

    (task.completed ? completedSection : taskList).appendChild(card);
}

// Toggle task completion
async function toggleComplete(taskId, newStatus) {
    const user = JSON.parse(localStorage.getItem('currentUser'));

    try {
        const res = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify({ completed: newStatus })
        });

        if (!res.ok) throw new Error("Failed to update task");
        loadTasks();
    } catch (err) {
        alert(err.message);
    }
}

// Delete task
async function deleteTask(taskId) {
    if (!confirm("Are you sure you want to delete this task? This action cannot be undone.")) return;

    const user = JSON.parse(localStorage.getItem('currentUser'));

    try {
        const res = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        });

        if (!res.ok) throw new Error("Failed to delete task");
        loadTasks();
    } catch (err) {
        alert(err.message);
    }
}

// On page load
document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        showDashboard(currentUser.username);
    } else {
        showWelcome();
    }
});
