import $ from 'lib/jquery-3.3.1';
import {baseAddress} from 'services';
import {getStore} from 'store/globalStore';
import {setItems} from 'common/basic/reducers/ItemReducer';

export const getStandards = () => {

	$.get(baseAddress+"/cma/StandardManagement/getAll" , null,(res)=>{
  		let data = res.data;
  		for (var i = data.length - 1; i >= 0; i--) {
  			data[i].key = data[i].fileId;
  		}
  		let store = getStore();
 		store.dispatch(setItems(data, 'StandardManagement'));
 		//console.log(store.getState());
  	});
/*  	let data = 
	[{
		"key": 1,
    	"fileId": 1,
    	"fileName": "xxx.xx"
  	}];

  	let store = getStore();
  	store.dispatch(setItems(data, 'StandardManagement'));*/
};