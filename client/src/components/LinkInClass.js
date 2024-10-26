import React, { Component } from "react";

export default class LinkInClass extends Component {
  render() {
    return (
      <span
        tabIndex="0" // Allows the span to receive keyboard focus and be navigable
        className={this.props.className} // Applies the (S)CSS class provided via props for styling
        onClick={(event) => { // Handles click events on the span
          this.props.onClick(event); // Calls the onClick handler function passed as a prop
        }}
      >
        {this.props.value}
      </span>
    );
  }
}
