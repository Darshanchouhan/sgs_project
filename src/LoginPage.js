import React from "react";
import "./style.css";

const LoginPage = () => {
    return (
        <div className="container-fluid p-40 vh-100">
            <div className="row h-100">
                {/* Left Section */}
                <div className="col-12 col-md-7 px-0">
                    <div className="login-bg rounded-start-3"></div>
                </div>

                {/* Right Section */}
                <div className="col-12 col-md-5 px-0">
                    <div className="d-flex flex-column align-items-center justify-content-center bg-color-light-gray h-100 rounded-end-3 font-poppins">
                        <div className="d-flex flex-column">
                            {/* Title */}
                            <h4 className="fs-44 fw-500 text-secondary ls-4 mb-1">Login</h4>
                            <p className="fs-20 fw-300 font-poppins text-color-dark mb-40 opacity-70">
                                Welcome back!
                            </p>

                            {/* Email Input */}
                            <div className="d-flex flex-column mb-40">
                                <label className="fs-14 ls-4 text-color-dark mb-2">Email</label>
                                <input
                                    type="email"
                                    className="h-40 text-color-dark rounded-2 border border-opacity-70 px-20 py-12 w-350"
                                    placeholder="vendors@asap.com"
                                />
                            </div>

                            {/* Password Input */}
                            <div className="d-flex flex-column mb-12">
                                <label className="fs-14 ls-4 text-color-dark mb-2">Password</label>
                                <input
                                    type="password"
                                    className="h-40 text-color-dark rounded-2 border border-opacity-70 px-20 py-12 w-350"
                                    placeholder="Enter Password"
                                />
                            </div>

                            {/* Forgot Password */}
                            <p className="fs-16 ls-4 text-color-dark opacity-80">
                                Forgot password?{" "}
                                <a href="#" className="text-secondary opacity-100">
                                    Reset it
                                </a>
                            </p>

                            {/* Login Button */}
                            <button
                                type="button"
                                className="fw-600 rounded-1 bg-secondary fs-18 py-12 w-350 border-0 shadow-none text-center text-white"
                            >
                                Login
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
