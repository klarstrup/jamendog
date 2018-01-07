// ----------------------
// IMPORTS

/* NPM */

// Apollo client library
import { ApolloClient } from 'react-apollo';
import { execute } from 'graphql';

/* ReactQL */

// Configuration
import config from 'kit/config';
import { getFragmentMatcher } from 'kit/lib/fragment_matcher';

import schema from '../../src/graphql/schema';

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

export const getNetworkInterface = () => ({
  query: ({ query, variables, operationName }) =>
    execute(schema, query, undefined, undefined, variables, operationName).catch(console.error),
});

// Creates a new browser client
export const browserClient = () =>
  createClient({
    networkInterface: getNetworkInterface(),
  });
