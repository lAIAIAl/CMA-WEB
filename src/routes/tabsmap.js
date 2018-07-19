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

//PeriodCheck
import RecordComponent from "./IntermediateChecks/RecordComponent"
import PeriodCheckListView from './PeriodCheck/PeriodCheckListView';

//training
import TrainingApplication from 'routes/TrainingManagement/TrainingApplication';
import AnnualTrainingMain from 'routes/Annual/AnnualTrainingMain';
import TrainingRecordMain from 'routes/TrainingRecord/TrainingRecordMain';

//management review
import ManagementReviewList from 'routes/ManagementReview/ManagementReviewList';
import ManagementReviewDetail from 'routes/ManagementReview/ManagementReviewDetail';

//Sample
import SampleReceiveList from 'routes/SampleManagement/SampleReceiveList';
import SampleIoList from 'routes/SampleManagement/SampleIoList';

//InternalAudit
import InternalAuditComponent from "./InternalAudit/InternalAuditComponent";

//Equipment
import EquipmentRecord from 'routes/Equipment/EquipmentRecord';
import EquipmentReceiveRecord from 'routes/Equipment/EquipmentReceiveRecord';
import EquipmentUseRecord from 'routes/Equipment/EquipmentUseRecord';
import EquipmentMaintenanceRecord from 'routes/Equipment/EquipmentMaintenanceRecord';
import EquipmentApplicationRecord from 'routes/Equipment/EquipmentApplicationRecord';

//StandardManagement
import StandardManagement from 'routes/StandardManagement/StandardManagement';

//test capacity
import TestCapacityView from 'routes/TestCapacity/TestCapacityView';

//ExternalReview
import ExternalReviewList from 'routes/ExternalReview/ExternalReviewList';
import ExternalReviewDetail from 'routes/ExternalReview/ExternalReviewDetail';

//quality system management
import QSManualView from 'routes/QualitySystem/QSManualView';
import QSProgramView from 'routes/QualitySystem/QSProgramView';
import QSInstructionView from 'routes/QualitySystem/QSInstructionView';

//Institution
import Introduction from 'routes/TestingInstitution/Introduction';
import TestingInstitutionResource from 'routes/TestingInstitution/TestingInstitutionResource';
import Certificate from 'routes/TestingInstitution/Certificate';

//CapacityVerification
import CapacityVerificationPlan from "./CapacityVerification/CapacityVerificationPlan";
import CapacityVerificationView from "./CapacityVerification/CapacityVerificationView";

//SelfInspection
import SelfInspectionComponent from "./SelfInspection/SelfInspectionComponent";

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
    //peoplemanagement
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
        component: ItemContainer('StaffQualificationView', StaffQualificationView),
    },
    {
        path: '/resigner_list',
        component: ItemContainer('Resigner', Rcomponent)
    },
    //supervise
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
    //peiriodcheck
    {
        path: '/record_list',
        component: ItemContainer('Record',RecordComponent)
    },
    {
        path: '/periodcheck_list',
        component: ItemContainer('PeriodCheck',PeriodCheckListView)
    },
    //training
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
    //management review
    {
    	path:'/ManagementReview',
    	component:ItemContainer('ManagementReview', ManagementReviewList)
    },
    {
        path:'/ManagementReviewDetail_fake',
        component:ItemContainer('ManagementReviewDetail', ManagementReviewDetail)
    },
    //Sample
    {
        path:'/sampleReceive_list',
        component:ItemContainer('ReceiveList', SampleReceiveList)
    },
    {
        path:'/sampleIo_list',
        component:ItemContainer('IoList',SampleIoList)
    },
    //InternalAudit
    {
        path:'/InternalAudit',
        component:InternalAuditComponent
    },
    //Equipment
    {
        path: '/er_list',
        component: ItemContainer('EquipmentRecord', EquipmentRecord)
    },
    {
        path: '/err_list',
        component: ItemContainer('EquipmentReceiveRecord', EquipmentReceiveRecord)
    },
    {
        path: '/eur_list',
        component: ItemContainer('EquipmentUseRecord', EquipmentUseRecord)
    },
    {
        path: '/emr_list',
        component: ItemContainer('EquipmentMaintenanceRecord', EquipmentMaintenanceRecord)
    },
    {
        path: '/ear_list',
        component: ItemContainer('EquipmentApplicationRecord', EquipmentApplicationRecord)
    },
    //StandardManagement
    {
        path: '/StandardManagement',
        component: ItemContainer('StandardManagement', StandardManagement)
    },
    //testcapacity
    {
        path: '/testcapacity_list',
        component: ItemContainer('TestCapacity',TestCapacityView)
    },
    //ExternalReview
    {
        path: '/ExternalReview',
        component: ItemContainer('ExternalReviewList', ExternalReviewList)
    },
    {
        path: '/ExternalReview_detail',
        component: ItemContainer('ExternalReviewDetail', ExternalReviewDetail)
    },
    //QS management
    {
        path: '/QSmanual_list',
        component: ItemContainer('QSmanual',QSManualView)
    },
    {
        path: '/QSprogram_list',
    component: ItemContainer('QSprogram',QSProgramView)
    },
    {
        path: '/QSinstruction_list',
    component: ItemContainer('QSinstruction',QSInstructionView)
    },
    //Institution
    {
        path:'/resource_list',
        component:TestingInstitutionResource
    },
    {
        path:'/introduction_list',
        component:Introduction
    },
    {
        path:'/certificate_list',
        component:Certificate
    },
    //SelfInspection
    {
        path:'/SelfInspection',
        component:SelfInspectionComponent
    },

    //CapacityVerification
    {
        path:'/CapacityVerification',
        component:ItemContainer('VerificationPlan',CapacityVerificationPlan)
    },
    {
        path:'/CapacityVerification_1',
        component:ItemContainer('VerificationProcess',CapacityVerificationView)
    },
]

export default tabsmap