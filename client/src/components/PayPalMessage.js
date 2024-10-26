import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import "../css/Styling.css";

export default class PayPalMessage extends Component {
  // Define possible message types as static properties
  static messageType = { SUCCESS: "success", ERROR: "error", CANCEL: "cancel" };

  constructor(props) {
    super(props);

    this.state = {
      redirectToDisplayAllProducts: false,
      colour: "red",
      message: ""  // Detailed message for the user
    };
  }

  componentDidMount() {
    if ( // Check the 'messageType' prop to set the appropriate state values
      this.props.match.params.messageType === PayPalMessage.messageType.SUCCESS
    ) {
      this.setState({
        heading: "PayPal Transaction Confirmation",
        message: "Your PayPal transaction was successful.",
        colour: "green",
      });
    } else if (
      this.props.match.params.messageType === PayPalMessage.messageType.CANCEL
    ) {
      this.setState({
        heading: "PayPal Transaction Cancelled",
        message:
          "You cancelled your PayPal transaction. Therefore, the transaction was not completed.",
      });
    } else if (
      this.props.match.params.messageType === PayPalMessage.messageType.ERROR
    ) {
      this.setState({
        heading: "PayPal Transaction Error",
        message:
          "An error occured when trying to perform your PayPal transaction. The transaction was not completed. Please try to perform your transaction again.",
      });
    } else { // Log an error if the 'messageType' is invalid
      console.log(
        "The 'messageType' prop that was passed into the PayPalMessage component is invalid. It must be one of the following: PayPalMessage.messageType.SUCCESS, PayPalMessage.messageType.CANCEL or PayPalMessage.messageType.ERROR"
      );
    }
  }

  render() {
    // Redirect to display all products if the state 'redirectToDisplayAllProducts' is true
    if (this.state.redirectToDisplayAllProducts) {
      return <Redirect to="/AllProducts" />;
    }

    return (
      <div className="main-container">
        <div className="ar_payPalMessage">
          {this.state.redirectToDisplayAllProducts ? (
            <Redirect to="/AllProducts" />
          ) : null}

          <h3 className={`ar_paypalH3${this.state.colour}`}>
            {this.state.heading}
          </h3>
          <p className="ar_paypalP">{this.props.match.params.message}</p>
          <p className="ar_paypalP">{this.state.message}</p>

          {this.props.match.params.messageType ===
          PayPalMessage.messageType.SUCCESS ? (
            <p className="ar_paypalP">
              Your PayPal payment confirmation is
              <span id="ar_payPalPaymentID">
                {this.props.match.params.payPalPaymentID}
              </span>
            </p>
          ) : null}

          <p className="ar_paypalContinueButton" id="ar_payPalPaymentIDButton">
            <Link
              className={`ar_paypal${this.state.colour}button`}
              to={"/AllProducts"}
            >
              Continue
            </Link>
          </p>
        </div>
      </div>
    );
  }
}
