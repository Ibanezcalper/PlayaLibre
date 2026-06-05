# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.




### React
For each operation, there is a wrapper hook that can be used to call the operation.

Here are all of the hooks that get generated:
```ts
import { useCreateBeach, useCreateAccess, useCreateReport, useUpdateAccessCuration, useUpdateReportScore, useDeleteReport, useUpsertUser, useUpdateUserReputation, useCreateComment, useDeleteComment } from '@dataconnect/generated/react';
// The types of these hooks are available in react/index.d.ts

const { data, isPending, isSuccess, isError, error } = useCreateBeach(createBeachVars);

const { data, isPending, isSuccess, isError, error } = useCreateAccess(createAccessVars);

const { data, isPending, isSuccess, isError, error } = useCreateReport(createReportVars);

const { data, isPending, isSuccess, isError, error } = useUpdateAccessCuration(updateAccessCurationVars);

const { data, isPending, isSuccess, isError, error } = useUpdateReportScore(updateReportScoreVars);

const { data, isPending, isSuccess, isError, error } = useDeleteReport(deleteReportVars);

const { data, isPending, isSuccess, isError, error } = useUpsertUser(upsertUserVars);

const { data, isPending, isSuccess, isError, error } = useUpdateUserReputation(updateUserReputationVars);

const { data, isPending, isSuccess, isError, error } = useCreateComment(createCommentVars);

const { data, isPending, isSuccess, isError, error } = useDeleteComment(deleteCommentVars);

```

Here's an example from a different generated SDK:

```ts
import { useListAllMovies } from '@dataconnect/generated/react';

function MyComponent() {
  const { isLoading, data, error } = useListAllMovies();
  if(isLoading) {
    return <div>Loading...</div>
  }
  if(error) {
    return <div> An Error Occurred: {error} </div>
  }
}

// App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MyComponent from './my-component';

function App() {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>
    <MyComponent />
  </QueryClientProvider>
}
```



## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { createBeach, createAccess, createReport, updateAccessCuration, updateReportScore, deleteReport, upsertUser, updateUserReputation, createComment, deleteComment } from '@dataconnect/generated';


// Operation CreateBeach:  For variables, look at type CreateBeachVars in ../index.d.ts
const { data } = await CreateBeach(dataConnect, createBeachVars);

// Operation CreateAccess:  For variables, look at type CreateAccessVars in ../index.d.ts
const { data } = await CreateAccess(dataConnect, createAccessVars);

// Operation CreateReport:  For variables, look at type CreateReportVars in ../index.d.ts
const { data } = await CreateReport(dataConnect, createReportVars);

// Operation UpdateAccessCuration:  For variables, look at type UpdateAccessCurationVars in ../index.d.ts
const { data } = await UpdateAccessCuration(dataConnect, updateAccessCurationVars);

// Operation UpdateReportScore:  For variables, look at type UpdateReportScoreVars in ../index.d.ts
const { data } = await UpdateReportScore(dataConnect, updateReportScoreVars);

// Operation DeleteReport:  For variables, look at type DeleteReportVars in ../index.d.ts
const { data } = await DeleteReport(dataConnect, deleteReportVars);

// Operation UpsertUser:  For variables, look at type UpsertUserVars in ../index.d.ts
const { data } = await UpsertUser(dataConnect, upsertUserVars);

// Operation UpdateUserReputation:  For variables, look at type UpdateUserReputationVars in ../index.d.ts
const { data } = await UpdateUserReputation(dataConnect, updateUserReputationVars);

// Operation CreateComment:  For variables, look at type CreateCommentVars in ../index.d.ts
const { data } = await CreateComment(dataConnect, createCommentVars);

// Operation DeleteComment:  For variables, look at type DeleteCommentVars in ../index.d.ts
const { data } = await DeleteComment(dataConnect, deleteCommentVars);


```