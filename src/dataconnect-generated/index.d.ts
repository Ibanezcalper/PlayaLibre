import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise, DataConnectSettings } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;
export const dataConnectSettings: DataConnectSettings;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface Access_Key {
  id: UUIDString;
  __typename?: 'Access_Key';
}

export interface Beach_Key {
  id: UUIDString;
  __typename?: 'Beach_Key';
}

export interface Comment_Key {
  id: UUIDString;
  __typename?: 'Comment_Key';
}

export interface CreateAccessData {
  access_insert: Access_Key;
}

export interface CreateAccessVariables {
  beachId: UUIDString;
  name: string;
  latitude: number;
  longitude: number;
  trailGeometry?: unknown | null;
  images?: unknown | null;
  pets: boolean;
  shade: boolean;
  showers: boolean;
  parking: boolean;
  security: boolean;
  ramps: boolean;
  wheelchair: boolean;
  parkingReserved: boolean;
  alcoholAllowed: boolean;
  campingAllowed: boolean;
  feeRequired: boolean;
  wifi: boolean;
  cellular4G: boolean;
  blockerType: string;
  blockerName?: string | null;
  blockerDescription?: string | null;
  illegalFeeAmount: number;
  userId?: string | null;
}

export interface CreateBeachData {
  beach_insert: Beach_Key;
}

export interface CreateBeachVariables {
  name: string;
  state: string;
  latitude: number;
  longitude: number;
  boundaryPolygon?: unknown | null;
  images?: unknown | null;
  userId?: string | null;
}

export interface CreateCommentData {
  comment_insert: Comment_Key;
}

export interface CreateCommentVariables {
  beachId: UUIDString;
  userId: string;
  text: string;
}

export interface CreateReportData {
  report_insert: Report_Key;
}

export interface CreateReportVariables {
  accessId: UUIDString;
  reporterName: string;
  blockerType: string;
  blockerName: string;
  description: string;
  hasIllegalFee: boolean;
  feeAmount?: number | null;
  userId?: string | null;
}

export interface DeleteCommentData {
  comment_delete?: Comment_Key | null;
}

export interface DeleteCommentVariables {
  id: UUIDString;
}

export interface DeleteReportData {
  report_delete?: Report_Key | null;
}

export interface DeleteReportVariables {
  id: UUIDString;
}

export interface GetBeachDetailsData {
  beach?: {
    id: UUIDString;
    name: string;
    state: string;
    latitude: number;
    longitude: number;
    boundaryPolygon?: unknown | null;
    images?: unknown | null;
    createdAt: DateString;
    user?: {
      id: string;
      username: string;
      avatarUrl?: string | null;
      reputation: number;
    } & User_Key;
  } & Beach_Key;
  accesses: ({
    id: UUIDString;
    name: string;
    latitude: number;
    longitude: number;
    trailGeometry?: unknown | null;
    images?: unknown | null;
    pets: boolean;
    shade: boolean;
    showers: boolean;
    parking: boolean;
    security: boolean;
    ramps: boolean;
    wheelchair: boolean;
    parkingReserved: boolean;
    alcoholAllowed: boolean;
    campingAllowed: boolean;
    feeRequired: boolean;
    wifi: boolean;
    cellular4G: boolean;
    blockerType: string;
    blockerName?: string | null;
    blockerDescription?: string | null;
    illegalFeeAmount: number;
    reputation: number;
    isPendingCuration: boolean;
    createdAt: DateString;
    user?: {
      id: string;
      username: string;
      avatarUrl?: string | null;
      reputation: number;
    } & User_Key;
    reports_on_access: ({
      id: UUIDString;
      reporterName: string;
      blockerType: string;
      blockerName: string;
      description: string;
      hasIllegalFee: boolean;
      feeAmount?: number | null;
      score: number;
      createdAt: DateString;
      user?: {
        id: string;
        username: string;
        avatarUrl?: string | null;
        reputation: number;
      } & User_Key;
    } & Report_Key)[];
  } & Access_Key)[];
}

export interface GetBeachDetailsVariables {
  id: UUIDString;
}

export interface GetCommentsForBeachData {
  comments: ({
    id: UUIDString;
    text: string;
    createdAt: DateString;
    user: {
      id: string;
      username: string;
      avatarUrl?: string | null;
      reputation: number;
    } & User_Key;
  } & Comment_Key)[];
}

export interface GetCommentsForBeachVariables {
  beachId: UUIDString;
}

export interface GetUserData {
  user?: {
    id: string;
    username: string;
    avatarUrl?: string | null;
    bio?: string | null;
    reputation: number;
    createdAt: DateString;
  } & User_Key;
}

export interface GetUserVariables {
  id: string;
}

export interface ListBeachesData {
  beaches: ({
    id: UUIDString;
    name: string;
    state: string;
    latitude: number;
    longitude: number;
    boundaryPolygon?: unknown | null;
    images?: unknown | null;
    createdAt: DateString;
    user?: {
      id: string;
      username: string;
      avatarUrl?: string | null;
      reputation: number;
    } & User_Key;
    accesses_on_beach: ({
      id: UUIDString;
      name: string;
      latitude: number;
      longitude: number;
      trailGeometry?: unknown | null;
      images?: unknown | null;
      pets: boolean;
      shade: boolean;
      showers: boolean;
      parking: boolean;
      security: boolean;
      ramps: boolean;
      wheelchair: boolean;
      parkingReserved: boolean;
      alcoholAllowed: boolean;
      campingAllowed: boolean;
      feeRequired: boolean;
      wifi: boolean;
      cellular4G: boolean;
      blockerType: string;
      blockerName?: string | null;
      blockerDescription?: string | null;
      illegalFeeAmount: number;
      reputation: number;
      isPendingCuration: boolean;
      createdAt: DateString;
      user?: {
        id: string;
        username: string;
        avatarUrl?: string | null;
        reputation: number;
      } & User_Key;
      reports_on_access: ({
        id: UUIDString;
        reporterName: string;
        blockerType: string;
        blockerName: string;
        description: string;
        hasIllegalFee: boolean;
        feeAmount?: number | null;
        score: number;
        createdAt: DateString;
        user?: {
          id: string;
          username: string;
          avatarUrl?: string | null;
          reputation: number;
        } & User_Key;
      } & Report_Key)[];
    } & Access_Key)[];
  } & Beach_Key)[];
}

export interface Report_Key {
  id: UUIDString;
  __typename?: 'Report_Key';
}

export interface UpdateAccessCurationData {
  access_update?: Access_Key | null;
}

export interface UpdateAccessCurationVariables {
  id: UUIDString;
  blockerType: string;
  blockerName?: string | null;
  blockerDescription?: string | null;
  illegalFeeAmount: number;
  reputation: number;
  isPendingCuration: boolean;
}

export interface UpdateReportScoreData {
  report_update?: Report_Key | null;
}

export interface UpdateReportScoreVariables {
  id: UUIDString;
  score: number;
}

export interface UpdateUserReputationData {
  user_update?: User_Key | null;
}

export interface UpdateUserReputationVariables {
  id: string;
  reputation: number;
}

export interface UpsertUserData {
  user_upsert: User_Key;
}

export interface UpsertUserVariables {
  id: string;
  username: string;
  avatarUrl?: string | null;
  bio?: string | null;
  reputation: number;
}

export interface User_Key {
  id: string;
  __typename?: 'User_Key';
}

interface CreateBeachRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateBeachVariables): MutationRef<CreateBeachData, CreateBeachVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateBeachVariables): MutationRef<CreateBeachData, CreateBeachVariables>;
  operationName: string;
}
export const createBeachRef: CreateBeachRef;

export function createBeach(vars: CreateBeachVariables): MutationPromise<CreateBeachData, CreateBeachVariables>;
export function createBeach(dc: DataConnect, vars: CreateBeachVariables): MutationPromise<CreateBeachData, CreateBeachVariables>;

interface CreateAccessRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateAccessVariables): MutationRef<CreateAccessData, CreateAccessVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateAccessVariables): MutationRef<CreateAccessData, CreateAccessVariables>;
  operationName: string;
}
export const createAccessRef: CreateAccessRef;

export function createAccess(vars: CreateAccessVariables): MutationPromise<CreateAccessData, CreateAccessVariables>;
export function createAccess(dc: DataConnect, vars: CreateAccessVariables): MutationPromise<CreateAccessData, CreateAccessVariables>;

interface CreateReportRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateReportVariables): MutationRef<CreateReportData, CreateReportVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateReportVariables): MutationRef<CreateReportData, CreateReportVariables>;
  operationName: string;
}
export const createReportRef: CreateReportRef;

export function createReport(vars: CreateReportVariables): MutationPromise<CreateReportData, CreateReportVariables>;
export function createReport(dc: DataConnect, vars: CreateReportVariables): MutationPromise<CreateReportData, CreateReportVariables>;

interface UpdateAccessCurationRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateAccessCurationVariables): MutationRef<UpdateAccessCurationData, UpdateAccessCurationVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateAccessCurationVariables): MutationRef<UpdateAccessCurationData, UpdateAccessCurationVariables>;
  operationName: string;
}
export const updateAccessCurationRef: UpdateAccessCurationRef;

export function updateAccessCuration(vars: UpdateAccessCurationVariables): MutationPromise<UpdateAccessCurationData, UpdateAccessCurationVariables>;
export function updateAccessCuration(dc: DataConnect, vars: UpdateAccessCurationVariables): MutationPromise<UpdateAccessCurationData, UpdateAccessCurationVariables>;

interface UpdateReportScoreRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateReportScoreVariables): MutationRef<UpdateReportScoreData, UpdateReportScoreVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateReportScoreVariables): MutationRef<UpdateReportScoreData, UpdateReportScoreVariables>;
  operationName: string;
}
export const updateReportScoreRef: UpdateReportScoreRef;

export function updateReportScore(vars: UpdateReportScoreVariables): MutationPromise<UpdateReportScoreData, UpdateReportScoreVariables>;
export function updateReportScore(dc: DataConnect, vars: UpdateReportScoreVariables): MutationPromise<UpdateReportScoreData, UpdateReportScoreVariables>;

interface DeleteReportRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteReportVariables): MutationRef<DeleteReportData, DeleteReportVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteReportVariables): MutationRef<DeleteReportData, DeleteReportVariables>;
  operationName: string;
}
export const deleteReportRef: DeleteReportRef;

export function deleteReport(vars: DeleteReportVariables): MutationPromise<DeleteReportData, DeleteReportVariables>;
export function deleteReport(dc: DataConnect, vars: DeleteReportVariables): MutationPromise<DeleteReportData, DeleteReportVariables>;

interface UpsertUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertUserVariables): MutationRef<UpsertUserData, UpsertUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertUserVariables): MutationRef<UpsertUserData, UpsertUserVariables>;
  operationName: string;
}
export const upsertUserRef: UpsertUserRef;

export function upsertUser(vars: UpsertUserVariables): MutationPromise<UpsertUserData, UpsertUserVariables>;
export function upsertUser(dc: DataConnect, vars: UpsertUserVariables): MutationPromise<UpsertUserData, UpsertUserVariables>;

interface UpdateUserReputationRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateUserReputationVariables): MutationRef<UpdateUserReputationData, UpdateUserReputationVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateUserReputationVariables): MutationRef<UpdateUserReputationData, UpdateUserReputationVariables>;
  operationName: string;
}
export const updateUserReputationRef: UpdateUserReputationRef;

export function updateUserReputation(vars: UpdateUserReputationVariables): MutationPromise<UpdateUserReputationData, UpdateUserReputationVariables>;
export function updateUserReputation(dc: DataConnect, vars: UpdateUserReputationVariables): MutationPromise<UpdateUserReputationData, UpdateUserReputationVariables>;

interface CreateCommentRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateCommentVariables): MutationRef<CreateCommentData, CreateCommentVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateCommentVariables): MutationRef<CreateCommentData, CreateCommentVariables>;
  operationName: string;
}
export const createCommentRef: CreateCommentRef;

export function createComment(vars: CreateCommentVariables): MutationPromise<CreateCommentData, CreateCommentVariables>;
export function createComment(dc: DataConnect, vars: CreateCommentVariables): MutationPromise<CreateCommentData, CreateCommentVariables>;

interface DeleteCommentRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteCommentVariables): MutationRef<DeleteCommentData, DeleteCommentVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteCommentVariables): MutationRef<DeleteCommentData, DeleteCommentVariables>;
  operationName: string;
}
export const deleteCommentRef: DeleteCommentRef;

export function deleteComment(vars: DeleteCommentVariables): MutationPromise<DeleteCommentData, DeleteCommentVariables>;
export function deleteComment(dc: DataConnect, vars: DeleteCommentVariables): MutationPromise<DeleteCommentData, DeleteCommentVariables>;

interface ListBeachesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListBeachesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListBeachesData, undefined>;
  operationName: string;
}
export const listBeachesRef: ListBeachesRef;

export function listBeaches(options?: ExecuteQueryOptions): QueryPromise<ListBeachesData, undefined>;
export function listBeaches(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListBeachesData, undefined>;

interface GetBeachDetailsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetBeachDetailsVariables): QueryRef<GetBeachDetailsData, GetBeachDetailsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetBeachDetailsVariables): QueryRef<GetBeachDetailsData, GetBeachDetailsVariables>;
  operationName: string;
}
export const getBeachDetailsRef: GetBeachDetailsRef;

export function getBeachDetails(vars: GetBeachDetailsVariables, options?: ExecuteQueryOptions): QueryPromise<GetBeachDetailsData, GetBeachDetailsVariables>;
export function getBeachDetails(dc: DataConnect, vars: GetBeachDetailsVariables, options?: ExecuteQueryOptions): QueryPromise<GetBeachDetailsData, GetBeachDetailsVariables>;

interface GetUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserVariables): QueryRef<GetUserData, GetUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetUserVariables): QueryRef<GetUserData, GetUserVariables>;
  operationName: string;
}
export const getUserRef: GetUserRef;

export function getUser(vars: GetUserVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserData, GetUserVariables>;
export function getUser(dc: DataConnect, vars: GetUserVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserData, GetUserVariables>;

interface GetCommentsForBeachRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetCommentsForBeachVariables): QueryRef<GetCommentsForBeachData, GetCommentsForBeachVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetCommentsForBeachVariables): QueryRef<GetCommentsForBeachData, GetCommentsForBeachVariables>;
  operationName: string;
}
export const getCommentsForBeachRef: GetCommentsForBeachRef;

export function getCommentsForBeach(vars: GetCommentsForBeachVariables, options?: ExecuteQueryOptions): QueryPromise<GetCommentsForBeachData, GetCommentsForBeachVariables>;
export function getCommentsForBeach(dc: DataConnect, vars: GetCommentsForBeachVariables, options?: ExecuteQueryOptions): QueryPromise<GetCommentsForBeachData, GetCommentsForBeachVariables>;

