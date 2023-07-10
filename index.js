const form = document.querySelector("form");
const input = document.querySelector("input");
const select = document.querySelector("select");
const categoryInputs = document.querySelectorAll('input[type="radio"]');
const dateTime = document.querySelector('input[type="datetime-local"]');
const fileInput = document.querySelector('input[type="file"]');
const notes = document.querySelector("textarea");
const ul = document.querySelector("ul");

// Load tasks from localStorage when the page loads
window.addEventListener("load", function () {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach(function (task) {
    createTaskElement(task);
  });
});

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const taskPriority = select.value;
  const taskReminder = dateTime.value;
  const taskNotes = notes.value;
  const taskAttachment = fileInput.files[0] ? fileInput.files[0].name : "";

  if (input.value.trim() !== "") {
    const task = {
      name: input.value,
      priority: taskPriority,
      reminder: taskReminder,
      notes: taskNotes,
      attachment: taskAttachment,
      category: getSelectedCategory(),
    };

    createTaskElement(task);
    saveTaskToStorage(task);

    input.value = "";
    select.value = "low";
    dateTime.value = "";
  }
});

ul.addEventListener("click", function (event) {
  if (event.target.tagName === "BUTTON") {
    const li = event.target.parentNode;
    li.parentNode.removeChild(li);
    removeTaskFromStorage(li.dataset.taskId);
  }
});

function createTaskElement(task) {
  const li = document.createElement("li");
  const priorityIcon = document.createElement("div");
  const span = document.createElement("span");
  const reminderSpan = document.createElement("span");
  const button = document.createElement("button");
  button.classList.add("btn", "del-btn");
  const taskNotesElement = document.createElement("p");
  taskNotesElement.innerText = task.notes;
  const taskAttachmentElement = document.createElement("span");
  taskAttachmentElement.innerText = task.attachment;

  priorityIcon.textContent = task.priority.charAt(0).toUpperCase();
  priorityIcon.classList.add("task-priority", task.priority);

  span.textContent = task.name;
  reminderSpan.textContent = task.reminder;
  reminderSpan.classList.add("task-reminder");
  button.textContent = "Delete";

  li.appendChild(priorityIcon);
  li.appendChild(span);
  li.appendChild(reminderSpan);
  li.appendChild(taskNotesElement);
  li.appendChild(taskAttachmentElement);
  li.appendChild(button);

  // Check if category is not empty before adding it to the classList
  if (task.category !== "") {
    li.classList.add(task.category);
  }

  // Assign a unique ID to the task element
  const taskId = Date.now().toString();
  li.setAttribute("data-task-id", taskId);

  ul.appendChild(li);
}

function getSelectedCategory() {
  let selectedCategory = "";
  categoryInputs.forEach(function (input) {
    if (input.checked) {
      selectedCategory = input.value;
    }
  });
  return selectedCategory;
}

function saveTaskToStorage(task) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function removeTaskFromStorage(taskId) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const updatedTasks = tasks.filter(function (task) {
    return task.taskId !== taskId;
  });
  localStorage.setItem("tasks", JSON.stringify(updatedTasks));
}
