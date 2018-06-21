/* 前后端交互 */
import $ from 'lib/jquery-3.3.1';
import { getStore } from 'store/globalStore';
import { setItems } from 'common/basic/reducers/ItemReducer';

/* 用到的url */
import { periodCheckGetAllService } from 'services';

export const getAllPeriodCheckData = () => {

  $.get(periodCheckGetAllService,null,(res)=>{
    let checkData = res.data;//后端返回的数组:res.data
    for(var i=checkData.length-1;i>=0;i--){ //为数组元素的key赋唯一值
      checkData[i].key = checkData[i].planId;
    }
    let store = getStore();
    store.dispatch(setItems(checkData,'PeriodCheck'));//使用redux
  });

};

