import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage';

const SING_IN_MUTATION = gql`
    mutation SING_IN_MUTATION ($email: String!, $password: String!){
    signIn(email: $email, password: $password) {
        id
        email
        name
    }
}
`;

class SignIn extends Component {
    state = {
        password: '',
        email: ''
    }

    saveToState = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }
    render() {
        return (
            <Mutation mutation={SING_IN_MUTATION} variables={this.state}>
                {(singIn, { error, loading }) => {
                    return (
                        <Form method="post" onSubmit={async e => {
                            e.preventDefault();
                            await singIn();

                            this.setState({
                                email: '',
                                password: ''
                            })
                        }}>
                            <fieldset disabled={loading} aria-busy={loading}>
                                <h2>SingIn For An Account</h2>
                                <Error error={error} />
                                <label htmlFor="email">
                                    Email
                            <input type="email" name="email" placeholder="email" value={this.state.email} onChange={this.saveToState} />
                                </label>
                                <label htmlFor="password">
                                    Password
                            <input type="password" name="password" placeholder="password" value={this.state.password} onChange={this.saveToState} />
                                </label>
                                <button type="submit">SignIn</button>
                            </fieldset>
                        </Form>
                    )
                }}
            </Mutation>
        );
    }
}

export default SignIn;