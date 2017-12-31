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
  console.log(options) ||
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
    type PageFlip {
      logo: String
      color: String
    }
    type Branding {
      name: String
      urlName: String
      website: String
      logo: String
      logoBackground: String
      color: String
      pageflip: PageFlip
    }
    type Offer {
      id: String
      heading: String
      description: String
      images: OfferImages
      branding: Branding
      pricing: Pricing
      quantity: Quantity
    }
    type Pricing {
      price: Float
      prePrice: Float
      currency: String
    }
    type Quantity {
      unit: Unit
      size: Range
      pieces: Range
    }
    type Range {
      from: Float
      to: Float
    }
    type Unit {
      symbol: String
      si: SI
    }
    type SI {
      symbol: String
      factor: Float
    }
    type Business {
      id: String
      name: String
    }
    type PagedPublication {
      id: String
      label: String
    }
    union SearchResult = Offer | Business | PagedPublication
    type Query {
      getOffers(term: String): [Offer]
      search(term: String): [SearchResult]
    }
`;

const resolvers = {
  SearchResult: {
    __resolveType: ({ ern }) =>
      ({
        dealer: 'Business',
        offer: 'Offer',
        catalog: 'PagedPublication',
      }[ern.split(':')[1]]),
  },
  Query: {
    getOffers: (root, { term = '', offset = 0, limit = 70 }) =>
      REST({
        url: term ? '/v2/offers/search' : '/v2/offers',
        qs: {
          offset,
          limit,
          ...(term ? { query: term } : { order_by: '-popularity,-created' }),
        },
      }),
    search: async (root, { term = '', offset = 0, limit = 70 }) => {
      try {
        const [offers, catalogs, businesses] = await Promise.all([
          REST({
            url: term ? '/v2/offers/search' : '/v2/offers',
            qs: {
              offset,
              limit,
              ...(term ? { query: term } : { order_by: '-popularity,-created' }),
            },
          }),
          REST({
            url: term ? '/v2/catalogs/search' : '/v2/catalogs',
            qs: {
              offset,
              limit,
              ...(term ? { query: term } : { order_by: '-popularity,-created' }),
            },
          }),
          REST({
            url: term ? '/v2/dealers/search' : '/v2/dealers',
            qs: {
              offset,
              limit,
              ...(term ? { query: term } : { order_by: '-popularity,-created' }),
            },
          }).catch(() => []),
        ]);
        return [...offers, ...catalogs, ...businesses];
      } catch (e) {
        console.error(e);
      }
      return [];
    },
  },
};

export default makeExecutableSchema({ typeDefs, resolvers });
