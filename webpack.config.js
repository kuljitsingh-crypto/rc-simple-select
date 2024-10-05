// const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const { CleanWebpackPlugin } = require("clean-webpack-plugin");

// module.exports = {
//   entry: "./src/index.ts",
//   output: {
//     filename: "index.js",
//     path: path.resolve(__dirname, "dist"),
//     libraryTarget: "umd",
//     umdNamedDefine: true,
//     globalObject: "this",
//   },
//   resolve: {
//     extensions: [".ts", ".tsx", ".js", ".jsx"],
//   },
//   externals: {
//     react: "react",
//     "react-dom": "react-dom",
//   },
//   module: {
//     rules: [
//       {
//         test: /\.tsx?$/,
//         use: "ts-loader",
//         exclude: /node_modules/,
//       },
//       {
//         test: /\.css$/,
//         use: [
//           MiniCssExtractPlugin.loader,
//           {
//             loader: "css-loader",
//             options: {
//               modules: {
//                 localIdentName: "[name]__[local]___[hash:base64:5]",
//               },
//             },
//           },
//         ],
//       },
//     ],
//   },
//   plugins: [
//     new CleanWebpackPlugin(),
//     new MiniCssExtractPlugin({
//       filename: "styles.css",
//     }),
//   ],
//   mode: "production",
// };

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleScopePlugin = require("react-dev-utils/ModuleScopePlugin");
const getCSSModuleLocalIdent = require("react-dev-utils/getCSSModuleLocalIdent");

// style files regexes
const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;

const useTailwind = false;

const shouldUseSourceMap = true;

module.exports = (webpackPackArg) => {
  const { WEBPACK_BUILD } = webpackPackArg;
  const isEnvDevelopment = !WEBPACK_BUILD;
  const isEnvProduction = !!WEBPACK_BUILD;

  // common function to get style loaders
  const getStyleLoaders = (cssOptions, preProcessor) => {
    const loaders = [
      isEnvDevelopment && require.resolve("style-loader"),
      isEnvProduction && {
        loader: MiniCssExtractPlugin.loader,
        // css is located in `static/css`, use '../../' to locate index.html folder
        // in production `paths.publicUrlOrPath` can be a relative path
        // options: paths.publicUrlOrPath.startsWith(".")
        //   ? { publicPath: "../../" }
        //   : {},
      },
      {
        loader: require.resolve("css-loader"),
        options: cssOptions,
      },
      {
        // Options for PostCSS as we reference these options twice
        // Adds vendor prefixing based on your specified browser support in
        // package.json
        loader: require.resolve("postcss-loader"),
        options: {
          postcssOptions: {
            // Necessary for external CSS imports to work
            // https://github.com/facebook/create-react-app/issues/2677
            ident: "postcss",
            config: false,
            plugins: !useTailwind
              ? [
                  "postcss-flexbugs-fixes",
                  [
                    "postcss-preset-env",
                    {
                      autoprefixer: {
                        flexbox: "no-2009",
                      },
                      stage: 3,
                    },
                  ],
                  // Adds PostCSS Normalize as the reset css with default options,
                  // so that it honors browserslist config in package.json
                  // which in turn let's users customize the target behavior as per their needs.
                  "postcss-normalize",
                ]
              : [
                  "tailwindcss",
                  "postcss-flexbugs-fixes",
                  [
                    "postcss-preset-env",
                    {
                      autoprefixer: {
                        flexbox: "no-2009",
                      },
                      stage: 3,
                    },
                  ],
                ],
          },
          sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
        },
      },
    ].filter(Boolean);
    // if (preProcessor) {
    //   loaders.push(
    //     {
    //       loader: require.resolve("resolve-url-loader"),
    //       options: {
    //         sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
    //         root: paths.appSrc,
    //       },
    //     },
    //     {
    //       loader: require.resolve(preProcessor),
    //       options: {
    //         sourceMap: true,
    //       },
    //     }
    //   );
    // }
    return loaders;
  };

  const getPlugins = () => {
    const plugins = [
      isEnvDevelopment &&
        new HtmlWebpackPlugin({
          template: "./dev/index.html",
        }),
      new MiniCssExtractPlugin(),
    ].filter(Boolean);
    return plugins;
  };

  const config = {
    mode: isEnvProduction ? "production" : isEnvDevelopment && "development",
    entry: isEnvProduction
      ? "./src/index.ts"
      : isEnvDevelopment && "./dev/index.tsx",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "index.js",
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js", ".jsx", ".css"],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: "ts-loader",
          exclude: /node_modules/,
        },
        {
          test: cssRegex,
          exclude: cssModuleRegex,
          use: getStyleLoaders({
            importLoaders: 1,
            sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
            modules: {
              mode: "icss",
            },
          }),
          // Don't consider CSS imports dead code even if the
          // containing package claims to have no side effects.
          // Remove this when webpack adds a warning or an error for this.
          // See https://github.com/webpack/webpack/issues/6571
          sideEffects: true,
        },
        // Adds support for CSS Modules (https://github.com/css-modules/css-modules)
        // using the extension .module.css
        {
          test: cssModuleRegex,
          use: getStyleLoaders({
            importLoaders: 1,
            sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
            modules: {
              mode: "local",
              getLocalIdent: getCSSModuleLocalIdent,
            },
          }),
        },
      ],
    },
    plugins: getPlugins(),
    // externals: {
    //   react: "react", // Exclude react from the bundle
    //   "react-dom": "react-dom", // Exclude react-dom from the bundle
    //   node_modules: "node_modules", // Exclude node_modules from the bundle
    // },
    devServer: {
      static: {
        directory: path.join(__dirname, "public"),
      },
      compress: true,
      port: 3001,
    },
  };
  return config;
};
