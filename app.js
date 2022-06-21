const input = document.querySelector(".input")
const addInput = document.querySelector(".add-input")
const clearInput = document.querySelector(".clear-input")
const messageArea = document.querySelector(".message-area")
const message = document.querySelector(".message")
const outputArea = document.querySelector(".output-area")

const showMessage = (msg) => {
    message.innerText = msg
    messageArea.style.display = "block"
    setTimeout(() => {
        messageArea.style.display = "none"
    }, 3000)
}

const clearInputField = (e) => {
    e.preventDefault()
    input.value = ""
}

const addItemsToTodo = (todoData) => {
    const div = document.createElement("div")
    div.classList.add("todo")
    const inputElement = document.createElement("input")

    inputElement.setAttribute("class", "output")
    inputElement.setAttribute("disabled", "true")
    inputElement.setAttribute("type", "text")
    inputElement.setAttribute("value", todoData.todo)

    if(todoData.complete === true) {
        inputElement.classList.add("task-complete")
    }

    const completeElement = document.createElement("a")
    completeElement.setAttribute("href", "#")
    completeElement.setAttribute("class", "complete-todo")
    completeElement.innerHTML = `<i class="fa-solid fa-check"></i>`

    const editElement = document.createElement("a")
    editElement.setAttribute("href", "#")
    editElement.setAttribute("class", "edit-todo")
    editElement.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>`

    const deleteElement = document.createElement("a")
    deleteElement.setAttribute("href", "#")
    deleteElement.setAttribute("class", "delete-todo")
    deleteElement.innerHTML = `<i class="fa-solid fa-trash"></i>`

    const uniqueElement = document.createElement("div")
    uniqueElement.className = "unique-id"
    uniqueElement.style.display = "none"
    uniqueElement.innerText = todoData.uniqueId

    div.append(inputElement, completeElement, editElement, deleteElement, uniqueElement)

    outputArea.append(div)
}

const AddItem = (e) => {
    e.preventDefault()
    if (input.value.trim() === "") {
        return showMessage("Please enter a valid input")
    }
    const uniqueId = Math.floor(Math.random() * 100000) + Math.floor(Math.random() * 1000)
    const todo = input.value.trim()


    input.value = ""

    const todoData = { uniqueId, todo, complete: false }

    addItemToLocalStorage(todoData)
    addItemsToTodo(todoData)

}
const deleteTodo = (e) => {
    e.preventDefault()
    if (e.target.parentElement.parentElement.className === "todo" && e.target.parentElement.className === "delete-todo") {
        e.target.parentElement.parentElement.classList.add("todo-delete")
        setTimeout(() => {
            e.target.parentElement.parentElement.remove()
        }, 800)
        const uniqueId = e.target.parentElement.parentElement.lastChild.innerText
        deleteItemFromLocalStorage(parseInt(uniqueId))
    }
}

const completeTodo = (e) => {
    e.preventDefault()
    if (e.target.parentElement.parentElement.className === "todo" && e.target.parentElement.className === "complete-todo") {
        if (e.target.parentElement.parentElement.firstChild.className === "output task-complete") {
            e.target.parentElement.parentElement.firstChild.classList.remove("task-complete")
        }
        else if (e.target.parentElement.parentElement.firstChild.className === "output") {
            e.target.parentElement.parentElement.firstChild.classList.add("task-complete")
    }
    const uniqueId = e.target.parentElement.parentElement.lastChild.innerText
    completeTodoInLocalStorage(parseInt(uniqueId))
}
}

const editTodo = (e) => {
    e.preventDefault()
     if (e.target.parentElement.parentElement.className === "todo" && e.target.parentElement.className === "edit-todo" && e.target.className === `fa-solid fa-pen-to-square`) {
         if(e.target.parentElement.parentElement.firstChild.className === "output") {
             e.target.parentElement.parentElement.children[1].style.display = "none"
             e.target.parentElement.parentElement.firstChild.removeAttribute("disabled")
             e.target.className = "fa-solid fa-check"
         }
     }
     else if (e.target.parentElement.parentElement.className === "todo" && e.target.parentElement.className === "edit-todo" && e.target.className === `fa-solid fa-check`) {
         if(e.target.parentElement.parentElement.firstChild.className === "output") {
             e.target.parentElement.parentElement.children[1].style.display = "grid"
             e.target.parentElement.parentElement.firstChild.setAttribute("disabled", "true")
             e.target.className = "fa-solid fa-pen-to-square"
             
             editItemInLocalStorage(e.target.parentElement.parentElement.firstChild.value, parseInt(e.target.parentElement.parentElement.lastChild.innerText))
         }
     }
}

const addItemToLocalStorage = (todoData) => {
    let todoList = [];
    if (localStorage.getItem("todoList")) {
        todoList = JSON.parse(localStorage.getItem("todoList"))
    }
    todoList.push(todoData)
    localStorage.setItem("todoList", JSON.stringify(todoList))
}

const addItemsFromLocalStorage = (e) => {
    if (localStorage.getItem("todoList")) {
        const todoList = JSON.parse(localStorage.getItem("todoList"))
        todoList.forEach((todo) => {
            addItemsToTodo(todo)
        })
    }
}

const deleteItemFromLocalStorage = (uniqueId) => {
    if (localStorage.getItem("todoList")) {
        let todoList = JSON.parse(localStorage.getItem("todoList"))
        todoList = todoList.filter(todo => todo.uniqueId !== uniqueId)
        localStorage.setItem("todoList", JSON.stringify(todoList))
    }
}

completeTodoInLocalStorage = (uniqueId) => {
     if (localStorage.getItem("todoList")) {
        let todoList = JSON.parse(localStorage.getItem("todoList"))
        todoList.forEach(todo => {
            if(todo.uniqueId === uniqueId) {
                if(todo.complete === false) todo.complete = true
                else if(todo.complete === true) todo.complete = false
            }
        })
        localStorage.setItem("todoList", JSON.stringify(todoList))
    }
}

const editItemInLocalStorage = (data, uniqueId) => {
     if (localStorage.getItem("todoList")) {
        let todoList = JSON.parse(localStorage.getItem("todoList"))
        todoList.forEach(todo => {
            if(todo.uniqueId === uniqueId) {
               todo.todo = data
            }
        })
        localStorage.setItem("todoList", JSON.stringify(todoList))
    }
} 
document.addEventListener("DOMContentLoaded", addItemsFromLocalStorage)
addInput.addEventListener("click", AddItem)
clearInput.addEventListener("click", clearInputField)
outputArea.addEventListener("click", deleteTodo)
outputArea.addEventListener("click", completeTodo)
outputArea.addEventListener("click", editTodo)