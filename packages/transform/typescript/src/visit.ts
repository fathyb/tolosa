import * as ts from 'typescript'

import {Context, copyContext} from './context'
import {parseJsxExpression} from './parse'
import {updateScope} from './update-scope'

export function visit(
	visitNode: ts.Node,
	parentContext: Context
): ts.Node | undefined {
	const context = {...parentContext}
	const {currentBag} = context
	const parsed = parseJsxExpression(visitNode, context)
	let node: ts.Node | undefined = parsed === null
		? visitNode
		: parsed

	if(node !== undefined) {
		node = updateScope(
			ts.visitEachChild(
				node,
				child => visit(child, context),
				context.transCtx
			),
			context.transCtx, context, currentBag
		)
	}

	copyContext(context, parentContext)

	return node
}
