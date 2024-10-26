import React from "react";
import { Route, Redirect } from "react-router-dom";

import { ACCESS_LEVEL_NORMAL_USER } from "../config/global_constants";

const AdminRoute = ({ component: Component, exact, path, ...rest }) => (
  <Route
    exact={exact} // Determines if the path should be matched exactly
    path={path}   // The path for this route
    render={(props) =>
      localStorage.accessLevel > ACCESS_LEVEL_NORMAL_USER ? ( // If the access level is higher than normal user, render the specified component
        <Component {...props} {...rest} />
      ) : (
        <Redirect to="/AllProducts" />
      )
    }
  />
);

export default AdminRoute;
