const taskTitle = document.getElementById("taskTitle");
const taskDetail = document.getElementById("taskDetail");
const dueDateInput = document.getElementById("dueDate");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const clearAllBtn = document.getElementById("clearAllBtn");
const filterBtns = document.querySelectorAll(".filter-btn");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Render tasks
function renderTasks(filter = "all") {
  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    if (filter === "active" && task.completed) return;
    if (filter === "completed" && !task.completed) return;

    const li = document.createElement("li");
    li.className = "task-item";

    // Top row
    const topDiv = document.createElement("div");
    topDiv.className = "task-top";

    const leftDiv = document.createElement("div");
    leftDiv.className = "task-left";

    // Checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", () => toggleTask(index));

    // Title
    const title = document.createElement("span");
    title.className = "task-title" + (task.completed ? " completed" : "");
    title.textContent = task.title;

    // Inline edit
    title.addEventListener("dblclick", () => editTask(index, title));

    leftDiv.appendChild(checkbox);
    leftDiv.appendChild(title);

    // Due date
    if (task.dueDate) {
      const due = document.createElement("span");
      due.className = "due-date";
      due.textContent = `(Due: ${task.dueDate})`;
      leftDiv.appendChild(due);
    }

    // Delete button
    const delBtn = document.createElement("button");
    delBtn.className = "delete-btn";
    delBtn.innerHTML = "✖";
    delBtn.addEventListener("click", () => deleteTask(index, li));

    topDiv.appendChild(leftDiv);
    topDiv.appendChild(delBtn);

    li.appendChild(topDiv);

    // Details (expand/collapse on click)
    if (task.detail) {
      const detail = document.createElement("p");
      detail.className = "task-detail";
      detail.textContent = task.detail;

      title.addEventListener("click", () => {
        detail.classList.toggle("show");
      });

      li.appendChild(detail);
    }

    taskList.appendChild(li);
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Add Task
function addTask() {
  const title = taskTitle.value.trim();
  const detail = taskDetail.value.trim();
  const dueDate = dueDateInput.value;

  if (title === "") return;

  tasks.push({ title, detail, completed: false, dueDate });
  taskTitle.value = "";
  taskDetail.value = "";
  dueDateInput.value = "";
  renderTasks();
}

// Edit Task
function editTask(index, titleEl) {
  const input = document.createElement("input");
  input.type = "text";
  input.value = tasks[index].title;
  input.className = "edit-input";

  titleEl.replaceWith(input);
  input.focus();

  const save = () => {
    tasks[index].title = input.value.trim() || tasks[index].title;
    renderTasks();
  };

  input.addEventListener("blur", save);
  input.addEventListener("keypress", e => {
    if (e.key === "Enter") save();
  });
}

// Toggle Complete
function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  renderTasks();
}

// Delete Task with animation
function deleteTask(index, element) {
  element.classList.add("removing");
  setTimeout(() => {
    tasks.splice(index, 1);
    renderTasks();
  }, 300);
}

// Clear All
function clearAllTasks() {
  if (confirm("Are you sure you want to clear all tasks?")) {
    tasks = [];
    renderTasks();
  }
}

// Filter
filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector(".filter-btn.active").classList.remove("active");
    btn.classList.add("active");
    renderTasks(btn.dataset.filter);
  });
});

// Event Listeners
addTaskBtn.addEventListener("click", addTask);
taskTitle.addEventListener("keypress", e => {
  if (e.key === "Enter") addTask();
});
clearAllBtn.addEventListener("click", clearAllTasks);

// Initial render
renderTasks();
