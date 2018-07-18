export const baseAddress = 'http://119.23.38.100:8080'; 
const serviceBaseAddress = 'http://119.23.38.100:8080/cma/services';

//auth
export const loginService = baseAddress + '/login';
export const logoutService = baseAddress + '/logout';
export const resetPasswordService = baseAddress + '/resetPassword';

//file
export const downloadFileService = serviceBaseAddress + '/downloadFile';

//project
export const addProjectService = serviceBaseAddress + '/addProject';
export const deleteProjectService = serviceBaseAddress + '/deleteProject';
export const editProjectService = serviceBaseAddress + '/editProject';
export const queryProjectsService = serviceBaseAddress + '/queryProjects';
export const queryAllProjectsService = serviceBaseAddress + '/queryAllProjects';

//topic
export const deleteTopicService = serviceBaseAddress + '/deleteTopic';
export const editTopicService = serviceBaseAddress + '/editTopic';
export const addTopicService = serviceBaseAddress + '/addTopic';
export const queryTopicsService = serviceBaseAddress + '/queryTopics';
export const queryAllTopicsService = serviceBaseAddress + '/queryAllTopics';

//milestone
export const deleteMilestoneService = serviceBaseAddress + '/deleteMilestone';
export const editMilestoneService = serviceBaseAddress + '/editMilestone';
export const addMilestoneService = serviceBaseAddress + '/addMilestone';
export const queryMilestonesService = serviceBaseAddress + '/queryMilestones';

//personnel
export const addPersonnelService = serviceBaseAddress + '/addPersonnel';
export const deletePersonnelService = serviceBaseAddress + '/deletePersonnel';
export const editPersonnelService = serviceBaseAddress + '/editPersonnel';
export const queryPersonnelsService = serviceBaseAddress + '/queryPersonnels';
export const queryAllPersonnelsService = serviceBaseAddress + '/queryAllPersonnels';

export const deleteResumeService = serviceBaseAddress + '/deleteResume';

//contract
export const addContractService = serviceBaseAddress + '/addContract';
export const deleteContractService = serviceBaseAddress + '/deleteContract';
export const editContractService = serviceBaseAddress + '/editContract';
export const queryContractsService = serviceBaseAddress + '/queryContracts';

export const deleteContractResourceService = serviceBaseAddress + '/deleteContractResource';

//customer
export const addCustomerService = serviceBaseAddress + '/addCustomer';
export const deleteCustomerService = serviceBaseAddress + '/deleteCustomer';
export const editCustomerService = serviceBaseAddress + '/editCustomer';
export const queryCustomersService = serviceBaseAddress + '/queryCustomers';
export const queryAllCustomersService = serviceBaseAddress + '/queryAllCustomers';

export const deleteCustomerResourceService = serviceBaseAddress + '/deleteCustomerResource';

//payment
export const addPaymentService = serviceBaseAddress + '/addPayment';
export const deletePaymentService = serviceBaseAddress + '/deletePayment';
export const editPaymentService = serviceBaseAddress + '/editPayment';
export const queryPaymentsService = serviceBaseAddress + '/queryPayments';

export const deletePaymentResourceService = serviceBaseAddress + '/deletePaymentResource';

//journal
export const addJournalService = serviceBaseAddress + '/addJournal';
export const deleteJournalService = serviceBaseAddress + '/deleteJournal';
export const editJournalService = serviceBaseAddress + '/editJournal';
export const queryJournalsService = serviceBaseAddress + '/queryJournals';
export const queryPersonalJournalsService = serviceBaseAddress + '/queryPersonalJournals';

export const deleteJournalResourceService = serviceBaseAddress + '/deleteJournalResource';

export const queryJournalsTotalAmountService = serviceBaseAddress + '/queryJournalsTotalAmount';
export const queryJournalsIncrementService = serviceBaseAddress + '/queryJournalsIncrement';
export const queryMostJournalsPersonnelService = serviceBaseAddress + '/queryMostJournalsPersonnel';
export const queryMostEvectionPersonnelsService = serviceBaseAddress + '/queryMostEvectionPersonnels';
export const queryMostFrequentEvectionPlacesService = serviceBaseAddress + '/queryMostFrequentEvectionPlaces';
export const queryLeastJournalsPersonnelService = serviceBaseAddress + '/queryLeastJournalsPersonnel';
export const queryTotalsByProjectsService = serviceBaseAddress + '/queryTotalsByProjects';
export const queryTotalsByPersonnelsService = serviceBaseAddress + '/queryTotalsByPersonnels';
export const queryRatiosByProjectsService = serviceBaseAddress + '/queryRatiosByProjects';
export const queryRatiosByPersonnelsService = serviceBaseAddress + '/queryRatiosByPersonnels';
export const queryRatiosByMonthsService = serviceBaseAddress + '/queryRatiosByMonths';
export const queryEvectionsService = serviceBaseAddress + '/queryEvections';

//standard
export const addStandardService = serviceBaseAddress + '/addStandard';
export const deleteStandardService = serviceBaseAddress + '/deleteStandard';
export const editStandardService = serviceBaseAddress + '/editStandard';
export const queryStandardsService = serviceBaseAddress + '/queryStandards';

export const deleteStandardResourceService = serviceBaseAddress + '/deleteStandardResource';

//system
export const getAllOrganizationHierarchiesService = serviceBaseAddress + '/getAllOrganizationHierarchies';
export const getAllFunctionsHierarchiesService = serviceBaseAddress + '/getAllFunctionsHierarchies';

export const addOrganizationService = serviceBaseAddress + '/addOrganization';
export const editOrganizationService = serviceBaseAddress + '/editOrganization';
export const deleteOrganizationService = serviceBaseAddress + '/deleteOrganization';
export const queryOrganizationsService = serviceBaseAddress + '/queryOrganizations';
export const queryAllOrganizationsService = serviceBaseAddress + '/queryAllOrganizations';

export const addUserService = serviceBaseAddress + '/addUser';
export const editUserService = serviceBaseAddress + '/editUser';
export const deleteUserService = serviceBaseAddress + '/deleteUser';
export const queryUsersService = serviceBaseAddress + '/queryUsers';
export const queryAllUsersService = serviceBaseAddress + '/queryAllUsers';

//role
export const getAllRolesService = serviceBaseAddress + '/getAllRoles';
export const queryRolesService = serviceBaseAddress + '/queryRoles';
export const addRoleService = serviceBaseAddress + '/addRole';
export const editRoleService = serviceBaseAddress + '/editRole';
export const deleteRoleService = serviceBaseAddress + '/deleteRole';

//staff training
export const getAllStaffTrainingsService = baseAddress + '/cma/StaffTraining/getAll';//url: 4.1
export const addOneStaffTrainingService = baseAddress + '/cma/StaffTraining/addOne';//url: 4.5
export const deleteOneStaffTrainingService = baseAddress + '/cma/StaffTraining/deleteOne';//url: 4.10
export const getStaffTrainingPeopleService = baseAddress + '/cma/StaffTraining/getTrainingPeople';//url:4.2
export const modifyOneStaffTrainingService = baseAddress + '/cma/StaffTraining/modifyOne';//url: 4.8
export const getAllByStaffService = baseAddress + '/cma/StaffTraining/getAllByStaff';//url: 4.3
export const getOnePersonalTrainService = baseAddress + '/cma/StaffTraining/getOne';//url: 4.4
export const addTraineeService = baseAddress + '/cma/StaffTraining/addTrainingPelple';//url: 4.6
export const addTrainingResultService = baseAddress + '/cma/StaffTraining/addTrainingResult';//url: 4.7
export const staffTrainingModifyResultService = baseAddress + '/cma/StaffTraining/modifyResult';//url: 4.9
export const deleteTrainingPeopleResultService = baseAddress + '/cma/StaffTraining/deleteTrainingPeople';//url: 4.11

//period check
export const periodCheckGetAllService = baseAddress + '/cma/IntermediateChecksPlan/getAll';//url: 1.1
export const periodCheckAddOneService = baseAddress + '/cma/IntermediateChecksPlan/addOne';//url: 1.3
export const periodCheckDeleteOneService = baseAddress + '/cma/IntermediateChecksPlan/deleteOne';//url: 1.5
export const periodCheckModifyOneService = baseAddress + '/cma/IntermediateChecksPlan/modifyOne';//url: 1.4
export const periodCheckGetOneService = baseAddress + '/cma/IntermediateChecksPlan/getOne';//url: 1.2

//test capacity
export const testCapacityGetAllService = baseAddress + '/cma/TestAbility/getAll'; //url: 1.1
export const testCapacityAddOneService = baseAddress + '/cma/TestAbility/addOne'; //url: 1.2
export const testCapacityModifyOneService = baseAddress + '/cma/TestAbility/modifyOne'; //url: 1.3
export const testCapacityGetAnnexService = baseAddress + '/cma/TestAbility/getAnnex'; //url: 1.4
export const testCapacityGetAllItemService = baseAddress + '/cma/TestAbility/getAllItem'; //url: 1.5
export const testCapacityAddOneItemService = baseAddress + '/cma/TestAbility/addOneItem'; //url: 1.6
export const testCapacityDeleteOneItemService = baseAddress + '/cma/TestAbility/deleteOneItem'; //url: 1.7

//quality system management
export const qualityManualUploadService = baseAddress + '/cma/QualityManual/upload'; //url: 1.1
export const qualityManualGetCurrentService = baseAddress + '/cma/QualityManual/getCurrent'; //url: 1.2
export const qualityManualGetCurrentFileService = baseAddress + '/cma/QualityManual/getCurrentFile'; //url: 1.3
export const qualityManualGetAllHistoryService = baseAddress + '/cma/QualityManual/getAllHistory'; //url: 1.4
export const qualityManualGetHistoryFileService = baseAddress + '/cma/QualityManual/getHistoryFile'; //url: 1.5
export const qualityManualModifyService = baseAddress + '/cma/QualityManual/modify'; //url: 1.6
export const qualityManualApproveService = baseAddress + '/cma/QualityManual/approve'; //url: 1.8
export const qualityManualDeleteService = baseAddress + '/cma/QualityManual/delete'; //url: 1.7 

//QS
export const qualityProgramUploadService = baseAddress + '/cma/ProgramFile/upload'; //url: 2.1
export const qualityProgramGetCurrentService = baseAddress + '/cma/ProgramFile/getCurrent'; //url: 2.2
export const qualityProgramGetCurrentFileService = baseAddress + '/cma/ProgramFile/getCurrentFile'; //url: 2.3
export const qualityProgramGetAllHistoryService = baseAddress + '/cma/ProgramFile/getAllHistory'; //url: 2.4
export const qualityProgramGetHistoryFileService = baseAddress + '/cma/ProgramFile/getHistoryFile'; //url: 2.5
export const qualityProgramModifyService = baseAddress + '/cma/ProgramFile/modify'; //url: 2.6
export const qualityProgramApproveService = baseAddress + '/cma/ProgramFile/approve'; //url: 2.8
export const qualityProgramDeleteService = baseAddress + '/cma/ProgramFile/delete'; //url: 2.7

export const qualityInstructionUploadService = baseAddress + '/cma/OperatingInstruction/upload'; //url: 3.1
export const qualityInstructionGetCurrentService = baseAddress + '/cma/OperatingInstruction/getCurrent'; //url: 3.2
export const qualityInstructionGetCurrentFileService = baseAddress + '/cma/OperatingInstruction/getCurrentFile'; //url: 3.3
export const qualityInstructionGetAllHistoryService = baseAddress + '/cma/OperatingInstruction/getAllHistory'; //url: 3.4
export const qualityInstructionGetHistoryFileService = baseAddress + '/cma/OperatingInstruction/getHistoryFile'; //url: 3.5
export const qualityInstructionModifyService = baseAddress + '/cma/OperatingInstruction/modify'; //url: 3.6
export const qualityInstructionApproveService = baseAddress + '/cma/OperatingInstruction/approve'; //url: 3.8
export const qualityInstructionDeleteService = baseAddress + '/cma/OperationInstruction/delete';//url: 3.7
