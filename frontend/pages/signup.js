import React from 'react';
import SingUp from '../components/SignUp';
import SingIn from '../components/SignIn';
import Reset from '../components/RequestReset';
import styled from 'styled-components';

const Columns = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    grid-gap: 20px;
`;


const SignUpPage = props => (
    <Columns>
        <SingUp />
        <SingIn />
        <Reset />
    </Columns>
);

export default SignUpPage;
