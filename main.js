const storage = window.localStorage;

const getTasks = () => {
  let tasks = storage.getItem('tasks-data');
  array = tasks ? JSON.parse(tasks) : [];
  return array;
}
var taskArray = getTasks();

// Helper functions for debugging
function logTasks() {
  console.log(JSON.parse(storage.getItem('tasks-data')));
}

// Bind elements to JS variables
const taskDisplay = document.getElementById('task-list');
const submitButton = document.getElementById('submit-task');
const resetButton = document.querySelector('#reset');
const deleteButton = document.getElementById('delete');
const editButton = document.getElementById('edit');
const completeTask = document.getElementById('div.item-text');

/* 
*  Binding Event Handlers
*/ 

// Submit handlers binding
document.querySelector('#task-input').addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    submitTask();
  }
})

submitButton.addEventListener('click', (event) => {
  event.preventDefault();
  submitTask();
});

// Reset handlers
resetButton.addEventListener('click', (event) => {
  event.preventDefault();
  resetList();
})


const focusInput = () => {
  document.getElementById('task-input').focus();
}

// // Complete item handler
// completeTask.addEventListener('click', () => {
//   toggleComplete();
// })

// Task action handlers
const actionEventListener = (event) => {
  event.preventDefault();
  if (event.target.value === "Edit") {
    console.log('Edit');
  } else if (event.target.value === "Delete") {
    var element = event.target.parentNode;

    while (element.getAttribute('class') !== 'task-list-item') {
      element = element.parentNode;
    }

    deleteItem(element);
  }
}
  
/*
 * Render tasks to list
*/

// helper function for setting element attributes
const setAttributes = (element, attributes) => {
  for (var key in attributes) {
    if (key === 'class') {
      element.classList.add(attributes[key]);
    } else {
      element.setAttribute(key, attributes[key]);
    }
  }
}



/*
 * Events | Methods
*/

const submitTask = (event) => {
  const input = document.getElementById('task-input');
  let trimmedInput = input.value.trim();
/* Note: Maybe let's use a regular expression here instead of checking for an empty string? */
  if (trimmedInput === '') {
    window.alert("Please enter a task.");
    return;
  } else {
    taskArray.push(trimmedInput);
    storage.setItem('tasks-data', JSON.stringify(taskArray));
    input.value = '';
  }

  reloadTasks();
}

// const editItem = (item) => {
//   return;
// }

const deleteItem = (item) => {

  if (!taskArray || taskArray.length === 0) {
    console.log('There are no tasks to delete')
    return;
  }

  const taskText = item.innerText.trim();
  const itemIndex = taskArray.indexOf(taskText);
  const updatedTasks = taskArray.slice(0, itemIndex)
    .concat(taskArray.slice(itemIndex + 1));
  storage.setItem('tasks-data', JSON.stringify(updatedTasks));
  item.remove();
  reloadTasks();
}

const resetList = () => {
  storage.clear();
  taskArray = [];
  reloadTasks();
}

const toggleComplete = (item) => {
  // Code for crossing out completed items
}

const renderTasks = (taskArray) => {
  if (document.getElementById('task-list').hasChildNodes()) {
    var node = document.getElementById('task-list');
    while (node.firstChild) {
      node.removeChild(node.lastChild);
    }
  }

  if (!taskArray || taskArray.length === 0) {
    let element = document.createElement('h1');
    element.innerHTML = "No tasks to complete!";
    element.setAttribute('class', 'no-tasks');
    taskDisplay.appendChild(element);
  } else {

    for (let i = 0; i < taskArray.length; i++) {
      var taskListItem = document.createElement('div');
      taskListItem.setAttribute('class', 'task-list-item');
      var itemContent = document.createElement('div');
      itemContent.setAttribute('class', 'item-content');
      var itemText = document.createElement('div');
      itemText.setAttribute('class', 'item-text');
      itemText.innerText = taskArray[i];
      var actionButtons = document.createElement('div');
      actionButtons.setAttribute('class', 'action-buttons');

      const editBtn = document.createElement('input');
      setAttributes(editBtn, {
        'type': 'button',
        'id': 'edit',
        'value': 'Edit'
      })

      const deleteBtn = document.createElement('input');
      setAttributes(deleteBtn, {
        'type': 'button',
        'id': 'delete',
        'value': 'Delete'
      })

      actionButtons.addEventListener('click', actionEventListener);
      actionButtons.appendChild(editBtn);
      actionButtons.appendChild(deleteBtn);
      itemContent.appendChild(itemText);
      itemContent.appendChild(actionButtons);
      taskListItem.appendChild(itemContent);
      taskDisplay.appendChild(taskListItem);
    }
  }
}

const reloadTasks = () => {
  taskArray = getTasks();
  renderTasks(taskArray);
}

window.addEventListener('load', () => {
  reloadTasks();
  focusInput();
})