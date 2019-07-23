import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import { userAPI } from "../../api";
import Footer from "../Footer";
import "./style.scss";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      message: "",
      isLoggedIn: null
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  componentDidMount() {
    this.setState({
      isLoggedIn: userAPI.isLoggedIn()
    });
    window.scrollTo(0, 0);
  }

  handleSubmit = event => {
    event.preventDefault();
    userAPI
      .localLogIn(this.state.username, this.state.password)
      .then(response => {
        if (response.data.user) {
          // Update App.js state
          this.setState({
            isLoggedIn: true
          });
        } else {
          this.setState({
            message: response.data.message
          });
        }
      })
      .catch(error => {
        console.log("Login error: " + error);
      });
  };

  render() {
    if (this.state.isLoggedIn === true) {
      return <Redirect to="/home" />;
    }
    return (
      <div>
        <div className="login-wrapper">
          <div className="login-block">
            <div className="login-form-content">
              <div className="login-form-header">
                <div className="logo">
                  <img
                    src="/images/recca-logo.png"
                    alt="recca the raccoon"
                    style={{ height: "180px" }}
                  />
                </div>
                <h1 className="sr-only">Recca</h1>
              </div>
              <p className="text-center mt-2">Quick test drive? Sign in with <br />username: <strong>demo</strong>, password: <strong>demo</strong></p>
              <form method="post" action="/login/local" className="login-form">
                {this.state.message.length > 0 ? (
                  <p className="warning">{this.state.message}</p>
                ) : (
                  <span />
                )}
                <div className="input-container">
                  <span className="fas fa-user" />
                  <input
                    type="text"
                    className="username"
                    name="username"
                    placeholder="Username"
                    value={this.state.username}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="input-container">
                  <span className="fas fa-lock" />
                  <input
                    type="password"
                    className="password"
                    name="password"
                    placeholder="Password"
                    value={this.state.password}
                    onChange={this.handleChange}
                  />
                </div>
                <input
                  type="submit"
                  name="login"
                  value="Log In"
                  className="submit-btn"
                  onClick={this.handleSubmit}
                />
                <div className="separator">
                  <span className="separator-text">OR</span>
                </div>
                <Link to="/signup" className="create-btn">
                  Create Account
                </Link>
              </form>

              {/* <div className="socmed-login">
                <Link to="/login/facebook" className="socmed-btn facebook-btn">
                  <i className="fab fa-facebook-square" />
                  <span>Login with Facebook</span>
                </Link>
              </div> */}
            </div>
          </div>
        </div>

        <Footer loginPage={true} />
      </div>
    );
  }
}

export default Login;
