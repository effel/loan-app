import {EventEmitter} from 'events';

const dataScope = [];

class DataStore extends EventEmitter {
  getData() {
   return JSON.parse(localStorage.getItem('loanData'));
  }  
  createItem(newItem) {
    dataScope.push(newItem);
    localStorage.setItem('loanData', JSON.stringify(dataScope));
    this.emit("change");
  }
  clearStore() {
    localStorage.clear();
  }
  emitChange(){
    this.emit('change');
  }
};

const dataStore = new DataStore;

export default dataStore