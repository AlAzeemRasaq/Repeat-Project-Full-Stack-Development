import React from "react";
import { Route, Redirect } from "react-router-dom";

import { ACCESS_LEVEL_GUEST } from "../config/global_constants";

const LoggedInRoute = ({ component: Component, exact, path, ...rest }) => (
  <Route
    exact={exact} // Specifies if the route should be matched exactly
    path={path} // The path to match for this route
    render={(props) => // Function to render the component or redirect based on access level
      localStorage.accessLevel > ACCESS_LEVEL_GUEST ? ( // Checks if the user's access level is greater than ACCESS_LEVEL_GUEST
        <Component {...props} {...rest} /> // If access level is sufficient, render the provided component with props and any additional rest props
      ) : (
        <Redirect to="/AllProducts" />
      )
    }
  />
);

export default LoggedInRoute;
