import * as ts from 'typescript'

import {Context} from './context'
import {createJsxCall} from './create-call'

export function parseJsxExpression(node: ts.Node, context: Context): ts.Expression | null | undefined
export function parseJsxExpression(node: ts.JsxSelfClosingElement | ts.JsxElement, context: Context): ts.CallExpression
export function parseJsxExpression(node: ts.JsxText, context: Context): ts.StringLiteral

export function parseJsxExpression(node: ts.Node, context: Context): ts.Expression | null | undefined {
	if(ts.isJsxSelfClosingElement(node)) {
		return createJsxCall(node, context)
	}

	if(ts.isJsxElement(node)) {
		return createJsxCall(node.openingElement, context, node.children)
	}

	if(ts.isJsxText(node)) {
		return ts.createLiteral(node.getText())
	}

	if(ts.isJsxFragment(node)) {
		switch(node.children.length) {
			case 0:
				return ts.createNull()
			case 1:
				return parseJsxExpression(node.children[0], context)
			default:
				// TODO
				throw new Error('not supported')
		}
	}

	// TODO: when JsxExpression.expression is undefined?
	if(ts.isJsxExpression(node)) {
		return node.expression
			? ts.getMutableClone(node.expression)
			: undefined
	}

	return null
}
