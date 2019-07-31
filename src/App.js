import React, { Component } from 'react';
//import { Route, Redirect } from 'react-router-dom';
import { Route } from 'react-router-dom';
import Home from './Home';
import Profile from './Profile';
import Nav from './Nav';
import Callback from './Callback';
import Auth from './Auth/Auth';
import Public from './Public';
import Private from './Private';
//import Courses from './Courses';
import PrivateRoute from './PrivateRoute';
import AuthContext from './AuthContext';
import Courses from './Courses';

class App extends Component {
  constructor(props) {
    super(props);
    //this.auth = new Auth(this.props.history);
    this.state = {
      auth: new Auth(this.props.history),
      tokenRenewalComplete: false
    }
  }

  componentDidMount() {
    this.state.auth.renewToken(() => {
      this.setState({ tokenRenewalComplete: true });
    })
  }

  render() {
    const { auth } = this.state;
    // Show loading message until the token renewal check is completed.
    if (!this.state.tokenRenewalComplete) return "Loading...";
    return (
      <AuthContext.Provider value={auth}>
        <Nav auth={auth} />
        <div className="body">
          {/* <Route path="/" exact component={Home} /> */}
          {/* <Route path="/profile" component={Profile} /> */}
          <Route
            path="/"
            exact
            render={props => <Home auth={auth} {...props} />}
          />
          <Route
            path="/callback"
            render={props => <Callback auth={auth} {...props} />}
          />
          {/* <Route
            path="/profile"
            render={props =>
              this.auth.isAuthenticated() ? (
                <Profile auth={this.auth} {...props} />
              ) : (
                  <Redirect to="/" />
                )
            }
          /> */}
          <PrivateRoute path="/profile" component={Profile} />
          <Route path="/public" component={Public} />
          <PrivateRoute path="/private" component={Private} />
          <PrivateRoute path="/course" component={Courses} scopes={['read:courses']} />
          {/* <Route
            path="/private"
            render={props => this.auth.isAuthenticated() ?
              (
                <Private auth={this.auth} {...props} />
              ) : (
                this.auth.login()
              )
            }
          /> */}
          {/* <Route
            path="/course"
            render={props =>
              this.auth.isAuthenticated() &&
                this.auth.userHasScopes(["read:courses"]) ?
                (
                  <Courses auth={this.auth} {...props} />
                ) : (
                  this.auth.login()
                )
            }
          /> */}
        </div>
      </AuthContext.Provider>
    );
  }
}

export default App;
