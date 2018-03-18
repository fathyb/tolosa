import * as ts from 'typescript'

import {Context} from './context'
import {createImport} from './create-import'

export function updateScope(
	node: ts.Node, transCtx: ts.TransformationContext,
	context: Context, currentBag: Context['currentBag']
): ts.Node {
	if(isScopable(node) && context.currentBag && currentBag !== context.currentBag) {
		const nodeStatements = ts.isFunctionDeclaration(node)
			? node.body.statements
			: node.statements
		const statements = [
			ts.createVariableStatement(
				undefined,
				[ts.createVariableDeclaration(
					context.currentBag,
					undefined,
					ts.createObjectLiteral()
				)]
			),
			...nodeStatements
		]

		if(ts.isFunctionDeclaration(node)) {
			return ts.updateFunctionDeclaration(
				node,
				node.decorators,
				node.modifiers,
				node.asteriskToken,
				node.name,
				node.typeParameters,
				node.parameters,
				node.type,
				ts.updateBlock(node.body, statements)
			)
		}
		else if(ts.isSourceFile(node)) {
			return ts.updateSourceFileNode(
				node,
				context.importFactory
					? [
						createImport(transCtx, context.jsxFactory),
						...statements
					]
					: statements
			)
		}
		else {
			throw new Error('invariant error: unknown node type')
		}
	}

	return node
}

type WithBlock = (ts.FunctionDeclaration & {body: ts.Block}) | ts.SourceFile

function isScopable(node: ts.Node): node is WithBlock {
	return ts.isSourceFile(node) || (ts.isFunctionDeclaration(node) && node.body !== undefined)
}
