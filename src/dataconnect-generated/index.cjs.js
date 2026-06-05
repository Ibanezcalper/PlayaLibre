const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'default-connector',
  service: 'playas-libres-service',
  location: 'us-central1'
};
exports.connectorConfig = connectorConfig;

const createBeachRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateBeach', inputVars);
}
createBeachRef.operationName = 'CreateBeach';
exports.createBeachRef = createBeachRef;

exports.createBeach = function createBeach(dcOrVars, vars) {
  return executeMutation(createBeachRef(dcOrVars, vars));
};

const createAccessRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateAccess', inputVars);
}
createAccessRef.operationName = 'CreateAccess';
exports.createAccessRef = createAccessRef;

exports.createAccess = function createAccess(dcOrVars, vars) {
  return executeMutation(createAccessRef(dcOrVars, vars));
};

const createReportRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateReport', inputVars);
}
createReportRef.operationName = 'CreateReport';
exports.createReportRef = createReportRef;

exports.createReport = function createReport(dcOrVars, vars) {
  return executeMutation(createReportRef(dcOrVars, vars));
};

const updateAccessCurationRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateAccessCuration', inputVars);
}
updateAccessCurationRef.operationName = 'UpdateAccessCuration';
exports.updateAccessCurationRef = updateAccessCurationRef;

exports.updateAccessCuration = function updateAccessCuration(dcOrVars, vars) {
  return executeMutation(updateAccessCurationRef(dcOrVars, vars));
};

const updateReportScoreRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateReportScore', inputVars);
}
updateReportScoreRef.operationName = 'UpdateReportScore';
exports.updateReportScoreRef = updateReportScoreRef;

exports.updateReportScore = function updateReportScore(dcOrVars, vars) {
  return executeMutation(updateReportScoreRef(dcOrVars, vars));
};

const deleteReportRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteReport', inputVars);
}
deleteReportRef.operationName = 'DeleteReport';
exports.deleteReportRef = deleteReportRef;

exports.deleteReport = function deleteReport(dcOrVars, vars) {
  return executeMutation(deleteReportRef(dcOrVars, vars));
};

const upsertUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertUser', inputVars);
}
upsertUserRef.operationName = 'UpsertUser';
exports.upsertUserRef = upsertUserRef;

exports.upsertUser = function upsertUser(dcOrVars, vars) {
  return executeMutation(upsertUserRef(dcOrVars, vars));
};

const updateUserReputationRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateUserReputation', inputVars);
}
updateUserReputationRef.operationName = 'UpdateUserReputation';
exports.updateUserReputationRef = updateUserReputationRef;

exports.updateUserReputation = function updateUserReputation(dcOrVars, vars) {
  return executeMutation(updateUserReputationRef(dcOrVars, vars));
};

const createCommentRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateComment', inputVars);
}
createCommentRef.operationName = 'CreateComment';
exports.createCommentRef = createCommentRef;

exports.createComment = function createComment(dcOrVars, vars) {
  return executeMutation(createCommentRef(dcOrVars, vars));
};

const deleteCommentRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteComment', inputVars);
}
deleteCommentRef.operationName = 'DeleteComment';
exports.deleteCommentRef = deleteCommentRef;

exports.deleteComment = function deleteComment(dcOrVars, vars) {
  return executeMutation(deleteCommentRef(dcOrVars, vars));
};

const listBeachesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListBeaches');
}
listBeachesRef.operationName = 'ListBeaches';
exports.listBeachesRef = listBeachesRef;

exports.listBeaches = function listBeaches(dc) {
  return executeQuery(listBeachesRef(dc));
};

const getBeachDetailsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetBeachDetails', inputVars);
}
getBeachDetailsRef.operationName = 'GetBeachDetails';
exports.getBeachDetailsRef = getBeachDetailsRef;

exports.getBeachDetails = function getBeachDetails(dcOrVars, vars) {
  return executeQuery(getBeachDetailsRef(dcOrVars, vars));
};

const getUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUser', inputVars);
}
getUserRef.operationName = 'GetUser';
exports.getUserRef = getUserRef;

exports.getUser = function getUser(dcOrVars, vars) {
  return executeQuery(getUserRef(dcOrVars, vars));
};

const getCommentsForBeachRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetCommentsForBeach', inputVars);
}
getCommentsForBeachRef.operationName = 'GetCommentsForBeach';
exports.getCommentsForBeachRef = getCommentsForBeachRef;

exports.getCommentsForBeach = function getCommentsForBeach(dcOrVars, vars) {
  return executeQuery(getCommentsForBeachRef(dcOrVars, vars));
};
