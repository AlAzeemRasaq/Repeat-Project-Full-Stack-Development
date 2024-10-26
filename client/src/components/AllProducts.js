import React, { Component } from "react";
import ProductBox from "./ProductBox";
import Nav from "./Nav";
import axios from "axios";
import Footer from "./Footer";
import { SERVER_HOST } from "../config/global_constants";
import { Link } from "react-router-dom";
import { ACCESS_LEVEL_ADMIN } from "../config/global_constants";
import "../css/Styling.css";
export default class AllProducts extends Component {
  constructor(props) {
    super(props);

    this.state = { // Initializing state with empty arrays for products and their original unfiltered list
      products: [],
      originalProducts: [],
    };
  }

  componentDidMount() { // Lifecycle method that runs after the component is mounted
    axios.get(`${SERVER_HOST}/products`).then((res) => { // Makes an HTTP GET request to fetch all products using Axios
      if (res.data) { // Checks if the response contains data
        if (res.data.errorMessage) { // Logs error message if there is an error in the response data
          console.log(res.data.errorMessage);
        } else { // Updates state with the fetched products for both display and original state
          this.setState({ products: res.data, originalProducts: res.data });
        }
      } else { // Logs a message if no data was found
        console.log("Record not found");
      }
    });
  }

  handleSearchChange = (e) => { // Event handler to filter products based on the search input value
    const originalProducts = this.state.originalProducts;

    // Filters products by matching the search term with the product name
    const selectedProducts = originalProducts.filter((product) =>
      product.name.toLowerCase().includes(e.target.value.toLowerCase())
    );

    // Updates the state with the filtered products
    this.setState({ products: selectedProducts });
  };

  // Event handler to sort products based on the selected sort option
  handleSortChange = (e) => {
    const products = this.state.products;
    let selectedProducts;

    if (e.target.value === "alphabet-asc") {
      selectedProducts = products.slice().sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
    } else if (e.target.value === "alphabet-dsc") {
      selectedProducts = products.slice().sort((a, b) => {
        return b.name.localeCompare(a.name);
      });
    } else if (e.target.value === "price-asc") {
      selectedProducts = products.slice().sort((a, b) => {
        return a.price - b.price;
      });
    } else if (e.target.value === "price-dsc") {
      selectedProducts = products.slice().sort((a, b) => {
        return b.price - a.price;
      });
    } else { // Resets to the original list if "default" option is selected
      return this.setState({ products: this.state.originalProducts });
    }

    // Updates the state with the sorted products
    this.setState({ products: selectedProducts });
  };

  // Event handler to filter products based on stock availability
  handleStockChange = (e) => {
    const { originalProducts } = this.state;
    let filteredProducts;

    // Filters products that are in stock
    if (e.target.value === "available") {
      filteredProducts = originalProducts.filter(
        (product) => product.stock > 0
      );
    } 
    // Filters products that are out of stock
    else if (e.target.value === "unavailable") {
      filteredProducts = originalProducts.filter(
        (product) => product.stock <= 0
      );
    } else { // Resets to the original list if "all" option is selected
      return this.setState({ products: this.state.originalProducts });
    }

    // Updates the state with the filtered products
    this.setState({ products: filteredProducts });
  };

  render() {
    return (
      <div className="main-container">
        <Nav />
        <div className="ar_headingContainer">
          <h1 className="ar_headingH1">Products</h1>
        </div>

        {/* Container for search, filter, and sort controls */}
        <div className="ar_toolButtonsContainer">

          {/* Search box for filtering products by name */}
          <div className="ar_searchBoxContainer">
            <input
              className="search-box"
              placeholder="Search by name"
              value={this.state.search}
              onChange={this.handleSearchChange}
            />
          </div>

          {/* Dropdown for filtering products by stock availability */}
          <div className="ar_filterContainer">
            <label>Filter </label>
            <select
              name="price"
              className="dropdown1"
              onChange={this.handleStockChange}
            >
              <option key="all" value="all">
                All
              </option>
              <option key="available" value="available">
                In Stock
              </option>
              <option key="unavailable" value="unavailable">
                Out of Stock
              </option>
            </select>
          </div>

          {/* Dropdown for sorting products by name or price */}
          <div className="ar_sortDropdownContainer">
            <label>Sort By : </label>
            <select
              name="price"
              className="dropdown1"
              onChange={this.handleSortChange}
            >
              <option key="default" value="default">
                Default
              </option>
              <option key="alphabet-asc" value="alphabet-asc">
                Alphabetically, A-Z
              </option>
              <option key="alphabet-dsc" value="alphabet-dsc">
                Alphabetically, Z-A
              </option>
              <option key="price-asc" value="price-asc">
                Price, low to high
              </option>
              <option key="price-dsc" value="price-dsc">
                Price , high to low
              </option>
            </select>
          </div>

          {/* Display "Add New Product" button only for admin users */}
          {localStorage.accessLevel >= ACCESS_LEVEL_ADMIN ? (
            <div className="ar_addProductContainer">
              <Link className="ar_blueButton" to={"/AddProduct"}>
                Add New Product
              </Link>
            </div>
          ) : null}
        </div>

        {/* Container for displaying the list of products */}
        <div className="ar_collectionContainer">
          {this.state.products.map((product) => (
            <div className="ar_productBoxContainer">
              {/* Renders each product in a ProductBox component */}
              <ProductBox key={product._id} product={product} />
            </div>
          ))}
        </div>
        <Footer />
      </div>
    );
  }
}