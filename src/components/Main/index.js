import React from 'react';

import pathToRegexp from 'path-to-regexp';

import MdMenu from 'react-icons/lib/md/menu';
import MdArrowBack from 'react-icons/lib/md/arrow-back';
import MdFilterList from 'react-icons/lib/md/filter-list';

import { slide as Menu } from 'react-burger-menu';

import { Route, Switch, withRouter, Link } from 'react-router-dom';
import { WhenNotFound } from 'components/routes';

import SearchResults from 'components/SearchResults';
import SearchSplash from 'components/SearchSplash';

@withRouter
class GlobalSearch extends React.PureComponent {
  constructor(props) {
    super(props);

    const term = this.getTerm() || '';
    this.state = { term, showFilters: false, showMenu: false };

    this.handleChange = this.handleChange.bind(this);
    //    this.updateUrl = debounce(this.updateUrl, 500, { leading: true });
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      term: this.getTerm(nextProps) || '',
    });
  }
  getTerm = (props = this.props) => {
    const [term] = (pathToRegexp('/search/:term').exec(props.location.pathname) || []).slice(-1);
    if (term) {
      return decodeURIComponent(term);
    }
    return pathToRegexp('/search/').exec(props.location.pathname) ? '' : undefined;
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
    const focused = SERVER ? false : document.activeElement === this.input;
    if (term !== urlTerm) {
      if (term) {
        if (urlTerm) {
          this.props.history.push(`/search/${term}`);
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
    const focused = SERVER ? false : document.activeElement === this.input;

    const styles = {
      bmBurgerButton: {
        position: 'absolute',
        width: '28px',
        height: '24px',
        left: '24px',
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'none',
      },
      bmBurgerBars: {
        background: '#373a47',
      },
      bmCrossButton: {
        height: '24px',
        width: '24px',
      },
      bmCross: {
        background: '#bdc3c7',
      },
      bmMenuWrap: {
        left: 0,
        top: 0,
      },
      bmMenu: {
        background: '#373a47',
        padding: '2.5em 1.5em 0',
        fontSize: '1.15em',
      },
      bmMorphShape: {
        fill: '#373a47',
      },
      bmItemList: {
        color: '#b8b7ad',
        padding: '0.8em',
      },
      bmOverlay: {
        background: 'rgba(0, 0, 0, 0.3)',
        left: 0,
        top: 0,
      },
    };
    return (
      <div>
        <div
          style={{
            width: '100%',
            padding: '0.5em',
            position: 'relative',
          }}>
          {focused || this.getTerm() !== undefined ? (
            <Link
              to="/"
              style={{
                position: 'absolute',
                left: 'initial',
                top: '50%',
                lineHeight: 1,
                transform: 'translateY(-50%)',
                padding: '0.5em 0.75em',
                color: '#212121',
                fontSize: '1.1em',
              }}>
              <MdArrowBack />
            </Link>
          ) : (
            <button
              onClick={() => this.setState({ showMenu: true })}
              style={{
                position: 'absolute',
                left: 'initial',
                lineHeight: 1,
                top: '50%',
                padding: '0.5em 0.75em',
                color: '#212121',
                fontSize: '1.1em',
                transform: 'translateY(-50%)',
                border: 0,
                background: 'none',
              }}>
              <MdMenu />
            </button>
          )}
          <Menu
            isOpen={this.state.showMenu}
            onStateChange={({ isOpen }) => this.setState({ showMenu: isOpen })}
            styles={styles}>
            <a id="home" className="menu-item" href="/">
              Home
            </a>
            <a id="about" className="menu-item" href="/about">
              About
            </a>
            <a id="contact" className="menu-item" href="/contact">
              Contact
            </a>
            <a onClick={this.showSettings} className="menu-item--small" href="">
              Settings
            </a>
          </Menu>

          {focused || this.getTerm() !== undefined ? (
            <button
              onClick={this.toggleFilters}
              style={{
                position: 'absolute',
                right: '0.5em',
                lineHeight: 1,
                top: '50%',
                padding: '0.5em 0.75em',
                color: '#212121',
                fontSize: '1.1em',
                transform: 'translateY(-50%)',
                border: 0,
                background: 'none',
              }}>
              <MdFilterList />
            </button>
          ) : null}
          <input
            placeholder="Søg her..."
            style={{
              boxShadow:
                '0 2px 2px 0 rgba(0,0,0,0.14), 0 1px 5px 0 rgba(0,0,0,0.12), 0 3px 1px -2px rgba(0,0,0,0.2)',
              width: '100%',
              border: 0,
              appearance: 'none',
              fontSize: '1em',
              padding: '0.75em 3em',
            }}
            ref={el => {
              this.input = el;
            }}
            type="text"
            value={this.state.term}
            onChange={this.handleChange}
            onBlur={this.handleBlur}
            onFocus={this.handleFocus} />
        </div>
        {(focused || this.getTerm() !== undefined) && this.state.showFilters ? (
          <div>FILTERS</div>
        ) : null}
      </div>
    );
  }
}
const ShoppingList = () => 'Shoppinglist';
export default () => (
  <React.Fragment>
    <GlobalSearch />
    <Switch>
      <Route exact path="/" component={ShoppingList} />
      <Route exact path="/search/" component={SearchSplash} />
      <Route exact path="/search/:term" component={SearchResults} />
      <Route component={WhenNotFound} />
    </Switch>
  </React.Fragment>
);
