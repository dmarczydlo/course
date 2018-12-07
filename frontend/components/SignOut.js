import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import { CURRENT_USER_QUERY } from './User';
import gql from 'graphql-tag';

const SIGN_OUT_MUTATION = gql`
    mutation SIGN_OUT_MUTATION {
        signOut {
            message
        }
    }
`;

const SingOut = props => (
    <Mutation
        mutation={SIGN_OUT_MUTATION}
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}
    >
        {(signOut) => <button onClick={() => signOut()}>Sign Out</button>}
    </Mutation>

)

export default SingOut;