import List from "../Models/List.js";
import _store from "../store.js"

//Public
class ListService {
  //TODO  Here is where we handle all of our business logic,
  //given the information you need in the controller,
  //what methods will you need to do when this class is first 'constructed'?
  //NOTE You will need this code to persist your data into local storage, be sure to call the store method to save after each change

  addTask(Task){
      if (!Task.newTask) {
          console.error("Invalid Task, Empty Task");
          return
      }
      let newTask = new List(Task)
      _store.addTask(newTask)
  }
  removeTask(id){
    let listIndexToRemove = findTask(id);
    _store.removeTask(listIndexToRemove);
  }
  addSub(id,sub){
    if(sub){
      let index = findTask(id);
      let appendSub = _store.State.lists[index].subs.length + 1;
      sub = appendSub +": " + sub;
      _store.addSub(sub,index);
    }
  }
  removeSub(sub,id){
    let listIndexToFind = findTask(id);
    let subIndexToFInd = _store.State.lists[listIndexToFind].subs.findIndex(s => s == sub);
    if(subIndexToFInd < 0)
      return;
    _store.removeSub(listIndexToFind,subIndexToFInd);
  }
  completedSub(sub,id){
    let listIndexToFind = findTask(id);
    let subIndexToFInd = _store.State.lists[listIndexToFind].subs.findIndex(s => s == sub);
    _store.completedSub(listIndexToFind,subIndexToFInd);
  }
}
function  findTask(id){
    return _store.State.lists.findIndex(l => l.id == id);
  }
const SERVICE = new ListService();
export default SERVICE;
