import { makeExecutableSchema } from 'graphql-tools';

import R from 'ramda';

import SGN from 'shopgun-sdk';

SGN.config.set({
  appKey: '00jb5b3exqs9ad6qmpkloyfpzgzampso',
  // We only need an appSecret when running in Node
  // In fact including it in the browser will break stuff
  appSecret: SERVER ? '00jb5b3exq7ake194vxbvmu212ri6xm5' : undefined,
});

export const REST = options =>
  new Promise((resolve, reject) =>
    SGN.CoreKit.request(R.clone(options), (error, response) => {
      if (error) {
        reject({ ...error, response });
      }
      resolve(response);
    }));

const typeDefs = `
    type OfferImages {
      view: String
      zoom: String
      thumb: String
    }

    type Offer {
      id: String
      heading: String
      description: String
      images: OfferImages
    }
    type Query {
      getOffers(term: String): [Offer]
    }
`;

const resolvers = {
  Query: {
    getOffers: (root, { term, offset = 0, limit = 70 }) =>
      REST({
        url: term ? '/v2/offers/search' : '/v2/offers',
        qs: {
          query: term,
          offset,
          limit,
          order_by: term ? undefined : '-popularity,-created',
        },
      }),
  },
};

export default makeExecutableSchema({ typeDefs, resolvers });