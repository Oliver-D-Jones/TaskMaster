import _listService from "../Services/ListService.js";
import _store from "../store.js"

//TODO Don't forget to render to the screen after every data change.
function _drawListsNOT() {
  let htmlTemplate = "";
  let tasksToDraw = _store.State.lists;

// style="${tasksToDraw[i].subsCompleted[j] ? 'text-decoration: line-through':''};" 
  for(let i = 0;i<tasksToDraw.length;i++){

    let elemID = tasksToDraw[i].id;
    htmlTemplate+=`<div class="insert col-sm-12 col-md-3" id="${elemID}">
    <div class="card">
      <div class="card-body" style="background-color:${tasksToDraw[i].color}">
        <button type="button" onclick="app.listController.removeTask(${elemID})" class="btn btn-light btn-outline-warning btn-sm">X</button>
        <h6 class="card-title">${tasksToDraw[i].task}</h6>
        <p>Add Sub-Task:
        <button type="button" onclick="app.listController.showSub(${elemID})" class="btn btn-dark btn-outline-secondary btn-sm"><b>+</b></button>
        </p>
        <p>
        <input type="text" class="sub" placeholder="New Sub Task"/><button type="button" onclick="app.listController.addSub(${elemID})" class="sub btn btn-light btn-sm">Add</button>
        </p>
        <div class="subs row d-flex justify-content-center">`;
          for (let j = 0;j<tasksToDraw[i].subs.length;j++){
            htmlTemplate+= `<div class="col-12" style="border-bottom:solid 1px gold; background-color:${j%2 ? "#d3d3d3":"#a9a9a9"}"><span>${tasksToDraw[i].subs[j]}</span><button type="button" style="float:right; padding:1px;" onclick="app.listController.removeSub(this,${elemID})" class="btn btn-warning btn-sm">X</button><button type="button" style="float:right; padding:1px;margin-right:5px;" onclick="" class="btn btn-light btn-sm">C</button></div>`;
          }
          htmlTemplate+=`
        </div>
      </div>
    </div>
  </div>`
  }
  document.getElementById("insert_tasks").innerHTML = htmlTemplate;
}
function _drawLists(){
  let htmlTemplate = "";
  let tasksToDraw = _store.State.lists; 
  for(let i = 0;i<tasksToDraw.length;i++){

    let elemID = tasksToDraw[i].id;
    htmlTemplate+=`<div class="insert col-sm-12 col-md-3" id="${elemID}">
    <div class="card">
      <div class="card-body" style="background-color:${tasksToDraw[i].color}">
        <button type="button" onclick="app.listController.removeTask('${elemID}')" class="btn btn-light btn-outline-warning btn-sm">X</button>
        <h6 class="card-title text-light">${tasksToDraw[i].task}</h6>
        <p>Add Task:
        <button type="button" onclick="app.listController.showSub('${elemID}')" class="btn btn-dark btn-outline-secondary btn-sm"><b>+</b></button>
        </p>
        <p>
        <input type="text" class="sub" placeholder="New Task"/><button type="button" onclick="app.listController.addSub('${elemID}')" class="sub btn btn-light btn-sm">Add</button>
        </p>
        <div class="subs row d-flex justify-content-center">`;
        for (let j = 0;j<tasksToDraw[i].subs.length;j++){
          htmlTemplate+= `<div class="col-12" style="border-bottom:solid 1px gold; background-color:${j%2 ? "#d3d3d3":"#a9a9a9"}"><span style="text-decoration:${tasksToDraw[i].subsCompleted[j] ? 'line-through':'none'};">${tasksToDraw[i].subs[j]}</span><button type="button" style="float:right; padding:1px;" onclick="app.listController.removeSub(event.target.previousElementSibling.textContent,'${elemID}')" class="btn btn-warning btn-sm">X</button><button type="button" style="float:right; padding:1px;margin-right:5px;" onclick="app.listController.completedSub(event.target.parentElement.firstElementChild.textContent,'${elemID}')" class="btn btn-light btn-sm">C</button></div>`;
        }
        htmlTemplate+=`
        </div>
      </div> 
    </div>
  </div>`
  }
  document.getElementById("insert_tasks").innerHTML = htmlTemplate;
}
function ConfirmDialog(message,func,id,sub) {
  $('<div></div>').appendTo('body')
    .html('<div><h6>' + message + '?</h6></div>')
    .dialog({
      modal: true,
      title: 'Delete message',
      zIndex: 10000,
      autoOpen: true,
      width: '34%',
      resizable: true,
      buttons: {
        Yes: function() { 
          $(this).dialog("close");
          if(!sub)
            func(id);
          else
            func(id,sub);

          _drawLists();
          !sub ? swal("OK!", "Your List Was Deleted!", "success") : swal("OK!", "Your Task Was Deleted!", "success") 

        },
        No: function() {
          $(this).dialog("close");

        }
      },
      close: function(event, ui) {
        $(this).remove();
      }
    });
};
function ConfirmDeleteAll(message,func) {
  $('<div></div>').appendTo('body')
    .html('<div><h6>' + message + '?</h6></div>')
    .dialog({
      modal: true,
      title: 'Delete message',
      zIndex: 10000,
      autoOpen: true,
      width: '34%',
      resizable: true,
      buttons: {
        Yes: function() { 
          $(this).dialog("close");
          func();
          _drawLists();
          swal("OK!", "All Your Lists Were Deleted!", "success")         },
        No: function() {
          $(this).dialog("close");

        }
      },
      close: function(event, ui) {
        $(this).remove();
      }
    });
};


//Public
export default class ListController {
  constructor() {
    //NOTE: After the store loads, we can automatically call to draw the lists.
    _drawLists();
  }
  //TODO: Your app will need the ability to create, and delete both lists and listItems
  resetAll(evt){
    ConfirmDeleteAll("Delete All Lists",_listService.resetAll)
    _drawLists();
  }
  addTask(e){
    e.preventDefault();
    let taskData = {
      newTask : e.target.add_task.value,
      taskColor : e.target.task_color.value,
    }
    _listService.addTask(taskData);
    e.target.reset();
    _drawLists();
  }
  removeTask(id){
    ConfirmDialog('Delete This List',_listService.removeTask,id,false);
  }
  showSub(id){
    let display= document.getElementById(id).getElementsByClassName("sub");
    // @ts-ignore
    display[0].style.display = "inline";
    // @ts-ignore
    display[1].style.display = "inline";
  }
  addSub(id){
    // @ts-ignore
    let sub_input= document.getElementById(id).getElementsByClassName("sub")[0].value;
    _listService.addSub(id,sub_input);
    _drawLists();
  }
  removeSub(sub,id){
    ConfirmDialog('Delete This Task',_listService.removeSub,id,sub);
  }
  
  completedSub(sub,id){
    _listService.completedSub(sub,id);
    _drawLists();
  }

}
