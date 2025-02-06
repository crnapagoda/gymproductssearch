const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: './scripts/main.js',
  output: {
    filename: 'main.bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new Dotenv({
      path: './.env.local', // Path to .env file (this is the default)
    }),
  ],
  mode: 'development', // Change to 'production' for production builds
};
