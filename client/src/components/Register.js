import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import axios from "axios";
import Nav from "./Nav";
import LinkInClass from "../components/LinkInClass";

import { SERVER_HOST } from "../config/global_constants";

export default class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      selectedFile: null,
      isRegistered: false,
      wasSubmittedAtLeastOnce: false
    };
  }

  // Handle changes in form fields
  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  // Handle file input changes
  handleFileChange = (e) => {
    this.setState({ selectedFile: e.target.files[0] });
  };

  handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Create FormData object to handle file upload
    let formData = new FormData();
    formData.append("profilePhoto", this.state.selectedFile);

    axios
      .post( // Send a POST request to register the user
        `${SERVER_HOST}/users/register/${this.state.name}/${this.state.email}/${this.state.password}`,
        formData,
        { headers: { "Content-type": "multipart/form-data" } } // Set content type for file upload
      )
      .then((res) => { // On successful registration
        console.log("User registered and logged in");

        // Store user data in local storage
        localStorage._id = res.data._id;
        localStorage.name = res.data.name;
        localStorage.accessLevel = res.data.accessLevel;
        localStorage.profilePhoto = res.data.profilePhoto;
        localStorage.token = res.data.token;

        // Update state to indicate registration is complete
        this.setState({ isRegistered: true });
      })
      .catch((err) => { // On error, set state to show error message
        this.setState({ wasSubmittedAtLeastOnce: true });
      });
  };

  render() { // Conditionally render error message if form was submitted but has issues
    let errorMessage = "";
    if (this.state.wasSubmittedAtLeastOnce) {
      errorMessage = (
        <div className="error">
          Error: All fields must be filled in
          <br />
        </div>
      );
    }
    return (
      <div className="main-container">
        <Nav />
        <form
          className="ar_formContainer"
          noValidate={true}
          id="loginOrRegistrationForm"
          onSubmit={this.handleSubmit}
        >
          {this.state.isRegistered ? <Redirect to="/AllProducts" /> : null}
          <h2 className="ar_registerH2">Create an account</h2>
          <h4 className="ar_loginH4">
            <Link className="ar_createAccountButton" to={"/Login"}>
              Or you can sign in...
            </Link>
          </h4>{" "}
          {errorMessage}
          <input
            className="ar_registerInput"
            name="name"
            type="text"
            placeholder="Name"
            autoComplete="name"
            value={this.state.name}
            onChange={this.handleChange}
            ref={(input) => {
              this.inputToFocus = input;
            }}
          />
          <input
            className="ar_registerInput"
            name="email"
            type="email"
            placeholder="Email"
            autoComplete="email"
            value={this.state.email}
            onChange={this.handleChange}
          />
          <input
            className="ar_registerInput"
            name="password"
            type="password"
            placeholder="Password"
            autoComplete="password"
            title="Password)"
            value={this.state.password}
            onChange={this.handleChange}
          />
          <input
            className="ar_registerInput"
            name="confirmPassword"
            type="password"
            placeholder="Confirm password"
            autoComplete="confirmPassword"
            value={this.state.confirmPassword}
            onChange={this.handleChange}
          />
          <input type="file" onChange={this.handleFileChange} />
          <div className="ar_registerConfirmationButtonsContainer">
            <LinkInClass
              value="Register"
              className="ar_formRegisterButton"
              onClick={this.handleSubmit}
            />
            <Link className="ar_formRegisterCancelButton" to={"/AllProducts"}>
              Cancel
            </Link>
          </div>
        </form>
      </div>
    );
  }
}
