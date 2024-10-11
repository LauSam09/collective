import { QueryClient } from "@tanstack/react-query";
import { DocumentSnapshot, onSnapshot } from "firebase/firestore";

export const queryClient = new QueryClient();

/** Based on implementation found here https://github.com/TanStack/query/discussions/2621 */
export const createQuery = (getRef: any) => async (context) => {
  let firstRun = true;
  let unsubscribe;
  // Wrap `onSnapshot` with a promise because `useQuery` expects a promise
  const data = await new Promise((resolve, reject) => {
    unsubscribe = onSnapshot(
      getRef(),
      // Success callback resolves the promise on the first run
      // For subsequent runs it manually updates the React Query cache
      (response: any) => {
        const data = format(response);
        if (firstRun) {
          resolve(data);
          firstRun = false;
        } else {
          queryClient.setQueryData(context.queryKey, data);
        }
      },
      // Error callback rejects the promise on the first run
      // We can't manually trigger an error in React Query, so on a subsequent runs we
      // invalidate the query (causes a re-fetch and will reject if error persists)
      (error: Error) => {
        if (firstRun) {
          reject(error);
          firstRun = false;
        } else {
          queryClient.invalidateQueries(context.queryKey);
        }
      },
    );
  });

  // Get query object from React Query
  const query = queryClient.getQueryCache().find(context.queryKey);
  // Remove existing subscription (if there is one) and store new one on `query` object
  // @ts-expect-error fix ts error
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  query?.__unsubscribe && query.__unsubscribe();
  // @ts-expect-error fix ts error
  query.__unsubscribe = unsubscribe;
  // Return data for `useQuery` hook
  return data;
};

// Auto-remove subscriptions when all observing components have unmounted
queryClient.getQueryCache().subscribe(({ type, query }) => {
  if (
    type === "observerRemoved" &&
    query.getObserversCount() === 0 &&
    // @ts-expect-error fix ts error
    query.__unsubscribe
  ) {
    // @ts-expect-error fix ts error
    query.__unsubscribe();
    // @ts-expect-error fix ts error
    delete query.__unsubscribe;
  }
});

// Format Firestore response
const format = (response: any) => {
  if (response.docs) {
    return response.docs.map(formatDoc);
  } else {
    return formatDoc(response);
  }
};

// Format document (merges `doc.data()` and `doc.id`)
const formatDoc = (doc: DocumentSnapshot) => {
  return doc.exists() === true ? { id: doc.id, ...doc.data() } : null;
};
