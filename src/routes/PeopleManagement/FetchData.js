import $ from 'lib/jquery-3.3.1';
import { getAllStaffTrainingsService } from 'services';
import { getStore } from 'store/globalStore';
import { setItems } from 'common/basic/reducers/ItemReducer';

export const getAllStaffTrainingData = () => {

  $.get(getAllStaffTrainingsService,null,(res)=>{
    let traindata = res.data;
    let store = getStore();
    store.dispatch( setItems(traindata, 'StaffTraining') );
  });

};


