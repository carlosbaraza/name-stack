const withPlugins = require("next-compose-plugins");
const sass = require("@zeit/next-sass");

module.exports = withPlugins([
  [
    sass,
    {
      cssModules: true,
      cssLoaderOptions: {
        importLoaders: 1,
        localIdentName: "[local]___[hash:base64:5]"
      }
    }
  ]
]);
