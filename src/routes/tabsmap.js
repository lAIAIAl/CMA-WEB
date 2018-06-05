import ProjectListView from 'routes/Project/subviews/ProjectList/components/ProjectListView';

import StandardListView from 'routes/Knowledge/subviews/StandardList/components/StandardListView';

import UserTreeView from 'routes/System/subviews/UserList/components/UserTreeView';
import OrganizationTreeView from 'routes/System/subviews/OrganizationTree/components/OrganizationTreeView';
import RoleListView from 'routes/System/subviews/RoleList/components/RoleListView';

import ItemContainer from 'common/basic/containers/ItemContainer';

import TestView from 'routes/test/TestView';
import TestListView from 'routes/test/TestListView';

import PeopleManagementRecordsView from 'routes/PeopleManagement/PeopleManagementRecords/PeopleManagementRecordsView';
import Rcomponent from 'routes/PeopleManagement/components/Rcomponent'

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
        path: '/resigner_list',
        component: ItemContainer('Resigner', Rcomponent)
    }
]

export default tabsmap