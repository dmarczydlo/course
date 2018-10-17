import React, { Component } from 'react';
import { Mutation, Query } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import formatMoney from '../lib//formatMoney';
import ErrorMessage from './ErrorMessage';
import Router from 'next/router';

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY ($id: ID!) {
    item(where: {id: $id}) {
      id
      title
      description
      price
    }
  }

`;

const UPDATE_ITEM_MUTATION = gql`
  mutation UPDATE_ITEM_MUTATION(
    $id: ID!
    $title: String!
    $description: String!
    $price: Int!
  ) {
    updateItem(
      id: $id
      title: $title
      description: $description
      price: $price
    ) {
      id
      title
      description
      price
    }
  }
`;

class UpdateItem extends Component {
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
  updateItem = async (e, udpdateItemMutation) => {
    e.preventDefault();
    const variables = {
      id: this.props.id,
      ...this.state
    };
    const res = await udpdateItemMutation({
      variables
    });
  }


  render() {
    return (
      <Query query={SINGLE_ITEM_QUERY} variables={
        { id: this.props.id }
      }>
        {({ loading, data }) => {
          if (loading) return <p>Loading....</p>
          if (!data.item) return <p>Not found item for ${this.props.id}</p>
          return (
            <Mutation mutation={UPDATE_ITEM_MUTATION} variables={this.state}>
              {(updateItem, { loading, error }) => (
                <Form onSubmit={e => this.updateItem(e, updateItem)}>
                  <ErrorMessage error={error} />
                  <fieldset disabled={loading} aria-busy={loading}>
                    <label htmlFor="title">
                      Title
                    <input
                        type="text"
                        id="title"
                        name="title"
                        placeholder="Title"
                        defaultValue={data.item.title}
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
                        defaultValue={data.item.price}
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
                        defaultValue={data.item.description}
                        onChange={this.handleChange}
                        required />
                    </label>
                    <button type="submit">Submit</button>
                  </fieldset>
                </Form>
              )}
            </Mutation>
          );
        }}
      </Query>
    )
  }
}



export default UpdateItem;
export {
  UPDATE_ITEM_MUTATION
}