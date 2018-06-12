import ProjectListView from 'routes/Project/subviews/ProjectList/components/ProjectListView';

import StandardListView from 'routes/Knowledge/subviews/StandardList/components/StandardListView';

import UserTreeView from 'routes/System/subviews/UserList/components/UserTreeView';
import OrganizationTreeView from 'routes/System/subviews/OrganizationTree/components/OrganizationTreeView';
import RoleListView from 'routes/System/subviews/RoleList/components/RoleListView';

import ItemContainer from 'common/basic/containers/ItemContainer';

//staff management
import InspectPeople from 'routes/PeopleManagement/PeopleManagementRecords/InspectPeople';
import PeopleManagementRecordsView from 'routes/PeopleManagement/PeopleManagementRecords/PeopleManagementRecordsView';
import Rcomponent from 'routes/PeopleManagement/components/Rcomponent';
import StaffTrainingListView from 'routes/Peoplemanagement/StaffTrainingListView';
import StaffQualificationView from 'routes/Peoplemanagement/StaffQualification/StaffQualificationView';
import TestView from 'routes/Peoplemanagement/Auth/StaffAuthorizationView';
//supervise
import SuperviseList from 'routes/Supervise/SuperviseList';
import SupervisePlans from 'routes/Supervise/SupervisePlans';
import SuperviseRecord from 'routes/Supervise/SuperviseRecord';

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
        path: '/PeopleManagementRecords',
        component: ItemContainer('StaffManagement',PeopleManagementRecordsView)
    },
    {
        path: '/StaffFile_fake',
        component: ItemContainer('StaffFile', InspectPeople)
    },
    {
        path: '/stafftraining_list',
        component: ItemContainer('StaffTraining',StaffTrainingListView)
    },
    {
        path: '/staff_auth_list',
        component: ItemContainer('Authorization',TestView),
    },
    {
        path: '/staff_quali_list',
        component: StaffQualificationView,
    },
    {
        path: '/resigner_list',
        component: ItemContainer('Resigner', Rcomponent)
    },
    {
        path: '/Supervise',
        component: ItemContainer('Supervise', SuperviseList)
    },
    {
        path: '/SupervisePlans_fake',
        component: ItemContainer('SupervisePlans', SupervisePlans)
    },
    {
        path: '/SuperviseRecord_fake',
        component: ItemContainer('SuperviseRecord', SuperviseRecord)
    },
]

export default tabsmap