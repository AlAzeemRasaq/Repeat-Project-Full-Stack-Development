import React, { Component } from "react";
import axios from "axios";
import { SERVER_HOST } from "../config/global_constants";
import Nav from "./Nav";
import Footer from "./Footer";
import "../css/Styling.css";
import BuyProduct from "./BuyProduct";
import Cart from "./Cart";

export default class ProductPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      product: [], // Stores product details fetched from the server
      quantity: 1, // Default quantity of the product to be purchased
      item_price: 0, // Price of the item
      total: 0, // Total price for the selected quantity
      loading: true // Loading state to manage component rendering
    };
  }

  // Updates the state with the current value of input fields
  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  // Validates if the selected quantity is within the allowed range
  validateQuantity() {
    const quantity = parseInt(this.state.quantity);
    return quantity >= 1 && quantity <= 100;
  }

  // Fetches product details when the component is mounted
  componentDidMount() {
    axios
      .get(`${SERVER_HOST}/products/${this.props.match.params.id}`, {
        headers: { authorization: localStorage.token },
      })
      .then((res) => {
        if (res.data) {
          if (res.data.errorMessage) {
            console.log(res.data.errorMessage);
          } else {
            this.setState({ product: res.data });
            console.log("Succesful Request");
          }
        } else {
          console.log("Record not found");
        }
      });
  }

  // Updates the product images after the product state is updated
  componentDidUpdate(prevState) {
    /* On initial render the product.photos state isn't loaded
    So using componentDidUpdate we can make the request to 
    get the photo using filename after the state is actually updated*/
    if (this.state.product !== prevState.product) {
      // Iterate through each photo of the product
      this.state.product.photos.map((photo) => {
        return axios
          .get(`${SERVER_HOST}/products/photo/${photo.filename}`)
          .then((res) => {
            if (res.data) {
              if (res.data.errorMessage) {
                console.log(res.data.errorMessage);
              } else {
                // Set the source of each image element with base64 data
                document.getElementById(
                  photo._id
                ).src = `data:;base64,${res.data.image}`;
              }
            } else {
              console.log("Record not found");
            }
          });
      });
    }
  }

  // Handles adding the product to the cart
  handleATC = (e) => {
    e.preventDefault(); // Prevents default form submission behavior

    let formData = new FormData();

    // Append product details to the FormData object
    formData.append("productId", this.state.product._id);
    formData.append("userId", localStorage._id);
    formData.append("quantity", 1);
    formData.append("productPrice", this.state.product.price);

    axios
      .post(`${SERVER_HOST}/cart`, formData, {
        headers: {
          authorization: localStorage.token,
          "Content-type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log("Added to cart");
      })
      .catch((err) => {});
  };

  render() {
    return (
      <div className="main-container">
        <Nav />

        <div className="ar_contentContainer">
          <div className="ar_leftContainer">
            {this.state.product.photos &&
              this.state.product.photos.length > 0 &&
              this.state.product.photos.map((photo, index) => (
                <img
                  className={`ar_mainImage${index}`}
                  key={photo._id}
                  id={photo._id}
                  alt=""
                />
              ))}
          </div>
          <div className="ar_rightContainer">
            <div className="ar_titleContainer">
              <h1>{this.state.product.name}</h1>
              <div className="ar_priceDiscountConatiner">
                <div className="ar_ratingContainer">
                  <i className="fa fa-star" />
                  <i className="fa fa-star" />
                  <i className="fa fa-star" />
                  <i className="fa fa-star" />
                  <i className="fa fa-star" />
                </div>

                <h3 className="ar_discountH3">
                  €{(this.state.product.price / (1 - 0.2)).toFixed(2)}
                </h3>

                <h3 className="ar_priceH3">${this.state.product.price}</h3>
              </div>
            </div>
            <div className="ar_descriptionContainer">
              <h3>Quantity</h3>
              <input
                className="ar_quantity"
                type="number"
                name="quantity"
                min="1"
                max="100"
                onChange={this.handleChange}
                value={this.state.quantity}
              />

              {this.state.product.stock > 0 ? (
                <div className="ar_buyingButtons">
                  <button
                    className="ar_productPageAtcButton"
                    onClick={this.handleATC}
                  >
                    <p>
                      Add To Cart +<i className="fa fa-shopping-cart" />
                    </p>
                  </button>
                  <div className="ar_paypalBuyButton">
                    <BuyProduct
                      price={this.state.product.price * this.state.quantity}
                      productId={this.state.product._id}
                      quantity={this.state.quantity}
                    />
                  </div>
                </div>
              ) : (
                <p>Sorry this item is out of stock</p>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}
