import React from 'react';
import ResetComponent from '../components/Reset';

const Reset = props => (
    <div>
        <p>Reset Your Password</p>
        <ResetComponent resetToken={props.query.resetToken} />
    </div>
);

export default Reset;
