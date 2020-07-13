import List from "./Models/List.js";

let _state = {
  /** @type {List[]} */
  lists: []
};

//NOTE You should not need to change the code from this point down

//NOTE this method will get the lists from local storage at the start of the app
function _loadState() {
  let data = JSON.parse(localStorage.getItem("TaskMaster"));
  if (data) {
    data.tasks = data.lists.map(l => new List(l));
    _state = data;
  }
}
_loadState();

class Store {
  /**
   * Provides access to application state data
   */
  get State() {
    return _state;
  }

  //NOTE call saveState everytime you change the state in any way
  saveState() {
    localStorage.setItem("TaskMaster", JSON.stringify(_state));
  }
  resetAll(){
    _state.lists = [];
    this.saveState();

  }
  addTask(Task){
    _state.lists.push(Task);
    this.saveState();
  }
  removeTask(index){
    _state.lists.splice(index,1);
    this.saveState();
  }
  addSub(sub,index){
    _state.lists[index].subs.push(sub);
    _state.lists[index].subsCompleted.push(false);
    this.saveState();

  }
  removeSub(listIndex,subIndex){
    _state.lists[listIndex].subs.splice(subIndex,1);
    _state.lists[listIndex].subsCompleted.splice(subIndex,1);
    this.saveState();
  }
  completedSub(listIndex,subIndex){
    _state.lists[listIndex].subsCompleted[subIndex] ? _state.lists[listIndex].subsCompleted[subIndex] = false : _state.lists[listIndex].subsCompleted[subIndex] = true;
    this.saveState();
  }
}

const store = new Store();
export default store;
