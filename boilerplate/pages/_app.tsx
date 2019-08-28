import App from "next/app";
import React from "react";

import "./_app.scss";
import "../styles/normalize.scss";

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
    return <Component {...pageProps} />;
  }
}
