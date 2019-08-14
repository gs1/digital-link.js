const { resolve } = require('path');

const path = resolve(__dirname, 'dist');
const entry = './src/index.js';

/** Name cannot contain punctuation */
const library = 'digitalLinkJs';

const babelrc = {
  presets: ['@babel/preset-env'],
};

const browserConfig = {
  entry,
  output: {
    path,
    library,
    filename: 'digital-link.js.browser.js',
    libraryTarget: 'var',
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: babelrc,
      },
    }],
  },
};

module.exports = [browserConfig];
