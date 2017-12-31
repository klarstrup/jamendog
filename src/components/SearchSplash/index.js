import React from 'react';

import { graphql } from 'react-apollo';

import SEARCH_QUERY from './SearchQuery.graphql';

import SearchResultsOffer from '../SearchResultsOffer';
@graphql(SEARCH_QUERY)
export default class SearchSplash extends React.Component {
  render() {
    const { data: { getOffers = [] } } = this.props;
    return (
      <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
        {getOffers.map(offer => (
          <li key={offer.id}>
            <SearchResultsOffer offer={offer} />
          </li>
        ))}
      </ul>
    );
  }
}
