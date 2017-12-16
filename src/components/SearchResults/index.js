import React from 'react';

import { graphql } from 'react-apollo';

import SEARCH_QUERY from './SearchQuery.graphql';

@graphql(SEARCH_QUERY, {
  options: ({ match: { params: { term } } }) => ({ variables: { term: decodeURI(term) } }),
})
export default class SearchResults extends React.Component {
  render() {
    const { data: { getOffers = [] } } = this.props;
    return (
      <ul>
        {getOffers.map(offer => (
          <li key={offer.id}>
            <img src={offer.images.thumb} alt={offer.headline} />
            {offer.heading}
          </li>
        ))}
      </ul>
    );
  }
}
