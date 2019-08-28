import React, { Component, FormEvent } from "react";
import Link from "next/link";
import Router from "next/router";

import styles from "./login.scss";

export default class AuthPageLogIn extends Component {
  emailEl = null;
  passwordEl = null;
  state = {
    error: null
  };

  onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new URLSearchParams();
    formData.append("email", this.emailEl.value);
    formData.append("password", this.passwordEl.value);

    const response = await fetch("http://localhost:3000/api/v1/users/login", {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });

    if (response.status === 200) {
      this.setState({ error: null });
      const user = await response.json();
      Router.push("/");
    } else if (response.status === 400) {
      this.setState({ error: "Some information is missing" });
    } else if (response.status === 401) {
      this.setState({ error: "The email or password don't match our records" });
    } else {
      this.setState({
        error:
          "Oops, something went wrong. If you continue having issues, please let us know at support@wisertag.com, and we'll jump into it to unblock you."
      });
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
            <div className="at-form">
              <h3 className="at-title">Log in</h3>
              {this.state.error && <div className={styles.error}>{this.state.error}</div>}

              <div className="at-pwd-form">
                <form
                  onSubmit={this.onSubmit}
                  role="form"
                  id="at-pwd-form"
                  noValidate
                  action="#"
                  method="POST"
                >
                  <div className="at-input">
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

                  <div className="at-input">
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

                  <button type="submit" className="at-btn submit" id="at-btn">
                    Log in
                  </button>
                </form>
              </div>

              <div className="at-signin-link">
                <p>
                  New to Wisertag?{" "}
                  <Link href="/signup">
                    <a id="at-signUp" className="at-link at-signup">
                      Sign up now
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
