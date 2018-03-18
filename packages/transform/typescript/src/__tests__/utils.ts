import {stripIndent} from 'common-tags'
import {resolve} from 'path'
import * as ts from 'typescript'

import {factory} from '..'
import {resetIdCounter} from '../create-call'

const sourceFile = resolve(__dirname, 'testfile.tsx')
const targetFile = resolve(__dirname, 'testfile.jsx')

export interface Assertion extends jest.Matchers<void> {
	toBeCompiledTo(code: string)
}

export function expectCode(code: string, withFactory = true, module = ts.ModuleKind.CommonJS): Assertion {
	const options: ts.CompilerOptions = {
		module,
		strict: true,
		noEmitOnError: false,
		target: ts.ScriptTarget.ESNext,
		jsx: ts.JsxEmit.Preserve,
		jsxFactory: withFactory ? 'h' : undefined
	}
	const host = ts.createCompilerHost(options)
	let result: string | null = null

	host.getSourceFile = (fileName, languageVersion) => {
		return ts.createSourceFile(fileName, code, languageVersion, true, ts.ScriptKind.TSX)
	}

	resetIdCounter()

	const program = ts.createProgram([sourceFile], options, host)
	const {emitSkipped, diagnostics} = program.emit(
		// sourceFile
		undefined,
		// writeFile
		(name, data) => {
			if(name === targetFile) {
				result = data
			}
		},
		// cancellationToken
		undefined,
		// emitDts
		false,
		// transformers
		{
			before: [factory]
		}
	)

	if(emitSkipped || diagnostics.length > 0) {
		throw new Error(diagnostics.map(diagnostic => diagnostic.messageText).join('\n'))
	}

	if(result === null) {
		throw new Error('no output')
	}

	code = result.replace('"use strict";\n', '').trim()

	const assert = expect(code) as Assertion

	assert.toBeCompiledTo = comp =>
		assert.toBe(stripIndent`${comp}`)

	return assert
}
