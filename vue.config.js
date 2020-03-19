const path = require('path')
const TerserPlugin = require('terser-webpack-plugin')

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  publicPath: './',
  outputDir: 'dist',
  assetsDir: 'static',
  filenameHashing: true,
  lintOnSave: true,
  runtimeCompiler: false,
  transpileDependencies: [/\/node_modules\/vue-echarts\//, /\/node_modules\/resize-detector\//],
  productionSourceMap: false,
  chainWebpack: (config) => {
    config.resolve.alias.set('@', resolve('src')).set('@assets', resolve('src/assets'))
    config.module
      .rule('pug')
      .test(/\.pug$/)
      .use('pug-html-loader')
      .loader('pug-html-loader')
      .end()
  },
  pluginOptions: {
    'style-resources-loader': {
      'preProcessor': 'sass',
      'patterns': [
        resolve('./src/styles/variable.scss')
      ]
    }
  },
  css: {
    loaderOptions: {
      sass: {
        prependData: '@import "~@/assets/styles/variable.scss";'
      },
      scss: {
        prependData: '@import "~@/assets/styles/variable.scss";'
      },
      less: {
        javascriptEnabled: true
      }
    }
  },
  configureWebpack: (config) => {
    if (process.env.NODE_ENV === 'production') {
      // 返回一个将会被合并的对象
      return {
        optimization: {
          minimizer: [
            new TerserPlugin({
              sourceMap: false,
              terserOptions: {
                compress: {
                  drop_console: true, // 去除代码中的console
                  keep_fnames: true // 保持类名不被压缩
                }
              }
            })
          ]
        }
      }
    }
  }
}
