import styles from "./login.module.css";

const Login = ({
  email,
  password,
  handleInputChange,
  handleSubmit,
  error,
  loading,
}) => {
  return (
    <div className="container-fluid p-40 h-100">
      <div className="row h-100">
        <div className="col-12 col-md-7 px-0">
          <div
            className={`${styles.loginBg} ${"rounded-start-3 position-relative"}`}
          >
            <div className={`${styles.loginFloatSection} ${"px-70 py-30"}`}>
              <p className="fs-48 text-white mb-0 px-12 font-mulish fw-700">
                AI for Sustainable <br /> Packaging Platform
              </p>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-5 px-0">
          <div className="d-flex flex-column align-items-center justify-content-center bg-color-light-gray h-100 rounded-end-3 font-poppins py-40">
            <div className="d-flex flex-column">
              <img
                src="/assets/images/cvs-logo.svg"
                className="cvs-logo-login pb-115"
                alt="cvs-logo"
              />
              <h4 className="fs-44 fw-500 text-secondary ls-4 mb-1">Login</h4>
              <p className="fs-20 fw-300 font-poppins text-color-dark mb-40 opacity-70">
                Welcome back !
              </p>
              {/* Login Form */}
              <form onSubmit={handleSubmit} className="d-flex flex-column">
                {/* Email input */}
                <div className="d-flex flex-column mb-12">
                  <label className="fs-14 ls-4 text-color-dark mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="h-40 text-color-dark rounded-2 border border-opacity-70 px-20 py-12 w-350"
                    placeholder="vendors@asap.com"
                    value={email}
                    onChange={handleInputChange("email")}
                    required
                  />
                </div>

                {/* Password input */}
                <div className="d-flex flex-column mb-12">
                  <label className="fs-14 ls-4 text-color-dark mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    className="h-40 text-color-dark rounded-2 border border-opacity-70 px-20 py-12 w-350"
                    placeholder="Enter Password"
                    value={password}
                    onChange={handleInputChange("password")}
                    required
                  />
                </div>

                {/* Forgot password */}
                <p className="fs-16 ls-4 text-color-dark opacity-80">
                  forgot password?{" "}
                  <a href="#" className="text-secondary opacity-100">
                    reset it
                  </a>
                </p>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="fw-600 rounded-1 bg-secondary fs-18 py-12 w-350 border-0 shadow-none text-center text-white"
                >
                  Login
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
