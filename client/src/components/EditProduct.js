import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import axios from "axios";
import "../css/Styling.css";
import LinkInClass from "./LinkInClass";
import Nav from "./Nav";

import { SERVER_HOST } from "../config/global_constants";

export default class EditProduct extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: ``,
      price: ``,
      stock: ``,
      photos: "",
      selectedFiles: null,
      redirectToDisplayAllProducts: false,
    };
  }

  componentDidMount() {
    this.inputToFocus.focus(); // Set focus on the first input field

    // Fetch the existing product details
    axios
      .get(`${SERVER_HOST}/products/${this.props.match.params.id}`, {
        headers: { authorization: localStorage.token },
      })
      .then((res) => {
        this.setState({
          name: res.data.name,
          price: res.data.price,
          stock: res.data.stock,
          photos: res.data.photos,
        });
      })
      .catch((err) => {
        // do nothing
      });
  }

  handleChange = (e) => { // Updates state with the value from input fields
    this.setState({ [e.target.name]: e.target.value });
  };

  handleFileChange = (e) => { // Updates state with the selected files
    this.setState({ selectedFiles: e.target.files });
  };

  handleSubmit = (e) => {
    e.preventDefault(); // Prevents the default form submission

    this.setState({ wasSubmittedAtLeastOnce: true });

    const formInputsState = this.validate(); // Validates form inputs

    if (Object.keys(formInputsState).every((index) => formInputsState[index])) {
      let formData = new FormData();

      formData.append("name", this.state.name);
      formData.append("price", this.state.price);
      formData.append("stock", this.state.stock);

      if (this.state.selectedFiles) { // Appends selected files to the form data
        for (let i = 0; i < this.state.selectedFiles.length; i++) {
          formData.append("productPhotos", this.state.selectedFiles[i]);
        }
      }

      axios
        .put( // Sends the updated product data to the server
          `${SERVER_HOST}/products/${this.props.match.params.id}`,
          formData,
          {
            headers: { authorization: localStorage.token },
          }
        )
        .then((res) => {
          this.setState({ redirectToDisplayAllProducts: true });
        })
        .catch((err) => {
          this.setState({ wasSubmittedAtLeastOnce: true });
        });
    }
  };

  validateName() {
    const pattern = /^[A-Za-z]+$/;
    return pattern.test(String(this.state.name));
  }

  validatePrice() {
    const price = parseInt(this.state.price);
    return price >= 1 && price <= 1000;
  }

  validateStock() {
    const stock = parseInt(this.state.stock);
    return stock <= 1000;
  }

  validate() {
    return {
      name: this.validateName(),
      price: this.validatePrice(),
      stock: this.validateStock(),
    };
  }

  render() {
    let errorMessage = "";
    if (this.state.wasSubmittedAtLeastOnce) {
      errorMessage = (
        <div className="error">
          Product Details are incorrect
          <br />
        </div>
      );
    }
    return (
      <div className="main-container">
        <Nav />
        <div className="ar_formContainer">
          <h2 className="ar_productFormH2">Edit Product</h2>
          {this.state.redirectToDisplayAllProducts ? (
            <Redirect to="/AllProducts" />
          ) : null}

          {errorMessage}
          <div className="ar_inputLabelContainer">
            <label className="ar_editLabel">Product Name :</label>
            <input
              ref={(input) => {
                this.inputToFocus = input;
              }}
              type="text"
              name="name"
              className="ar_editFormInput"
              value={this.state.name}
              onChange={this.handleChange}
              placeholder="Product-Name"
            />
          </div>
          <div className="ar_inputLabelContainer">
            <label className="ar_editLabel">Price :</label>
            <input
              type="text"
              name="price"
              className="ar_editFormInput"
              value={this.state.price}
              onChange={this.handleChange}
              placeholder="Price"
            />
          </div>

          <div className="ar_inputLabelContainer">
            <label className="ar_editLabel">Product Stock :</label>
            <input
              type="text"
              name="stock"
              className="ar_editFormInput"
              value={this.state.stock}
              onChange={this.handleChange}
              placeholder="Stock-Quantity"
            />
          </div>
          <div className="photo-upload-container">
            <input
              type="file"
              id="fileInput"
              className="ar_fileInput"
              multiple
              onChange={this.handleFileChange}
              style={{
                border: "1px solid #ced4da",
                borderRadius: ".25rem",
                padding: ".375rem .75rem",
              }}
            />
          </div>

          <div className="ar_addCancelContainer">
            <LinkInClass
              value="Edit"
              className="ar_addButton"
              onClick={this.handleSubmit}
            />

            <Link className="ar_cancelButton" to={"/AllProducts"}>
              Cancel
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
