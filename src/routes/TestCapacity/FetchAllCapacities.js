import $ from 'lib/jquery-3.3.1';
import { getStore } from 'store/globalStore';
import { setItems } from 'common/basic/reducers/ItemReducer';

import { testCapacityGetAllService } from 'services';

export const getAllTestCapacities = () => {
  
  $.get(testCapacityGetAllService,null,(res)=>{
    let tmp = res.data;
    for(var i=tmp.length-1;i>=0;i--){
      tmp[i].key = tmp[i].year;
    }
    let store = getStore();
    store.dispatch(setItems(tmp,'TestCapacity'));
    console.log('Get All Successfully.');
  });

};
