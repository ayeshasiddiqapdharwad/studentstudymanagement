// Load saved data or set defaults
let subjects = JSON.parse(localStorage.getItem('subjects')) || ['Java', 'Mathematics', 'Python'];
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// DOM Elements
const subjectInput = document.getElementById('subject-input');
const addSubjectBtn = document.getElementById('add-subject-btn');
const subjectTags = document.getElementById('subject-tags');
const taskSubjectSelect = document.getElementById('task-subject');
const filterSubjectSelect = document.getElementById('filter-subject');

const taskForm = document.getElementById('task-form');
const taskList = document.getElementById('task-list');

const filterPriority = document.getElementById('filter-priority');
const filterStatus = document.getElementById('filter-status');

// Save to browser storage
function saveData() {
  localStorage.setItem('subjects', JSON.stringify(subjects));
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Render Subjects in tags and dropdowns
function renderSubjects() {
  subjectTags.innerHTML = '';
  taskSubjectSelect.innerHTML = '<option value="">Select Subject</option>';
  filterSubjectSelect.innerHTML = '<option value="All">All Subjects</option>';

  subjects.forEach((subj) => {
    // Tag badge
    const span = document.createElement('span');
    span.className = 'tag';
    span.textContent = subj;
    subjectTags.appendChild(span);

    // Dropdown options
    const opt1 = new Option(subj, subj);
    const opt2 = new Option(subj, subj);
    taskSubjectSelect.add(opt1);
    filterSubjectSelect.add(opt2);
  });
}

// Add new subject
addSubjectBtn.addEventListener('click', () => {
  const newSubj = subjectInput.value.trim();
  if (newSubj && !subjects.includes(newSubj)) {
    subjects.push(newSubj);
    subjectInput.value = '';
    saveData();
    renderSubjects();
  }
});

// Add new task
taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const newTask = {
    id: Date.now(),
    title: document.getElementById('task-title').value.trim(),
    subject: taskSubjectSelect.value,
    priority: document.getElementById('task-priority').value,
    deadline: document.getElementById('task-deadline').value,
    completed: false
  };

  tasks.push(newTask);
  taskForm.reset();
  saveData();
  renderTasks();
});

// Toggle task completion
function toggleComplete(id) {
  tasks = tasks.map(task =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  saveData();
  renderTasks();
}

// Delete task
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveData();
  renderTasks();
}

// Render Tasks & Update Dashboard
function renderTasks() {
  // Update Progress Dashboard
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;

  document.getElementById('total-count').textContent = total;
  document.getElementById('completed-count').textContent = completed;
  document.getElementById('pending-count').textContent = pending;

  // Apply Filters
  const subjFilter = filterSubjectSelect.value;
  const prioFilter = filterPriority.value;
  const statFilter = filterStatus.value;

  const filteredTasks = tasks.filter(task => {
    const matchSubj = subjFilter === 'All' || task.subject === subjFilter;
    const matchPrio = prioFilter === 'All' || task.priority === prioFilter;
    const matchStat =
      statFilter === 'All' ||
      (statFilter === 'Completed' && task.completed) ||
      (statFilter === 'Pending' && !task.completed);
    return matchSubj && matchPrio && matchStat;
  });

  // Render list
  taskList.innerHTML = '';
  if (filteredTasks.length === 0) {
    taskList.innerHTML = '<p style="color:#6b7280; text-align:center;">No tasks match your filter.</p>';
    return;
  }

  filteredTasks.forEach(task => {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'done' : ''}`;
    li.innerHTML = `
      <div class="task-info">
        <strong>${task.title}</strong>
        <div class="task-meta">
          <span>📘 ${task.subject}</span> • 
          <span class="badge ${task.priority}">${task.priority}</span> • 
          <span>📅 Due: ${task.deadline}</span>
        </div>
      </div>
      <div class="task-actions">
        <button class="btn-complete" onclick="toggleComplete(${task.id})">
          ${task.completed ? 'Undo' : '✔ Done'}
        </button>
        <button class="btn-delete" onclick="deleteTask(${task.id})">🗑</button>
      </div>
    `;
    taskList.appendChild(li);
  });
}

// Listen for filter changes
filterSubjectSelect.addEventListener('change', renderTasks);
filterPriority.addEventListener('change', renderTasks);
filterStatus.addEventListener('change', renderTasks);

// Initial load
renderSubjects();
renderTasks();