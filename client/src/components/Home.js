import React, { Component } from "react";
import Nav from "./Nav";
import { Link } from "react-router-dom";
import Footer from "./Footer";
import Image from "../config/images/image.jpg"; //Image Credit  https://www.boohooman.com/ie?gclsrc=aw.ds&gad_source=1&gclid=CjwKCAiA3JCvBhA8EiwA4kujZuHPXEROAn7HVMObKQy2FsjRuX7xfmuXRcH3iBGz6TGdYcVgv-i15xoCDx0QAvD_BwE&gclsrc=aw.ds
import "../css/Styling.css";
export default class Home extends Component {
  render() {
    return (
      <div className="main-container">
        <Nav />
        <div className="ar_homeContainer">
          <h1 className="ar_homeH1">The Lego Shop</h1>

          <div class="ar_imageContainer">
            <img className="ar_homeImg" src={Image} alt="" />
          </div>
        </div>
        <Footer className="footer" />
      </div>
    );
  }
}
