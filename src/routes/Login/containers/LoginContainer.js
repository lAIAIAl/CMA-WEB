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
    	},
    	{
    		id: "4",       
        	code: "4",      
        	name: "管理评审",
        	modulePath: "/ManagementReview",
        	menuPath: "/ManagementReview",
    	},
    	{
	        id: "5",
	        code: "5",
	        name: "样品管理",
	        modulePath: "/index/system",
	        menus:[
        	{
		        id: "5-1",
		        code: "5-1",
		        name: "样品接收登记",
		        modulePath: "/index/SampleReceive",
		        menuPath: "/sampleReceive_list"
	        },
	        {
		        id: "5-2",
		        code: "5-2",
		        name: "样品室样品进出",
		        modulePath: "/index/SampleIo",
		        menuPath: "/sampleIo_list"
	        }]
    	},
    	{
            id: "6",
            code: "6",
            name: "内审管理",
            modulePath: "/index/InternalAudit",
            menuPath: "/InternalAudit",
        },
        {
	    	id: "7",
	    	code: "7",
	    	name: "仪器设备管理",
	    	modulePath: "/index/system",
	    	menus: [
	    		{
	    			id: "7-0",
	    			code: "7-0",
	    			name: "仪器设备信息",
	    			modulePath: "/index/equipment",
	    			menuPath: "/er_list"
	    		},
	            {
	                id: "7-1",
	                code: "7-1",
	                name: "仪器设备验收",
	                modulePath: "/index/equipment",
	                menuPath: "/err_list"
	            },
	            {
	                id: "7-2",
	                code: "7-2",
	                name: "仪器设备使用",
	                modulePath: "/index/equipment",
	                menuPath: "/eur_list"
	            },
	            {
	                id: "7-3",
	                code: "7-3",
	                name: "仪器设备维修保养",
	                modulePath: "/index/equipment",
	                menuPath: "/emr_list"
	            },
	            {
	                id: "7-4",
	                code: "7-4",
	                name: "仪器设备使用申请",
	                modulePath: "/index/equipment",
	                menuPath: "/ear_list"
	            }
	    	]
    	},
    	{
            id: "8",
            code: "8",
            name: "标准管理",
            modulePath: "/index/StandardManagement",
            menuPath: "/StandardManagement",
        },
        {
			id: "9",
			code: "9",
			name: "检测检验能力管理",
			modulePath: "/index/TestCapacity",
			menuPath: "/testcapacity_list"
		},
		{
			id: "10",
			code: "10",
			name: "外部评审与上报管理",
			modulePath: "/index/ExternalReview",
			menuPath: "/ExternalReview"
		},
		{
			id: "11",
			code: "11",
			name: "质量体系管理",
			modulePath: "/index/QualitySystem",
			menus: [
			  {
			    id: "11-0",
			    code: "11-0",
			    name: "质量手册",
			    menuPath: "/QSmanual_list"
			  },
			  {
			    id: "11-1",
			    code: "11-1",
			    name: "程序文件",
			    menuPath: "/QSprogram_list"
			  },
			  {
			    id: "11-2",
			    code: "11-2",
			    name: "作业指导书",
			    menuPath: "/QSinstruction_list"
			  }
			],
		},
		{
	        id: "12",
	        code: "12",
	        name: "检测机构管理",
	        modulePath: "/index/system",
	        menus:[
	        	{
		        id: "12-1",
		        code: "12-1",
		        name: "检测机构信息",
		        modulePath: "/index/Introduction",
		        menuPath: "/introduction_list"
	        	},
	        	{
		        id: "12-2",
		        code: "12-2",
		        name: "检测机构资源",
		        modulePath: "/index/Resource",
		        menuPath: "/resource_list"
	        	},
	        	{
	        	id :"12-3",
	        	code:"12-3",
	        	name:"认证材料",
	        	modulePath:"/index/Certificate",
	        	menuPath:"/certificate_list"
	        	}
	        ]
    	},
    	{
            id: "13",
            code: "13",
            name: "自查管理",
            modulePath: "/index/SelfInspection",
            menuPath: "/SelfInspection",
        },
		{
            id: "14",
            code: "14",
            name: "能力验证管理",
            modulePath: "/index/CapacityVerification",
            menuPath: "/CapacityVerification",
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