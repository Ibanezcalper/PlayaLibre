import { CreateBeachData, CreateBeachVariables, CreateAccessData, CreateAccessVariables, CreateReportData, CreateReportVariables, UpdateAccessCurationData, UpdateAccessCurationVariables, UpdateReportScoreData, UpdateReportScoreVariables, DeleteReportData, DeleteReportVariables, UpsertUserData, UpsertUserVariables, UpdateUserReputationData, UpdateUserReputationVariables, CreateCommentData, CreateCommentVariables, DeleteCommentData, DeleteCommentVariables, ListBeachesData, GetBeachDetailsData, GetBeachDetailsVariables, GetUserData, GetUserVariables, GetCommentsForBeachData, GetCommentsForBeachVariables } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateBeach(options?: useDataConnectMutationOptions<CreateBeachData, FirebaseError, CreateBeachVariables>): UseDataConnectMutationResult<CreateBeachData, CreateBeachVariables>;
export function useCreateBeach(dc: DataConnect, options?: useDataConnectMutationOptions<CreateBeachData, FirebaseError, CreateBeachVariables>): UseDataConnectMutationResult<CreateBeachData, CreateBeachVariables>;

export function useCreateAccess(options?: useDataConnectMutationOptions<CreateAccessData, FirebaseError, CreateAccessVariables>): UseDataConnectMutationResult<CreateAccessData, CreateAccessVariables>;
export function useCreateAccess(dc: DataConnect, options?: useDataConnectMutationOptions<CreateAccessData, FirebaseError, CreateAccessVariables>): UseDataConnectMutationResult<CreateAccessData, CreateAccessVariables>;

export function useCreateReport(options?: useDataConnectMutationOptions<CreateReportData, FirebaseError, CreateReportVariables>): UseDataConnectMutationResult<CreateReportData, CreateReportVariables>;
export function useCreateReport(dc: DataConnect, options?: useDataConnectMutationOptions<CreateReportData, FirebaseError, CreateReportVariables>): UseDataConnectMutationResult<CreateReportData, CreateReportVariables>;

export function useUpdateAccessCuration(options?: useDataConnectMutationOptions<UpdateAccessCurationData, FirebaseError, UpdateAccessCurationVariables>): UseDataConnectMutationResult<UpdateAccessCurationData, UpdateAccessCurationVariables>;
export function useUpdateAccessCuration(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateAccessCurationData, FirebaseError, UpdateAccessCurationVariables>): UseDataConnectMutationResult<UpdateAccessCurationData, UpdateAccessCurationVariables>;

export function useUpdateReportScore(options?: useDataConnectMutationOptions<UpdateReportScoreData, FirebaseError, UpdateReportScoreVariables>): UseDataConnectMutationResult<UpdateReportScoreData, UpdateReportScoreVariables>;
export function useUpdateReportScore(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateReportScoreData, FirebaseError, UpdateReportScoreVariables>): UseDataConnectMutationResult<UpdateReportScoreData, UpdateReportScoreVariables>;

export function useDeleteReport(options?: useDataConnectMutationOptions<DeleteReportData, FirebaseError, DeleteReportVariables>): UseDataConnectMutationResult<DeleteReportData, DeleteReportVariables>;
export function useDeleteReport(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteReportData, FirebaseError, DeleteReportVariables>): UseDataConnectMutationResult<DeleteReportData, DeleteReportVariables>;

export function useUpsertUser(options?: useDataConnectMutationOptions<UpsertUserData, FirebaseError, UpsertUserVariables>): UseDataConnectMutationResult<UpsertUserData, UpsertUserVariables>;
export function useUpsertUser(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertUserData, FirebaseError, UpsertUserVariables>): UseDataConnectMutationResult<UpsertUserData, UpsertUserVariables>;

export function useUpdateUserReputation(options?: useDataConnectMutationOptions<UpdateUserReputationData, FirebaseError, UpdateUserReputationVariables>): UseDataConnectMutationResult<UpdateUserReputationData, UpdateUserReputationVariables>;
export function useUpdateUserReputation(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateUserReputationData, FirebaseError, UpdateUserReputationVariables>): UseDataConnectMutationResult<UpdateUserReputationData, UpdateUserReputationVariables>;

export function useCreateComment(options?: useDataConnectMutationOptions<CreateCommentData, FirebaseError, CreateCommentVariables>): UseDataConnectMutationResult<CreateCommentData, CreateCommentVariables>;
export function useCreateComment(dc: DataConnect, options?: useDataConnectMutationOptions<CreateCommentData, FirebaseError, CreateCommentVariables>): UseDataConnectMutationResult<CreateCommentData, CreateCommentVariables>;

export function useDeleteComment(options?: useDataConnectMutationOptions<DeleteCommentData, FirebaseError, DeleteCommentVariables>): UseDataConnectMutationResult<DeleteCommentData, DeleteCommentVariables>;
export function useDeleteComment(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteCommentData, FirebaseError, DeleteCommentVariables>): UseDataConnectMutationResult<DeleteCommentData, DeleteCommentVariables>;

export function useListBeaches(options?: useDataConnectQueryOptions<ListBeachesData>): UseDataConnectQueryResult<ListBeachesData, undefined>;
export function useListBeaches(dc: DataConnect, options?: useDataConnectQueryOptions<ListBeachesData>): UseDataConnectQueryResult<ListBeachesData, undefined>;

export function useGetBeachDetails(vars: GetBeachDetailsVariables, options?: useDataConnectQueryOptions<GetBeachDetailsData>): UseDataConnectQueryResult<GetBeachDetailsData, GetBeachDetailsVariables>;
export function useGetBeachDetails(dc: DataConnect, vars: GetBeachDetailsVariables, options?: useDataConnectQueryOptions<GetBeachDetailsData>): UseDataConnectQueryResult<GetBeachDetailsData, GetBeachDetailsVariables>;

export function useGetUser(vars: GetUserVariables, options?: useDataConnectQueryOptions<GetUserData>): UseDataConnectQueryResult<GetUserData, GetUserVariables>;
export function useGetUser(dc: DataConnect, vars: GetUserVariables, options?: useDataConnectQueryOptions<GetUserData>): UseDataConnectQueryResult<GetUserData, GetUserVariables>;

export function useGetCommentsForBeach(vars: GetCommentsForBeachVariables, options?: useDataConnectQueryOptions<GetCommentsForBeachData>): UseDataConnectQueryResult<GetCommentsForBeachData, GetCommentsForBeachVariables>;
export function useGetCommentsForBeach(dc: DataConnect, vars: GetCommentsForBeachVariables, options?: useDataConnectQueryOptions<GetCommentsForBeachData>): UseDataConnectQueryResult<GetCommentsForBeachData, GetCommentsForBeachVariables>;
