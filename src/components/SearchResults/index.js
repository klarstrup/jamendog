import React from 'react';
import Helmet from 'react-helmet';

import { graphql } from 'react-apollo';

import SEARCH_QUERY from './SearchQuery.graphql';

import SearchResultsOffer from '../SearchResultsOffer';

const Json = ({ children }) => JSON.stringify(children);

@graphql(SEARCH_QUERY, {
  options: ({ match: { params: { term } } }) => ({ variables: { term: decodeURI(term) } }),
})
export default class SearchResults extends React.Component {
  render() {
    const { data: { search = [], variables: { term } } } = this.props;
    return (
      <React.Fragment>
        <Helmet>
          <title>{term}</title>
        </Helmet>
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
      </React.Fragment>
    );
  }
}
