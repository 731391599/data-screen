const path = require('path')
function resolve(dir) {
    return path.join(__dirname, dir)
}
const vueConfig = {
    assetsDir: 'static',
    publicPath: './',
    productionSourceMap: false,
    chainWebpack: config => {
        config.resolve.alias.set('@', resolve('src'))
    },
    configureWebpack: {
        module: {
            rules: [
                {
                    test: /\.mjs$/,
                    include: /node_modules/,
                    type: 'javascript/auto'
                }
            ]
        }
    },
    css: {
        loaderOptions: {
            scss: {
                prependData: `@import "~@/themes/themes.scss";@import "~@/assets/css/mixins.scss";`
            },
            postcss: {
                plugins: [
                    require('postcss-plugin-px2rem')({
                        rootValue: 19.2, //换算基数，1rem相当于10px,值为37.5时,1rem为20px,淘宝的flex默认为1rem为10px
                        // unitPrecision: 5, //允许REM单位增长到的十进制数字。
                        propWhiteList: [], //默认值是一个空数组，这意味着禁用白名单并启用所有属性。
                        // propBlackList: [], //黑名单
                        // /(node_module)\element-ui/
                        exclude: false, //默认false，可以（reg）利用正则表达式排除某些文件夹的方法，例如/(node_module)\/如果想把前端UI框架内的px也转换成rem，请把此属性设为默认值
                        // selectorBlackList: [''], //要忽略并保留为px的选择器
                        // ignoreIdentifier: false,  //（boolean/string）忽略单个属性的方法，启用ignoreidentifier后，replace将自动设置为true。
                        // replace: true, // （布尔值）替换包含REM的规则，而不是添加回退。
                        mediaQuery: true, //（布尔值）允许在媒体查询中转换px。
                        minPixelValue: 0 //设置要替换的最小像素值(3px会被转rem)。 默认 0
                    })
                ]
            }
        }
    },
    devServer: {
        port: 9000,
        open: true,
        overlay: {
            warnings: false,
            errors: true
        },
        proxy: {
            '/wangyi': {
                target: 'https://c.m.163.com/ug/',
                changeOrigin: true,
                pathRewrite: {
                    ['/wangyi']: ''
                }
            }
        }
    }
}

module.exports = vueConfig
