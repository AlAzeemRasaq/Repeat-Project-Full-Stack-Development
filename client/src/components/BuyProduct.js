import React, { Component } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";
import { SERVER_HOST } from "../config/global_constants";
import { SANDBOX_CLIENT_ID } from "../config/global_constants";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import PayPalMessage from "./PayPalMessage";

export default class BuyProduct extends Component {
  constructor(props) {
    super(props);

    // Initializing state with default values for redirecting to PayPal messages and order details
    this.state = {
      redirectToPayPalMessage: false,
      payPalMessageType: null,
      payPalOrderID: null,
    };
  }

  // Lifecycle method that runs after the component is mounted
  componentDidMount() {
    axios // Makes an HTTP GET request to fetch user details using Axios
      .get(`${SERVER_HOST}/users/${localStorage._id}`, {
        headers: { authorization: localStorage.token },
      })
      .then((res) => {  // Checks if the response contains data
        if (res.data) { // Logs error message if there is an error in the response data
          if (res.data.errorMessage) {
            console.log(res.data.errorMessage);
          } else { // Updates state with the fetched user details
            this.setState({ user: res.data });
          }
        } else { // Logs a message if no data was found
          console.log("Record not found");
        }
      });
  }

  // Creates a new PayPal order with the specified purchase amount
  createOrder = (data, actions) => {
    // Returns a PayPal order creation action with the purchase amount set to the product price
    return actions.order.create({
      // Sets the order amount based on product price
      purchase_units: [{ amount: { value: this.props.price } }],
    });
  };

  // Callback function when the PayPal payment is approved
  onApprove = (paymentData) => {
    let salesData = new FormData();

    // If product information is available, append it to the sales data
    if (this.props.productInfos) {
      const productInfosArray = [];
      // Loops through the product information and adds each product's details to the array
      this.props.productInfos.forEach((info) => {
        productInfosArray.push({
          productId: info.productId,
          productName: info.productName,
          quantity: info.quantity,
          productPrice: info.productPrice,
        });
      });
      // Converts the product information array to a JSON string and appends it to the form data
      salesData.append("productInfos", JSON.stringify(productInfosArray)); //Found this at JSON.stringify https://stackoverflow.com/questions/53735223/js-how-to-append-array-in-formdata
    }
    axios
      .post( // Makes an HTTP POST request to save the sale details on the server
        `${SERVER_HOST}/sales/${paymentData.orderID}/${localStorage._id}/${this.props.price}/${this.state.user.name}/${this.state.user.email}`,
        salesData,
        {
          headers: {
            authorization: localStorage.token,
            "Content-type": "multipart/form-data",
          },
        }
      )
      .then((res) => { // Updates state to redirect to a success message with the PayPal order ID
        this.setState({
          payPalMessageType: PayPalMessage.messageType.SUCCESS,
          payPalOrderID: paymentData.orderID,
          redirectToPayPalMessage: true,
        });
      })
      .catch((errorData) => { // Updates state to redirect to an error message in case of failure
        this.setState({
          payPalMessageType: PayPalMessage.messageType.ERROR,
          redirectToPayPalMessage: true,
        });
      });

    axios // Makes an HTTP DELETE request to clear the user's shopping cart
      .delete(`${SERVER_HOST}/cart/${localStorage._id}`, {
        headers: { authorization: localStorage.token },
      })
      .then((res) => { // Logs a message when the cart is successfully emptied
        console.log("Cart emptied");
      })
      .catch((err) => {}); // Handle error silently
  };

  onError = (errorData) => { // Updates state to redirect to an error message
    this.setState({
      payPalMessageType: PayPalMessage.messageType.ERROR,
      redirectToPayPalMessage: true,
    });
  };

  onCancel = (cancelData) => {
    // Updates state to redirect to a cancel message
    this.setState({
      payPalMessageType: PayPalMessage.messageType.CANCEL,
      redirectToPayPalMessage: true,
    });
  };

  render() {
    return (
      <div>
        {this.state.redirectToPayPalMessage ? (
          <Redirect
            to={`/PayPalMessage/${this.state.payPalMessageType}/${this.state.payPalOrderID}`}
          />
        ) : null}

        {/* PayPal script provider with buttons for handling payments */}
        <PayPalScriptProvider
          options={{ currency: "EUR", "client-id": SANDBOX_CLIENT_ID }}
        >
          <PayPalButtons
            style={{ layout: "horizontal" }}
            createOrder={this.createOrder}
            onApprove={this.onApprove}
            onError={this.onError}
            onCancel={this.onCancel}
          />
        </PayPalScriptProvider>
      </div>
    );
  }
}
