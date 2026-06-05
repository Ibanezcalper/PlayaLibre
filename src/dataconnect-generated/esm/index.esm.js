import { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'default-connector',
  service: 'playas-libres-service',
  location: 'us-central1'
};

export const createBeachRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateBeach', inputVars);
}
createBeachRef.operationName = 'CreateBeach';

export function createBeach(dcOrVars, vars) {
  return executeMutation(createBeachRef(dcOrVars, vars));
}

export const createAccessRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateAccess', inputVars);
}
createAccessRef.operationName = 'CreateAccess';

export function createAccess(dcOrVars, vars) {
  return executeMutation(createAccessRef(dcOrVars, vars));
}

export const createReportRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateReport', inputVars);
}
createReportRef.operationName = 'CreateReport';

export function createReport(dcOrVars, vars) {
  return executeMutation(createReportRef(dcOrVars, vars));
}

export const updateAccessCurationRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateAccessCuration', inputVars);
}
updateAccessCurationRef.operationName = 'UpdateAccessCuration';

export function updateAccessCuration(dcOrVars, vars) {
  return executeMutation(updateAccessCurationRef(dcOrVars, vars));
}

export const updateReportScoreRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateReportScore', inputVars);
}
updateReportScoreRef.operationName = 'UpdateReportScore';

export function updateReportScore(dcOrVars, vars) {
  return executeMutation(updateReportScoreRef(dcOrVars, vars));
}

export const deleteReportRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteReport', inputVars);
}
deleteReportRef.operationName = 'DeleteReport';

export function deleteReport(dcOrVars, vars) {
  return executeMutation(deleteReportRef(dcOrVars, vars));
}

export const upsertUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertUser', inputVars);
}
upsertUserRef.operationName = 'UpsertUser';

export function upsertUser(dcOrVars, vars) {
  return executeMutation(upsertUserRef(dcOrVars, vars));
}

export const updateUserReputationRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateUserReputation', inputVars);
}
updateUserReputationRef.operationName = 'UpdateUserReputation';

export function updateUserReputation(dcOrVars, vars) {
  return executeMutation(updateUserReputationRef(dcOrVars, vars));
}

export const createCommentRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateComment', inputVars);
}
createCommentRef.operationName = 'CreateComment';

export function createComment(dcOrVars, vars) {
  return executeMutation(createCommentRef(dcOrVars, vars));
}

export const deleteCommentRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteComment', inputVars);
}
deleteCommentRef.operationName = 'DeleteComment';

export function deleteComment(dcOrVars, vars) {
  return executeMutation(deleteCommentRef(dcOrVars, vars));
}

export const listBeachesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListBeaches');
}
listBeachesRef.operationName = 'ListBeaches';

export function listBeaches(dc) {
  return executeQuery(listBeachesRef(dc));
}

export const getBeachDetailsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetBeachDetails', inputVars);
}
getBeachDetailsRef.operationName = 'GetBeachDetails';

export function getBeachDetails(dcOrVars, vars) {
  return executeQuery(getBeachDetailsRef(dcOrVars, vars));
}

export const getUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUser', inputVars);
}
getUserRef.operationName = 'GetUser';

export function getUser(dcOrVars, vars) {
  return executeQuery(getUserRef(dcOrVars, vars));
}

export const getCommentsForBeachRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetCommentsForBeach', inputVars);
}
getCommentsForBeachRef.operationName = 'GetCommentsForBeach';

export function getCommentsForBeach(dcOrVars, vars) {
  return executeQuery(getCommentsForBeachRef(dcOrVars, vars));
}

