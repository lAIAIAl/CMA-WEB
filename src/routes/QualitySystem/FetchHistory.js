import $ from 'lib/jquery-3.3.1';
import { getStore } from 'store/globalStore';
import { setItems } from 'common/basic/reducers/ItemReducer';

import { qualityManualGetAllHistoryService, qualityProgramGetAllHistoryService, qualityInstructionGetAllHistoryService } from 'services';

export const getAllManualHistory = () => {

  $.get(qualityManualGetAllHistoryService,null,(res)=>{
    let tmp = res.data;
    for(var i=tmp.length-1;i>=0;i--){
      tmp[i].key = tmp[i].id;
    }
    let store = getStore();
    store.dispatch(setItems(tmp,'QSmanual'));
  });

};

export const getAllProgramHistory = () => {

  $.get(qualityProgramGetAllHistoryService,null,(res)=>{
    let tmp = res.data;
    for(var i=tmp.length-1;i>=0;i--){
      tmp[i].key = tmp[i].id;
    }
    let store = getStore();
    store.dispatch(setItems(tmp,'QSprogram'));
  });

};

export const getAllInstructionHistory = () => {

  $.get(qualityInstructionGetAllHistoryService,null,(res)=>{
    let tmp = res.data;
    for(var i=tmp.length-1;i>=0;i--){
      tmp[i].key = tmp[i].id;
    }
    let store = getStore();
    store.dispatch(setItems(tmp,'QSinstruction'));
  });

};

