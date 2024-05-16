module.exports = {
    runtimeCompiler: true,

    chainWebpack: config => {
		config
			.plugin('html')
			.tap(args => {
				args[0].title = 'Trẻ Trâu Online - Trẻ Trâu THPT'
				return args
			})
	},
	devServer: {
		headers: {
		  'Access-Control-Allow-Origin': '*',
		  'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
		}
	  },

    transpileDependencies: [
      'vuetify'
    ]
}
