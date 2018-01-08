import { makeExecutableSchema } from 'graphql-tools';

import * as R from 'ramda';

import camelCaseObject from 'camelize';

import SGN from 'shopgun-sdk';

if (!SERVER) window.SGN = SGN;

SGN.config.set({
  appKey: '00jb5b3exqs9ad6qmpkloyfpzgzampso',
  // We only need an appSecret when running in Node
  // In fact including it in the browser will break stuff
  appSecret: SERVER ? '00jb5b3exq7ake194vxbvmu212ri6xm5' : undefined,
});
// 55.6599125,12.4903421
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

REST({ url: '/v2/sessions' })
  .then(console.log)
  .catch(console.error);

const typeDefs = `
    type Images {
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
      images: Images
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
    type Location {
      id: String
      street: String
      city: String
      zipCode: String
    }
    type Country {
      id: String
      unsubscribePrintUrl: String
    }
    type Business {
      id: String
      name: String
      color: String
      country: Country
      locations(limit: Int, offset: Int): [Location]
      pagedPublications(limit: Int, offset: Int): [PagedPublication]
    }
    type PagedPublication {
      id: String
      label: String
      images: Images
    }
    union SearchResult = Offer | Business | PagedPublication
    type Query {
      getOffers(term: String): [Offer]
      getPagedPublications(term: String): [PagedPublication]
      getBusinesses(term: String): [Business]
      getSuggestedBusinesses(limit: Int, offset: Int): [Business]
      search(term: String): [SearchResult]
      viewer: User
    }
    input LogInInput {
      email: String!
      password: String!
    }
    type Mutation {
      logIn(input: LogInInput): User!
      logOut: User
    }
    type User {
      id: String
      gender: String
      birthYear: Int
      email: String
      name: String
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
  Business: {
    locations: ({ id }, { offset = 0, limit = 70 }) =>
      REST({
        url: '/v2/stores',
        qs: {
          offset,
          limit,
          dealer_ids: [id],
        },
      }),
    pagedPublications: ({ id }, { offset = 0, limit = 70 }) =>
      REST({
        url: '/v2/catalogs',
        qs: {
          offset,
          limit,
          dealer_ids: [id],
        },
      }),
  },
  Mutation: {
    logIn: async (root, { input: { email, password } }) =>
      (await REST({
        url: '/v2/sessions',
        method: 'PUT',
        body: {
          email,
          password,
        },
      })).user,
    logOut: async () =>
      (await new Promise((resolve, reject) =>
        SGN.CoreKit.session.create((error, response) => {
          if (error) {
            reject({ ...error, response });
          }
          resolve(camelCaseObject(response));
        }))).user,
  },
  Query: {
    getOffers: (root, { term = '', offset = 0, limit = 70 }) =>
      REST({
        url: term ? '/v2/offers/search' : '/v2/offers',
        qs: {
          offset,
          limit,
          query: term,
          //          ...(term ? { query: term } : { order_by: '-popularity,-created' }),
        },
      }).then(
        R.filter(
          ({ branding: { website } }) => website.endsWith('.dk') || website.endsWith('.dk/'),
        ),
      ),
    getPagedPublications: (root, { term = '', offset = 0, limit = 70 }) =>
      REST({
        url: term ? '/v2/catalogs/search' : '/v2/catalogs',
        qs: {
          offset,
          limit,
          query: term,
          //          ...(term ? { query: term } : { order_by: '-popularity,-created' }),
        },
      }).then(
        R.filter(
          ({ branding: { website } }) => website.endsWith('.dk') || website.endsWith('.dk/'),
        ),
      ),
    getBusinesses: (root, { term = '', offset = 0, limit = 70 }) =>
      REST({
        url: term ? '/v2/dealers/search' : '/v2/dealers',
        qs: {
          offset,
          limit,
          query: term,
          //          ...(term ? { query: term } : { order_by: '-popularity,-created' }),
        },
      }).then(R.filter(business => business.country.id === 'DK')),
    getSuggestedBusinesses: (root, { offset = 0, limit = 70 }) =>
      REST({
        url: '/v2/dealers/suggested',
        qs: {
          offset,
          limit,
        },
      }).then(R.filter(business => business.country.id === 'DK')),
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
    viewer: (root, args, ctx) => ctx.session && ctx.session.user,
  },
};

export default makeExecutableSchema({ typeDefs, resolvers });
