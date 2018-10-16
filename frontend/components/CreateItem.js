import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import formatMoney from '../lib//formatMoney';
import ErrorMessage from './ErrorMessage';
import Router from 'next/router';

const CREATE_ITEM_MUTATION = gql`
  mutation CREATE_ITEM_MUTATION(
    $title: String!
    $description: String!
    $price: Int!
    $image: String
    $largeImage: String
  ) {
    createItem(
      title: $title
      description: $description
      price: $price
      image: $image
      largeImage: $largeImage
    ) {
      id
    }
  }
`;

class CreateItem extends Component {
  state = {
    title: '',
    price: 0,
    description: '',
    image: '',
    largeImage: '',
  }
  handleChange = e => {
    const { name, type, value } = e.target
    this.setState({ [name]: type === 'number' ? parseFloat(value) : value });
  }

  uploadFile = async e => {
    const files = e.target.files;
    const data = new FormData();
    data.append('file', files[0]);
    data.append('upload_preset', 'course');

    const URL = "https://api.cloudinary.com/v1_1/dtrczjgit/image/upload";
    const res = await fetch(URL, {
      method: 'POST',
      body: data
    });

    const file = await res.json();

    this.setState({
      image: file.secure_url,
      largeImage: file.eager[0].secure_url
    });
  }


  render() {
    return (
      <Mutation mutation={CREATE_ITEM_MUTATION} variables={this.state}>
        {(createItem, { loading, error }) => (
          <Form onSubmit={async e => {
            e.preventDefault();
            const res = await createItem();
            Router.push({
              pathname: '/item',
              query: { id: res.data.createItem.id }
            })
          }}>
            <ErrorMessage error={error} />
            <fieldset disabled={loading} aria-busy={loading}>
              <label htmlFor="title">
                Title
              <input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="Title"
                  value={this.state.title}
                  onChange={this.handleChange}
                  required />
                {this.state.image && <img src={this.state.image} alt="Uplaod preview" />}
              </label>
              <label htmlFor="price">
                Price
              <input
                  type="number"
                  id="price"
                  name="price"
                  placeholder="Price"
                  value={this.state.price}
                  onChange={this.handleChange}
                  required />
              </label>
              <label htmlFor="description">
                Description
              <textarea
                  type="text"
                  id="description"
                  name="description"
                  placeholder="Description"
                  value={this.state.description}
                  onChange={this.handleChange}
                  required />
              </label>
              <label htmlFor="image">
                Image
              <input
                  type="file"
                  id="file"
                  name="file"
                  placeholder="Image"
                  onChange={this.uploadFile}
                  required />
              </label>


              <button type="submit">Submit</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    )
  }
}



export default CreateItem;
export {
  CREATE_ITEM_MUTATION
}