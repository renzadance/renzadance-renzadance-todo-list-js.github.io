const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('.main_list');

// ------------------------------------------------------------

//events
form.addEventListener('submit', addTask);
tasksList.addEventListener('click', delTask);
tasksList.addEventListener('click', doneTask);

//массив с задачами
let tasks = [];

if(localStorage.getItem('tasks')){
    tasks = JSON.parse(localStorage.getItem('tasks'))    
}

tasks.forEach(function (task) {
    renderTask(task)
});

checkEmptyList()

// functions
function addTask(event) {
    //отменяем отправку формы (страница не перезагружается)
    event.preventDefault()

    const taskText = taskInput.value
    //обнуляем текст в инпуте и делаем фокус на инпут
    taskInput.value = ""
    taskInput.focus()
    
    //описываем задачу в виде объекта
    const newTasks = {
        id: Date.now(),
        text: taskText,
        done: false,
    }

    //добавляем задачу в массив с задачами
    tasks.push(newTasks)
    
    renderTask(newTasks)

    checkEmptyList()
    saveToLocalStorage()
}

function delTask(event) {
    //если клик происходит не по кнопке - завершаем функцию
    if(event.target.dataset.action !== 'delete') return;

    //находим в блоке кнопку delete
    const parenNode = event.target.closest('.list_group_item'); //closest ищет элемент в родителях

    //Определяем id задачи
    const id = +parenNode.id;

    //находим индекс задачи в массиве
    const index = tasks.findIndex( (task) => {
        return task.id === id // if true
    } )
    //удаляем элемент с массива
    tasks.splice(index,1)
    
    //удаляем элемент
    parenNode.remove()

    checkEmptyList()
    saveToLocalStorage()
}

function doneTask(event) {
    //функция завершится, если это не кнопка done
    if(event.target.dataset.action !== "done") return;    

    //находим span с текстом
    const parenNode = event.target.closest('.list_group_item')
    const taskTitle = parenNode.querySelector('.item_title')
    taskTitle.classList.toggle('done')

    //меняем в массиве задач done: false на true
    const id = +parenNode.id
    const task = tasks.find((task) => task.id === id)
    task.done = !task.done;

    checkEmptyList()
    saveToLocalStorage()
}

function checkEmptyList() {
    if(tasks.length === 0) {
        const emptyListElement = `
        <div class="main_tasks_list">
            <img src="img/leaf.svg" alt="" width="48">
            <div class="main_tasks_list_title">to-do list is empty</div>
        </div>`
        tasksList.insertAdjacentHTML("afterbegin", emptyListElement)
    }else{
        const emptyListEl = document.querySelector('.main_tasks_list');
        emptyListEl ? emptyListEl.remove() : null;
    }
}

function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks))
}

function renderTask(task) {
    const cssClass = task.done ? "item_title done" : "item_title";

    //формируем заметку для новой задачи
    const taskHTML = `         
        <div id="${task.id}" class="list_group_item">
            <span class="${cssClass}">${task.text}</span>
            <div class="item_buttons">
                <button type="button" data-action="done" class="btn-action">
                    <img src="img/tick.svg" alt="" width="18" height="18">
                </button>
                <button type="button" data-action="delete" class="btn-action">
                    <img src="img/cross.svg" alt="" width="18" height="18">
                </button>
            </div>
        </div>`

    //добавляем задачу на страницу (beforeend - добавляет после блока)
    tasksList.insertAdjacentHTML('beforeend', taskHTML)
}
