import React, { Component } from 'react'

class DeleteItem extends Component {
  render() {
    return (
      <div>
        <button>{this.props.children}</button>
      </div>
    )
  }
}

export default  DeleteItem;
