import React, { Component } from "react";
import Nav from "./Nav";
import axios from "axios";
import { Link } from "react-router-dom";
import { SERVER_HOST } from "../config/global_constants";
export default class Users extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [],
      originalUsers: [],
    };
  }

  // Fetch users from the server when the component mounts
  componentDidMount() {
    axios
      .get(`${SERVER_HOST}/users`)
      .then((res) => { // Populate state with user data from the server
        this.setState({ users: res.data, originalUsers: res.data });
      })
      .catch((err) => {}); // Log errors (if any)
  }

  // Handle changes in the search box
  handleSearchChange = (e) => {
    const originalUsers = this.state.originalUsers;

    // Filter users based on the search query (case-insensitive)
    const selectedUsers = originalUsers.filter((user) => {
      return user.name.toLowerCase().includes(e.target.value.toLowerCase());
    });

     // Update state with the filtered users
    this.setState({ users: selectedUsers });
  };

  // Handle sorting changes
  handleSortChange = (e) => {
    let selectedUsers;

    if (e.target.value === "alphabet-asc") {
      selectedUsers = [...this.state.originalUsers].sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
    } else if (e.target.value === "alphabet-dsc") {
      selectedUsers = [...this.state.originalUsers].sort((a, b) => {
        return b.name.localeCompare(a.name);
      });
    } else { // Reset to original users if "default" is selected
      return this.setState({ users: this.state.originalUsers });
    }

    this.setState({ users: selectedUsers });
  };

  // Handle filtering by access level
  handleFilterChange = (e) => {
    let filteredUsers;

    if (e.target.value === "2") { // Filter users with admin access level (2)
      filteredUsers = this.state.originalUsers.filter(
        (user) => user.accessLevel === 2
      );
    } else if (e.target.value === "1") { // Filter users with normal access level (1)
      filteredUsers = this.state.originalUsers.filter(
        (user) => user.accessLevel === 1
      );
    } else { // Reset to original users if "all" is selected
      return this.setState({ users: this.state.originalUsers });
    }

    // Update state with filtered users
    this.setState({ users: filteredUsers });
  };

  render() {
    return (
      <div className="main-container">
        <Nav />

        <div className="ar_toolButtonsContainer">
          <div className="ar_searchBoxContainer">
            <input
              className="ar_searchBox"
              placeholder="Search by name"
              value={this.state.search}
              onChange={this.handleSearchChange}
            />
          </div>
          <div className="ar_filterContainer">
            <label>Filter </label>
            <select
              name="price"
              className="ar_dropdown1"
              onChange={this.handleFilterChange}
            >
              <option key="all" value="all">
                All
              </option>
              <option key="admin" value={2}>
                Admin
              </option>
              <option key="normal-user" value={1}>
                Normal User
              </option>
            </select>
          </div>
          <div className="ar_sortDropdownContainer">
            <label>Sort By : </label>
            <select
              name="price"
              className="ar_dropdown1"
              onChange={this.handleSortChange}
            >
              <option key="default" value="default">
                Default
              </option>
              <option key="alphabet-asc" value="alphabet-asc">
                Alphabetically, A-Z
              </option>
              <option key="alphabet-dsc" value="alphabet-dsc">
                Alphabetically, Z-A
              </option>
            </select>
          </div>
        </div>
        <div className="ar_tableContainer">
          <tbody className="ar_userTable">
            <tr className="ar_rowHeader">
              <th>Name</th>
              <th>Email</th>
              <th>Access Level</th>
              <th>Actions</th>
            </tr>
            {this.state.users.map((user, index) => (
              <tr className={`row-${index}`}>
                <td data-cell="name">{user.name}</td>
                <td data-cell="email">{user.email}</td>
                <td data-cell="accessLevel">{user.accessLevel}</td>
                <td data-cell="actions">
                  <div className="ar_actionsContainer">
                    <Link className="ar_delButton" to={"/DeleteUser/" + user._id}>
                      Delete
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </div>
      </div>
    );
  }
}
