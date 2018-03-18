import {ModuleKind} from 'typescript'

import {expectCode} from './utils'

it('should compile a self-closing element', () =>
	expectCode('const test = <div/>')
		.toBeCompiledTo(`
			var bag_0 = {};
			const test = h("div", bag_0, "0", null, 0, 0);
		`)
)

it('should compile a simple element', () =>
	expectCode('const test = <div></div>')
		.toBeCompiledTo(`
			var bag_0 = {};
			const test = h("div", bag_0, "0", null, 0, 0);
		`)
)

it('should prevent bag symbol clash', () =>
	expectCode('const bag_0 = <div></div>')
		.toBeCompiledTo(`
			var bag_1 = {};
			const bag_0 = h("div", bag_1, "0", null, 0, 0);
		`)
)

it('should auto import the factory with CommonJS', () =>
	expectCode('const test = <div></div>', false, ModuleKind.CommonJS)
		.toBeCompiledTo(`
			var h = require("@tolosa/core").h;
			var bag_0 = {};
			const test = h("div", bag_0, "0", null, 0, 0);
		`)
)

it('should auto import the factory with ES6', () =>
	[ModuleKind.ES2015, ModuleKind.ESNext].forEach(module =>
		expectCode('const test = <div></div>', false, module)
			.toBeCompiledTo(`
				import { h as h } from "@tolosa/core";
				var bag_0 = {};
				const test = h("div", bag_0, "0", null, 0, 0);
			`)
		)
)

it('should prevent auto import factory symbol clash', () =>
	expectCode('const h = <div></div>, h_0 = null', false, ModuleKind.CommonJS)
		.toBeCompiledTo(`
			var h_1 = require("@tolosa/core").h;
			var bag_0 = {};
			const h = h_1("div", bag_0, "0", null, 0, 0), h_0 = null;
		`)
)

it('should compile fragments with one child', () =>
	expectCode('const test = <><div/></>')
		.toBeCompiledTo(`
			var bag_0 = {};
			const test = h("div", bag_0, "0", null, 0, 0);
		`)
)

it('should compile fragments with no child', () =>
	expectCode('const test = <></>')
		.toBeCompiledTo('const test = null;')
)

it('should compile childs', () =>
	expectCode('const test = <div><br/></div>')
		.toBeCompiledTo(`
			var bag_0 = {};
			const test = h("div", bag_0, "1", null, 0, [h("br", bag_0, "0", null, 0, 0)]);
		`)
)
