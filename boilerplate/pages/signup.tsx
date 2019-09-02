import React, { Component, FormEvent } from "react";
import Link from "next/link";
import * as firebase from "firebase/app";
import "firebase/auth";

import styles from "./signup.scss";
import { signIn } from "../lib/firebase";

const DEFAULT_ERROR_MESSAGE =
  "Something went wrong. If the problem persists, please get in touch with us.";

export default class AuthPageSignIn extends Component {
  emailEl = null;
  passwordEl = null;
  passwordAgainEl = null;
  state = {
    error: null
  };

  onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const email = this.emailEl.value;
    const password = this.passwordEl.value || "";
    const passwordAgain = this.passwordAgainEl.value || "";

    if (password !== passwordAgain) {
      return this.setState({ error: "Passwords don't match" });
    }

    try {
      const credentials = await firebase.auth().createUserWithEmailAndPassword(email, password);
      credentials.user.sendEmailVerification();
      await signIn(email, password);
      window.location.assign("/");
    } catch (error) {
      const errorMessage = error.message || DEFAULT_ERROR_MESSAGE;
      this.setState({ error: errorMessage });
    }
  };

  render() {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.container}>
          <div className={styles.artworkMobile}>
            <object data="/static/images/login-artwork-mobile.svg" type="image/svg+xml" />
          </div>
          <span className={styles.formContainer}>
            <h3 className={styles.formTitle}>Create an Account</h3>

            <form role="form" noValidate onSubmit={this.onSubmit} className={styles.form}>
              {this.state.error && <div className={styles.error}>{this.state.error}</div>}

              <div className={styles.formInput}>
                <label htmlFor="email">Email</label>

                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email"
                  autoCapitalize="none"
                  autoCorrect="off"
                  autoComplete="off"
                  ref={el => (this.emailEl = el)}
                />
              </div>

              <div className={styles.formInput}>
                <label htmlFor="password">Password</label>

                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Password"
                  autoCapitalize="none"
                  autoCorrect="off"
                  autoComplete="off"
                  ref={el => (this.passwordEl = el)}
                />
              </div>

              <div className={styles.formInput}>
                <label htmlFor="password_again">Password (again)</label>

                <input
                  type="password"
                  id="password_again"
                  name="password_again"
                  placeholder="Password (again)"
                  autoCapitalize="none"
                  autoCorrect="off"
                  ref={el => (this.passwordAgainEl = el)}
                />
              </div>

              <button type="submit" className={styles.formSubmit}>
                Register
              </button>
            </form>

            <div className={styles.formFooter}>
              <p>
                If you already have an account.{" "}
                <Link href="/login">
                  <a>Log in</a>
                </Link>
              </p>
            </div>
          </span>
          <object
            className={styles.artwork}
            data="/static/images/login-artwork.svg"
            type="image/svg+xml"
          />
        </div>
      </div>
    );
  }
}
