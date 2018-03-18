import * as ts from 'typescript'

import {createContext} from './context'
import {visit} from './visit'

export const factory: ts.TransformerFactory<ts.SourceFile> =
	transCtx =>
		source =>
			source.languageVariant === ts.LanguageVariant.JSX
				? ts.visitNode(source, node => visit(node, createContext(source, transCtx)))
				: source

export const transformers = {
	before: [factory]
}
