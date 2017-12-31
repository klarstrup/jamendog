import React from 'react';

import { graphql } from 'react-apollo';

import SEARCH_QUERY from './SearchQuery.graphql';

import SearchResultsOffer from '../SearchResultsOffer';

const Json = ({ children }) => JSON.stringify(children);

@graphql(SEARCH_QUERY)
export default class SearchSplash extends React.Component {
  render() {
    const { data: { search = [] } } = this.props;
    return (
      <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
        {search.map(result => (
          <li key={result.id}>
            {{
              Offer: <SearchResultsOffer offer={result} />,
              Business: <Json>{result}</Json>,
              PagedPublication: <Json>{result}</Json>,
            }[result.__typename] || null}
          </li>
        ))}
      </ul>
    );
  }
}
