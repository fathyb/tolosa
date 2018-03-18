import * as ts from 'typescript'

import {Context} from './context'

import {parseJsxExpression} from './parse'

let idCounter = 0

// only used for tests
export function resetIdCounter() {
	idCounter = 0
}

export function createJsxCall(
	{attributes, tagName}: ts.JsxOpeningLikeElement, context: Context,
	nodeChilds: ts.NodeArray<ts.JsxChild> | null = null
): ts.CallExpression {
	if(!ts.isIdentifier(tagName)) {
		// TODO: components
		throw new Error('not supported')
	}

	let childs: ts.Expression | null = null
	let props: ts.Expression | null = null

	if(!context.currentBag) {
		const {symbols} = context
		let bagCounter = 0

		// look for an available symbol for the bag
		do {
			context.currentBag = `bag_${bagCounter++}`
		}
		while(symbols.has(context.currentBag))

		// add the symbol to prevent it from being reused
		symbols.add(context.currentBag)
	}

	let keyProp: ts.JsxAttribute | null = null

	if(attributes.properties.length > 0) {
		props = ts.createObjectLiteral(
			attributes.properties
				.filter(attr => {
					if(ts.isJsxAttribute(attr) && attr.name.text === 'key') {
						keyProp = attr

						return false
					}

					return true
				})
				.map(attr => {
					if(ts.isJsxAttribute(attr)) {
						const {initializer, name} = attr
						const init = initializer
							? ts.isStringLiteral(initializer)
								? initializer
								: parseJsxExpression(initializer, context)
							: ts.createTrue()

						if(!init) {
							throw new Error('Unable to parse JSX prop')
						}

						return ts.createPropertyAssignment(
							ts.createIdentifier(name.text),
							init
						)
					}
					else {
						return ts.createSpreadAssignment(attr.expression)
					}
				})
		)
	}
	else {
		props = ts.createNumericLiteral('0')
	}

	if(keyProp !== null) {
		const prop = keyProp as ts.JsxAttribute

		if(!prop.initializer) {
			throw new Error('key should have initializer')
		}

		// the key will be propagated to the childs
		context.currentKey = prop.initializer
	}

	if(nodeChilds) {
		const filtered = nodeChilds
			.filter(child =>
				ts.isJsxText(child)
					? !child.containsOnlyWhiteSpaces
					: true
			)
			.map(child => {
				const expr = parseJsxExpression(child, context)

				if(!expr) {
					throw new Error('Unable to parse JSX child')
				}

				return expr
			})

		if(filtered.length > 0) {
			childs = ts.createArrayLiteral(filtered)
		}
		else {
			childs = ts.createNumericLiteral('0')
		}
	}
	else {
		childs = ts.createNumericLiteral('0')
	}

	return ts.createCall(
		ts.createIdentifier(context.jsxFactory),
		undefined,
		[
			ts.createLiteral(tagName.text),
			ts.createIdentifier(context.currentBag),
			ts.createLiteral((idCounter++).toString(16)),
			context.currentKey
				? ts.getMutableClone(context.currentKey)
				: ts.createNull(),
			props,
			childs
		]
	)
}
