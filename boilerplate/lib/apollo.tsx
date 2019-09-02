import React, { useMemo } from "react";
import Head from "next/head";
import { ApolloProvider } from "@apollo/react-hooks";
import { ApolloClient, InMemoryCache, HttpLink } from "apollo-boost";
import fetch from "isomorphic-unfetch";
import { isServer, isBrowser } from "./config";

let apolloClient = null;

/**
 * Creates and provides the apolloContext
 * to a next.js PageTree. Use it by wrapping
 * your PageComponent via HOC pattern.
 * @param {Function|Class} PageComponent
 * @param {Object} [config]
 * @param {Boolean} [config.ssr=true]
 */
export function withApollo(PageComponent, { ssr = true } = {}) {
  const WithApollo = ({ apolloClient, apolloState, ...pageProps }) => {
    const client = useMemo(() => apolloClient || initApolloClient(apolloState), []);
    return (
      <ApolloProvider client={client}>
        <PageComponent {...pageProps} />
      </ApolloProvider>
    );
  };

  // Set the correct displayName in development
  if (process.env.NODE_ENV !== "production") {
    const displayName = PageComponent.displayName || PageComponent.name || "Component";

    if (displayName === "App") {
      console.warn("This withApollo HOC only works with PageComponents.");
    }

    WithApollo.displayName = `withApollo(${displayName})`;
  }

  // Allow Next.js to remove getInitialProps from the browser build
  if (isServer) {
    if (ssr) {
      WithApollo.getInitialProps = async ctx => {
        const { AppTree, req } = ctx;

        let pageProps = {};
        if (PageComponent.getInitialProps) {
          pageProps = await PageComponent.getInitialProps(ctx);
        }

        // Run all GraphQL queries in the component tree
        // and extract the resulting data
        console.log(req);
        const apolloClient = initApolloClient({}, req.headers.cookie);

        try {
          // Run all GraphQL queries
          await require("@apollo/react-ssr").getDataFromTree(
            <AppTree
              pageProps={{
                ...pageProps,
                apolloClient
              }}
            />
          );
        } catch (error) {
          // Prevent Apollo Client GraphQL errors from crashing SSR.
          // Handle them in components via the data.error prop:
          // https://www.apollographql.com/docs/react/api/react-apollo.html#graphql-query-data-error
          console.error("Error while running `getDataFromTree`", error);
        }

        // getDataFromTree does not call componentWillUnmount
        // head side effect therefore need to be cleared manually
        Head.rewind();

        // Extract query data from the Apollo store
        const apolloState = apolloClient.cache.extract();

        return {
          ...pageProps,
          apolloState
        };
      };
    }
  }

  return WithApollo;
}

/**
 * Always creates a new apollo client on the server
 * Creates or reuses apollo client in the browser.
 * @param  {Object} initialState
 */
function initApolloClient(initialState?, cookie?) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (isServer) {
    return createApolloClient(initialState, cookie);
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = createApolloClient(initialState);
  }

  return apolloClient;
}

/**
 * Creates and configures the ApolloClient
 * @param  {Object} [initialState={}]
 */
function createApolloClient(initialState = {}, cookie?) {
  // Check out https://github.com/zeit/next.js/pull/4611 if you want to use the AWSAppSyncClient
  return new ApolloClient({
    connectToDevTools: isBrowser,
    ssrMode: !isBrowser, // Disables forceFetch on the server (so queries are only run once)
    link: new HttpLink({
      uri: isBrowser ? "/api/graphql" : "http://localhost:3000/api/graphql",
      credentials: "same-origin", // Additional fetch() options like `credentials` or `headers`
      // Use fetch() polyfill on the server
      headers: isBrowser ? {} : { cookie },
      fetch: !isBrowser && fetch
    }),
    cache: new InMemoryCache().restore(initialState)
  });
}
