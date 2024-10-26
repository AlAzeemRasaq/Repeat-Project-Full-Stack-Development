import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import AllProducts from "./components/AllProducts";
import EditProduct from "./components/EditProduct";
import AddProduct from "./components/AddProduct";
import ResetDatabase from "./components/ResetDatabase";
import DeleteProduct from "./components/DeleteProduct";
import Cart from "./components/Cart";
import ProductPage from "./components/ProductPage";
import Account from "./components/Account";
import Login from "./components/Login";
import Logout from "./components/Logout";
import Register from "./components/Register";
import Users from "./components/Users";
import DeleteUser from "./components/DeleteUser";
import Home from "./components/Home";
import LoggedInRoute from "./components/LoggedInRoute";
import PayPalMessage from "./components/PayPalMessage";
import AdminRoute from "./components/AdminRoute";
import PurchaseHistory from "./components/PurchaseHistory";
import { ACCESS_LEVEL_GUEST } from "./config/global_constants";

if (typeof localStorage.accessLevel === "undefined") {
  localStorage._id = null;
  localStorage.name = "GUEST";
  localStorage.accessLevel = ACCESS_LEVEL_GUEST;
  localStorage.token = null;
  localStorage.profilePhoto = null;
}

export default class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/Home" component={Home} />
          <Route exact path="/ResetDatabase" component={ResetDatabase} />
          <Route exact path="/AllProducts" component={AllProducts} />
          <Route exact path="/Login" component={Login} />
          <Route exact path="/Register" component={Register} />
          <Route exact path="/ProductPage/:id" component={ProductPage} />
          <Route exact path="/Cart/:id" component={Cart} />
          <Route
            exact
            path="/PayPalMessage/:messageType/:payPalPaymentID"
            component={PayPalMessage}
          />
          <LoggedInRoute
            exact
            path="/PurchaseHistory/:id"
            component={PurchaseHistory}
          />
          <LoggedInRoute exact path="/Account/:id" component={Account} />
          <LoggedInRoute exact path="/Logout" component={Logout} />
          <AdminRoute exact path="/AddProduct" component={AddProduct} />
          <AdminRoute exact path="/EditProduct/:id" component={EditProduct} />
          <AdminRoute
            exact
            path="/DeleteProduct/:id"
            component={DeleteProduct}
          />
          <AdminRoute exact path="/Users/" component={Users} />
          <AdminRoute exact path="/DeleteUser/:id" component={DeleteUser} />

          <Route path="*" component={AllProducts} />
        </Switch>
      </BrowserRouter>
    );
  }
}
