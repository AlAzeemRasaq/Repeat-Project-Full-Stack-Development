import React, { Component } from "react";
import axios from "axios";
import Nav from "./Nav";
import { SERVER_HOST } from "../config/global_constants";
import "../css/Styling.css";
export default class Account extends Component {
  constructor(props) {
    super(props);

    this.state = { // Initializing state with an empty array for the user data
      user: [],
    };
  }

  // Lifecycle method that runs after the component is mounted
  componentDidMount() { // Makes an HTTP GET request to fetch user data using Axios
    axios
      .get(`${SERVER_HOST}/users/${localStorage._id}`, { // Including authorization headers with the request using token stored in localStorage
        headers: { authorization: localStorage.token },
      })
      .then((res) => { // Checks if the response contains data
        if (res.data) { // If there is an error message in the response, it logs the error
          if (res.data.errorMessage) {
            console.log(res.data.errorMessage);
          } else { // Updates the state with the fetched user data
            this.setState({ user: res.data });
            console.log("Succesful Request");
          }
        } else { // Logs a message if no data was found
          console.log("Record not found");
        }
      });
  }

  // Event handler function to update state when input fields change
  handleChange = (e) => { // Sets the state with the new value for the specific input field that triggered the event
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    console.log("User", this.state.user);
    return (
      <div className="main-container">
        <Nav />
        <div className="ar_accountContainer">
          <h1 className="ar_accountH1">Your Account</h1>

          {localStorage.profilePhoto !== "null" ? (
            <img
              className="ar_accountProfilePic"
              id="profilePhoto"
              src={`data:;base64,${localStorage.profilePhoto}`}
              alt=""
            />
          ) : (
            <img
              className="ar_accountProfilePic"
              src="https://via.placeholder.com/250"
              alt=""
            />
          )}

          <h4>Username: {this.state.user.name}</h4>
          <h4>Email: {this.state.user.email}</h4>
          <h4>Access Level: {this.state.user.accessLevel}</h4>
        </div>
      </div>
    );
  }
}