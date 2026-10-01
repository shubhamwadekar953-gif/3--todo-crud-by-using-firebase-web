const todoForm = document.getElementById("todoForm")
const todoList = document.getElementById("todoList")
const userId = document.getElementById("userId")
const addTodo = document.getElementById("addTodo")
const addbtn = document.getElementById("submitBtn")
const updatebtn = document.getElementById("updateBtn")
const spinner = document.getElementById("spinner")

const BASE_URL = "https://student-crud-26d0f-default-rtdb.firebaseio.com/tod%20crud%20by%20using%20firebase%20web";
const TODO_URL = `${BASE_URL}/todos.json`;

function hidespinner() {
    spinner.classList.add("d-none")
}

function showspinner() {
    spinner.classList.remove("d-none")
}

//read-todo
let xhr = new XMLHttpRequest();
xhr.open("GET", TODO_URL)
xhr.send(null)
xhr.onload = function () {
    let data = JSON.parse(xhr.response);
    let result = ``;

    for (let key in data) {
        let todo = data[key];
        result += `
            <tr id="${key}">
                <td>${todo.userId}</td>
                <td>${todo.todo}</td>
                <td>
                    <button onclick="onEdit(this)" class="btn btn-sm btn-success"> Edit </button>
                </td>
                <td>
                    <button onclick="onDelete(this)" class="btn btn-sm btn-danger"> Remove </button>
                </td>
            </tr>
        `;
    }
    todoList.innerHTML = result;
}

//create-todo
function onCreate(eve){
    showspinner()
    eve.preventDefault();

    const todoObj ={
        userId: userId.value,
        todo: addTodo.value
    }

    let xhr = new XMLHttpRequest();
    xhr.open("POST", TODO_URL)
    xhr.send(JSON.stringify(todoObj));

    xhr.onload = () => {
        let res = JSON.parse(xhr.response)

        if(xhr.status >= 200 && xhr.status <= 299){
            let createtr = document.createElement("tr")
            createtr.id = res.name
            createtr.innerHTML = `
                        <td>${todoObj.userId}</td>
                        <td>${todoObj.todo}</td>
                        <td><button onclick="onEdit(this)" class="btn btn-sm btn-success">Edit</button></td>
                        <td><button onclick="onDelete(this)" class="btn btn-sm btn-danger">Remove</button></td>
                        `

        todoList.prepend(createtr)
        todoForm.reset()

        Swal.fire({
            text:"Your Todo added successfully!!!",
            icon:"success",
            timer:2000
        })
    }else{
        console.log(`something went wrong while get data!!!`)
    }
    hidespinner()
  }
}

//edit-todo
function onEdit(ele){
    showspinner();

    let EDIT_ID = ele.closest('tr').id;
    let EDIT_URL = `${BASE_URL}/todos/${EDIT_ID}.json`;
    localStorage.setItem('EDIT_ID', EDIT_ID);

    let xhr = new XMLHttpRequest();
    xhr.open("GET", EDIT_URL);
    xhr.send(null);
    xhr.onload = function(){
        if(xhr.status >= 200 && xhr.status <= 299){
            let res = JSON.parse(xhr.response);
            userId.value = res.userId;
            addTodo.value = res.todo;

            addbtn.classList.add('d-none');
            updatebtn.classList.remove('d-none');

            Swal.fire({
              title: "Now, You Can Edit Todo Data",
              icon: "info",
              timer: 1500,
              showConfirmButton: false
            });
        }
        hidespinner();
    }
}

//update-todo
function onUpdate(){
    showspinner();

    let update_Id = localStorage.getItem('EDIT_ID');
    let UPDATE_URL = `${BASE_URL}/todos/${update_Id}.json`;

    let updateObj={
        userId: userId.value,
        todo: addTodo.value
    };

    let xhr = new XMLHttpRequest();
    xhr.open("PATCH", UPDATE_URL);
    xhr.send(JSON.stringify(updateObj));
    xhr.onload = function(){
        if(xhr.status >= 200 && xhr.status <= 299){
            let res = JSON.parse(xhr.response);
            let tr = document.getElementById(update_Id);
            tr.children[0].innerHTML = res.userId;
            tr.children[1].innerHTML = res.todo;

            todoForm.reset();
            addbtn.classList.remove('d-none');
            updatebtn.classList.add('d-none');
            localStorage.removeItem('EDIT_ID');

            Swal.fire({
              title: "Todo Updated successfully!",
              icon: "success",
              timer:1500
            });
        }
        hidespinner();
    }
}

//delete-todo
function onDelete(ele){
    let DELETE_ID = ele.closest('tr').id;

     Swal.fire({
        title: `Are you sure, you want to Remove Todo with id ${DELETE_ID}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Remove it!"
    }).then((result) => {
        if (result.isConfirmed){

            showspinner()

            let DELETE_URL = `${BASE_URL}/todos/${DELETE_ID}.json`;

            let xhr = new XMLHttpRequest();
            xhr.open("DELETE", DELETE_URL);
            xhr.send(null);

            xhr.onload = function(){
                if(xhr.status >= 200 && xhr.status <= 299){
                let res = JSON.parse(xhr.response);
                ele.closest('tr').remove();

                Swal.fire({
                    text: `Your Todo with id ${DELETE_ID} is Removed successfully!!!`,
                    icon:"success",
                    timer:2000
                })

            }else {
                console.log("Something went wrong while deleting!!!");
            }
            hidespinner()
            }
                xhr.onerror = function (){
                    hidespinner()
                 }
        }
    })
}

todoForm.addEventListener("submit", onCreate);
updatebtn.addEventListener('click', onUpdate);