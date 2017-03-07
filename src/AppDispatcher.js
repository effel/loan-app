var Dispatcher = require('flux').Dispatcher;
import DataStore from './DataStore';

var AppDispatcher = new Dispatcher();

AppDispatcher.register((payload) => {

  let new_item = payload.new_item;
  let action = payload.action;

  switch(action) {
    case 'add-item':
      DataStore.createItem(new_item);
      break;
    default:
      return true;      
  }
  DataStore.emitChange();
  return true;
  
});


export default AppDispatcher;
