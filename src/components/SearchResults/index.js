import React from 'react';
import Helmet from 'react-helmet';

import { graphql } from 'react-apollo';

import SEARCH_QUERY from './SearchQuery.graphql';

import SearchResultsOffer from '../SearchResultsOffer';

@graphql(SEARCH_QUERY, {
  options: ({ match: { params: { term } } }) => ({ variables: { term: decodeURI(term) } }),
})
export default class SearchResults extends React.Component {
  render() {
    const { data: { getOffers = [], variables: { term } } } = this.props;
    return (
      <React.Fragment>
        <Helmet>
          <title>{term}</title>
        </Helmet>
        <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
          {getOffers.map(offer => (
            <li key={offer.id}>
              <SearchResultsOffer offer={offer} />
            </li>
          ))}
        </ul>
      </React.Fragment>
    );
  }
}
