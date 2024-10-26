import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  ACCESS_LEVEL_ADMIN,
  ACCESS_LEVEL_GUEST,
  ACCESS_LEVEL_NORMAL_USER,
  SERVER_HOST,
} from "../config/global_constants";

import "../css/Styling.css";
export default class ProductBox extends Component {
  componentDidMount() { // Iterate through each photo associated with the product
    this.props.product.photos.map((photo) => {
      return axios
        .get(`${SERVER_HOST}/products/photo/${photo.filename}`)
        .then((res) => { // If response contains data, set the image source
          if (res.data) {
            if (res.data.errorMessage) {
              console.log(res.data.errorMessage);
            } else { // Set the source of the image element with base64 data
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

  // Handle adding the product to the cart
  handleATC = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    let formData = new FormData();

    formData.append("productId", this.props.product._id);
    formData.append("userId", localStorage._id);
    formData.append("quantity", 1);
    formData.append("productPrice", this.props.product.price);

    axios
      .post(`${SERVER_HOST}/cart`, formData, {
        headers: {
          authorization: localStorage.token,
          "Content-type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.data) {
          if (res.data.errorMessage) {
            console.log(res.data.errorMessage);
          } else {
            console.log(res.data);
            console.log("Added to cart");
          }
        } else {
          console.log("Not added to cart");
        }
      });
  };

  render() {
    return (
      <div className="ar_boxContainer">
        {/* Link to the product detail page */}
        <Link to={"/ProductPage/" + this.props.product._id}>
          {/* Display product photos */}
          {this.props.product.photos.map((photo, index) => (
            <img
              key={photo._id}
              id={photo._id}
              className={`image-${index}`}
              alt=""
            />
          ))}
        </Link>

        <div className="ar_infoButtonContainer">
          <div className="ar_boxInfoContainer">
            <Link to={"/ProductPage/" + this.props.product._id}>
              <h3 className="ar_productNameP">{this.props.product.name}</h3>
            </Link>
            <div className="ar_ratingContainer">
              <i className="fa fa-star" />
              <i className="fa fa-star" />
              <i className="fa fa-star" />
              <i className="fa fa-star" />
              <i className="fa fa-star" />
            </div>
            <h4 className="ar_discountH3">
              {/* Calculate and display discounted price */}
              €{(this.props.product.price / (1 - 0.2)).toFixed(2)}
            </h4>
            <h3 className="ar_priceH3">€{this.props.product.price}</h3>
          </div>
          {localStorage.accessLevel >= ACCESS_LEVEL_ADMIN && (
            <div className="ar_boxButtonContainer">
              <Link
                className="ar_editButton"
                to={"/EditProduct/" + this.props.product._id}
              >
                <i className="fa fa-pencil" />
              </Link>
              <Link
                className="ar_delButton"
                to={"/DeleteProduct/" + this.props.product._id}
              >
                <i className="fa fa-trash-o" />
              </Link>
              {this.props.product.stock > 0 ? (
                <p>
                  <button className="ar_atcButton" onClick={this.handleATC}>
                    <p>
                      +<i className="fa fa-shopping-cart" />
                    </p>
                  </button>
                </p>
              ) : (
                <p className="ar_outOfStockP">Out of Stock</p>
              )}
            </div>
          )}
          {localStorage.accessLevel === ACCESS_LEVEL_NORMAL_USER &&
            (this.props.product.stock > 0 ? (
              <p>
                <button className="ar_atcButton" onClick={this.handleATC}>
                  <p>
                    +<i className="fa fa-shopping-cart" />
                  </p>
                </button>
              </p>
            ) : (
              <p className="ar_outOfStockP">Out of Stock</p>
            ))}
          {localStorage.accessLevel === ACCESS_LEVEL_GUEST &&
            (this.props.product.stock > 0 ? (
              <p>
                <Link className="ar_linkAtcButton" to={"/Register"}>
                  +<i className="fa fa-shopping-cart" />
                </Link>
              </p>
            ) : (
              <p className="ar_outOfStockP">Out of Stock</p>
            ))}
        </div>
      </div>
    );
  }
}
