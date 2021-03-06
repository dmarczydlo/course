import Link from 'next/link';
import NavStyles from './styles/NavStyles';
import User from './User';
import { Fragment } from 'react';
import SignOut from './SignOut';

const Nav = () => (

    <User>
        {({ data: { me } }) => (
            <NavStyles>

                <Link href={'/items'}>
                    <a>Shop</a>
                </Link>
                {me && (
                    <Fragment>
                        <Link href={'/sell'}>
                            <a>Sell</a>
                        </Link>
                        <Link href={'/orders'}>
                            <a>Orders</a>
                        </Link>
                        <Link href={'/account'}>
                            <a>Account</a>
                        </Link>
                        <SignOut />
                    </Fragment>
                )}
                {!me &&
                    <Link href={'/signup'}>
                        <a>Sign In</a>
                    </Link>
                }
            </NavStyles>
        )}
    </User>
);

export default Nav;
