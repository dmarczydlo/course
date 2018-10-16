import React from 'react';
import Link from 'next/link';
import Items from '../components/items';

const Home = props => (
    <div>
        <p>{'Home'}</p>
        <Link href={'/sell'}>
            <a>Sell</a>
        </Link>
        <Items />
    </div>
);

export default Home;
