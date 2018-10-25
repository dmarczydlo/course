import React, { Component } from 'react'
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { ALL_ITEMS_QUERY } from './Items';


const DELETE_ITEM_MUTATION = gql`
  mutation DELETE_ITEM_MUTATION($id: ID!){
    deleteItem(id: $id){
      id
    }
  }
`;

class DeleteItem extends Component {
  update = (cache, payload) => {
    //manually update the cache on the client
    //1. Read the cache for the items we want
    const data = cache.readQuery({ query: ALL_ITEMS_QUERY });
    //2. Filter the deleted items
    data.items = data.items.filter(item => item.id !== payload.data.deleteItem.id);
    console.log(data);
    //3. put the items back
    cache.writeQuery({ query: ALL_ITEMS_QUERY, data });
  }
  render() {
    return (

      <Mutation
        mutation={DELETE_ITEM_MUTATION}
        update={this.update}
        variables={{
          id: this.props.id
        }}>
        {(deleteItem, { error }) => (
          <button onClick={() => {
            if (confirm('Are you want to delete it? ')) {
              deleteItem();
            }
          }}>
            {this.props.children}
          </button>
        )}
      </Mutation>

    )
  }
}

export default DeleteItem;
