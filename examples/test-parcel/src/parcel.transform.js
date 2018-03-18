const tolosa = require('@tolosa/transform-typescript')

module.exports = () => ({
	before: [tolosa.factory]
})
