# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `default-connector`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*ListBeaches*](#listbeaches)
  - [*GetBeachDetails*](#getbeachdetails)
  - [*GetUser*](#getuser)
  - [*GetCommentsForBeach*](#getcommentsforbeach)
- [**Mutations**](#mutations)
  - [*CreateBeach*](#createbeach)
  - [*CreateAccess*](#createaccess)
  - [*CreateReport*](#createreport)
  - [*UpdateAccessCuration*](#updateaccesscuration)
  - [*UpdateReportScore*](#updatereportscore)
  - [*DeleteReport*](#deletereport)
  - [*UpsertUser*](#upsertuser)
  - [*UpdateUserReputation*](#updateuserreputation)
  - [*CreateComment*](#createcomment)
  - [*DeleteComment*](#deletecomment)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `default-connector`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@playalibre/dataconnect-sdk` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@playalibre/dataconnect-sdk';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@playalibre/dataconnect-sdk';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `default-connector` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## ListBeaches
You can execute the `ListBeaches` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
listBeaches(): QueryPromise<ListBeachesData, undefined>;

interface ListBeachesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListBeachesData, undefined>;
}
export const listBeachesRef: ListBeachesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listBeaches(dc: DataConnect): QueryPromise<ListBeachesData, undefined>;

interface ListBeachesRef {
  ...
  (dc: DataConnect): QueryRef<ListBeachesData, undefined>;
}
export const listBeachesRef: ListBeachesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listBeachesRef:
```typescript
const name = listBeachesRef.operationName;
console.log(name);
```

### Variables
The `ListBeaches` query has no variables.
### Return Type
Recall that executing the `ListBeaches` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListBeachesData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListBeaches`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listBeaches } from '@playalibre/dataconnect-sdk';


// Call the `listBeaches()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listBeaches();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listBeaches(dataConnect);

console.log(data.beaches);

// Or, you can use the `Promise` API.
listBeaches().then((response) => {
  const data = response.data;
  console.log(data.beaches);
});
```

### Using `ListBeaches`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listBeachesRef } from '@playalibre/dataconnect-sdk';


// Call the `listBeachesRef()` function to get a reference to the query.
const ref = listBeachesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listBeachesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.beaches);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.beaches);
});
```

## GetBeachDetails
You can execute the `GetBeachDetails` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getBeachDetails(vars: GetBeachDetailsVariables): QueryPromise<GetBeachDetailsData, GetBeachDetailsVariables>;

interface GetBeachDetailsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetBeachDetailsVariables): QueryRef<GetBeachDetailsData, GetBeachDetailsVariables>;
}
export const getBeachDetailsRef: GetBeachDetailsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getBeachDetails(dc: DataConnect, vars: GetBeachDetailsVariables): QueryPromise<GetBeachDetailsData, GetBeachDetailsVariables>;

interface GetBeachDetailsRef {
  ...
  (dc: DataConnect, vars: GetBeachDetailsVariables): QueryRef<GetBeachDetailsData, GetBeachDetailsVariables>;
}
export const getBeachDetailsRef: GetBeachDetailsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getBeachDetailsRef:
```typescript
const name = getBeachDetailsRef.operationName;
console.log(name);
```

### Variables
The `GetBeachDetails` query requires an argument of type `GetBeachDetailsVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetBeachDetailsVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetBeachDetails` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetBeachDetailsData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetBeachDetails`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getBeachDetails, GetBeachDetailsVariables } from '@playalibre/dataconnect-sdk';

// The `GetBeachDetails` query requires an argument of type `GetBeachDetailsVariables`:
const getBeachDetailsVars: GetBeachDetailsVariables = {
  id: ..., 
};

// Call the `getBeachDetails()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getBeachDetails(getBeachDetailsVars);
// Variables can be defined inline as well.
const { data } = await getBeachDetails({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getBeachDetails(dataConnect, getBeachDetailsVars);

console.log(data.beach);
console.log(data.accesses);

// Or, you can use the `Promise` API.
getBeachDetails(getBeachDetailsVars).then((response) => {
  const data = response.data;
  console.log(data.beach);
  console.log(data.accesses);
});
```

### Using `GetBeachDetails`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getBeachDetailsRef, GetBeachDetailsVariables } from '@playalibre/dataconnect-sdk';

// The `GetBeachDetails` query requires an argument of type `GetBeachDetailsVariables`:
const getBeachDetailsVars: GetBeachDetailsVariables = {
  id: ..., 
};

// Call the `getBeachDetailsRef()` function to get a reference to the query.
const ref = getBeachDetailsRef(getBeachDetailsVars);
// Variables can be defined inline as well.
const ref = getBeachDetailsRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getBeachDetailsRef(dataConnect, getBeachDetailsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.beach);
console.log(data.accesses);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.beach);
  console.log(data.accesses);
});
```

## GetUser
You can execute the `GetUser` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getUser(vars: GetUserVariables): QueryPromise<GetUserData, GetUserVariables>;

interface GetUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserVariables): QueryRef<GetUserData, GetUserVariables>;
}
export const getUserRef: GetUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getUser(dc: DataConnect, vars: GetUserVariables): QueryPromise<GetUserData, GetUserVariables>;

interface GetUserRef {
  ...
  (dc: DataConnect, vars: GetUserVariables): QueryRef<GetUserData, GetUserVariables>;
}
export const getUserRef: GetUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getUserRef:
```typescript
const name = getUserRef.operationName;
console.log(name);
```

### Variables
The `GetUser` query requires an argument of type `GetUserVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetUserVariables {
  id: string;
}
```
### Return Type
Recall that executing the `GetUser` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetUserData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetUserData {
  user?: {
    id: string;
    username: string;
    avatarUrl?: string | null;
    reputation: number;
    createdAt: DateString;
  } & User_Key;
}
```
### Using `GetUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getUser, GetUserVariables } from '@playalibre/dataconnect-sdk';

// The `GetUser` query requires an argument of type `GetUserVariables`:
const getUserVars: GetUserVariables = {
  id: ..., 
};

// Call the `getUser()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getUser(getUserVars);
// Variables can be defined inline as well.
const { data } = await getUser({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getUser(dataConnect, getUserVars);

console.log(data.user);

// Or, you can use the `Promise` API.
getUser(getUserVars).then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

### Using `GetUser`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getUserRef, GetUserVariables } from '@playalibre/dataconnect-sdk';

// The `GetUser` query requires an argument of type `GetUserVariables`:
const getUserVars: GetUserVariables = {
  id: ..., 
};

// Call the `getUserRef()` function to get a reference to the query.
const ref = getUserRef(getUserVars);
// Variables can be defined inline as well.
const ref = getUserRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getUserRef(dataConnect, getUserVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.user);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

## GetCommentsForBeach
You can execute the `GetCommentsForBeach` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getCommentsForBeach(vars: GetCommentsForBeachVariables): QueryPromise<GetCommentsForBeachData, GetCommentsForBeachVariables>;

interface GetCommentsForBeachRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetCommentsForBeachVariables): QueryRef<GetCommentsForBeachData, GetCommentsForBeachVariables>;
}
export const getCommentsForBeachRef: GetCommentsForBeachRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getCommentsForBeach(dc: DataConnect, vars: GetCommentsForBeachVariables): QueryPromise<GetCommentsForBeachData, GetCommentsForBeachVariables>;

interface GetCommentsForBeachRef {
  ...
  (dc: DataConnect, vars: GetCommentsForBeachVariables): QueryRef<GetCommentsForBeachData, GetCommentsForBeachVariables>;
}
export const getCommentsForBeachRef: GetCommentsForBeachRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getCommentsForBeachRef:
```typescript
const name = getCommentsForBeachRef.operationName;
console.log(name);
```

### Variables
The `GetCommentsForBeach` query requires an argument of type `GetCommentsForBeachVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetCommentsForBeachVariables {
  beachId: UUIDString;
}
```
### Return Type
Recall that executing the `GetCommentsForBeach` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetCommentsForBeachData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetCommentsForBeach`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getCommentsForBeach, GetCommentsForBeachVariables } from '@playalibre/dataconnect-sdk';

// The `GetCommentsForBeach` query requires an argument of type `GetCommentsForBeachVariables`:
const getCommentsForBeachVars: GetCommentsForBeachVariables = {
  beachId: ..., 
};

// Call the `getCommentsForBeach()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getCommentsForBeach(getCommentsForBeachVars);
// Variables can be defined inline as well.
const { data } = await getCommentsForBeach({ beachId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getCommentsForBeach(dataConnect, getCommentsForBeachVars);

console.log(data.comments);

// Or, you can use the `Promise` API.
getCommentsForBeach(getCommentsForBeachVars).then((response) => {
  const data = response.data;
  console.log(data.comments);
});
```

### Using `GetCommentsForBeach`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getCommentsForBeachRef, GetCommentsForBeachVariables } from '@playalibre/dataconnect-sdk';

// The `GetCommentsForBeach` query requires an argument of type `GetCommentsForBeachVariables`:
const getCommentsForBeachVars: GetCommentsForBeachVariables = {
  beachId: ..., 
};

// Call the `getCommentsForBeachRef()` function to get a reference to the query.
const ref = getCommentsForBeachRef(getCommentsForBeachVars);
// Variables can be defined inline as well.
const ref = getCommentsForBeachRef({ beachId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getCommentsForBeachRef(dataConnect, getCommentsForBeachVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.comments);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.comments);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `default-connector` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateBeach
You can execute the `CreateBeach` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createBeach(vars: CreateBeachVariables): MutationPromise<CreateBeachData, CreateBeachVariables>;

interface CreateBeachRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateBeachVariables): MutationRef<CreateBeachData, CreateBeachVariables>;
}
export const createBeachRef: CreateBeachRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createBeach(dc: DataConnect, vars: CreateBeachVariables): MutationPromise<CreateBeachData, CreateBeachVariables>;

interface CreateBeachRef {
  ...
  (dc: DataConnect, vars: CreateBeachVariables): MutationRef<CreateBeachData, CreateBeachVariables>;
}
export const createBeachRef: CreateBeachRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createBeachRef:
```typescript
const name = createBeachRef.operationName;
console.log(name);
```

### Variables
The `CreateBeach` mutation requires an argument of type `CreateBeachVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateBeachVariables {
  name: string;
  state: string;
  latitude: number;
  longitude: number;
  boundaryPolygon?: unknown | null;
  images?: unknown | null;
  userId?: string | null;
}
```
### Return Type
Recall that executing the `CreateBeach` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateBeachData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateBeachData {
  beach_insert: Beach_Key;
}
```
### Using `CreateBeach`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createBeach, CreateBeachVariables } from '@playalibre/dataconnect-sdk';

// The `CreateBeach` mutation requires an argument of type `CreateBeachVariables`:
const createBeachVars: CreateBeachVariables = {
  name: ..., 
  state: ..., 
  latitude: ..., 
  longitude: ..., 
  boundaryPolygon: ..., // optional
  images: ..., // optional
  userId: ..., // optional
};

// Call the `createBeach()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createBeach(createBeachVars);
// Variables can be defined inline as well.
const { data } = await createBeach({ name: ..., state: ..., latitude: ..., longitude: ..., boundaryPolygon: ..., images: ..., userId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createBeach(dataConnect, createBeachVars);

console.log(data.beach_insert);

// Or, you can use the `Promise` API.
createBeach(createBeachVars).then((response) => {
  const data = response.data;
  console.log(data.beach_insert);
});
```

### Using `CreateBeach`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createBeachRef, CreateBeachVariables } from '@playalibre/dataconnect-sdk';

// The `CreateBeach` mutation requires an argument of type `CreateBeachVariables`:
const createBeachVars: CreateBeachVariables = {
  name: ..., 
  state: ..., 
  latitude: ..., 
  longitude: ..., 
  boundaryPolygon: ..., // optional
  images: ..., // optional
  userId: ..., // optional
};

// Call the `createBeachRef()` function to get a reference to the mutation.
const ref = createBeachRef(createBeachVars);
// Variables can be defined inline as well.
const ref = createBeachRef({ name: ..., state: ..., latitude: ..., longitude: ..., boundaryPolygon: ..., images: ..., userId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createBeachRef(dataConnect, createBeachVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.beach_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.beach_insert);
});
```

## CreateAccess
You can execute the `CreateAccess` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createAccess(vars: CreateAccessVariables): MutationPromise<CreateAccessData, CreateAccessVariables>;

interface CreateAccessRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateAccessVariables): MutationRef<CreateAccessData, CreateAccessVariables>;
}
export const createAccessRef: CreateAccessRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createAccess(dc: DataConnect, vars: CreateAccessVariables): MutationPromise<CreateAccessData, CreateAccessVariables>;

interface CreateAccessRef {
  ...
  (dc: DataConnect, vars: CreateAccessVariables): MutationRef<CreateAccessData, CreateAccessVariables>;
}
export const createAccessRef: CreateAccessRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createAccessRef:
```typescript
const name = createAccessRef.operationName;
console.log(name);
```

### Variables
The `CreateAccess` mutation requires an argument of type `CreateAccessVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
```
### Return Type
Recall that executing the `CreateAccess` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateAccessData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateAccessData {
  access_insert: Access_Key;
}
```
### Using `CreateAccess`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createAccess, CreateAccessVariables } from '@playalibre/dataconnect-sdk';

// The `CreateAccess` mutation requires an argument of type `CreateAccessVariables`:
const createAccessVars: CreateAccessVariables = {
  beachId: ..., 
  name: ..., 
  latitude: ..., 
  longitude: ..., 
  trailGeometry: ..., // optional
  images: ..., // optional
  pets: ..., 
  shade: ..., 
  showers: ..., 
  parking: ..., 
  security: ..., 
  ramps: ..., 
  wheelchair: ..., 
  parkingReserved: ..., 
  alcoholAllowed: ..., 
  campingAllowed: ..., 
  feeRequired: ..., 
  wifi: ..., 
  cellular4G: ..., 
  blockerType: ..., 
  blockerName: ..., // optional
  blockerDescription: ..., // optional
  illegalFeeAmount: ..., 
  userId: ..., // optional
};

// Call the `createAccess()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createAccess(createAccessVars);
// Variables can be defined inline as well.
const { data } = await createAccess({ beachId: ..., name: ..., latitude: ..., longitude: ..., trailGeometry: ..., images: ..., pets: ..., shade: ..., showers: ..., parking: ..., security: ..., ramps: ..., wheelchair: ..., parkingReserved: ..., alcoholAllowed: ..., campingAllowed: ..., feeRequired: ..., wifi: ..., cellular4G: ..., blockerType: ..., blockerName: ..., blockerDescription: ..., illegalFeeAmount: ..., userId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createAccess(dataConnect, createAccessVars);

console.log(data.access_insert);

// Or, you can use the `Promise` API.
createAccess(createAccessVars).then((response) => {
  const data = response.data;
  console.log(data.access_insert);
});
```

### Using `CreateAccess`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createAccessRef, CreateAccessVariables } from '@playalibre/dataconnect-sdk';

// The `CreateAccess` mutation requires an argument of type `CreateAccessVariables`:
const createAccessVars: CreateAccessVariables = {
  beachId: ..., 
  name: ..., 
  latitude: ..., 
  longitude: ..., 
  trailGeometry: ..., // optional
  images: ..., // optional
  pets: ..., 
  shade: ..., 
  showers: ..., 
  parking: ..., 
  security: ..., 
  ramps: ..., 
  wheelchair: ..., 
  parkingReserved: ..., 
  alcoholAllowed: ..., 
  campingAllowed: ..., 
  feeRequired: ..., 
  wifi: ..., 
  cellular4G: ..., 
  blockerType: ..., 
  blockerName: ..., // optional
  blockerDescription: ..., // optional
  illegalFeeAmount: ..., 
  userId: ..., // optional
};

// Call the `createAccessRef()` function to get a reference to the mutation.
const ref = createAccessRef(createAccessVars);
// Variables can be defined inline as well.
const ref = createAccessRef({ beachId: ..., name: ..., latitude: ..., longitude: ..., trailGeometry: ..., images: ..., pets: ..., shade: ..., showers: ..., parking: ..., security: ..., ramps: ..., wheelchair: ..., parkingReserved: ..., alcoholAllowed: ..., campingAllowed: ..., feeRequired: ..., wifi: ..., cellular4G: ..., blockerType: ..., blockerName: ..., blockerDescription: ..., illegalFeeAmount: ..., userId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createAccessRef(dataConnect, createAccessVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.access_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.access_insert);
});
```

## CreateReport
You can execute the `CreateReport` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createReport(vars: CreateReportVariables): MutationPromise<CreateReportData, CreateReportVariables>;

interface CreateReportRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateReportVariables): MutationRef<CreateReportData, CreateReportVariables>;
}
export const createReportRef: CreateReportRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createReport(dc: DataConnect, vars: CreateReportVariables): MutationPromise<CreateReportData, CreateReportVariables>;

interface CreateReportRef {
  ...
  (dc: DataConnect, vars: CreateReportVariables): MutationRef<CreateReportData, CreateReportVariables>;
}
export const createReportRef: CreateReportRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createReportRef:
```typescript
const name = createReportRef.operationName;
console.log(name);
```

### Variables
The `CreateReport` mutation requires an argument of type `CreateReportVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
```
### Return Type
Recall that executing the `CreateReport` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateReportData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateReportData {
  report_insert: Report_Key;
}
```
### Using `CreateReport`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createReport, CreateReportVariables } from '@playalibre/dataconnect-sdk';

// The `CreateReport` mutation requires an argument of type `CreateReportVariables`:
const createReportVars: CreateReportVariables = {
  accessId: ..., 
  reporterName: ..., 
  blockerType: ..., 
  blockerName: ..., 
  description: ..., 
  hasIllegalFee: ..., 
  feeAmount: ..., // optional
  userId: ..., // optional
};

// Call the `createReport()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createReport(createReportVars);
// Variables can be defined inline as well.
const { data } = await createReport({ accessId: ..., reporterName: ..., blockerType: ..., blockerName: ..., description: ..., hasIllegalFee: ..., feeAmount: ..., userId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createReport(dataConnect, createReportVars);

console.log(data.report_insert);

// Or, you can use the `Promise` API.
createReport(createReportVars).then((response) => {
  const data = response.data;
  console.log(data.report_insert);
});
```

### Using `CreateReport`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createReportRef, CreateReportVariables } from '@playalibre/dataconnect-sdk';

// The `CreateReport` mutation requires an argument of type `CreateReportVariables`:
const createReportVars: CreateReportVariables = {
  accessId: ..., 
  reporterName: ..., 
  blockerType: ..., 
  blockerName: ..., 
  description: ..., 
  hasIllegalFee: ..., 
  feeAmount: ..., // optional
  userId: ..., // optional
};

// Call the `createReportRef()` function to get a reference to the mutation.
const ref = createReportRef(createReportVars);
// Variables can be defined inline as well.
const ref = createReportRef({ accessId: ..., reporterName: ..., blockerType: ..., blockerName: ..., description: ..., hasIllegalFee: ..., feeAmount: ..., userId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createReportRef(dataConnect, createReportVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.report_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.report_insert);
});
```

## UpdateAccessCuration
You can execute the `UpdateAccessCuration` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
updateAccessCuration(vars: UpdateAccessCurationVariables): MutationPromise<UpdateAccessCurationData, UpdateAccessCurationVariables>;

interface UpdateAccessCurationRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateAccessCurationVariables): MutationRef<UpdateAccessCurationData, UpdateAccessCurationVariables>;
}
export const updateAccessCurationRef: UpdateAccessCurationRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateAccessCuration(dc: DataConnect, vars: UpdateAccessCurationVariables): MutationPromise<UpdateAccessCurationData, UpdateAccessCurationVariables>;

interface UpdateAccessCurationRef {
  ...
  (dc: DataConnect, vars: UpdateAccessCurationVariables): MutationRef<UpdateAccessCurationData, UpdateAccessCurationVariables>;
}
export const updateAccessCurationRef: UpdateAccessCurationRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateAccessCurationRef:
```typescript
const name = updateAccessCurationRef.operationName;
console.log(name);
```

### Variables
The `UpdateAccessCuration` mutation requires an argument of type `UpdateAccessCurationVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateAccessCurationVariables {
  id: UUIDString;
  blockerType: string;
  blockerName?: string | null;
  blockerDescription?: string | null;
  illegalFeeAmount: number;
  reputation: number;
  isPendingCuration: boolean;
}
```
### Return Type
Recall that executing the `UpdateAccessCuration` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateAccessCurationData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateAccessCurationData {
  access_update?: Access_Key | null;
}
```
### Using `UpdateAccessCuration`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateAccessCuration, UpdateAccessCurationVariables } from '@playalibre/dataconnect-sdk';

// The `UpdateAccessCuration` mutation requires an argument of type `UpdateAccessCurationVariables`:
const updateAccessCurationVars: UpdateAccessCurationVariables = {
  id: ..., 
  blockerType: ..., 
  blockerName: ..., // optional
  blockerDescription: ..., // optional
  illegalFeeAmount: ..., 
  reputation: ..., 
  isPendingCuration: ..., 
};

// Call the `updateAccessCuration()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateAccessCuration(updateAccessCurationVars);
// Variables can be defined inline as well.
const { data } = await updateAccessCuration({ id: ..., blockerType: ..., blockerName: ..., blockerDescription: ..., illegalFeeAmount: ..., reputation: ..., isPendingCuration: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateAccessCuration(dataConnect, updateAccessCurationVars);

console.log(data.access_update);

// Or, you can use the `Promise` API.
updateAccessCuration(updateAccessCurationVars).then((response) => {
  const data = response.data;
  console.log(data.access_update);
});
```

### Using `UpdateAccessCuration`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateAccessCurationRef, UpdateAccessCurationVariables } from '@playalibre/dataconnect-sdk';

// The `UpdateAccessCuration` mutation requires an argument of type `UpdateAccessCurationVariables`:
const updateAccessCurationVars: UpdateAccessCurationVariables = {
  id: ..., 
  blockerType: ..., 
  blockerName: ..., // optional
  blockerDescription: ..., // optional
  illegalFeeAmount: ..., 
  reputation: ..., 
  isPendingCuration: ..., 
};

// Call the `updateAccessCurationRef()` function to get a reference to the mutation.
const ref = updateAccessCurationRef(updateAccessCurationVars);
// Variables can be defined inline as well.
const ref = updateAccessCurationRef({ id: ..., blockerType: ..., blockerName: ..., blockerDescription: ..., illegalFeeAmount: ..., reputation: ..., isPendingCuration: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateAccessCurationRef(dataConnect, updateAccessCurationVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.access_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.access_update);
});
```

## UpdateReportScore
You can execute the `UpdateReportScore` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
updateReportScore(vars: UpdateReportScoreVariables): MutationPromise<UpdateReportScoreData, UpdateReportScoreVariables>;

interface UpdateReportScoreRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateReportScoreVariables): MutationRef<UpdateReportScoreData, UpdateReportScoreVariables>;
}
export const updateReportScoreRef: UpdateReportScoreRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateReportScore(dc: DataConnect, vars: UpdateReportScoreVariables): MutationPromise<UpdateReportScoreData, UpdateReportScoreVariables>;

interface UpdateReportScoreRef {
  ...
  (dc: DataConnect, vars: UpdateReportScoreVariables): MutationRef<UpdateReportScoreData, UpdateReportScoreVariables>;
}
export const updateReportScoreRef: UpdateReportScoreRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateReportScoreRef:
```typescript
const name = updateReportScoreRef.operationName;
console.log(name);
```

### Variables
The `UpdateReportScore` mutation requires an argument of type `UpdateReportScoreVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateReportScoreVariables {
  id: UUIDString;
  score: number;
}
```
### Return Type
Recall that executing the `UpdateReportScore` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateReportScoreData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateReportScoreData {
  report_update?: Report_Key | null;
}
```
### Using `UpdateReportScore`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateReportScore, UpdateReportScoreVariables } from '@playalibre/dataconnect-sdk';

// The `UpdateReportScore` mutation requires an argument of type `UpdateReportScoreVariables`:
const updateReportScoreVars: UpdateReportScoreVariables = {
  id: ..., 
  score: ..., 
};

// Call the `updateReportScore()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateReportScore(updateReportScoreVars);
// Variables can be defined inline as well.
const { data } = await updateReportScore({ id: ..., score: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateReportScore(dataConnect, updateReportScoreVars);

console.log(data.report_update);

// Or, you can use the `Promise` API.
updateReportScore(updateReportScoreVars).then((response) => {
  const data = response.data;
  console.log(data.report_update);
});
```

### Using `UpdateReportScore`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateReportScoreRef, UpdateReportScoreVariables } from '@playalibre/dataconnect-sdk';

// The `UpdateReportScore` mutation requires an argument of type `UpdateReportScoreVariables`:
const updateReportScoreVars: UpdateReportScoreVariables = {
  id: ..., 
  score: ..., 
};

// Call the `updateReportScoreRef()` function to get a reference to the mutation.
const ref = updateReportScoreRef(updateReportScoreVars);
// Variables can be defined inline as well.
const ref = updateReportScoreRef({ id: ..., score: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateReportScoreRef(dataConnect, updateReportScoreVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.report_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.report_update);
});
```

## DeleteReport
You can execute the `DeleteReport` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
deleteReport(vars: DeleteReportVariables): MutationPromise<DeleteReportData, DeleteReportVariables>;

interface DeleteReportRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteReportVariables): MutationRef<DeleteReportData, DeleteReportVariables>;
}
export const deleteReportRef: DeleteReportRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteReport(dc: DataConnect, vars: DeleteReportVariables): MutationPromise<DeleteReportData, DeleteReportVariables>;

interface DeleteReportRef {
  ...
  (dc: DataConnect, vars: DeleteReportVariables): MutationRef<DeleteReportData, DeleteReportVariables>;
}
export const deleteReportRef: DeleteReportRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteReportRef:
```typescript
const name = deleteReportRef.operationName;
console.log(name);
```

### Variables
The `DeleteReport` mutation requires an argument of type `DeleteReportVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteReportVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteReport` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteReportData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteReportData {
  report_delete?: Report_Key | null;
}
```
### Using `DeleteReport`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteReport, DeleteReportVariables } from '@playalibre/dataconnect-sdk';

// The `DeleteReport` mutation requires an argument of type `DeleteReportVariables`:
const deleteReportVars: DeleteReportVariables = {
  id: ..., 
};

// Call the `deleteReport()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteReport(deleteReportVars);
// Variables can be defined inline as well.
const { data } = await deleteReport({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteReport(dataConnect, deleteReportVars);

console.log(data.report_delete);

// Or, you can use the `Promise` API.
deleteReport(deleteReportVars).then((response) => {
  const data = response.data;
  console.log(data.report_delete);
});
```

### Using `DeleteReport`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteReportRef, DeleteReportVariables } from '@playalibre/dataconnect-sdk';

// The `DeleteReport` mutation requires an argument of type `DeleteReportVariables`:
const deleteReportVars: DeleteReportVariables = {
  id: ..., 
};

// Call the `deleteReportRef()` function to get a reference to the mutation.
const ref = deleteReportRef(deleteReportVars);
// Variables can be defined inline as well.
const ref = deleteReportRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteReportRef(dataConnect, deleteReportVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.report_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.report_delete);
});
```

## UpsertUser
You can execute the `UpsertUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
upsertUser(vars: UpsertUserVariables): MutationPromise<UpsertUserData, UpsertUserVariables>;

interface UpsertUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertUserVariables): MutationRef<UpsertUserData, UpsertUserVariables>;
}
export const upsertUserRef: UpsertUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertUser(dc: DataConnect, vars: UpsertUserVariables): MutationPromise<UpsertUserData, UpsertUserVariables>;

interface UpsertUserRef {
  ...
  (dc: DataConnect, vars: UpsertUserVariables): MutationRef<UpsertUserData, UpsertUserVariables>;
}
export const upsertUserRef: UpsertUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertUserRef:
```typescript
const name = upsertUserRef.operationName;
console.log(name);
```

### Variables
The `UpsertUser` mutation requires an argument of type `UpsertUserVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpsertUserVariables {
  id: string;
  username: string;
  avatarUrl?: string | null;
  reputation: number;
}
```
### Return Type
Recall that executing the `UpsertUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertUserData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertUserData {
  user_upsert: User_Key;
}
```
### Using `UpsertUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertUser, UpsertUserVariables } from '@playalibre/dataconnect-sdk';

// The `UpsertUser` mutation requires an argument of type `UpsertUserVariables`:
const upsertUserVars: UpsertUserVariables = {
  id: ..., 
  username: ..., 
  avatarUrl: ..., // optional
  reputation: ..., 
};

// Call the `upsertUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertUser(upsertUserVars);
// Variables can be defined inline as well.
const { data } = await upsertUser({ id: ..., username: ..., avatarUrl: ..., reputation: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertUser(dataConnect, upsertUserVars);

console.log(data.user_upsert);

// Or, you can use the `Promise` API.
upsertUser(upsertUserVars).then((response) => {
  const data = response.data;
  console.log(data.user_upsert);
});
```

### Using `UpsertUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertUserRef, UpsertUserVariables } from '@playalibre/dataconnect-sdk';

// The `UpsertUser` mutation requires an argument of type `UpsertUserVariables`:
const upsertUserVars: UpsertUserVariables = {
  id: ..., 
  username: ..., 
  avatarUrl: ..., // optional
  reputation: ..., 
};

// Call the `upsertUserRef()` function to get a reference to the mutation.
const ref = upsertUserRef(upsertUserVars);
// Variables can be defined inline as well.
const ref = upsertUserRef({ id: ..., username: ..., avatarUrl: ..., reputation: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertUserRef(dataConnect, upsertUserVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_upsert);
});
```

## UpdateUserReputation
You can execute the `UpdateUserReputation` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
updateUserReputation(vars: UpdateUserReputationVariables): MutationPromise<UpdateUserReputationData, UpdateUserReputationVariables>;

interface UpdateUserReputationRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateUserReputationVariables): MutationRef<UpdateUserReputationData, UpdateUserReputationVariables>;
}
export const updateUserReputationRef: UpdateUserReputationRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateUserReputation(dc: DataConnect, vars: UpdateUserReputationVariables): MutationPromise<UpdateUserReputationData, UpdateUserReputationVariables>;

interface UpdateUserReputationRef {
  ...
  (dc: DataConnect, vars: UpdateUserReputationVariables): MutationRef<UpdateUserReputationData, UpdateUserReputationVariables>;
}
export const updateUserReputationRef: UpdateUserReputationRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateUserReputationRef:
```typescript
const name = updateUserReputationRef.operationName;
console.log(name);
```

### Variables
The `UpdateUserReputation` mutation requires an argument of type `UpdateUserReputationVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateUserReputationVariables {
  id: string;
  reputation: number;
}
```
### Return Type
Recall that executing the `UpdateUserReputation` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateUserReputationData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateUserReputationData {
  user_update?: User_Key | null;
}
```
### Using `UpdateUserReputation`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateUserReputation, UpdateUserReputationVariables } from '@playalibre/dataconnect-sdk';

// The `UpdateUserReputation` mutation requires an argument of type `UpdateUserReputationVariables`:
const updateUserReputationVars: UpdateUserReputationVariables = {
  id: ..., 
  reputation: ..., 
};

// Call the `updateUserReputation()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateUserReputation(updateUserReputationVars);
// Variables can be defined inline as well.
const { data } = await updateUserReputation({ id: ..., reputation: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateUserReputation(dataConnect, updateUserReputationVars);

console.log(data.user_update);

// Or, you can use the `Promise` API.
updateUserReputation(updateUserReputationVars).then((response) => {
  const data = response.data;
  console.log(data.user_update);
});
```

### Using `UpdateUserReputation`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateUserReputationRef, UpdateUserReputationVariables } from '@playalibre/dataconnect-sdk';

// The `UpdateUserReputation` mutation requires an argument of type `UpdateUserReputationVariables`:
const updateUserReputationVars: UpdateUserReputationVariables = {
  id: ..., 
  reputation: ..., 
};

// Call the `updateUserReputationRef()` function to get a reference to the mutation.
const ref = updateUserReputationRef(updateUserReputationVars);
// Variables can be defined inline as well.
const ref = updateUserReputationRef({ id: ..., reputation: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateUserReputationRef(dataConnect, updateUserReputationVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_update);
});
```

## CreateComment
You can execute the `CreateComment` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createComment(vars: CreateCommentVariables): MutationPromise<CreateCommentData, CreateCommentVariables>;

interface CreateCommentRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateCommentVariables): MutationRef<CreateCommentData, CreateCommentVariables>;
}
export const createCommentRef: CreateCommentRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createComment(dc: DataConnect, vars: CreateCommentVariables): MutationPromise<CreateCommentData, CreateCommentVariables>;

interface CreateCommentRef {
  ...
  (dc: DataConnect, vars: CreateCommentVariables): MutationRef<CreateCommentData, CreateCommentVariables>;
}
export const createCommentRef: CreateCommentRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createCommentRef:
```typescript
const name = createCommentRef.operationName;
console.log(name);
```

### Variables
The `CreateComment` mutation requires an argument of type `CreateCommentVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateCommentVariables {
  beachId: UUIDString;
  userId: string;
  text: string;
}
```
### Return Type
Recall that executing the `CreateComment` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateCommentData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateCommentData {
  comment_insert: Comment_Key;
}
```
### Using `CreateComment`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createComment, CreateCommentVariables } from '@playalibre/dataconnect-sdk';

// The `CreateComment` mutation requires an argument of type `CreateCommentVariables`:
const createCommentVars: CreateCommentVariables = {
  beachId: ..., 
  userId: ..., 
  text: ..., 
};

// Call the `createComment()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createComment(createCommentVars);
// Variables can be defined inline as well.
const { data } = await createComment({ beachId: ..., userId: ..., text: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createComment(dataConnect, createCommentVars);

console.log(data.comment_insert);

// Or, you can use the `Promise` API.
createComment(createCommentVars).then((response) => {
  const data = response.data;
  console.log(data.comment_insert);
});
```

### Using `CreateComment`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createCommentRef, CreateCommentVariables } from '@playalibre/dataconnect-sdk';

// The `CreateComment` mutation requires an argument of type `CreateCommentVariables`:
const createCommentVars: CreateCommentVariables = {
  beachId: ..., 
  userId: ..., 
  text: ..., 
};

// Call the `createCommentRef()` function to get a reference to the mutation.
const ref = createCommentRef(createCommentVars);
// Variables can be defined inline as well.
const ref = createCommentRef({ beachId: ..., userId: ..., text: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createCommentRef(dataConnect, createCommentVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.comment_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.comment_insert);
});
```

## DeleteComment
You can execute the `DeleteComment` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
deleteComment(vars: DeleteCommentVariables): MutationPromise<DeleteCommentData, DeleteCommentVariables>;

interface DeleteCommentRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteCommentVariables): MutationRef<DeleteCommentData, DeleteCommentVariables>;
}
export const deleteCommentRef: DeleteCommentRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteComment(dc: DataConnect, vars: DeleteCommentVariables): MutationPromise<DeleteCommentData, DeleteCommentVariables>;

interface DeleteCommentRef {
  ...
  (dc: DataConnect, vars: DeleteCommentVariables): MutationRef<DeleteCommentData, DeleteCommentVariables>;
}
export const deleteCommentRef: DeleteCommentRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteCommentRef:
```typescript
const name = deleteCommentRef.operationName;
console.log(name);
```

### Variables
The `DeleteComment` mutation requires an argument of type `DeleteCommentVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteCommentVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteComment` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteCommentData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteCommentData {
  comment_delete?: Comment_Key | null;
}
```
### Using `DeleteComment`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteComment, DeleteCommentVariables } from '@playalibre/dataconnect-sdk';

// The `DeleteComment` mutation requires an argument of type `DeleteCommentVariables`:
const deleteCommentVars: DeleteCommentVariables = {
  id: ..., 
};

// Call the `deleteComment()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteComment(deleteCommentVars);
// Variables can be defined inline as well.
const { data } = await deleteComment({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteComment(dataConnect, deleteCommentVars);

console.log(data.comment_delete);

// Or, you can use the `Promise` API.
deleteComment(deleteCommentVars).then((response) => {
  const data = response.data;
  console.log(data.comment_delete);
});
```

### Using `DeleteComment`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteCommentRef, DeleteCommentVariables } from '@playalibre/dataconnect-sdk';

// The `DeleteComment` mutation requires an argument of type `DeleteCommentVariables`:
const deleteCommentVars: DeleteCommentVariables = {
  id: ..., 
};

// Call the `deleteCommentRef()` function to get a reference to the mutation.
const ref = deleteCommentRef(deleteCommentVars);
// Variables can be defined inline as well.
const ref = deleteCommentRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteCommentRef(dataConnect, deleteCommentVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.comment_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.comment_delete);
});
```

