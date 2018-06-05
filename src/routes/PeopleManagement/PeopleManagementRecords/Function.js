
import $ from 'lib/jquery-3.3.1';
import {baseAddress} from 'services';
import {getStore} from 'store/globalStore';
import {setItems} from 'common/basic/reducers/ItemReducer';

export const getStuffManagement = () => {
	$.get(baseAddress+"/cma/StaffManagement/getAll" , null,(res)=>{
  		let peopledata = res.data;
  		for (var i = peopledata.length - 1; i >= 0; i--) {
  			peopledata[i].key = peopledata[i].id;
  		}
  		let store = getStore();
 		store.dispatch(setItems(peopledata, 'StaffManagement'));
 		console.log(store.getState());
  	});
};

export const getStuffFile = () => {
	$.get(baseAddress+"/cma/StaffManagement/getAll" , null,(res)=>{
  		let peopledata = res.data;
  		for (var i = peopledata.length - 1; i >= 0; i--) {
  			peopledata[i].key = peopledata[i].id;
  		}
  		let store = getStore();
 		store.dispatch(setItems(peopledata, 'StaffManagement'));
 		console.log(store.getState());
  	});
};