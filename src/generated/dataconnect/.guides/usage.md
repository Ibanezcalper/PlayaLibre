# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.





## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { createBeach, createAccess, createReport, updateAccessCuration, updateReportScore, deleteReport, upsertUser, updateUserReputation, createComment, deleteComment } from '@playalibre/dataconnect-sdk';


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