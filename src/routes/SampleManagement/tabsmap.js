import ProjectListView from 'routes/Project/subviews/ProjectList/components/ProjectListView';

import StandardListView from 'routes/Knowledge/subviews/StandardList/components/StandardListView';

import UserTreeView from 'routes/System/subviews/UserList/components/UserTreeView';
import OrganizationTreeView from 'routes/System/subviews/OrganizationTree/components/OrganizationTreeView';
import RoleListView from 'routes/System/subviews/RoleList/components/RoleListView';

import StaffAuthorizationView from 'routes/PeopleManagement/StaffAuthorizationView';
import TrainingApplication from 'routes/TrainingManagement/TrainingApplication';
import AnnualTrainingMain from 'routes/Annual/AnnualTrainingMain';
import TrainingRecordMain from 'routes/TrainingRecord/TrainingRecordMain';

import SampleReceiveList from 'routes/SampleManagement/SampleReceiveList';
import SampleIoList from 'routes/SampleManagement/SampleIoList';

import ItemContainer from 'common/basic/containers/ItemContainer';



const tabsmap = 
[
    {
        path: '/project_list',
        component: ItemContainer('project', ProjectListView)
    },
    {
        path: '/standard_list',
        component: ItemContainer('standard', StandardListView)
    },
    {
        path: '/user_list',
        component: UserTreeView
    },
    {
        path: '/organization_tree',
        component: OrganizationTreeView
    },
    {
        path: '/role_list',
        component: ItemContainer('role', RoleListView)
    },
    {
        path: '/staff_list',
        component:  ItemContainer( 'Authorization',StaffAuthorizationView)
     },
     {
        path:'/application_list',
        component: ItemContainer('Application',TrainingApplication)
     },
     {
        path:'/annualPlan_list',
        component:ItemContainer('AnnualTrainingMain',AnnualTrainingMain)
     },
    {
        path:'/trainingRecord_list',
        component:ItemContainer('TrainingRecordMain',TrainingRecordMain)
    },
    {
        path:'/sampleReceive_list',
        component:ItemContainer('ReceiveList', SampleReceiveList)
    },
    {
        path:'/sampleIo_list',
        component:ItemContainer('IoList',SampleIoList)
    }
     ]

export default tabsmap