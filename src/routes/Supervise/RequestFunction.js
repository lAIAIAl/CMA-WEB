import $ from 'lib/jquery-3.3.1';
import {baseAddress} from 'services';
import {getStore} from 'store/globalStore';
import {setItems} from 'common/basic/reducers/ItemReducer';

export const getSupervise = () => {

	$.get(baseAddress+"/cma/Supervision/getAll" , null,(res)=>{
  		let data = res.data;
  		for (var i = data.length - 1; i >= 0; i--) {
  			data[i].key = data[i].id;
        switch(data[i].situation){
          case 0:
            data[i].situation = "未批准";
            break;
          case 1:
            data[i].situation = "已批准";
            break;
          case 2:
            data[i].situation = "已执行";
            break;
        }
  		}
  		let store = getStore();
 		store.dispatch(setItems(data, 'Supervise'));
 		//console.log(store.getState());
  	});

/*  	let store = getStore();
	let data = [
	{
		"key": 0,
    	"id": 123,
    	"situation": 2,
    	"author": "老王",
    	"createDate": "2018-05-08",
    	"approver": "老李",
    	"approveDate": "2018-06-08",
    	"remark": "无",
  	},
  	{
		"key": 1,
    	"id": 1231231,
    	"situation": 0,
    	"author": "老里",
    	"createDate": "2018-05-08",
    	"approver": "老丽丽",
    	"approveDate": "2018-06-08",
    	"remark": "无",
  	},
  	{
		"key": 2,
    	"id": 321,
    	"situation": 1,
    	"author": "老asfa",
    	"createDate": "2018-05-08",
    	"approver": "老424",
    	"approveDate": "2018-06-08",
    	"remark": "无",
  	},];

  	for (var i = data.length - 1; i >= 0; i--) {
  		switch(data[i].situation){
  			case 0:
  				data[i].situation = "未批准";
  				break;
  			case 1:
				data[i].situation = "已批准";
  				break;
  			case 2:
  				data[i].situation = "已执行";
  				break;
  		}
  	}

	store.dispatch(setItems(data, 'Supervise'));*/
}

export const getSupervisePlans = (id) => {
  $.get(baseAddress+"/cma/SupervisionPlan/getAll?id=" + id, null,(res)=>{
      let data = res.data;
      for (var i = data.length - 1; i >= 0; i--) {
        data[i].key = data[i].planId;
      }
      let store = getStore();
      store.dispatch(setItems(data, 'SupervisePlans'));
    //console.log(store.getState());
  });

/*	let store = getStore();
	let data = [
	{
		"key": 5,
    	"planId": 5,
    	"id": 1,
    	"content": "操作规范1",
    	"object" : "张三1",
    	"dateFrequency" : "1212"
  	},
  	{
		"key": 6,
    	"planId": 6,
    	"id": 1,
    	"content": "操作规范2",
    	"object" : "张三2",
    	"dateFrequency" : "123413"
  	},
  	{
		"key": 7,
    	"planId": 7,
    	"id": 1,
    	"content": "操作规范3",
    	"object" : "张三3",
    	"dateFrequency" : "sdfsdf"
  	},
  	];

  	store.dispatch(setItems(data, 'SupervisePlans'));*/
}

export const getSuperviseRecord = (id) => {
/*    $.get(baseAddress+"/cma/SupervisionRecord/getAll?planId=" + id, null,(res)=>{
      let data = res.data;
      console.log(data);
      for (var i = data.length - 1; i >= 0; i--) {
        data[i].key = data[i].planId;
      }
      let store = getStore();
      store.dispatch(setItems([data[0]], 'SupervisePlans'));
      console.log(store.getState().SupervisePlans);
    });*/
    $.ajax({
      type: "get",
      url: baseAddress+"/cma/SupervisionRecord/getAll?planId=" + id,
      async:false,
      success: function (res) {
        let data = res.data;
        for (var i = data.length - 1; i >= 0; i--) {
          data[i].key = data[i].planId;
        }
        let store = getStore();
        if(data.length == 0){
          data = [];
          store.dispatch(setItems([], 'SuperviseRecord'));
        }
        else
          store.dispatch(setItems([data[0]], 'SuperviseRecord'));
        console.log(store.getState().SuperviseRecord);
      }
    });
/*	let store = getStore();
	let data = 
	[{
    	"recordId": 5,
    	"planId": 1,
    	"department": "市场部",
    	"supervisor" : "张三",
    	"superviseDate" : "2018-03-03",
    	"supervisedPerson" : "王五",
    	"record" : "记录",
    	"conclusion" : "好",
    	"operator" : "李四",
    	"recordDate" : "2018-05-11"
  	}];
*/
  	//store.dispatch(setItems(data[0], 'SuperviseRecord'));
  	//store.dispatch(setItems(null, 'SuperviseRecord'));
}