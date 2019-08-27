import * as React from "react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";

export const USER_QUERY = gql`
  query currentUser {
    currentUser {
      email
    }
  }
`;

export function Navbar() {
  const { loading, error, data, fetchMore, networkStatus } = useQuery(USER_QUERY, {
    notifyOnNetworkStatusChange: true
  });

  return (
    <div>
      <span className="logo">Wisertag</span>
      <span>{loading ? "Loading..." : data.currentUser.email}</span>

      <style jsx>
        {`
          .logo {
            color: red;
          }
        `}
      </style>
    </div>
  );
}
