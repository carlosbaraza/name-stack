import App from "next/app";
import React from "react";

import "../styles/normalize.scss";
import "../lib/firebase";

export default class MyApp extends App {
  static async getInitialProps({ Component, router: _router, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  render() {
    const { Component, pageProps } = this.props;
    return (
      <>
        <Component {...pageProps} />
        <style jsx global>
          {`
            html,
            body {
              padding: 0;
              margin: 0;
              color: #333;
              font-family: "Open Sans", Helvetica, sans-serif;
              box-sizing: border-box;
            }
          `}
        </style>
      </>
    );
  }
}
