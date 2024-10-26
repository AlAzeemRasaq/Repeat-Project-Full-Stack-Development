import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import axios from "axios";
import "../css/Styling.css";
import LinkInClass from "./LinkInClass";
import { SERVER_HOST } from "../config/global_constants";
import { ACCESS_LEVEL_ADMIN } from "../config/global_constants";
import Nav from "./Nav";
export default class AddProduct extends Component {
  constructor(props) {
    super(props);

    // Initializing state with default values for the form fields and redirect condition
    this.state = {
      name: "",
      price: "",
      stock: "",
      selectedFiles: null,
      redirectToDisplayAllProducts: // Determines whether to redirect to the product list
        localStorage.accessLevel < ACCESS_LEVEL_ADMIN, // Redirect for non-admin users
    };
  }

  // Lifecycle method that runs after the component is mounted
  componentDidMount() { // Focuses on the first input field when the component mounts
    this.inputToFocus.focus();
  }

  // Event handler to update state when input fields change
  handleChange = (e) => { // Updates the state with the new value for the specific input field that triggered the event
    this.setState({ [e.target.name]: e.target.value });
  };

  // Event handler to update state when files are selected
  handleFileChange = (e) => { // Updates the state with the selected files from the file input
    this.setState({ selectedFiles: e.target.files });
  };

  // Event handler for form submission
  handleSubmit = (e) => {
    e.preventDefault(); // Prevents the default form submission behavior

    let formData = new FormData(); // Creating a new FormData object to send form data including files

    // Appending form data for name, price, and stock
    formData.append("name", this.state.name);
    formData.append("price", this.state.price);
    formData.append("stock", this.state.stock);

    if (this.state.selectedFiles) { // Appending each selected file to the form data
      for (let i = 0; i < this.state.selectedFiles.length; i++) {
        formData.append("productPhotos", this.state.selectedFiles[i]);
      }
    }

    axios // Makes an HTTP POST request to add a new product using Axios
      .post(`${SERVER_HOST}/products`, formData, {
        headers: {
          authorization: localStorage.token,      // Authorization header with token
          "Content-type": "multipart/form-data",  // Header specifying the content type
        },
      })
      .then((res) => { // Redirects to display all products if the request is successful
        this.setState({ redirectToDisplayAllProducts: true });
      })
      .catch((err) => { // Sets an error state if the submission fails
        this.setState({ wasSubmittedAtLeastOnce: true });
      });
  };

  validateName() {  // Validates the product name against a pattern allowing only letters
    const pattern = /^[A-Za-z]+$/;
    return pattern.test(String(this.state.name));
  }

  validatePrice() { // Validates the price to ensure it's an integer between 1 and 1000
    const price = parseInt(this.state.price);
    return price >= 1 && price <= 1000;
  }
  validateStock() { // Validates the stock quantity to ensure it's an integer between 1 and 1000
    const stock = parseInt(this.state.stock);
    return stock >= 1 && stock <= 1000;
  }

  validate() {  // Aggregates validation results for the form fields
    return {
      name: this.validateName(),
      price: this.validatePrice(),
      stock: this.validateStock(),
    };
  }

  render() {
    let errorMessage = ""; // Displays an error message if the form was submitted and there's a validation error
    if (this.state.wasSubmittedAtLeastOnce) {
      errorMessage = (
        <div className="error">
          Product Details are invalid
          <br />
        </div>
      );
    }
  
    return (
      <div className="main-container">
        <Nav />

        <div className="ar_formContainer">
          <h2 className="ar_productFormH2">Add Product</h2>
          {this.state.redirectToDisplayAllProducts ? (
            <Redirect to="/AllProducts" />
          ) : null}
          {errorMessage} 
          <input
            ref={(input) => {
              this.inputToFocus = input;
            }}
            type="text"
            name="name"
            className="ar_productFormInput"
            value={this.state.name}
            onChange={this.handleChange}
            placeholder="Product Name"
          />
          <input
            type="text"
            name="price"
            className="ar_productFormInput"
            value={this.state.price}
            onChange={this.handleChange}
            placeholder="Price"
          />
          <input
            type="text"
            name="stock"
            className="ar_productFormInput"
            value={this.state.stock}
            onChange={this.handleChange}
            placeholder="Stock Quantity"
          />
          <div className="ar_photoUploadContainer">
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
              value="Add"
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
