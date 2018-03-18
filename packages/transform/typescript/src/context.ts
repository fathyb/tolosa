import * as ts from 'typescript'

export interface Context {
	symbols: Set<string>
	jsxFactory: string
	importFactory: boolean
	transCtx: ts.TransformationContext

	currentBag?: string
	currentKey?: ts.Expression
}

export function createContext(root: ts.Node, transCtx: ts.TransformationContext): Context {
	const symbols = collectSymbols(root)
	let {jsxFactory} = transCtx.getCompilerOptions()
	let importFactory = false

	if(!jsxFactory) {
		let counter = 0

		importFactory = true

		do {
			jsxFactory = jsxFactory === 'h'
				? `h_${(counter++).toString(16)}`
				: 'h'
		}
		while(symbols.has(jsxFactory))

		symbols.add(jsxFactory)
	}

	return {symbols, jsxFactory, importFactory, transCtx}
}

export function copyContext(from: Context, to: Context) {
	to.currentBag = from.currentBag
	to.currentKey = from.currentKey
}

function collectSymbols(block: ts.Node) {
	const symbols = new Set<string>()

	void function visit(node: ts.Node) {
		if(ts.isIdentifier(node)) {
			symbols.add(node.text)
		}

		ts.forEachChild(node, visit)
	}(block)

	return symbols
}
