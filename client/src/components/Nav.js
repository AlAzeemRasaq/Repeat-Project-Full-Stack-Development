import React, { Component } from "react";
import { Link } from "react-router-dom";
import Logout from "./Logout";
import {
  ACCESS_LEVEL_GUEST,
  ACCESS_LEVEL_ADMIN,
  ACCESS_LEVEL_NORMAL_USER,
} from "../config/global_constants";

import "../css/Styling.css";

export default class Nav extends Component {
  render() {
    return (
      <div className="ar_navContainer">
        <p className="ar_brandNameP">
          <Link className="ar_brandButton" to={"/Home"}>
            LEGO
          </Link>
        </p>
        <div className="ar_linkContainer">
          <Link className="ar_button" to={"/Home"}>
            Home
          </Link>
          <Link className="ar_button" to={"/AllProducts"}>
            Shop
          </Link>
          {localStorage.accessLevel >= ACCESS_LEVEL_ADMIN ? (
            <Link className="ar_button" to={"/Users"}>
              Users
            </Link>
          ) : null}

          {localStorage.accessLevel === ACCESS_LEVEL_NORMAL_USER ? (
            <Link
              className="ar_button"
              to={`/PurchaseHistory/${localStorage._id}`}
            >
              Purchase History
            </Link>
          ) : null}
        </div>
        {localStorage.accessLevel > ACCESS_LEVEL_GUEST ? (
          <div className="ar_rightSideNavContainer">
            <Link className="ar_navAtcButton" to={`/Cart/${localStorage._id}`}>
              <i className="fa fa-shopping-cart" />
            </Link>

            {localStorage.profilePhoto !== "null" ? (
              <img
                className="ar_profilePic"
                id="profilePhoto"
                src={`data:;base64,${localStorage.profilePhoto}`}
                alt=""
              />
            ) : (
              <img
                className="ar_profilePic"
                src="https://via.placeholder.com/250"
                alt=""
              />
            )}

            <div className="ar_logoutContainer">
              <Logout />
              <Link className="ar_button" to={`/Account/${localStorage._id}`}>
                <i className="fa fa-user" />
                View Account
              </Link>
            </div>
          </div>
        ) : (
          <div className="ar_loginContainer">
            <Link className="ar_loginButton" to={"/Login"}>
              <i className="fa fa-user"></i>
            </Link>
            <Link className="ar_navAtcButton" to={`/Cart/${localStorage._id}`}>
              <i className="fa fa-shopping-cart" />
            </Link>
          </div>
        )}
      </div>
    );
  }
}
