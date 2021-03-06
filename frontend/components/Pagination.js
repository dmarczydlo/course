import React, { Component } from 'react';
import PaginationStyles from './styles/PaginationStyles';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { perPage } from '../config';
import Head from 'next/head';
import Link from 'next/link';


const PAGINATION_QUERY = gql`
    query PAGINATION_QUERY {
        itemsConnection {
            aggregate {
                count
            }
        }
    }
`;



const Pagination = props => {
    return (
        <Query query={PAGINATION_QUERY}
        >
            {({ data, error, loading }) => {
                if (loading) return <p>Loading</p>
                const count = data.itemsConnection.aggregate.count;
                const pages = Math.ceil(count / perPage);
                const { page } = props;
                return (
                    <PaginationStyles>
                        <Link
                            prefetch
                            href={{
                                pathname: '/items',
                                query: { page: page - 1 }
                            }}>
                            <a className="prev" aria-disabled={page <= 1}>Prev</a>
                        </Link>
                        <Head>
                            <title>Sick Fits Page {page} of {pages}</title>
                        </Head>
                        <p>Page {page} of {pages}</p>
                        <p>{count} item total</p>
                        <Link
                            prefetch
                            href={{
                                pathname: '/items',
                                query: { page: page + 1 }
                            }}>
                            <a className="next" aria-disabled={page >= pages}>Next</a>
                        </Link>

                    </PaginationStyles>
                )
            }}
        </Query>
    )
}

export default Pagination;