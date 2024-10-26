import React, { Component } from "react";
import axios from "axios";
import { SERVER_HOST } from "../config/global_constants";
import "../css/Styling.css";
import Nav from "./Nav";
import BuyProduct from "./BuyProduct";

export default class Cart extends Component {
  constructor(props) {
    super(props);

    // Initializing state with empty cart, products list, and subtotal
    this.state = {
      cart: [],         // Holds the list of items in the user's cart
      products: [],     // Holds product details fetched from the server
      subTotal: 0,      // Stores the total cost of items in the cart
    };
  }

  // Lifecycle method that runs after the component mounts
  componentDidMount() {
    // Fetches the cart items for the current user using their ID from the URL params
    axios
      .get(`${SERVER_HOST}/cart/${this.props.match.params.id}`, {
        headers: { authorization: localStorage.token },
      })
      .then((res) => {
        // Checks if the response contains data
        if (res.data) {
          // Logs error message if there is an error in the response data
          if (res.data.errorMessage) {
            console.log(res.data.errorMessage);
          } else if (res.data.deleteMessage) {
            // Handles special cases where the cart may be updated or deleted
            this.setState({ cart: res.data.cart });
          } else {
            // Sets the cart state with the fetched data
            this.setState({ cart: res.data });
            console.log("Successful Request");
          }
        } else {
          // Logs a message if no data was found
          console.log("Record not found");
        }
      });
  }

  // Function to get product information from the cart and products state
  getProductInfo() {
    let productInfos = [];

    // Iterates over cart items and matches them with product details
    this.state.cart.forEach((cartItem) => {
      const foundProduct = this.state.products.find(
        (product) => product._id === cartItem.productId
      );

      // If product details are found, they are added to the productInfos array
      if (foundProduct) {
        productInfos.push({
          productId: cartItem.productId,
          productName: foundProduct.name,
          quantity: cartItem.quantity,
          productPrice: cartItem.productPrice,
        });
      }
    });
    // Returns an array of product information relevant for the purchase process
    return productInfos;
  }

  // Lifecycle method that runs when the component's state or props update
  componentDidUpdate(prevProps, prevState) {
    // Updates the subtotal and fetches product details when the cart changes
    if (this.state.cart !== prevState.cart) {
      let subTotal = 0;

      // Calculates the subtotal by iterating through each cart item
      this.state.cart.map((cartItem) => {
        subTotal += cartItem.quantity * cartItem.productPrice;

        // Fetches product details for each item in the cart
        axios
          .get(`${SERVER_HOST}/products/${cartItem.productId}`, {
            headers: { authorization: localStorage.token },
          })
          .then((res) => {
            // Checks if the product is already in the state to avoid duplicates
            const productExists = this.state.products.some(
              (product) => product._id === res.data._id
            );
            if (!productExists) {
              // Updates the products state with the newly fetched product
              this.setState((prevState) => ({
                products: [...prevState.products, res.data],
              }));
            }
          })
          .catch((err) => {
            // Error handling for product fetch failures
          });

        // Updates the state with the new subtotal
        this.getProductInfo();
        return this.setState({ subTotal: subTotal });
      });
    }

    // Updates the image sources for each product when the products state changes
    if (this.state.products !== prevState.products) {
      this.state.products.map((product) => {
        return product.photos.map((photo) => {
          return axios
            .get(`${SERVER_HOST}/products/photo/${photo.filename}`)
            .then((res) => {
              // Sets the image source for each product photo
              document.getElementById(
                photo._id
              ).src = `data:;base64,${res.data.image}`;
            })
            .catch((err) => {
              // Error handling for image fetch failures
            });
        });
      });
    }
  }

  // Handles quantity changes of items in the cart
  handleQuantityChange = (e) => {
    // Retrieves the index of the cart item being modified
    const index = e.target.getAttribute("index");

    // Creates a cart object to update the quantity of the specific product
    const cartObject = {
      userId: localStorage._id,
      productId: this.state.cart[index].productId,
      quantity: parseInt(e.target.value),
    };

    // Makes an HTTP PUT request to update the cart on the server
    axios
      .put(`${SERVER_HOST}/cart/${localStorage._id}`, cartObject, {
        headers: { authorization: localStorage.token },
      })
      .then((res) => {
        // Handles updates if the server response indicates the item was deleted from the cart
        if (res.data.deleteMessage) {
          this.setState({ cart: res.data.cart });
          let subTotal = 0;
          this.state.cart.forEach((cartItem) => {
            subTotal += cartItem.quantity * cartItem.productPrice;
          });
          this.setState({ subTotal: subTotal });
        } else {
          // Updates the cart state with the server's response data
          const updatedCart = [...this.state.cart];
          updatedCart[index] = res.data;
          this.setState({ cart: updatedCart });

          let subTotal = 0;
          let updatedProducts;
          this.state.cart.forEach((cartItem) => {
            subTotal += cartItem.quantity * cartItem.productPrice;

            // Updates the products state by removing the product that was just updated
            updatedProducts = this.state.products.filter(
              (product) => product._id !== cartItem.productId
            );
          });

          // Sets the updated products and subtotal in the state
          this.setState({ products: updatedProducts });
          this.setState({ subTotal: subTotal });
          console.log(`Cart updated`);
        }
      });

    // Recalculates and sets the subtotal after updating the cart
    let subTotal = 0;
    this.state.cart.forEach((cartItem) => {
      subTotal += cartItem.quantity * cartItem.productPrice;
    });
    this.setState({ subTotal: subTotal });
  };

  render() {
    return (
      <div className="main-container">
        <Nav />
        <div className="ar_cartContainer">
          <h2 className="ar_cartH2">Your Cart</h2>

          {/* Renders the list of cart items if there are any */}
          {this.state.cart.length > 0 && this.state.products ? (
            this.state.cart.map((cartItem, index) => { // Finds the corresponding product details for each cart item
              const foundProduct = this.state.products.find(
                (product) => product._id === cartItem.productId
              );
              if (foundProduct) {
                return (
                  <div className="ar_cartProductInfoContainer">
                    <div className="ar_productPhotoContainer">
                      {foundProduct.photos.map((photo, photoIndex) => (
                        <img
                          className={`ar_cartMainImage${photoIndex}`}
                          key={photo._id}
                          id={photo._id}
                          alt=""
                        />
                      ))}
                    </div>
                    <div className="ar_productNameContainer">
                      <span>{foundProduct.name}</span>

                      <div className="ar_quantityContainer">
                        <button
                          className="ar_quantityBtn"
                          value={1}
                          index={index}
                          onClick={this.handleQuantityChange}
                        >
                          +
                        </button>

                        <span className="ar_itemQuantityText">
                          {this.state.cart[index].quantity}
                        </span>

                        <button
                          className="ar_quantityBtn"
                          value={-1}
                          index={index}
                          onClick={this.handleQuantityChange}
                        >
                          -
                        </button>
                      </div>
                    </div>
                    <div className="ar_productPriceContainer">
                      <span>
                        $
                        {this.state.cart[index] &&
                        this.state.cart[index].productPrice
                          ? (
                              this.state.cart[index].productPrice *
                              this.state.cart[index].quantity
                            ).toFixed(2)
                          : ""}
                      </span>
                    </div>
                  </div>
                );
              } else return <p>Couldn't load products</p>;
            })
          ) : (
            <p>No items in cart</p>
          )}

          {/* Displays the subtotal and provides a button to proceed with the purchase */}
          {this.state.cart.length > 0 ? (
            <div>
              <div className="ar_subtotalContainer">
                <span className="ar_subtotalText">Subtotal:</span>
                <span className="ar_subtotalNum">
                  ${this.state.subTotal.toFixed(2)}
                </span>
              </div>
              <div className="ar_paypalButton">
                <BuyProduct
                  price={this.state.subTotal}
                  productInfos={this.getProductInfo()}
                  quantity={this.state.quantity}
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}
