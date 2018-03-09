import React from "react";

import { Query } from "react-apollo";

import SEARCH_QUERY from "./SearchQuery.graphql";

import SearchResultsOffer from "../SearchResultsOffer";
import SearchResultsBusiness from "../SearchResultsBusiness";

const SearchSplash = () => (
  <Query query={SEARCH_QUERY}>
    {({ data: { getOffers = [], getSuggestedBusinesses = [] } }) => (
      <React.Fragment>
        <div
          style={{
            background: "white",
            borderRadius: "4px",
            margin: "8px",
            boxShadow:
              "0 2px 2px 0 rgba(0,0,0,0.14), 0 1px 5px 0 rgba(0,0,0,0.12), 0 3px 1px -2px rgba(0,0,0,0.2)",
          }}
        >
          <ul
            style={{
              margin: 0,
              padding: "4px",
              listStyle: "none",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "stretch",
            }}
          >
            {getSuggestedBusinesses
              .filter(({ pagedPublications }) => pagedPublications.length)
              .map(business => (
                <li
                  key={business.id}
                  style={{
                    width: "50%",
                    padding: "4px",
                    position: "relative",
                    maxWidth: "200px",
                  }}
                >
                  <button
                    style={{
                      position: "absolute",
                      top: "8px",
                      right: "8px",
                    }}
                  >
                    X
                  </button>
                  <SearchResultsBusiness business={business} />
                </li>
              ))}
          </ul>
          <div
            style={{
              background: "rgb(244,244,244)",
              borderTop: "rgba(0,0,0,1)",
            }}
          >
            -> Flere kæder
          </div>
        </div>
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

export default SearchSplash;
