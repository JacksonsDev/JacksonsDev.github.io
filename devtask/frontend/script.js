const loginSection = document.getElementById('login-section');
const registerSection = document.getElementById('register-section');
const dashboard = document.getElementById('dashboard');
const welcomeSection = document.getElementById('welcome-section');

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

registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = registerForm.username.value;
    const email = registerForm.email.value;
    const password = registerForm.password.value;

    const users = JSON.parse(localStorage.getItem('users') || '{}');

    if (users[email]) {
        alert('Account already exists. Please login instead.');
        return;
    }

    users[email] = { username, password };
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify({ email, username }));

    registerForm.reset();
    showDashboard(username);
});

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = loginForm.email.value;
    const password = loginForm.password.value;

    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const user = users[email];

    if (!user || user.password !== password) {
        alert('Invalid Credentials. Please check and try again.');
        return;
    }

    localStorage.setItem('currentUser', JSON.stringify({ email, username: user.username }));
    loginForm.reset();
    showDashboard(user.username);
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
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) return;

    const userTasks = JSON.parse(localStorage.getItem(`tasks_${user.email}`) || '[]');
    userTasks.forEach(task => {
        const card = document.createElement('div');
        card.classList.add('task-card');
        card.innerHTML = `
        <h3>${task.title}</h3>
        <p>${task.description}</p>`;
        taskList.appendChild(card);
    });
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