import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";

import { SERVER_HOST } from "../config/global_constants";

export default class DeleteProduct extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirectToDisplayAllUsers: false, // State to handle redirection after deletion
    };
  }

  componentDidMount() {
    // Sends a DELETE request to the server to delete the user with the specified ID
    axios
      .delete(`${SERVER_HOST}/users/${this.props.match.params.id}`, {
        headers: { authorization: localStorage.token }, // Authorization header
      })
      .then((res) => {
        // Updates state to trigger redirection after successful deletion
        this.setState({ redirectToDisplayAllUsers: true });
      })
      .catch((err) => {
        // Error handling (currently not implemented)
      });
  }

  render() {
    return (
      <div>
        {this.state.redirectToDisplayAllUsers ? <Redirect to="/Users" /> : null}
      </div>
    );
  }
}
