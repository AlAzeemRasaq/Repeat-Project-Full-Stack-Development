import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import axios from "axios";
import Nav from "./Nav";
import LinkInClass from "../components/LinkInClass";
import { SERVER_HOST } from "../config/global_constants";
import "../css/Styling.css";
export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      isLoggedIn: false,
      wasSubmittedAtLeastOnce: false, // Tracks if the form has been submitted at least once
    };
  }

  handleChange = (e) => { // Handles changes to the input fields by updating the state
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = (e) => { // Handles the form submission to log in the user
    axios
      .post(
        `${SERVER_HOST}/users/login/${this.state.email}/${this.state.password}`
      )
      .then((res) => { // On successful login, store user data in localStorage
        localStorage._id = res.data._id;
        localStorage.name = res.data.name;
        localStorage.accessLevel = res.data.accessLevel;
        localStorage.profilePhoto = res.data.profilePhoto;
        localStorage.token = res.data.token;

        this.setState({ isLoggedIn: true }); // Update state to reflect that the user is logged in
      })
      .catch((err) => { // Log error details to the console
        console.log("err.response.status", err.response.status);
        console.log("err.response.statusText", err.response.statusText);
        console.log("err.response.data", err.response.data);

        // Update state to indicate form has been submitted and there was an error
        this.setState({ wasSubmittedAtLeastOnce: true });
      });
  };

  render() {
    let errorMessage = "";
    // Display an error message if the form has been submitted at least once and there was an error
    if (this.state.wasSubmittedAtLeastOnce) {
      errorMessage = (
        <div className="error">
          Login Details are incorrect
          <br />
        </div>
      );
    }

    return (
      <div className="main-container">
        <Nav />
        <form className="ar_formContainer" noValidate={true}>
          <h2 className="ar_loginH2">Login</h2>

          <h4 className="ar_loginH4">
            <Link className="ar_createAccountButton" to={"/Register"}>
              Or you can register...
            </Link>
          </h4>
          {this.state.isLoggedIn ? <Redirect to="/AllProducts" /> : null}

          {errorMessage}
          <input
            className="ar_loginInput"
            type="email"
            name="email"
            placeholder="Email"
            autoComplete="email"
            value={this.state.email}
            onChange={this.handleChange}
          />

          <input
            className="ar_loginInput"
            type="password"
            name="password"
            placeholder="Password"
            autoComplete="password"
            value={this.state.password}
            onChange={this.handleChange}
          />
          <div className="ar_confirmationButtonsContainer">
            <LinkInClass
              value="Login"
              className="ar_formLoginButton"
              onClick={this.handleSubmit}
            />
            <Link className="ar_formCancelButton" to={"/AllProducts"}>
              Cancel
            </Link>
          </div>
        </form>
      </div>
    );
  }
}
