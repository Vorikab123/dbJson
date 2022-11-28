// ! TODOS
/**
 *  GET - получить данные 
 * PATCH - частичное изменение
 * PUT - полная замена данных
 * POST - добавление данных
 * DELETE - удаление 
 * 
 * CRUD - Create(POST- request)  Read(GET-request) Update(PUT/patch) Delete(DELETE)
 */

// npx son-server -w db.json -p 8000
// API - APPLICATION PROGRAMMING INTERFACE

// ? npm i -g json-server

const API =   "http://localhost:8000/todos";

let inpAdd = document.getElementById("inp-add")
let btnAdd = document.getElementById("btn-add")
let inpSearch = document.getElementById("inp-search")

btnAdd.addEventListener("click", async (e)=>{
    let newTodo = {
        todo:inpAdd.value,
    }
    // console.log(newTodo);
    if (newTodo.todo.trim()===""){
        alert("заполните поле!")
        return;
    }
    await fetch(API,{
        method: "POST",
        body: JSON.stringify(newTodo),
        headers: {
            "Content-type": "application/json; charset=utf-8",
        },
    })
    inpAdd.value = "";
    getTodos()
})
let page = 1;
getTodos()

//! READ 
//! Search 
inpSearch.addEventListener("input", ()=>{
   getTodos()
})

//!Pagination
let pagination=document.getElementById("pagination")
// console.log(pagination)


let list= document.getElementById("list");
// console.log(list)

async function getTodos(){
  let response = await fetch(`${API}?q=${inpSearch.value}&_page=${page}&_limit=3`).then((res)=>res.json())
//   console.log(response)

let allTodos = await fetch(API).then((res)=> res.json()).catch((e)=>console.log(e));

let lastPage = Math.ceil(allTodos.length/2)-1;
console.log(lastPage)
// console.log(allTodos)
    list .innerHTML = "";
    response.forEach((item)=>{
        let newElem= document.createElement("div");
        newElem.id=item.id;
        newElem.innerHTML = `
        <span>${item.todo}</span>
        <button class="btn-delete">Delete</button>
        <button class="btn-edit">Edit</button>
        `
        list.append(newElem);
        // console.log(newElem);
    })

    //добавляем пагинацию
    pagination.innerHTML=`<button ${page===1? "disabled":""} id="btn-prev">Назад</button>
    <span>${page}</span>
    <button ${page===lastPage?"disabled":""} id="btn-next">Вперед</button>`
}
 
document.addEventListener("click", async (e)=>{
    //! Delete
    if(e.target.className==="btn-delete"){
        let id = e.target.parentNode.id;
        await fetch(`${API}/${id}`,{
            method: "DELETE",
        })
        getTodos()
    }
    //! Updete
    if(e.target.className==="btn-edit"){
      modalEdit.style.display = "flex";
      let id = e.target.parentNode.id;
    
    let response = await fetch(`${API}/${id}`).then((res)=> res.json()).catch((err)=>console.log(err));
    // console.log(response)
    inpEditTodo.value=response.todo
    inpEditTodo.className = response.id;
    }
    //!Paginate
    if(e.target.id==="btn-next"){
        page++
        getTodos()
    }
    if(e.target.id === "btn-prev"){
        page--
        getTodos()
    }
})

let modalEdit = document.getElementById("modal-edit");
let modalEditClose = document.getElementById("modal-edit-close");
let inpEditTodo=document.getElementById("inp-edit-todo");
let btnSaveEdit=document.getElementById("btn-save-edit");
// console.log(modalEdit,modalEditClose,inpEditTodo,btnSaveEdit)

btnSaveEdit.addEventListener("click",async (e)=>{
    let editedTodo = {
        todo:inpEditTodo.value,
    };
    if (editedTodo.todo.trim()===""){
        alert("заполните поле!")
        return;
    }

    let id = inpEditTodo.className;

    await fetch(`${API}/${id}`,{
        method: "PATCH",
        body:JSON.stringify(editedTodo),
        headers:{
            "Content-type": "application/json; charset=utf-8"
        }
    })
    modalEdit.style.display ="none";
    getTodos()
})

modalEditClose.addEventListener("click", function(){
    modalEdit.style.display = "none"
});



