module.exports = {
    outputDir: './bear',
    productionSourceMap: false,
    lintOnSave: false,

    css: {
        sourceMap: true
    },

    configureWebpack: config => {
        config.output.filename = '[name].[hash:8].js'
        config.externals = {
            // vue: 'Vue',
            'vue-router': 'VueRouter',
        }
    },

    devServer: {
        disableHostCheck: true
    }
}
