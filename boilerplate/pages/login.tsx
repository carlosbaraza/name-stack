import React, { Component, FormEvent } from "react";
import Link from "next/link";
import Router from "next/router";
import firebase from "firebase/app";
import "firebase/auth";

import styles from "./login.scss";
import { signIn } from "../lib/firebase";
const DEFAULT_ERROR_MESSAGE =
  "Something went wrong. If the problem persists, please get in touch with us.";

export default class AuthPageLogIn extends Component {
  emailEl = null;
  passwordEl = null;
  state = {
    error: null
  };

  onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const email = this.emailEl.value;
    const password = this.passwordEl.value;

    try {
      await signIn(email, password);
      window.location.assign("/");
    } catch (e) {
      this.setState({ error: e.message || DEFAULT_ERROR_MESSAGE });
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
            <h3 className={styles.formTitle}>Log in</h3>

            <form
              onSubmit={this.onSubmit}
              role="form"
              noValidate
              action="#"
              method="POST"
              className={styles.form}
            >
              {this.state.error && <div className={styles.error}>{this.state.error}</div>}

              <div className={styles.formInput}>
                <label htmlFor="login_username">Email</label>

                <input
                  type="email"
                  id="login_username"
                  name="login_username"
                  placeholder="Email"
                  autoCapitalize="none"
                  autoCorrect="off"
                  autoComplete="off"
                  ref={el => (this.emailEl = el)}
                />
              </div>

              <div className={styles.formInput}>
                <label htmlFor="login_password">Password</label>

                <input
                  type="password"
                  id="login_password"
                  name="login_password"
                  placeholder="Password"
                  autoCapitalize="none"
                  autoCorrect="off"
                  autoComplete="off"
                  ref={el => (this.passwordEl = el)}
                />
              </div>

              <button type="submit" className={styles.formSubmit}>
                Log in
              </button>
            </form>

            <div className={styles.formFooter}>
              <p>
                Don't have an account?{" "}
                <Link href="/signup">
                  <a>Sign up now</a>
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
