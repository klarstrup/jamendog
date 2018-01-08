// ----------------------
// IMPORTS

/* NPM */

// Apollo client library
import { ApolloClient } from 'react-apollo';
import { execute } from 'graphql';
import SGN from 'shopgun-sdk';
import * as R from 'ramda';

import camelCaseObject from 'camelize';

/* ReactQL */

// Configuration
import config from 'kit/config';
import { getFragmentMatcher } from 'kit/lib/fragment_matcher';

import schema from '../../src/graphql/schema';

if (!SERVER) window.SGN = SGN;

SGN.config.set({
  appKey: '00jb5b3exqs9ad6qmpkloyfpzgzampso',
  // We only need an appSecret when running in Node
  // In fact including it in the browser will break stuff
  appSecret: SERVER ? '00jb5b3exq7ake194vxbvmu212ri6xm5' : undefined,
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
    ));

// ----------------------
const dataIdFromObject = ({ __typename, id }) => __typename && id && `${__typename}:${id}`;

// Helper function to create a new Apollo client, by merging in
// passed options alongside any set by `config.setApolloClientOptions` and defaults
export function createClient(opt = {}) {
  return new ApolloClient(
    Object.assign(
      {
        reduxRootSelector: state => state.apollo,
        dataIdFromObject,
        fragmentMatcher: getFragmentMatcher(),
      },
      config.apolloClientOptions,
      opt,
    ),
  );
}

const context = {};

export const getNetworkInterface = () => ({
  query: async ({ query, variables, operationName }) => {
    if (!context.session) {
      console.log('getting session');
      context.session = await REST({ url: '/v2/sessions' });
    } else {
      console.log('not getting session');
    }
    return execute(schema, query, undefined, context, variables, operationName).catch(
      console.error,
    );
  },
});

// Creates a new browser client
export const browserClient = () =>
  createClient({
    networkInterface: getNetworkInterface(),
  });
