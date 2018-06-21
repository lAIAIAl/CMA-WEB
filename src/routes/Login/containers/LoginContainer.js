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
        //moduleIcon: "user",
        modulePath: "/index/PeopleManagement",
        menus:[
        	{
	        id: "0-0",       
	        code: "0-0",      
	        name: "人员管理",
	        modulePath: "/index/PeopleManagement/",
	        menuPath: "/PeopleManagementRecords",
        	},
        	{
                id: "0-1",
                code: "0-1",
                name: "培训与考核",
                modulePath: "/index/StaffTraining",
                menuPath: "/stafftraining_list"
            },
            {
                id: "0-2",
                code: "0-2",
                name: "授权管理",
                modulePath: "/index/StaffAuth",
                menuPath: "/staff_auth_list"
            },
            {
                id: "0-3",
                code: "0-3",
                name: "岗位资质管理",
                modulePath: "/index/StaffAuth",
                menuPath: "/staff_quali_list"
            },        	
        	{
	        id: "0-4",       
	        code: "0-4",      
	        name: "离任人员管理",
	        modulePath: "Resigner",
	        menuPath: "/resigner_list",
	        functions: []
        	}
        ]
    	},
    	{
    		id: "1",       
        	code: "1",      
        	name: "监督",
        	//moduleIcon: "eye",
        	modulePath: "/index/Supervise",
        	menuPath: "/Supervise",
    	},
    	{
			id:"2",
			code:"2",
			name:"期间核查",
			modulePath:"/index/system",
			menus:[
				{
					id:"2-0",
					code:"2-0",
					name:"期间核查记录",
					menuPath:"/record_list"
				},{
					id:"2-1",
					code:"2-1",
					name:"期间核查计划",
					menuPath:"/periodcheck_list"
				}
			],
		},
		{
        id: "3",
        code: "3",
        name: "培训管理",
        modulePath: "/index/system",
        menus:[
        	{
	        id: "3-1",
	        code: "3-1",
	        name: "培训申请",
	        modulePath: "/index/TrainingManagement",
	        menuPath: "/application_list"
        	},
        	{
	        id: "3-2",
	        code: "3-2",
	        name: "年度培训计划",
	        modulePath: "/index/Annual",
	        menuPath: "/annualPlan_list"
        	},
        	{
	        id: "3-3",
	        code: "3-3",
	        name: "培训记录",
	        modulePath: "/index/TrainingRecord",
	        menuPath: "/trainingRecord_list"
        	}
        ]
    }
    ]
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