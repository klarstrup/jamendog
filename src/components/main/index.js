import React from 'react';

import pathToRegexp from 'path-to-regexp';

import { Route, Switch, withRouter, Link } from 'react-router-dom';
import { WhenNotFound } from 'components/routes';

@withRouter
class GlobalSearch extends React.PureComponent {
  constructor(props) {
    super(props);
    const term = this.getTerm() || '';
    this.state = { term, showFilters: false };

    this.handleChange = this.handleChange.bind(this);
    //    this.updateUrl = debounce(this.updateUrl, 500, { leading: true });
  }
  componentWillReceiveProps() {
    this.setState({
      term: this.getTerm() || '',
    });
  }
  getTerm = () => {
    const [term] = (pathToRegexp('/search/:term').exec(window.location.pathname) || []).slice(-1);
    if (term) {
      return decodeURIComponent(term);
    }
    return pathToRegexp('/search/').exec(window.location.pathname) ? '' : undefined;
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
    const urlTerm = this.getTerm() || '';
    const focused = document.activeElement === this.input;
    if (term !== urlTerm) {
      if (term) {
        if (urlTerm) {
          this.props.history.replace(`/search/${term}`);
        } else {
          this.props.history.push(`/search/${term}`);
        }
      } else if (focused) {
        this.props.history.push('/search/');
      } else {
        this.props.history.push('/');
      }
    }
    if (!urlTerm && !term) {
      if (focused) {
        this.props.history.push('/search/');
      } else {
        this.props.history.push('/');
      }
    }
  }
  render() {
    console.log(this.getTerm());
    return (
      <div>
        {document.activeElement === this.input || this.getTerm() !== undefined ? (
          <Link to="/">B</Link>
        ) : null}
        {document.activeElement === this.input || this.getTerm() !== undefined ? (
          <button onClick={this.toggleFilters}>F</button>
        ) : null}
        <input
          style={{ boxShadow: '0 0 .1em .1em black' }}
          ref={el => {
            this.input = el;
          }}
          type="text"
          value={this.state.term}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
          onFocus={this.handleFocus} />
        {this.state.showFilters ? <div>FILTERS</div> : null}
      </div>
    );
  }
}
const ShoppingList = () => null;
const SearchSplash = () => <span>Pre-search suggestions</span>;
const SearchResults = ({ match: { params: { term } } }) => <span>Search results for {term}</span>;
export default () => (
  <div>
    <GlobalSearch />
    <Switch>
      <Route exact path="/" component={ShoppingList} />
      <Route exact path="/search/" component={SearchSplash} />
      <Route exact path="/search/:term" component={SearchResults} />
      <Route component={WhenNotFound} />
    </Switch>
  </div>
);
