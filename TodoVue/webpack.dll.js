const webpack = require('webpack')
const library = '[name]_lib'
const path = require('path')

module.exports = {
  mode: 'production',
  entry: {
    vendors: ['vue']                                    // 对vue等库单独打包
  },

  output: {
    filename: '[name].dll.js',
    path: path.join(__dirname, 'dist'),
    library
  },

  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, 'dist/[name]-manifest.json'),
      // This must match the output.library option above
      name: library
    }),
  ],
}