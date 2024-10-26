import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";

import { SERVER_HOST } from "../config/global_constants";

export default class DeleteProduct extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirectToDisplayAllProducts: false, // State to handle redirection after deletion
    };
  }

  componentDidMount() {
    axios // Sends a DELETE request to the server to delete the product with the specified ID
      .delete(`${SERVER_HOST}/products/${this.props.match.params.id}`, {
        headers: { authorization: localStorage.token }, // Authorization header
      })
      .then((res) => {
        if (res.data) {
          if (res.data.errorMessage) {
            console.log(res.data.errorMessage); // Logs any error messages
          } // success
          else {
            console.log("Record deleted"); // Confirms successful deletion
          }
          // Sets the state to trigger redirection to the list of all products
          this.setState({ redirectToDisplayAllProducts: true });
        } else {
          console.log("Record not deleted"); // Logs if deletion was not successful
        }
      });
  }

  render() {
    return (
      <div>
        {this.state.redirectToDisplayAllProducts ? (
          <Redirect to="/AllProducts" />
        ) : null}
      </div>
    );
  }
}
