import * as React from "react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import firebase from "firebase/app";

import styles from "./Navbar.scss";

export const USER_QUERY = gql`
  query currentUser {
    currentUser {
      email
    }
  }
`;

function signOut() {
  firebase.auth().signOut();
}

export function Navbar() {
  const { loading, error, data, fetchMore, networkStatus } = useQuery(USER_QUERY, {
    notifyOnNetworkStatusChange: true
  });

  return (
    <div className={styles.container}>
      <span className={styles.logo}>Wisertag</span>

      <div className={styles.menu}>
        <span>{loading ? "Loading..." : data.currentUser.email}</span>
        <a href="/logout">Log out</a>
      </div>
    </div>
  );
}
