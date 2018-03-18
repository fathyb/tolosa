const {realpathSync} = require('fs')
const resolve = require('resolve')

module.exports = (modulePath, options) =>
	realpathSync(
		resolve.sync(modulePath, {
			...options,
			preserveSymlinks: false,
			packageFilter: (pkg, path) => {
				pkg.main = pkg['typescript:source'] || pkg.main

				return pkg
			}
		})
	)
