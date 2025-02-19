import React, { useState } from "react";
import styles from "./login.module.css";

const Login = ({
  email,
  password,
  handleInputChange,
  handleSubmit,
  error,
  loading,
}) => {
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isLinkSent, setIsLinkSent] = useState(false); // State to track if the link is sent

  const toggleForgotPassword = () => {
    setShowForgotPassword((prev) => !prev);
    setIsLinkSent(false); // Reset the success message if toggling back to login form
  };

  const handleSendLink = () => {
    // Here you can call your API to send the reset link
    setIsLinkSent(true); // Set the link sent status to true
  };

  const emailInputClass = error ? styles["error-border"] : "border-opacity-70";
  const passwordInputClass = error
    ? styles["error-border"]
    : "border-opacity-70";

  return (
    <div className="container-fluid h-100 font-britanica">
      {/* {loading && (
        <div
          className={`${styles.loaderOverlay} d-flex align-items-center justify-content-center`}
        >
          <img src="/assets/images/loader.svg" alt="Loading..." />
        </div>
      )} */}

      <div className="row vh-100">
        <div className="col-12 col-md-7 px-0">
          <div className={`${styles.loginBg} position-relative`}>
            <h4 className="fs-36 fw-600 text-white mb-0">
              Smart Data
              <br /> for Packaging
              <br /> Compliance.
            </h4>
          </div>
        </div>
        <div className="col-12 col-md-5 px-0">
          <div className="d-flex flex-column align-items-center justify-content-center bg-color-light-gray h-100 py-40">
            <div className="entire-login-block d-flex flex-column">
              <img
                src="/assets/images/cvs-logo-login.svg"
                className="cvs-logo-login pb-115"
                alt="cvs-logo-login"
              />
              {!showForgotPassword && (
                <>
                  <h4 className="fs-44 fw-600 text-secondary mb-3">Sign In</h4>
                </>
              )}

              {!showForgotPassword && error && (
                <div
                  className="d-flex align-items-center mb-40 fs-16"
                  style={{ color: "#D42D1F" }}
                >
                  <img
                    src="/assets/images/login-error-alert.svg"
                    alt="Error"
                    style={{ paddingRight: "8px" }}
                  />
                  <p className="mb-0">{error}</p>
                </div>
              )}

              {!showForgotPassword ? (
                <form onSubmit={handleSubmit} className="d-flex flex-column">
                  <div className="d-flex flex-column mb-32">
                    <label className="fs-18 text-color-dark mb-2 fw-600">
                      Email
                    </label>
                    <input
                      type="email"
                      className={`h-40 text-color-dark rounded-2 px-20 py-12 w-350 ls-10 fw-600 ${emailInputClass}`}
                      placeholder="vendors@asap.com"
                      value={email}
                      onChange={handleInputChange("email")}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="d-flex flex-column mb-32">
                    <label className="fs-18 text-color-dark mb-2 fw-600">
                      Password
                    </label>
                    <input
                      type="password"
                      className={`h-40 text-color-dark rounded-2 px-20 py-12 w-350 ls-10 fw-600 ${passwordInputClass}`}
                      placeholder="Enter Password"
                      value={password}
                      onChange={handleInputChange("password")}
                      required
                      disabled={loading}
                    />
                  </div>
                  <p className="fs-16 ls-4 text-color-dark opacity-80 d-none">
                    Forgot password?{" "}
                    <a
                      href="#"
                      className="text-secondary opacity-100"
                      onClick={toggleForgotPassword}
                    >
                      Reset it
                    </a>
                  </p>
                  <button
                    type="submit"
                    className="fw-600 rounded-1 bg-secondary fs-18 py-2 w-350 border-0 shadow-none text-center text-white text-uppercase ls-20"
                  >
                    Login
                    {/* {loading ? (
                      <img src="/assets/images/loader.svg" alt="Loading..." />
                    ) : (
                      "Login"
                    )} */}
                  </button>
                </form>
              ) : (
                <div className="d-flex flex-column">
                  <h4 className="fs-44 fw-500 text-secondary ls-4 mb-1">
                    Forgot Password?
                  </h4>
                  {!isLinkSent ? (
                    <>
                      <p className="fs-20 fw-300 font-poppins text-color-dark mb-40 opacity-70">
                        We will be sending Reset Password link to the registered
                        email
                      </p>

                      <form className="d-flex flex-column">
                        <div className="d-flex flex-column mb-12">
                          <label className="fs-14 ls-4 text-color-dark mb-2">
                            Email
                          </label>
                          <input
                            type="email"
                            className="h-40 text-color-dark rounded-2 px-20 py-12 w-350"
                            placeholder="vendors@asap.com"
                            required
                            disabled={loading}
                          />
                        </div>

                        <button
                          type="button"
                          className="fw-600 rounded-1 bg-secondary fs-18 py-12 w-350 border-0 shadow-none text-center text-white"
                          onClick={handleSendLink}
                          disabled={loading}
                        >
                          {loading ? (
                            <img
                              src="/assets/images/loader.svg"
                              alt="Loading..."
                            />
                          ) : (
                            "Send Link"
                          )}
                        </button>
                      </form>

                      <p className="fs-16 ls-4 text-color-dark opacity-80 my-4">
                        Remember password?{" "}
                        <a
                          href="#"
                          className="text-secondary opacity-100"
                          onClick={toggleForgotPassword}
                        >
                          Login
                        </a>
                      </p>
                    </>
                  ) : (
                    <div className="text-start">
                      <p className="fs-20 text-success mb-5">
                        Link sent successfully! Please check your email and
                        click the link to reset your password.
                      </p>
                      <button
                        className="fw-600 rounded-1 bg-secondary fs-18 py-12 w-350 border-0 shadow-none text-center text-white"
                        onClick={toggleForgotPassword}
                      >
                        Back to Login
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
