import React from "react";
import Helmet from "react-helmet";
import pathToRegexp from "path-to-regexp";
import Loadable from "react-loadable";

import MdMenu from "react-icons/lib/md/menu";
import MdArrowBack from "react-icons/lib/md/arrow-back";
import MdFilterList from "react-icons/lib/md/filter-list";

import { slide as Menu } from "react-burger-menu";

import { Route, Switch, withRouter, Link } from "react-router-dom";

import { graphql, Query } from "react-apollo";
import gql from "graphql-tag";

import { WhenNotFound } from "components/routes";

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

@graphql(gql`
  mutation($logIn: LogInInput) {
    logIn(input: $logIn) {
      id
      gender
      birthYear
      email
      name
    }
  }
`)
class LogInForm extends React.Component {
  onSubmit = e => {
    e.preventDefault();

    this.props.mutate({
      variables: {
        logIn: {
          email: e.currentTarget.email.value,
          password: e.currentTarget.password.value,
        },
      },
      update: (proxy, { data: { logIn } }) => {
        proxy.writeQuery({
          query: viewerQuery,
          data: {
            ...proxy.readQuery({ query: viewerQuery }),
            viewer: logIn,
          },
        });
      },
    });
  };
  render() {
    return (
      <form onSubmit={this.onSubmit}>
        <input type="email" name="email" />
        <input type="password" name="password" />
        <input type="submit" />
      </form>
    );
  }
}

@graphql(gql`
  mutation logOut {
    logOut {
      id
      gender
      birthYear
      email
      name
    }
  }
`)
class LogOutForm extends React.Component {
  onSubmit = e => {
    e.preventDefault();

    this.props.mutate({
      update: (proxy, { data: { logOut } }) => {
        proxy.writeQuery({
          query: viewerQuery,
          data: {
            ...proxy.readQuery({ query: viewerQuery }),
            viewer: logOut,
          },
        });
      },
    });
  };
  render() {
    return (
      <form onSubmit={this.onSubmit}>
        <input type="submit" value="Log out" />
      </form>
    );
  }
}

const ShoppingList = () => (
  <Query
    query={gql`
      {
        getShoppingLists {
          id
          name
          items {
            id
            count
            description
            tick
            offerId
          }
        }
      }
    `}
  >
    {({ data: { getShoppingLists } }) =>
      getShoppingLists
        ? getShoppingLists.map(list => (
            <li key={list.id}>
              <pre>{JSON.stringify(list, null, 2)}</pre>
            </li>
          ))
        : "???"
    }
  </Query>
);
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
              )
            }
          </Query>
        )}
      />
      <Route
        exact
        path="/search/"
        component={Loadable({
          loader: () => import("components/SearchSplash"),
          loading: () => null,
        })}
      />
      <Route
        exact
        path="/search/:term"
        component={Loadable({
          loader: () => import("components/SearchResults"),
          loading: () => null,
        })}
      />
      <Route component={WhenNotFound} />
    </Switch>
  </React.Fragment>
);
