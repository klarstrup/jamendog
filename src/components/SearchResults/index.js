import React from "react";
import Helmet from "react-helmet";

import { Query } from "react-apollo";

import SEARCH_QUERY from "./SearchQuery.graphql";

import SearchResultsOffer from "../SearchResultsOffer";
import SearchResultsBusiness from "../SearchResultsBusiness";

const SearchResults = ({ match: { params: { term } } }) => (
  <Query query={SEARCH_QUERY} variables={{ term: decodeURI(term) }}>
    {({ data: { getOffers = [], getBusinesses = [] } }) => (
      <React.Fragment>
        <Helmet>
          <title>{decodeURI(term)}</title>
        </Helmet>
        <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
          {getBusinesses.map(business => (
            <li key={business.id}>
              <SearchResultsBusiness business={business} />
            </li>
          ))}
        </ul>
        <ul
          style={{
            margin: 0,
            padding: 0,
            listStyle: "none",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "stretch",
          }}
        >
          {getOffers.map(offer => (
            <li
              key={offer.id}
              style={{
                flexGrow: 1,
                padding: "8px",
                maxWidth: "400px",
              }}
            >
              <SearchResultsOffer offer={offer} />
            </li>
          ))}
        </ul>
      </React.Fragment>
    )}
  </Query>
);

export default SearchResults;
