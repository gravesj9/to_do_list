var storage;
var taskArray;

window.addEventListener('load', () => {
  storage = window.localStorage;
  taskArray = getTasks();

  reloadTasks();
  focusInput();
})

function getTasks() {
  let tasks = storage.getItem('tasks-data');
  array = tasks ? JSON.parse(tasks) : [];
  return array;
} 

const setTasks = (taskArray) => {
  storage.setItem('tasks-data', JSON.stringify(taskArray));
}

// initialize task array

// Bind elements to JS variables
const taskDisplay = document.getElementById('task-list');
const submitButton = document.getElementById('submit-task');
const resetButton = document.getElementById('reset');

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

// Task action handlers
const actionEventListener = (event) => {
  event.preventDefault();

  // EDIT
  if (event.target.value === "Edit") {

    // Hide action buttons
    event.target.parentNode.style.display = 'none';

    // Access text in ancestor div
    let itemToEdit = event.target.parentNode.parentNode.firstChild;

    editItem(itemToEdit);
  } else {
    var element = event.target.parentNode;


    // COMPLETE
    if (event.target.value === "Complete") {
      completeTask(element.parentNode);

      // DELETE
    } else if (event.target.value === "Delete") {

      // Find element to delete (task container) in lineage
      while (element.getAttribute('class') !== 'task-list-item') {
        element = element.parentNode;
      }

      deleteItem(element);
    }
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


const submitTask = () => {
  const input = document.getElementById('task-input');
  taskArray = getTasks();
  let trimmedInput = input.value.trim();
  /* Note: Maybe let's use a regular expression here instead of checking for an empty string? */
  if (trimmedInput === '') {
    window.alert("Please enter a task.");
    return;
  } else if (taskArray.includes(trimmedInput)) {
    window.alert("That task is already on your list.")
    return;
  } 
  else {
    taskArray.push(trimmedInput);
    storage.setItem('tasks-data', JSON.stringify(taskArray));
    input.value = '';
  }

  reloadTasks();
}

const submitEdit = (input, index) => {
  taskArray = getTasks();

  if (input === '' || input.trim() === '') {
    window.alert('why no task?');
  }
  let trimmedInput = input.trim();
  
  taskArray[index] = trimmedInput;
  storage.setItem('tasks-data', JSON.stringify(taskArray));
  reloadTasks();
}

const editItem = (item) => {
  taskArray = getTasks();
  var text = item.innerText;

  var elemDiv = document.createElement('div');
  elemDiv.setAttribute('id', 'edit-task-div');

  var elem = document.createElement('input');
  setAttributes(elem, {
    type: 'text',
    value: text,
    id: 'edit-task',
  })

  var doneBtn = document.createElement('input');
  setAttributes(doneBtn, {
    type: 'button',
    value: 'Done Editing',
    id: 'done'
  })

  doneBtn.addEventListener('click', (event) => {
    event.preventDefault();
    submitEdit(event.target.previousSibling.value, taskArray.indexOf(text));
  })

  elem.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      submitEdit(event.target.value, taskArray.indexOf(text));
    }
  });

  elemDiv.appendChild(elem);
  elemDiv.appendChild(doneBtn);

  item.parentNode.replaceChild(elemDiv, item);

  document.getElementById('edit-task').focus();

  return elemDiv;
}

const deleteItem = (item) => {
  var taskText;
  var itemIndex;
  taskArray = getTasks();


  // Bail if no tasks in storage
  if (!taskArray || taskArray.length === 0) {
    console.log('There are no tasks to delete')
    return;
  }

  // grab item text element
  let itemTextEl = item.firstChild.firstChild;
  if (itemTextEl.classList.contains('completed')) {
    taskText = itemTextEl.innerText;
    for (let i in taskArray) {
      if (Array.isArray(taskArray[i])) {
        if (taskArray[i][0] === taskText) {
          itemIndex = i;
          
        }
      }
    }
    // itemIndex = taskArray.indexOf(new Array([taskText, 'completed']));
  } else {
    taskText = item.innerText;
    itemIndex = taskArray.indexOf(taskText);
  }

  // update storage
  const updatedTasks = taskArray.slice(0, itemIndex)
      .concat(taskArray.slice(itemIndex + 1));
  setTasks(updatedTasks);

  console.log("Deleted item \"" + taskText + "\" from storage.");

  reloadTasks();
}

const resetList = () => {
  storage.clear();
  taskArray = [];
  reloadTasks();
}

const completeTask = (item) => {

  // Set up taskArray
  taskArray = getTasks();

  // Bail if no tasks in storage
  if (!taskArray || taskArray.length == 0) {
    console.log('Why no task array?');
    return;
  }

  var taskDiv = item.firstChild;
  var taskText = taskDiv.innerText;
  var taskIndex = taskArray.indexOf(taskText);
  var actionButtons = item.lastChild.childNodes;
  actionButtons.forEach(button => {
    button.setAttribute('hidden', true);
  });
  taskDiv.classList.toggle('completed');

  // Set up new taskArray to update storage
  var newTaskArray = taskArray.slice(0, taskIndex).concat(taskArray.slice(taskIndex + 1));
  newTaskArray.push([taskText, 'completed']);
  setTasks(newTaskArray);

  // Refresh with new taskArray
  reloadTasks();
}

const renderTasks = (taskArray) => {

  // Setup : remove all tasks from the rendered list
  if (document.getElementById('task-list').children) {
    var node = document.getElementById('task-list');
    while (node.firstChild) {
      node.removeChild(node.lastChild);
    }
  }

  // Tell user there are no tasks to render
  if (!taskArray || taskArray.length === 0) {

    let element = document.createElement('h1');
    element.innerHTML = "No tasks to complete!";
    element.setAttribute('class', 'no-tasks');
    taskDisplay.appendChild(element);

  } else {

    // Loop through taskArray to render items
    for (let i = 0; i < taskArray.length; i++) {
      let task;
      let completed;
      
      // Look for completed items in storage
      if (typeof taskArray[i] === 'string') {
        task = taskArray[i];
      } else if (typeof taskArray[i] === 'object' && taskArray[i][1] === 'completed') {
        task = taskArray[i][0];
        completed = true;
      } 

      var taskListItem = document.createElement('div');
      taskListItem.setAttribute('class', 'task-list-item');
      var itemContent = document.createElement('div');
      itemContent.setAttribute('class', 'item-content');
      var actionButtons = document.createElement('div');
      actionButtons.setAttribute('class', 'action-buttons');
      var itemText = document.createElement('div');
      itemText.setAttribute('class', 'item-text');
      itemText.innerText = task;

      actionButtons.addEventListener('click', actionEventListener);


      const deleteBtn = document.createElement('input');
      setAttributes(deleteBtn, {
        type: 'button',
        id: 'delete',
        value: 'Delete'
      })

      // Special treatment for completed items
      // No 'edit' or 'complete' buttons; text crossed out
      if (completed) {
        itemText.classList.toggle('completed');

        completed = false;
      } else {

        // Normal treatment for the remaining items
        const editBtn = document.createElement('input');
        setAttributes(editBtn, {
          type: 'button',
          id: 'edit',
          value: 'Edit'
        })

        const completeBtn = document.createElement('input');
        setAttributes(completeBtn, {
          type: 'button',
          id: 'complete',
          value: 'Complete'
        })

        actionButtons.appendChild(completeBtn);
        actionButtons.appendChild(editBtn);
      }

      actionButtons.appendChild(deleteBtn);
      itemContent.appendChild(itemText);
      itemContent.appendChild(actionButtons);
      taskListItem.appendChild(itemContent);
      taskDisplay.appendChild(taskListItem);
      
    }
  }
}

const reloadTasks = () => {
  renderTasks(getTasks());
}

