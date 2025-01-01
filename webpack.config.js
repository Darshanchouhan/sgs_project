const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  // Entry point of the application
  entry: "./src/index.jsx", // Entry file where React starts

  // Output configuration
  output: {
    path: path.resolve(__dirname, "dist"), // Path where bundled files will be stored
    filename: "bundle.js", // Name of the output file
  },

  // Development server configuration
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    port: 3000, // Port for dev server
    hot: true, // Enable hot module replacement
    open: true, // Automatically open browser on server start
  },

  // Module rules to handle different file types
  module: {
    rules: [
      {
        test: /\.jsx?$/, // Apply babel-loader for .js and .jsx files
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
      {
        test: /\.scss$/, // Apply sass-loader, css-loader, and style-loader for .scss files
        use: [
          "style-loader", // Injects CSS into the DOM
          "css-loader", // Resolves CSS imports and dependencies
          "sass-loader", // Compiles SCSS to CSS
        ],
      },
      {
        test: /\.(jpg|jpeg|png|gif|svg)$/, // Handle image files
        use: {
          loader: "file-loader",
          options: {
            name: "[name].[hash].[ext]",
            outputPath: "images/", // Save images to dist/images
          },
        },
      },
    ],
  },

  // Plugins to generate HTML file and other optimizations
  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html", // Reference index.html in the parent folder
    }),
  ],

  // Enable source maps for debugging
  devtool: "source-map",

  // Resolve extensions (to handle .jsx files)
  resolve: {
    extensions: [".js", ".jsx"], // Add .jsx to resolve
  },
};
