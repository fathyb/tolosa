import * as ts from 'typescript'

export function createImport(transCtx: ts.TransformationContext, factory: string) {
	switch(transCtx.getCompilerOptions().module) {
		case ts.ModuleKind.ES2015:
		case ts.ModuleKind.ESNext:
			return createEs6Import(factory)
		default:
			return createCommonJsImport(factory)
	}
}

function createEs6Import(factory: string): ts.ImportDeclaration {
	return ts.createImportDeclaration(
		undefined,
		undefined,
		ts.createImportClause(
			undefined,
			ts.createNamedImports([
				ts.createImportSpecifier(
					ts.createIdentifier('h'),
					ts.createIdentifier(factory)
				)
			])
		),
		ts.createLiteral('@tolosa/core')
	)
}

function createCommonJsImport(factory: string): ts.VariableStatement {
	return ts.createVariableStatement(
		undefined,
		[
			ts.createVariableDeclaration(
				factory,
				undefined,
				ts.createPropertyAccess(
					ts.createCall(
						ts.createIdentifier('require'),
						undefined,
						[ts.createLiteral('@tolosa/core')]
					),
					'h'
				)
			)
		]
	)
}
