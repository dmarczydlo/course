import React, { Component } from 'react'
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';
import Item from './item';

const ALL_ITEMS_QUERY = gql`
  query ALL_ITEMS_QUERY {
    items {
      id
      title
      price
      description
      image
      largeImage
    }
  }
 `;

const Center = styled.div`
  text-align: center;
`;

const ItemList = styled.div`
  display: grid;
  grid-auto-columns: 1fr 1fr;
  grid-gap: 60px;
  max-width: ${props => props.theme.maxWidth};
  margin: 0 auto;
`;

class Items extends Component {
  render() {
    return (
      <Center>
        <p>Items</p>
        <Query query={ALL_ITEMS_QUERY}>
          {({ data, error, loading }) => {
            console.log(data);
            return <ItemList>
              {data.items.map(item => <Item key={item.id} item={item}>{item.title}</Item>)}
            </ItemList>
          }}
        </Query>
      </Center>
    )
  }
}

export default Items;