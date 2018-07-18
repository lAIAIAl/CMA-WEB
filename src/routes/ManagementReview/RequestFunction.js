import $ from 'lib/jquery-3.3.1';
import {baseAddress} from 'services';
import {getStore} from 'store/globalStore';
import {setItems} from 'common/basic/reducers/ItemReducer';

export const getManagementReviewList = () => {

	$.get(baseAddress+"/cma/ManagementReview/getAll" , null,(res)=>{
  		let data = res.data;
  		for (var i = data.length - 1; i >= 0; i--) {
  			data[i].key = data[i].year;
  		}
  		let store = getStore();
 		store.dispatch(setItems(data, 'ManagementReview'));
 		//console.log(store.getState());
  	});
/*  	let data = 
	[{
		"key":0,
		"year": 2017,
		"date":"2017-06-21",
			},{
			"key":1,
		"year": 2018,
		"date":"2018-06-21",
  	}];*/
};

export const getManagementReviewDetail = (year) => {

	$.get(baseAddress+"/cma/ManagementReview/getAllFile?year="+ year, null,(res)=>{
  		let data = res.data;
  		for (var i = data.length - 1; i >= 0; i--) {
  			data[i].key = data[i].fileId;
  		}
  		let store = getStore();
 		store.dispatch(setItems(data, 'ManagementReviewDetail'));

  	});
/*

  	let data = 
	[{
		"key": 1,
	    "year": 2017,
	    "fileId": 1,
	    "fileName":"2017会议记录",
	    "file":"2017_1.jpg",
  	},
  	{
  		"key": 2,
	    "year": 2018,
	    "fileId": 2,
	    "fileName":"2017评审结果表",
	    "file":"2017_2.jpg",
  	}];

  	let store = getStore();
  	store.dispatch(setItems(data, 'ManagementReviewDetail'));*/
};