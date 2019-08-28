import React, { Component } from "react";
import Link from "next/link";

import styles from "./login.scss";

export default class AuthPageSignIn extends Component {
  render() {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.container}>
          <div className={styles.artworkMobile}>
            <object data="/static/images/login-artwork-mobile.svg" type="image/svg+xml" />
          </div>
          <span className={styles.formContainer}>
            <div className="at-form">
              <h3 className="at-title">Create an Account</h3>

              <div className="at-pwd-form">
                <form
                  role="form"
                  id="at-pwd-form"
                  noValidate
                  action="/api/v1/users/signup"
                  method="POST"
                >
                  <div className="at-input">
                    <label htmlFor="at-field-email">Email</label>

                    <input
                      type="email"
                      id="at-field-email"
                      name="at-field-email"
                      placeholder="Email"
                      autoCapitalize="none"
                      autoCorrect="off"
                      autoComplete="off"
                    />
                  </div>

                  <div className="at-input">
                    <label htmlFor="at-field-password">Password</label>

                    <input
                      type="password"
                      id="at-field-password"
                      name="at-field-password"
                      placeholder="Password"
                      autoCapitalize="none"
                      autoCorrect="off"
                      autoComplete="off"
                    />
                  </div>

                  <div className="at-input">
                    <label htmlFor="at-field-password_again">Password (again)</label>

                    <input
                      type="password"
                      id="at-field-password_again"
                      name="at-field-password_again"
                      placeholder="Password (again)"
                      autoCapitalize="none"
                      autoCorrect="off"
                    />
                  </div>

                  <button type="submit" className="at-btn submit" id="at-btn">
                    Register
                  </button>
                </form>
              </div>

              <div className="at-signin-link">
                <p>
                  If you already have an account.{" "}
                  <Link href="/login">
                    <a id="at-signIn" className="at-link at-signin">
                      Log in
                    </a>
                  </Link>
                </p>
              </div>
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
