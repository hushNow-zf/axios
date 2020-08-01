module.exports = {
  devServer: {
    hot: true,
    open: false,
    // 跨域
    proxy: {
      '/api': {
        target: 'http://localhost:3000/',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
}