import React from "react";
import Link from "next/link";
import { withApollo } from "../../lib/apollo";
import { Navbar } from "../../components/Navbar";

interface props {
  userAgent: string;
}

function GeneratorPage(props: props) {
  return (
    <div>
      <Navbar />
      <div>Hello World {props.userAgent}</div>
      <div>
        <Link href="/">
          <a>Go to home</a>
        </Link>
      </div>
    </div>
  );
}

GeneratorPage.getInitialProps = async ({ req }) => {
  const userAgent = req ? req.headers["user-agent"] : navigator.userAgent;
  return { userAgent };
};

export default withApollo(GeneratorPage);
