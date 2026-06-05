# Generated React README
This README will guide you through the process of using the generated React SDK package for the connector `default-connector`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `JavaScript README`, you can find it at [`dataconnect-generated/README.md`](../README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

You can use this generated SDK by importing from the package `@dataconnect/generated/react` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#react).

# Table of Contents
- [**Overview**](#generated-react-readme)
- [**TanStack Query Firebase & TanStack React Query**](#tanstack-query-firebase-tanstack-react-query)
  - [*Package Installation*](#installing-tanstack-query-firebase-and-tanstack-react-query-packages)
  - [*Configuring TanStack Query*](#configuring-tanstack-query)
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

# TanStack Query Firebase & TanStack React Query
This SDK provides [React](https://react.dev/) hooks generated specific to your application, for the operations found in the connector `default-connector`. These hooks are generated using [TanStack Query Firebase](https://react-query-firebase.invertase.dev/) by our partners at Invertase, a library built on top of [TanStack React Query v5](https://tanstack.com/query/v5/docs/framework/react/overview).

***You do not need to be familiar with Tanstack Query or Tanstack Query Firebase to use this SDK.*** However, you may find it useful to learn more about them, as they will empower you as a user of this Generated React SDK.

## Installing TanStack Query Firebase and TanStack React Query Packages
In order to use the React generated SDK, you must install the `TanStack React Query` and `TanStack Query Firebase` packages.
```bash
npm i --save @tanstack/react-query @tanstack-query-firebase/react
```
```bash
npm i --save firebase@latest # Note: React has a peer dependency on ^11.3.0
```

You can also follow the installation instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#tanstack-install), or the [TanStack Query Firebase documentation](https://react-query-firebase.invertase.dev/react) and [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/installation).

## Configuring TanStack Query
In order to use the React generated SDK in your application, you must wrap your application's component tree in a `QueryClientProvider` component from TanStack React Query. None of your generated React SDK hooks will work without this provider.

```javascript
import { QueryClientProvider } from '@tanstack/react-query';

// Create a TanStack Query client instance
const queryClient = new QueryClient()

function App() {
  return (
    // Provide the client to your App
    <QueryClientProvider client={queryClient}>
      <MyApplication />
    </QueryClientProvider>
  )
}
```

To learn more about `QueryClientProvider`, see the [TanStack React Query documentation](https://tanstack.com/query/latest/docs/framework/react/quick-start) and the [TanStack Query Firebase documentation](https://invertase.docs.page/tanstack-query-firebase/react#usage).

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `default-connector`.

You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#emulator-react-angular).

```javascript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) using the hooks provided from your generated React SDK.

# Queries

The React generated SDK provides Query hook functions that call and return [`useDataConnectQuery`](https://react-query-firebase.invertase.dev/react/data-connect/querying) hooks from TanStack Query Firebase.

Calling these hook functions will return a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and the most recent data returned by the Query, among other things. To learn more about these hooks and how to use them, see the [TanStack Query Firebase documentation](https://react-query-firebase.invertase.dev/react/data-connect/querying).

TanStack React Query caches the results of your Queries, so using the same Query hook function in multiple places in your application allows the entire application to automatically see updates to that Query's data.

Query hooks execute their Queries automatically when called, and periodically refresh, unless you change the `queryOptions` for the Query. To learn how to stop a Query from automatically executing, including how to make a query "lazy", see the [TanStack React Query documentation](https://tanstack.com/query/latest/docs/framework/react/guides/disabling-queries).

To learn more about TanStack React Query's Queries, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/guides/queries).

## Using Query Hooks
Here's a general overview of how to use the generated Query hooks in your code:

- If the Query has no variables, the Query hook function does not require arguments.
- If the Query has any required variables, the Query hook function will require at least one argument: an object that contains all the required variables for the Query.
- If the Query has some required and some optional variables, only required variables are necessary in the variables argument object, and optional variables may be provided as well.
- If all of the Query's variables are optional, the Query hook function does not require any arguments.
- Query hook functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.
- Query hooks functions can be called with or without passing in an `options` argument of type `useDataConnectQueryOptions`. To learn more about the `options` argument, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/guides/query-options).
  - ***Special case:***  If the Query has all optional variables and you would like to provide an `options` argument to the Query hook function without providing any variables, you must pass `undefined` where you would normally pass the Query's variables, and then may provide the `options` argument.

Below are examples of how to use the `default-connector` connector's generated Query hook functions to execute each Query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#operations-react-angular).

## ListBeaches
You can execute the `ListBeaches` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useListBeaches(dc: DataConnect, options?: useDataConnectQueryOptions<ListBeachesData>): UseDataConnectQueryResult<ListBeachesData, undefined>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListBeaches(options?: useDataConnectQueryOptions<ListBeachesData>): UseDataConnectQueryResult<ListBeachesData, undefined>;
```

### Variables
The `ListBeaches` Query has no variables.
### Return Type
Recall that calling the `ListBeaches` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `ListBeaches` Query is of type `ListBeachesData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `ListBeaches`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';
import { useListBeaches } from '@dataconnect/generated/react'

export default function ListBeachesComponent() {
  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListBeaches();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListBeaches(dataConnect);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListBeaches(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListBeaches(dataConnect, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.beaches);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## GetBeachDetails
You can execute the `GetBeachDetails` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useGetBeachDetails(dc: DataConnect, vars: GetBeachDetailsVariables, options?: useDataConnectQueryOptions<GetBeachDetailsData>): UseDataConnectQueryResult<GetBeachDetailsData, GetBeachDetailsVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useGetBeachDetails(vars: GetBeachDetailsVariables, options?: useDataConnectQueryOptions<GetBeachDetailsData>): UseDataConnectQueryResult<GetBeachDetailsData, GetBeachDetailsVariables>;
```

### Variables
The `GetBeachDetails` Query requires an argument of type `GetBeachDetailsVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface GetBeachDetailsVariables {
  id: UUIDString;
}
```
### Return Type
Recall that calling the `GetBeachDetails` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `GetBeachDetails` Query is of type `GetBeachDetailsData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `GetBeachDetails`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, GetBeachDetailsVariables } from '@dataconnect/generated';
import { useGetBeachDetails } from '@dataconnect/generated/react'

export default function GetBeachDetailsComponent() {
  // The `useGetBeachDetails` Query hook requires an argument of type `GetBeachDetailsVariables`:
  const getBeachDetailsVars: GetBeachDetailsVariables = {
    id: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useGetBeachDetails(getBeachDetailsVars);
  // Variables can be defined inline as well.
  const query = useGetBeachDetails({ id: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useGetBeachDetails(dataConnect, getBeachDetailsVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useGetBeachDetails(getBeachDetailsVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useGetBeachDetails(dataConnect, getBeachDetailsVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.beach);
    console.log(query.data.accesses);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## GetUser
You can execute the `GetUser` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useGetUser(dc: DataConnect, vars: GetUserVariables, options?: useDataConnectQueryOptions<GetUserData>): UseDataConnectQueryResult<GetUserData, GetUserVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useGetUser(vars: GetUserVariables, options?: useDataConnectQueryOptions<GetUserData>): UseDataConnectQueryResult<GetUserData, GetUserVariables>;
```

### Variables
The `GetUser` Query requires an argument of type `GetUserVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface GetUserVariables {
  id: string;
}
```
### Return Type
Recall that calling the `GetUser` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `GetUser` Query is of type `GetUserData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `GetUser`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, GetUserVariables } from '@dataconnect/generated';
import { useGetUser } from '@dataconnect/generated/react'

export default function GetUserComponent() {
  // The `useGetUser` Query hook requires an argument of type `GetUserVariables`:
  const getUserVars: GetUserVariables = {
    id: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useGetUser(getUserVars);
  // Variables can be defined inline as well.
  const query = useGetUser({ id: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useGetUser(dataConnect, getUserVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useGetUser(getUserVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useGetUser(dataConnect, getUserVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.user);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## GetCommentsForBeach
You can execute the `GetCommentsForBeach` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useGetCommentsForBeach(dc: DataConnect, vars: GetCommentsForBeachVariables, options?: useDataConnectQueryOptions<GetCommentsForBeachData>): UseDataConnectQueryResult<GetCommentsForBeachData, GetCommentsForBeachVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useGetCommentsForBeach(vars: GetCommentsForBeachVariables, options?: useDataConnectQueryOptions<GetCommentsForBeachData>): UseDataConnectQueryResult<GetCommentsForBeachData, GetCommentsForBeachVariables>;
```

### Variables
The `GetCommentsForBeach` Query requires an argument of type `GetCommentsForBeachVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface GetCommentsForBeachVariables {
  beachId: UUIDString;
}
```
### Return Type
Recall that calling the `GetCommentsForBeach` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `GetCommentsForBeach` Query is of type `GetCommentsForBeachData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `GetCommentsForBeach`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, GetCommentsForBeachVariables } from '@dataconnect/generated';
import { useGetCommentsForBeach } from '@dataconnect/generated/react'

export default function GetCommentsForBeachComponent() {
  // The `useGetCommentsForBeach` Query hook requires an argument of type `GetCommentsForBeachVariables`:
  const getCommentsForBeachVars: GetCommentsForBeachVariables = {
    beachId: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useGetCommentsForBeach(getCommentsForBeachVars);
  // Variables can be defined inline as well.
  const query = useGetCommentsForBeach({ beachId: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useGetCommentsForBeach(dataConnect, getCommentsForBeachVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useGetCommentsForBeach(getCommentsForBeachVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useGetCommentsForBeach(dataConnect, getCommentsForBeachVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.comments);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

# Mutations

The React generated SDK provides Mutations hook functions that call and return [`useDataConnectMutation`](https://react-query-firebase.invertase.dev/react/data-connect/mutations) hooks from TanStack Query Firebase.

Calling these hook functions will return a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, and the most recent data returned by the Mutation, among other things. To learn more about these hooks and how to use them, see the [TanStack Query Firebase documentation](https://react-query-firebase.invertase.dev/react/data-connect/mutations).

Mutation hooks do not execute their Mutations automatically when called. Rather, after calling the Mutation hook function and getting a `UseMutationResult` object, you must call the `UseMutationResult.mutate()` function to execute the Mutation.

To learn more about TanStack React Query's Mutations, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/guides/mutations).

## Using Mutation Hooks
Here's a general overview of how to use the generated Mutation hooks in your code:

- Mutation hook functions are not called with the arguments to the Mutation. Instead, arguments are passed to `UseMutationResult.mutate()`.
- If the Mutation has no variables, the `mutate()` function does not require arguments.
- If the Mutation has any required variables, the `mutate()` function will require at least one argument: an object that contains all the required variables for the Mutation.
- If the Mutation has some required and some optional variables, only required variables are necessary in the variables argument object, and optional variables may be provided as well.
- If all of the Mutation's variables are optional, the Mutation hook function does not require any arguments.
- Mutation hook functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.
- Mutation hooks also accept an `options` argument of type `useDataConnectMutationOptions`. To learn more about the `options` argument, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/guides/mutations#mutation-side-effects).
  - `UseMutationResult.mutate()` also accepts an `options` argument of type `useDataConnectMutationOptions`.
  - ***Special case:*** If the Mutation has no arguments (or all optional arguments and you wish to provide none), and you want to pass `options` to `UseMutationResult.mutate()`, you must pass `undefined` where you would normally pass the Mutation's arguments, and then may provide the options argument.

Below are examples of how to use the `default-connector` connector's generated Mutation hook functions to execute each Mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#operations-react-angular).

## CreateBeach
You can execute the `CreateBeach` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useCreateBeach(options?: useDataConnectMutationOptions<CreateBeachData, FirebaseError, CreateBeachVariables>): UseDataConnectMutationResult<CreateBeachData, CreateBeachVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useCreateBeach(dc: DataConnect, options?: useDataConnectMutationOptions<CreateBeachData, FirebaseError, CreateBeachVariables>): UseDataConnectMutationResult<CreateBeachData, CreateBeachVariables>;
```

### Variables
The `CreateBeach` Mutation requires an argument of type `CreateBeachVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
Recall that calling the `CreateBeach` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `CreateBeach` Mutation is of type `CreateBeachData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface CreateBeachData {
  beach_insert: Beach_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `CreateBeach`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, CreateBeachVariables } from '@dataconnect/generated';
import { useCreateBeach } from '@dataconnect/generated/react'

export default function CreateBeachComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useCreateBeach();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useCreateBeach(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateBeach(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateBeach(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useCreateBeach` Mutation requires an argument of type `CreateBeachVariables`:
  const createBeachVars: CreateBeachVariables = {
    name: ..., 
    state: ..., 
    latitude: ..., 
    longitude: ..., 
    boundaryPolygon: ..., // optional
    images: ..., // optional
    userId: ..., // optional
  };
  mutation.mutate(createBeachVars);
  // Variables can be defined inline as well.
  mutation.mutate({ name: ..., state: ..., latitude: ..., longitude: ..., boundaryPolygon: ..., images: ..., userId: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(createBeachVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.beach_insert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## CreateAccess
You can execute the `CreateAccess` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useCreateAccess(options?: useDataConnectMutationOptions<CreateAccessData, FirebaseError, CreateAccessVariables>): UseDataConnectMutationResult<CreateAccessData, CreateAccessVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useCreateAccess(dc: DataConnect, options?: useDataConnectMutationOptions<CreateAccessData, FirebaseError, CreateAccessVariables>): UseDataConnectMutationResult<CreateAccessData, CreateAccessVariables>;
```

### Variables
The `CreateAccess` Mutation requires an argument of type `CreateAccessVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
Recall that calling the `CreateAccess` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `CreateAccess` Mutation is of type `CreateAccessData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface CreateAccessData {
  access_insert: Access_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `CreateAccess`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, CreateAccessVariables } from '@dataconnect/generated';
import { useCreateAccess } from '@dataconnect/generated/react'

export default function CreateAccessComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useCreateAccess();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useCreateAccess(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateAccess(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateAccess(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useCreateAccess` Mutation requires an argument of type `CreateAccessVariables`:
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
  mutation.mutate(createAccessVars);
  // Variables can be defined inline as well.
  mutation.mutate({ beachId: ..., name: ..., latitude: ..., longitude: ..., trailGeometry: ..., images: ..., pets: ..., shade: ..., showers: ..., parking: ..., security: ..., ramps: ..., wheelchair: ..., parkingReserved: ..., alcoholAllowed: ..., campingAllowed: ..., feeRequired: ..., wifi: ..., cellular4G: ..., blockerType: ..., blockerName: ..., blockerDescription: ..., illegalFeeAmount: ..., userId: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(createAccessVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.access_insert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## CreateReport
You can execute the `CreateReport` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useCreateReport(options?: useDataConnectMutationOptions<CreateReportData, FirebaseError, CreateReportVariables>): UseDataConnectMutationResult<CreateReportData, CreateReportVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useCreateReport(dc: DataConnect, options?: useDataConnectMutationOptions<CreateReportData, FirebaseError, CreateReportVariables>): UseDataConnectMutationResult<CreateReportData, CreateReportVariables>;
```

### Variables
The `CreateReport` Mutation requires an argument of type `CreateReportVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
Recall that calling the `CreateReport` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `CreateReport` Mutation is of type `CreateReportData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface CreateReportData {
  report_insert: Report_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `CreateReport`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, CreateReportVariables } from '@dataconnect/generated';
import { useCreateReport } from '@dataconnect/generated/react'

export default function CreateReportComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useCreateReport();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useCreateReport(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateReport(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateReport(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useCreateReport` Mutation requires an argument of type `CreateReportVariables`:
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
  mutation.mutate(createReportVars);
  // Variables can be defined inline as well.
  mutation.mutate({ accessId: ..., reporterName: ..., blockerType: ..., blockerName: ..., description: ..., hasIllegalFee: ..., feeAmount: ..., userId: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(createReportVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.report_insert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## UpdateAccessCuration
You can execute the `UpdateAccessCuration` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpdateAccessCuration(options?: useDataConnectMutationOptions<UpdateAccessCurationData, FirebaseError, UpdateAccessCurationVariables>): UseDataConnectMutationResult<UpdateAccessCurationData, UpdateAccessCurationVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpdateAccessCuration(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateAccessCurationData, FirebaseError, UpdateAccessCurationVariables>): UseDataConnectMutationResult<UpdateAccessCurationData, UpdateAccessCurationVariables>;
```

### Variables
The `UpdateAccessCuration` Mutation requires an argument of type `UpdateAccessCurationVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
Recall that calling the `UpdateAccessCuration` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpdateAccessCuration` Mutation is of type `UpdateAccessCurationData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpdateAccessCurationData {
  access_update?: Access_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpdateAccessCuration`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpdateAccessCurationVariables } from '@dataconnect/generated';
import { useUpdateAccessCuration } from '@dataconnect/generated/react'

export default function UpdateAccessCurationComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpdateAccessCuration();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpdateAccessCuration(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateAccessCuration(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateAccessCuration(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpdateAccessCuration` Mutation requires an argument of type `UpdateAccessCurationVariables`:
  const updateAccessCurationVars: UpdateAccessCurationVariables = {
    id: ..., 
    blockerType: ..., 
    blockerName: ..., // optional
    blockerDescription: ..., // optional
    illegalFeeAmount: ..., 
    reputation: ..., 
    isPendingCuration: ..., 
  };
  mutation.mutate(updateAccessCurationVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., blockerType: ..., blockerName: ..., blockerDescription: ..., illegalFeeAmount: ..., reputation: ..., isPendingCuration: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(updateAccessCurationVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.access_update);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## UpdateReportScore
You can execute the `UpdateReportScore` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpdateReportScore(options?: useDataConnectMutationOptions<UpdateReportScoreData, FirebaseError, UpdateReportScoreVariables>): UseDataConnectMutationResult<UpdateReportScoreData, UpdateReportScoreVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpdateReportScore(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateReportScoreData, FirebaseError, UpdateReportScoreVariables>): UseDataConnectMutationResult<UpdateReportScoreData, UpdateReportScoreVariables>;
```

### Variables
The `UpdateReportScore` Mutation requires an argument of type `UpdateReportScoreVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface UpdateReportScoreVariables {
  id: UUIDString;
  score: number;
}
```
### Return Type
Recall that calling the `UpdateReportScore` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpdateReportScore` Mutation is of type `UpdateReportScoreData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpdateReportScoreData {
  report_update?: Report_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpdateReportScore`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpdateReportScoreVariables } from '@dataconnect/generated';
import { useUpdateReportScore } from '@dataconnect/generated/react'

export default function UpdateReportScoreComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpdateReportScore();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpdateReportScore(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateReportScore(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateReportScore(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpdateReportScore` Mutation requires an argument of type `UpdateReportScoreVariables`:
  const updateReportScoreVars: UpdateReportScoreVariables = {
    id: ..., 
    score: ..., 
  };
  mutation.mutate(updateReportScoreVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., score: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(updateReportScoreVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.report_update);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## DeleteReport
You can execute the `DeleteReport` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useDeleteReport(options?: useDataConnectMutationOptions<DeleteReportData, FirebaseError, DeleteReportVariables>): UseDataConnectMutationResult<DeleteReportData, DeleteReportVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useDeleteReport(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteReportData, FirebaseError, DeleteReportVariables>): UseDataConnectMutationResult<DeleteReportData, DeleteReportVariables>;
```

### Variables
The `DeleteReport` Mutation requires an argument of type `DeleteReportVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface DeleteReportVariables {
  id: UUIDString;
}
```
### Return Type
Recall that calling the `DeleteReport` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `DeleteReport` Mutation is of type `DeleteReportData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface DeleteReportData {
  report_delete?: Report_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `DeleteReport`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, DeleteReportVariables } from '@dataconnect/generated';
import { useDeleteReport } from '@dataconnect/generated/react'

export default function DeleteReportComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useDeleteReport();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useDeleteReport(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteReport(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteReport(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useDeleteReport` Mutation requires an argument of type `DeleteReportVariables`:
  const deleteReportVars: DeleteReportVariables = {
    id: ..., 
  };
  mutation.mutate(deleteReportVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(deleteReportVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.report_delete);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## UpsertUser
You can execute the `UpsertUser` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpsertUser(options?: useDataConnectMutationOptions<UpsertUserData, FirebaseError, UpsertUserVariables>): UseDataConnectMutationResult<UpsertUserData, UpsertUserVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpsertUser(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertUserData, FirebaseError, UpsertUserVariables>): UseDataConnectMutationResult<UpsertUserData, UpsertUserVariables>;
```

### Variables
The `UpsertUser` Mutation requires an argument of type `UpsertUserVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface UpsertUserVariables {
  id: string;
  username: string;
  avatarUrl?: string | null;
  reputation: number;
}
```
### Return Type
Recall that calling the `UpsertUser` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpsertUser` Mutation is of type `UpsertUserData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpsertUserData {
  user_upsert: User_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpsertUser`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpsertUserVariables } from '@dataconnect/generated';
import { useUpsertUser } from '@dataconnect/generated/react'

export default function UpsertUserComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpsertUser();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpsertUser(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertUser(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertUser(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpsertUser` Mutation requires an argument of type `UpsertUserVariables`:
  const upsertUserVars: UpsertUserVariables = {
    id: ..., 
    username: ..., 
    avatarUrl: ..., // optional
    reputation: ..., 
  };
  mutation.mutate(upsertUserVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., username: ..., avatarUrl: ..., reputation: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(upsertUserVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.user_upsert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## UpdateUserReputation
You can execute the `UpdateUserReputation` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpdateUserReputation(options?: useDataConnectMutationOptions<UpdateUserReputationData, FirebaseError, UpdateUserReputationVariables>): UseDataConnectMutationResult<UpdateUserReputationData, UpdateUserReputationVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpdateUserReputation(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateUserReputationData, FirebaseError, UpdateUserReputationVariables>): UseDataConnectMutationResult<UpdateUserReputationData, UpdateUserReputationVariables>;
```

### Variables
The `UpdateUserReputation` Mutation requires an argument of type `UpdateUserReputationVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface UpdateUserReputationVariables {
  id: string;
  reputation: number;
}
```
### Return Type
Recall that calling the `UpdateUserReputation` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpdateUserReputation` Mutation is of type `UpdateUserReputationData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpdateUserReputationData {
  user_update?: User_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpdateUserReputation`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpdateUserReputationVariables } from '@dataconnect/generated';
import { useUpdateUserReputation } from '@dataconnect/generated/react'

export default function UpdateUserReputationComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpdateUserReputation();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpdateUserReputation(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateUserReputation(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateUserReputation(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpdateUserReputation` Mutation requires an argument of type `UpdateUserReputationVariables`:
  const updateUserReputationVars: UpdateUserReputationVariables = {
    id: ..., 
    reputation: ..., 
  };
  mutation.mutate(updateUserReputationVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., reputation: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(updateUserReputationVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.user_update);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## CreateComment
You can execute the `CreateComment` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useCreateComment(options?: useDataConnectMutationOptions<CreateCommentData, FirebaseError, CreateCommentVariables>): UseDataConnectMutationResult<CreateCommentData, CreateCommentVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useCreateComment(dc: DataConnect, options?: useDataConnectMutationOptions<CreateCommentData, FirebaseError, CreateCommentVariables>): UseDataConnectMutationResult<CreateCommentData, CreateCommentVariables>;
```

### Variables
The `CreateComment` Mutation requires an argument of type `CreateCommentVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface CreateCommentVariables {
  beachId: UUIDString;
  userId: string;
  text: string;
}
```
### Return Type
Recall that calling the `CreateComment` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `CreateComment` Mutation is of type `CreateCommentData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface CreateCommentData {
  comment_insert: Comment_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `CreateComment`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, CreateCommentVariables } from '@dataconnect/generated';
import { useCreateComment } from '@dataconnect/generated/react'

export default function CreateCommentComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useCreateComment();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useCreateComment(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateComment(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateComment(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useCreateComment` Mutation requires an argument of type `CreateCommentVariables`:
  const createCommentVars: CreateCommentVariables = {
    beachId: ..., 
    userId: ..., 
    text: ..., 
  };
  mutation.mutate(createCommentVars);
  // Variables can be defined inline as well.
  mutation.mutate({ beachId: ..., userId: ..., text: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(createCommentVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.comment_insert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## DeleteComment
You can execute the `DeleteComment` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useDeleteComment(options?: useDataConnectMutationOptions<DeleteCommentData, FirebaseError, DeleteCommentVariables>): UseDataConnectMutationResult<DeleteCommentData, DeleteCommentVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useDeleteComment(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteCommentData, FirebaseError, DeleteCommentVariables>): UseDataConnectMutationResult<DeleteCommentData, DeleteCommentVariables>;
```

### Variables
The `DeleteComment` Mutation requires an argument of type `DeleteCommentVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface DeleteCommentVariables {
  id: UUIDString;
}
```
### Return Type
Recall that calling the `DeleteComment` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `DeleteComment` Mutation is of type `DeleteCommentData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface DeleteCommentData {
  comment_delete?: Comment_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `DeleteComment`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, DeleteCommentVariables } from '@dataconnect/generated';
import { useDeleteComment } from '@dataconnect/generated/react'

export default function DeleteCommentComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useDeleteComment();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useDeleteComment(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteComment(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteComment(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useDeleteComment` Mutation requires an argument of type `DeleteCommentVariables`:
  const deleteCommentVars: DeleteCommentVariables = {
    id: ..., 
  };
  mutation.mutate(deleteCommentVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(deleteCommentVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.comment_delete);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

