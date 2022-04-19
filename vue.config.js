const {defineConfig} = require('@vue/cli-service')
const path = require("path")
const vueSrc = "./src"
module.exports = defineConfig({
    transpileDependencies: true,
    configureWebpack: {
        resolve: {
            alias: {
                "@": path.resolve(__dirname, vueSrc)
            },
            extensions: ['.js', '.vue', '.json']
        }
    },
    devServer: {
        host: 'localhost', //target host
        port: 8080,
        proxy: {
            "/api": {
                target: "http://127.0.0.1:3000", //对应自己的接口
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    "^/api": "/api/v1"
                }
            }
        }
    }
})
