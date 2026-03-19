//! selecting elements :----------------->>
//accessing dialog:
const addBtn = document.querySelector("#addBtn");
const taskDialog = document.querySelector("#taskDialog");
const taskForm = document.querySelector("#taskForm");
const newTaskInput = document.querySelector("#newTask");
//accessing table:
const tableHead = document.querySelector("#tableHead");
const tableBody = document.querySelector("#tasks_tbody");
// span to display date and time:
const currentTime = document.querySelector("#currentTime");
//tasks array :
let tasks =[];
//checked cells array to remember :
let Completed =[];
//*--------------------------------------
const WinColor = "rgb(139, 92, 246)"; 
const LoseColor = "rgb(30, 58, 138)"; 

//!global reausable functions :----------------->>
//* save to local storage function :----------------->>
function saveToStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  localStorage.setItem("completed", JSON.stringify(Completed));
}
//* Load from local storage function :----------------->>
function LoadFromStorage() {
const savedTasks = localStorage.getItem("tasks");
  if (savedTasks) {
    tasks = JSON.parse(savedTasks);
  }
  const savedCompleted = localStorage.getItem("completed");
  if (savedCompleted) {
    Completed = JSON.parse(savedCompleted);
  }
}
//* reset form  and exit dialog function :----------------->>
function resetClose(e) {
  e.target.closest("form").reset();
  e.target.closest("dialog").close();
}
//* messages function :----------------->>
const toast = document.querySelector('.toast')
const toastBody = document.querySelector('.toast-body')
function ShowAlert(msge, nature) {
let currentColor= nature?WinColor:LoseColor;
  toast.style.background=currentColor;
  let messageP = document.createElement('p');
  messageP.innerText=msge;
  toastBody.innerHTML='';
  toastBody.appendChild(messageP)
  toast.classList.add('show');
setTimeout(
  ()=>toast.classList.remove('show'),1500
)
}
//* time displaying function :----------------->>
function seeDate() {
  let now = new Date();
  const options = {
    year: "numeric",
    month: "short",
    day: "2-digit",
    weekday: "short",
    hour: "numeric",
    hour12: true,
    minute: "2-digit",
  };
  const label = now.toLocaleString("en-US", options);
  currentTime.innerText = label;
}
//* refresh all the table:
function refreshAll(start=startdate) {
  refreshWeek(start);
  refreshBody(start);
  refreshMarks();
  saveToStorage();
  tasks.sort();
  Completed.sort();
}

//!run functions as document loads :----------------->>
document.addEventListener("DOMContentLoaded", () => {
  LoadFromStorage();
  seeDate();
  refreshAll();
  ShowAlert("Welcome To war !", 1);
});
//* run a function each 1000ms :----------------->>
setInterval(seeDate, 1000);

//! dialogs actions :----------------->>
//* show dialog :----------------->>
addBtn.addEventListener("click", (e) => taskDialog.showModal());
//* cancel adding new task :----------------->>
taskDialog.addEventListener("click", (e) => {
  if (e.target.value === "cancel" ) {
    resetClose(e);
  }else if ((e.target === taskDialog)){
    taskDialog.close();
    taskForm.reset();
  }
});
taskDialog.addEventListener('close', () => {
    taskForm.reset();
});
//! refresh week days :----------------->>
//days of week :
let weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
//today's date
let today = new Date();
today.setHours(0, 0, 0, 0);
let now = new Date();
//this week monday
let monday;
while (now.getDay() != 1) {
  now.setDate(now.getDate() - 1);
}
monday = new Date(now);
monday.setHours(0, 0, 0, 0);
//get the whole week in table:
function refreshWeek(startdate) {
  for (let i = 0; i < 7; i++) {
    const cell = document.querySelector(
      "#day_cell_".concat((i + 1).toString()),
    );
    cell.innerHTML = "";
    //getting week days:
    let datex = new Date(startdate);
    datex.setDate(datex.getDate() + i);
    //inserting new p into cells:
    let newP = document.createElement("p");
    let day = datex.getDate(),
      month = (datex.getMonth() + 1).toString().padStart(2, "0"),
      year = datex.getFullYear().toString().slice(-2);
    newP.innerText = `${month}/${day}`;
    cell.innerText = weekDays.at(i);
    cell.appendChild(newP);
    //green current day:
    if (today.toDateString() === datex.toDateString()) {
      cell.style.background = "grey";
      cell.style.color = "white";
    } else {
      cell.style.background = "";
      cell.style.color = "";
    }
  }
}

//!see previous or next week :----------------->>
// getting buttons:
const leftWeek = document.querySelector("#leftWeek");
const current = document.querySelector("#current");
const rightweek = document.querySelector("#rightweek");

let startdate = new Date(monday);
leftWeek.addEventListener("click", (e) => {
  startdate.setDate(startdate.getDate() - 7);
  refreshAll();
});
rightweek.addEventListener("click", (e) => {
  startdate.setDate(startdate.getDate() + 7);
  refreshAll();
});
current.addEventListener("click", (e) => {
  refreshAll(monday);
});

//! getting input from user :----------------->>

// const tasksbackup= Array.from(...tasks);
//*gettings tasks :----------------->>
let isEditing = false;
let taskToEdit='';
taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let formData = new FormData(taskForm);
  let newTask = formData.get("taskName").trim();
  taskINsert(newTask);
  resetClose(e);
  refreshAll();
});
//!function to insert/update tasks array :
function taskINsert(newTask){
//adding to the array if task is valid, message if not:
if (tasks.includes(newTask)) ShowAlert("task alraedy exists", 0);
else if (newTask) {
  if (isEditing){
    let taskId = taskToEdit.replaceAll(/\s/g,'');
    let newtaskId = newTask.replaceAll(/\s/g,'');
    Completed = Completed.map(id => {
      return (id.startsWith(taskId+"-")?id.replace(taskId,newtaskId): id);
});
    tasks.splice(tasks.indexOf(taskToEdit),1,newTask);
    ShowAlert('task updated !' , 1);
    isEditing = false;
    taskToEdit=''
  }else{
    tasks.push(newTask);
    ShowAlert("new task added", 1);
  }
} else ShowAlert("task field is empty", 0);
}
//! refresh tasks in table :----------------->>
//accessing table body:
function refreshBody(startdate) {
  tableBody.innerHTML = "";
  // creating a row for every task
  if (tasks.length===0){
    let newRow = document.createElement("tr");
    let newTd = document.createElement("th");
    newTd.setAttribute('colspan','8')
    newTd.innerHTML = `<p class="task">Start By Adding a new Habit</p>`;
    newRow.appendChild(newTd);
    tableBody.appendChild(newRow);
  }else{
  tasks.forEach((task, index) => {
    let newRow = document.createElement("tr");
    let newTh = document.createElement("th");
    let btnDiv = document.createElement("div");
    btnDiv.className = "taskActions";
    btnDiv.innerHTML = `<button class="deleteTask"><i class="fa-solid fa-trash-can"></i></button>
  <button class="renameTask"><i class="fa-solid fa-pen-to-square"></i></button>`;
    newTh.setAttribute("scope", "row");
    newTh.innerHTML = `<p class="task">${task}</p>`;
    newTh.appendChild(btnDiv);
    newRow.appendChild(newTh);
    //getting day for ids
    for (let i = 0; i < 7; i++) {
      let datex = new Date(startdate);
      datex.setDate(datex.getDate() + i);
      let day = datex.getDate(),
        month = datex.getMonth() + 1,
        year = datex.getFullYear().toString().slice(-2),
        taskForId = task.split("").filter((c) => c != " ").join("");
      let newTd = document.createElement("td");
      newTd.id = `${taskForId + "-" + day + "-" + month + "-" + year}`;
      //classList.add - className
      newTd.className = `cellToCheck`;
      newTd.setAttribute('title',`task: ${task}\nday: ${day+'/'+month+'/'+datex.getFullYear()}`)
      newRow.appendChild(newTd);
    }
    tableBody.appendChild(newRow);
  });
  /*
  cells IDs
  index+'-'+day+'-'+month+'-'+year
*/
}}
//! check cell if clicked and store checked cells:----------------->>
function checkCell(cell) {
  cell.style.background = WinColor;
  cell.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
}
function uncheckCell(cell) {
  cell.style.background = "";
  cell.innerHTML = "";
}
tableBody.addEventListener("click", (e) => {
  let status;
  if (e.target.classList.contains("cellToCheck")) {
    if (e.target.style.background == WinColor) {
      uncheckCell(e.target);
      status = "unchecked";
    } else {
      checkCell(e.target);
      status = "checked";
    }
  }
  let id = e.target.id;
  if (status === "checked") {
    Completed.push(id);
  } else if (status === "unchecked") {
    Completed.splice(Completed.indexOf(id), 1);
  }
});
//! refresh checked cells in table :----------------->>
// getting all cells:
function refreshMarks() {
  const cells = document.querySelectorAll(".cellToCheck");
  cells.forEach((cell) => {
    if (Completed.includes(cell.id)) {
      checkCell(cell);
    }
  });
}
//! delete or edit a task :----------------->>
//selecting parent to listen, event delegation , because those child are not yet created:
const mainTable = document.querySelector("#mainTable");
//adding actions to buttons:
mainTable.addEventListener("click", (e) => {
  if (e.target.className === "deleteTask"|| e.target.className === "renameTask"){
    editTask(e);
    refreshAll();
  }
});
//function:
function editTask(e) {
  const thTarget = e.target.closest("th");
  const task = thTarget.querySelector(".task");
  const taskName = task.innerText;
  if (e.target.className === "deleteTask") {
    let userConfirm = confirm(
      `Are you sure!\nyou want to delete the task : ${taskName}`,
    );
    if (userConfirm) {
      tasks.splice(tasks.indexOf(taskName), 1);
      ShowAlert("Task Deleted ", 1);
    }
  } else if (e.target.className === "renameTask") {
    taskDialog.showModal();
    newTaskInput.value = taskName;
    isEditing=true;
    taskToEdit = taskName;
  }
}