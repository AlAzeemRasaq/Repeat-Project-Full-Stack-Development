import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";

import LinkInClass from "../components/LinkInClass";
import { SERVER_HOST } from "../config/global_constants";

export default class Logout extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoggedIn: true,
    };
  }

  // Handles the logout process when the user submits the logout request
  handleSubmit = (e) => {
    e.preventDefault(); // Prevents the default form submission behavior

    axios // Sends a POST request to the logout endpoint
      .post(`${SERVER_HOST}/users/logout`)
      .then((res) => { // If the request is successful, log the user out
        console.log("User logged out");
        localStorage.clear();
        this.setState({ isLoggedIn: false });
      })
      .catch((err) => {
        // do nothing
      });
  };

  render() {
    return (
      <div>
        {!this.state.isLoggedIn ? <Redirect to="/AllProducts" /> : null}
        <div className="ar_logoutText">
          <i className="fa  fa-sign-out" />
          <LinkInClass
            value="Log out"
            className="ar_logoutButton"
            onClick={this.handleSubmit}
          />
        </div>
      </div>
    );
  }
}
