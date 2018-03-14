import React from "react";
import Helmet from "react-helmet";
import pathToRegexp from "path-to-regexp";
import Loadable from "react-loadable";

import MdMenu from "react-icons/lib/md/menu";
import MdArrowBack from "react-icons/lib/md/arrow-back";
import MdFilterList from "react-icons/lib/md/filter-list";

import { slide as Menu } from "react-burger-menu";

import { Route, Switch, withRouter, Link } from "react-router-dom";

import { graphql, Query, Mutation } from "react-apollo";
import gql from "graphql-tag";

import { WhenNotFound } from "components/routes";

import { getModified } from "../../graphql/schema.js";
import logo from "./logo-sgn.svg";

@withRouter
class GlobalSearch extends React.PureComponent {
  constructor(props) {
    super(props);

    const term = this.getTerm() || "";
    this.state = { term, showFilters: false, showMenu: false };

    this.handleChange = this.handleChange.bind(this);
    //    this.updateUrl = debounce(this.updateUrl, 500, { leading: true });
  }
  componentDidMount() {
    if (!SERVER) {
      document.addEventListener("scroll", () => {
        const focused = document.activeElement === this.input;
        if (focused) {
          this.input.blur();
        }
      });
    }
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      term: this.getTerm(nextProps) || "",
    });
  }
  getTerm = (props = this.props) => {
    const [term] = (pathToRegexp("/search/:term").exec(props.location.pathname) || []).slice(-1);
    if (term) {
      return decodeURIComponent(term);
    }
    return pathToRegexp("/search/").exec(props.location.pathname) ? "" : undefined;
  };
  handleChange = event => {
    const term = event.target.value;
    this.setState({ term });
    this.updateUrl(term.trim());
  };
  handleFocus = () => {
    this.updateUrl(this.state.term.trim());
  };
  handleBlur = () => {
    //    this.updateUrl(this.state.term);
  };
  toggleFilters = () => {
    this.setState(state => ({ showFilters: !state.showFilters }));
  };
  updateUrl(term) {
    const urlTerm = this.getTerm() || "";
    const focused = SERVER ? false : document.activeElement === this.input;
    if (term !== urlTerm) {
      if (term) {
        if (urlTerm) {
          this.props.history.push(`/search/${term}`);
        } else {
          this.props.history.push(`/search/${term}`);
        }
      } else if (focused) {
        this.props.history.push("/search/");
      } else {
        this.props.history.push("/");
      }
    }
    if (!urlTerm && !term) {
      if (focused) {
        this.props.history.push("/search/");
      } else {
        this.props.history.push("/");
      }
    }
  }
  render() {
    const focused = SERVER ? false : document.activeElement === this.input;

    const styles = {
      bmBurgerButton: {
        position: "absolute",
        width: "28px",
        height: "24px",
        left: "24px",
        top: "50%",
        transform: "translateY(-50%)",
        display: "none",
      },
      bmBurgerBars: {
        background: "#373a47",
      },
      bmCrossButton: {
        display: "none",
      },
      bmCross: {
        background: "#bdc3c7",
      },
      bmMenuWrap: {
        left: 0,
        top: 0,
        //        maxWidth: '320px',
        width: "calc(100vw - 64px)",
      },
      bmMenu: {
        background: "#FFFFFF",
        boxShadow:
          "0 2px 2px 0 rgba(0,0,0,0.14), 0 1px 5px 0 rgba(0,0,0,0.12), 0 3px 1px -2px rgba(0,0,0,0.2)",
      },
      bmMorphShape: {
        fill: "#373a47",
      },
      bmItemList: {},
      bmOverlay: {
        background: "rgba(0, 0, 0, 0.3)",
        left: 0,
        top: 0,
      },
    };
    return (
      <div>
        <Helmet defaultTitle="Jamen Dog - der er tilbud!" titleTemplate="%s - Jamen Dog" />
        <div
          style={{
            width: "100%",
            padding: "0.5em",
            position: "relative",
          }}
        >
          {focused || this.getTerm() !== undefined ? (
            <Link
              to="/"
              style={{
                position: "absolute",
                left: "initial",
                top: "50%",
                lineHeight: 1,
                transform: "translateY(-50%)",
                padding: "0.5em 0.75em",
                color: "#212121",
                fontSize: "1.1em",
              }}
            >
              <MdArrowBack />
            </Link>
          ) : (
            <button
              onClick={() => this.setState({ showMenu: true })}
              style={{
                position: "absolute",
                left: "initial",
                lineHeight: 1,
                top: "50%",
                padding: ".6em .9em",
                color: "#212121",
                fontSize: "1.1em",
                transform: "translateY(-50%)",
                border: 0,
                background: "none",
              }}
            >
              <MdMenu />
            </button>
          )}
          <Menu
            isOpen={this.state.showMenu}
            onStateChange={({ isOpen }) => this.setState({ showMenu: isOpen })}
            styles={styles}
          >
            <section>Profile stuff/login enticing</section>
            <section>
              <header>Header</header>
              <ul>
                <li>Item</li>
              </ul>
            </section>
            <div>
              Powered by ShopGun{" "}
              <img
                src={logo}
                style={{
                  width: "24px",
                  height: "24px",
                  verticalAlign: "bottom",
                }}
                alt="ShopGun Logo"
              />
            </div>
          </Menu>

          {focused || this.getTerm() !== undefined ? (
            <button
              onClick={this.toggleFilters}
              style={{
                position: "absolute",
                right: "0.5em",
                lineHeight: 1,
                top: "50%",
                padding: "0.5em 0.75em",
                color: "#212121",
                fontSize: "1.1em",
                transform: "translateY(-50%)",
                border: 0,
                background: "none",
              }}
            >
              <MdFilterList />
            </button>
          ) : null}
          <input
            placeholder="Søg her..."
            style={{
              boxShadow:
                "0 2px 2px 0 rgba(0,0,0,0.14), 0 1px 5px 0 rgba(0,0,0,0.12), 0 3px 1px -2px rgba(0,0,0,0.2)",
              width: "100%",
              border: 0,
              appearance: "none",
              fontSize: "1em",
              padding: "0.75em 3em",
            }}
            ref={el => {
              this.input = el;
            }}
            type="search"
            value={this.state.term}
            onChange={this.handleChange}
            onBlur={this.handleBlur}
            onFocus={this.handleFocus}
          />
        </div>
        {(focused || this.getTerm() !== undefined) && this.state.showFilters ? (
          <div>FILTERS</div>
        ) : null}
      </div>
    );
  }
}

const viewerQuery = gql`
  {
    viewer {
      id
      gender
      birthYear
      email
      name
    }
  }
`;

const logInMutation = gql`
  mutation($logIn: LogInInput) {
    logIn(input: $logIn) {
      id
      gender
      birthYear
      email
      name
    }
  }
`;

const LogInForm = () => (
  <Mutation mutation={logInMutation}>
    {logIn => (
      <form
        onSubmit={e => {
          e.preventDefault();

          logIn({
            variables: {
              logIn: {
                email: e.currentTarget.email.value,
                password: e.currentTarget.password.value,
              },
            },
            update: (proxy, { data }) => {
              proxy.writeQuery({
                query: viewerQuery,
                data: {
                  ...proxy.readQuery({ query: viewerQuery }),
                  viewer: data.logIn,
                },
              });
            },
          });
        }}
      >
        <input type="email" name="email" />
        <input type="password" name="password" />
        <input type="submit" />
      </form>
    )}
  </Mutation>
);

const logOutMutation = gql`
  mutation logOut {
    logOut {
      id
      gender
      birthYear
      email
      name
    }
  }
`;
const LogOutForm = () => (
  <Mutation mutation={logOutMutation}>
    {logOut => (
      <form
        onSubmit={e => {
          e.preventDefault();

          logOut({
            update: (proxy, { data }) => {
              proxy.writeQuery({
                query: viewerQuery,
                data: {
                  ...proxy.readQuery({ query: viewerQuery }),
                  viewer: data.logOut,
                },
              });
            },
          });
        }}
      >
        <input type="submit" value="Log out" />
      </form>
    )}
  </Mutation>
);

const getActiveList = lists => {
  const sortedLists = [...lists].sort(function(a, b) {
    const aActiveMeta = a.meta.find(meta => meta.property === "active");
    const bActiveMeta = b.meta.find(meta => meta.property === "active");
    a = aActiveMeta ? new Date(aActiveMeta.value) : new Date(0);
    b = bActiveMeta ? new Date(bActiveMeta.value) : new Date(0);
    return a > b ? -1 : a < b ? 1 : 0;
  });
  return sortedLists[0];
};

const activateListMutation = gql`
  mutation activateShoppingList($id: String!) {
    activateShoppingList(id: $id) {
      id
      meta {
        property
        value
      }
    }
  }
`;
const activateListOptimisticResponse = id => ({
  activateShoppingList: {
    id,
    meta: [
      {
        property: "active",
        value: getModified(),
        __typename: "Meta",
      },
    ],
    __typename: "ShoppingList",
  },
});
const ShoppingList = () => (
  <Query
    query={gql`
      {
        getShoppingLists {
          id
          name
          meta {
            property
            value
          }
        }
      }
    `}
  >
    {({ data: { getShoppingLists = [] } = {} }, activeList = getActiveList(getShoppingLists)) => (
      <div>
        {getShoppingLists.length ? (
          <Mutation mutation={activateListMutation}>
            {(activateList, result) => (
              <select
                value={activeList.id}
                onChange={event => {
                  const id = event.target.value;
                  activateList({
                    variables: { id },
                    optimisticResponse: activateListOptimisticResponse(id),
                  });
                }}
              >
                {getShoppingLists.map(list => (
                  <option value={list.id} key={list.id}>
                    {list.name}
                  </option>
                ))}
              </select>
            )}
          </Mutation>
        ) : (
          "???"
        )}
        {activeList ? (
          <Query
            variables={{
              id: activeList.id,
            }}
            query={gql`
              query getShoppingList($id: String) {
                getShoppingList(id: $id) {
                  id
                  name
                  meta {
                    property
                    value
                  }
                  items {
                    id
                    count
                    description
                    tick
                    offerId
                    meta {
                      property
                      value
                    }
                  }
                }
              }
            `}
          >
            {({ data: { getShoppingList: { items, meta } = {} } = {} } = {}) => (
              <React.Fragment>
                <h1>{activeList.name}</h1>
                {items ? (
                  <ul>
                    {items.map(item => (
                      <li key={item.id}>
                        <pre>{JSON.stringify(item, null, 2)}</pre>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </React.Fragment>
            )}
          </Query>
        ) : (
          <h1>WANGS</h1>
        )}
      </div>
    )}
  </Query>
);
const SearchResults = Loadable({
  loader: () => import("components/SearchResults"),
  loading: () => null,
});
const SearchSplash = Loadable({
  loader: () => import("components/SearchSplash"),
  loading: () => null,
});

export default () => (
  <React.Fragment>
    <GlobalSearch />
    <Switch>
      <Route
        exact
        path="/"
        component={() => (
          <Query query={viewerQuery}>
            {({ data: { viewer } }) =>
              viewer ? (
                <React.Fragment>
                  <ShoppingList />
                  <LogOutForm />
                  <pre>{JSON.stringify(viewer, null, 2)}</pre>
                </React.Fragment>
              ) : (
                <LogInForm />
              )}
          </Query>
        )}
      />
      <Route exact path="/search/" component={SearchSplash} />
      <Route exact path="/search/:term" component={SearchResults} />
      <Route component={WhenNotFound} />
    </Switch>
  </React.Fragment>
);
