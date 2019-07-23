import React, { Component, Fragment } from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Nav from "./components/Nav";
import Home from "./components/pages/Home";
import Books from "./components/pages/Books";
import Games from "./components/pages/Games";
import Movies from "./components/pages/Movies";
import Music from "./components/pages/Music";
import Shows from "./components/pages/Shows";
import Friends from "./components/pages/Friends";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import "./styles/fontello/css/fontello.css";
import "./styles/fontello/css/fontello-codes.css";
import "./App.scss";
import { runSagas } from './store';


class App extends Component {
  constructor() {
    super()
    this.store = configureStore()
    runSagas()
  }

  render() {
    return (
      <Provider store={this.store}>
        <Router>
          <div>
            <Route
              path={["/home", "/books", "/games", "/movies", "/music", "/shows", "/friends"]} 
              component={Nav}
            />
            <Switch>
              <Route exact path="/signup" component={Signup} />
              <ProtectedRoute exact path="/books" component={Books} />
              <ProtectedRoute exact path="/games" component={Games} />
              <ProtectedRoute exact path="/movies" component={Movies} />
              <ProtectedRoute exact path="/music" component={Music} />
              <ProtectedRoute exact path="/shows" component={Shows} />
              <ProtectedRoute exact path="/friends" component={Friends} />
              <ProtectedRoute exact path="/home" component={Home} />
              <Route path="/" component={Login} />
            </Switch>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
