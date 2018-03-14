// ----------------------
// IMPORTS

/* NPM */

// Apollo client library
import { ApolloClient } from "apollo-client";
import { toIdValue } from 'apollo-utilities';
import { InMemoryCache } from "apollo-cache-inmemory";
import { execute } from "graphql";
import SGN from "shopgun-sdk";
import * as R from "ramda";

import camelCaseObject from "camelize";

/* ReactQL */

// Configuration
import config from "kit/config";
import { getFragmentMatcher } from "kit/lib/fragment_matcher";

import schema from "../../src/graphql/schema";
import { ApolloLink, Observable } from "apollo-link";

if (!SERVER) window.SGN = SGN;

SGN.config.set({
  appKey: "00jb5b3exqs9ad6qmpkloyfpzgzampso",
  // We only need an appSecret when running in Node
  // In fact including it in the browser will break stuff
  appSecret: SERVER ? "00jb5b3exq7ake194vxbvmu212ri6xm5" : undefined,
});

export const REST = options =>
  console.log(options) ||
  new Promise((resolve, reject) =>
    SGN.CoreKit.request(
      R.clone({
        ...options,
        geolocation: {
          latitude: 55.6599125,
          longitude: 12.4903421,
        },
      }),
      (error, response) => {
        if (error) {
          reject({ ...error, response });
        }
        resolve(camelCaseObject(response));
      },
    ),
  );

// ----------------------
const dataIdFromObject = ({ __typename, id }) => __typename && id && `${__typename}:${id}`;

// Helper function to create a new Apollo client, by merging in
// passed options alongside any set by `config.setApolloClientOptions` and defaultsm "apollo-link";

const context = {};
export class SchemaLink extends ApolloLink {
  constructor({ schema, rootValue, context }) {
    super();

    this.schema = schema;
    this.rootValue = rootValue;
  }

  request(operation) {
    return new Observable(observer => {
      (async () => {
        if (!context.session) {
          console.log("getting session");
          context.session = await REST({ url: "/v2/sessions" });
        } else {
          console.log("not getting session");
        }
        return execute(
          this.schema,
          operation.query,
          this.rootValue,
          context,
          operation.variables,
          operation.operationName,
        );
      })()
        .then(data => {
          if (!observer.closed) {
            observer.next(data);
            observer.complete();
          }
        })
        .catch(error => {
          if (!observer.closed) {
            observer.error(error);
          }
        });
    });
  }
}
export function createClient(opt = {}) {
  const cache = new InMemoryCache({
    dataIdFromObject,
    addTypename: true,
    fragmentMatcher: getFragmentMatcher(),
    cacheRedirects: {
      Query: {
        getShoppingList: (_, { id }) =>
          toIdValue(cache.config.dataIdFromObject({ __typename: "ShoppingList", id })),
      },
    },
  });

  const client = new ApolloClient({
    link: new SchemaLink({ schema }),
    // use restore on the cache instead of initialState
    cache:
      typeof window !== "undefined" && window && window.__APOLLO_STATE__
        ? cache.restore(window.__APOLLO_STATE__)
        : new InMemoryCache(),
    ssrForceFetchDelay: 100,
    connectToDevTools: true,
    queryDeduplication: true,
    ...opt,
  });
  return client;
}

export const getNetworkInterface = () => ({
  query: async ({ query, variables, operationName }) => {
    return execute(schema, query, undefined, context, variables, operationName).catch(
      console.error,
    );
  },
});

// Creates a new browser client
export const browserClient = () => createClient();
