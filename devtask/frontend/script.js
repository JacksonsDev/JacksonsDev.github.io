import { API_BASE_URL } from "./config";

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

// Temp user session handling
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

function showWelcome () {
    document.getElementById('welcome-section').classList.remove('hidden');
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

// Toggle forms
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
})


// Register and Login (localstorage Sim until backend built)

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = registerForm.username.value;
    const email = registerForm.email.value;
    const password = registerForm.password.value;

    try {
        const res = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Registration failed");

        alert("Registration successful. You are now logged in.");
        localStorage.setItem('currentUser', JSON.stringify({ username, email, token: data.token }));
        registerForm.reset();
        showDashboard(username);

    } catch (err) {
        alert(err.message);
    }
});

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = loginForm.email.value;
    const password = loginForm.password.value;

    try {
        const res = await fetch(`${API_BASE_URL}/auth/login`, {
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

// Task Handling
taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = taskForm.title.value;
    const description = taskForm.description.value;

    const task = { title, description, id: Date.now() };
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const userTasksKey = `tasks_${user.email}`;
    const existingTasks = JSON.parse(localStorage.getItem(userTasksKey) || '[]');

    existingTasks.push(task);
    localStorage.setItem(userTasksKey, JSON.stringify(existingTasks));

    taskForm.reset();
    loadTasks();
});

function loadTasks() {
    taskList.innerHTML = '';
    completedSection.innerHTML = '';

    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) return;

    const userTasks = JSON.parse(localStorage.getItem(`tasks_${user.email}`) || '[]');

    userTasks.forEach(task => {
        const card = document.createElement('div');
        card.classList.add('task-card');
        if (task.completed) {
            card.classList.add('task-completed');
            card.innerHTML = `<h3>${task.title}</h3><p>${task.description}</p>`;
            card.addEventListener('mouseenter', () => card.classList.add('expanded'));
            card.addEventListener('mouseleave', () => card.classList.remove('expanded'));
        } else {
            card.innerHTML = `<h3>${task.title}</h3><p>${task.description}</p>`;
        }

        const actions = document.createElement('div');
        actions.className = 'task-actions';

        const completeBtn = document.createElement('button');
        completeBtn.innerHTML = task.completed ? '↩️' : '✅';
        completeBtn.className = 'task-btn';
        completeBtn.title = task.completed ? 'Mark as incomplete' : 'Mark as complete';
        completeBtn.onclick = () => toggleComplete(task.id);

        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '❌';
        deleteBtn.className = 'task-btn';
        deleteBtn.title = 'Delete task';
        deleteBtn.onclick = () => deleteTask(task.id);

        actions.appendChild(completeBtn);
        actions.appendChild(deleteBtn);
        card.appendChild(actions);

        if (task.completed) {
            completedSection.appendChild(card);
        } else {
            taskList.appendChild(card);
        }
    });
}

// Toggle task completion
function toggleComplete(taskId) {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const key = `tasks_${user.email}`;
    const tasks = JSON.parse(localStorage.getItem(key) || '[]');

    const updated = tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t);
    localStorage.setItem(key, JSON.stringify(updated));
    loadTasks();
}

// Delete task with confirmation
function deleteTask(taskId) {
    if (!confirm("Are you sure you want to delete this task? This action cannot be undone.")) {
        return;
    }

    const user = JSON.parse(localStorage.getItem('currentUser'));
    const key = `tasks_${user.email}`;
    const tasks = JSON.parse(localStorage.getItem(key) || '[]');

    const updated = tasks.filter(t => t.id !== taskId);
    localStorage.setItem(key, JSON.stringify(updated));
    loadTasks();
}


// autoload if already logged in
document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        showDashboard(currentUser.username);
    } else {
        showWelcome();
    }
});