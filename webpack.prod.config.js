const { resolve } = require('path');
const CopyModulesPlugin = require("copy-modules-webpack-plugin");
const nodeExternals = require('webpack-node-externals');

const root = resolve(__dirname, '..');
const node_modules = resolve(root, 'node_modules');

module.exports = {
  target: 'node',
  entry: {
      index: ['./src/main/index'],
  },
  resolve: {
    mainFields: ['module', 'browser', 'main'],
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
  },
  output: {
    filename: '[name].js',
  },
  node: {
    __dirname: false,
    __filename: false,
  },
  stats: {
    colors: true,
    modules: false,
    children: false,
  },
  performance: {
    hints: false,
  },
  externals: {
    express: 'express',
  },
  module: {
    rules: [
        {
            test: /\.m?([jt])sx?$/,
            exclude: node_modules,
            loader: 'babel-loader',
            options: {
              presets: [
                  [
                    "@babel/preset-env",
                    {
                      "targets": {
                        "node": "12.16.3"
                      }
                    }
                  ],
              ],
          },
        },
        {
            test: /\.m?([jt])sx?$/,
            loader: 'babel-loader',
            include: node_modules,
            exclude: [/@babel(?:\/|\\{1,2})runtime/, /core-js/],
            options: {
                presets: [
                    [
                      "@babel/preset-env",
                      {
                        "targets": {
                          "node": "12.16.3"
                        }
                      }
                    ],
                ],
            },
        },
    ],
  },
  plugins: [
    new CopyModulesPlugin({
      destination: 'webpack-modules'
    })
  ]
};
