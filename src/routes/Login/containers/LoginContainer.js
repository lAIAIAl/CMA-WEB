import {connect} from 'react-redux';
import LoginView from '../components/LoginView';

import {injectReducer} from 'STORE/reducers';

const SET_MODULES = "SET_MODULES";
const SET_SYS_USER = 'SET_SYS_USER';

export const setSysUser = (sysUser) =>
{
	return(
	{
		type: SET_SYS_USER,
		payload: sysUser
	});
}


const setModules = (modules) =>
{
	return(
	{
		type: SET_MODULES,
		payload: modules
	})
}

const initialState = 
{
	sysUser: {},
	modules: [{
        id: "0",       
        code: "0",      
        name: "人员管理",
        moduleIcon: "setting",
        modulePath: "/index/system",
        menus:[
/*        	{
	        id: "0-0",       
	        code: "0-0",      
	        name: "testSubSideBar1",
	        modulePath: "/index/test",
	        menuPath: "/testSub1_list"
        	},
        	{
	        id: "0-1",       
	        code: "0-1",      
	        name: "testSubSideBar2",
	        modulePath: "/index/test",
	        menuPath: "/testSub2_list"
        	}*/
        ]
    }]
}

const LoginReducer = (state = initialState, action) =>
{
	switch(action.type)
	{
		case SET_SYS_USER:
			return(
			{
				...state,
				sysUser: action.payload
			});

		case SET_MODULES:
			return(
			{
				...state,
				modules: action.payload
			})

		default:
			return state;
	}
}

export default (store) =>
{
	injectReducer(store,
	{
		key: 'system',
		reducer: LoginReducer
	});

	return connect(null, null)(LoginView);
}