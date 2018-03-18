import {TestEmitter} from '../../stream/__tests__/emitter'

import {mutateProps} from '..'
import {DOMProps} from '../../element/interfaces.type'

it('should set an attribute', () => {
	const prev: DOMProps = {
		style: {
			prop: {},
			unsubcriber: null,
			current: null
		},
		events: {},
		attributes: {}
	}
	const node: any = document.createElement('div')
	const prop = 'testAttribute'
	const val = Math.random().toString()

	mutateProps(node, prev, {[prop]: val})

	expect(node[prop]).toBe(val)
	expect(prev.attributes).toHaveProperty(prop)
	expect(prev.attributes[prop].current).not.toBeNull()
	expect(prev.attributes[prop].current!.value).toBe(val)
	expect(prev.attributes[prop].prop).toBe(val)
	expect(prev.attributes[prop].unsubcriber).toBeNull()
})

it('should ignore non-html elements', () => {
	const prev: DOMProps = {
		style: {
			prop: {},
			unsubcriber: null,
			current: null
		},
		events: {},
		attributes: {}
	}
	const node: any = document.createTextNode('test')
	const prop = 'testAttribute'
	const val = Math.random().toString()

	mutateProps(node, prev, {[prop]: val})

	expect(node).not.toHaveProperty(prop)
	expect(prev.attributes).toHaveProperty(prop)
	expect(prev.attributes[prop].current).toBeNull()
	expect(prev.attributes[prop].prop).toBe(val)
	expect(prev.attributes[prop].unsubcriber).toBeNull()
})

it('should ignore redudant attributes', () => {
	const prev: DOMProps = {
		style: {
			prop: {},
			unsubcriber: null,
			current: null
		},
		events: {},
		attributes: {}
	}
	const node: any = document.createElement('div')
	const prop = 'testAttribute'
	const val = Math.random().toString()

	mutateProps(node, prev, {[prop]: val})

	node[prop] = null

	mutateProps(node, prev, {[prop]: val})

	expect(node[prop]).toBeNull()
})

it('should not ignore new attributes', () => {
	const prev: DOMProps = {
		style: {
			prop: {},
			unsubcriber: null,
			current: null
		},
		events: {},
		attributes: {}
	}
	const node: any = document.createElement('div')
	const prop = 'testAttribute'
	let val = Math.random().toString()

	mutateProps(node, prev, {[prop]: val})

	node[prop] = null
	val = Math.random().toString()

	mutateProps(node, prev, {[prop]: val})

	expect(node[prop]).not.toBeNull()
	expect(node[prop]).toBe(val)
})

it('should observe', () => {
	const prev: DOMProps = {
		style: {
			prop: {},
			unsubcriber: null,
			current: null
		},
		events: {},
		attributes: {}
	}
	const node: any = document.createElement('div')
	const prop = 'testAttribute'
	let val = Math.random().toString()
	const stream1 = new TestEmitter<string>()
	const stream2 = new TestEmitter<string>()

	expect(node).not.toHaveProperty(prop)

	mutateProps(node, prev, {[prop]: stream1})

	stream1.next(val)
	expect(node[prop]).toBe(val)

	stream1.next(val = Math.random().toString())
	expect(node[prop]).toBe(val)

	mutateProps(node, prev, {[prop]: stream2})

	const prevVal = val

	stream1.next(val = Math.random().toString())
	expect(node[prop]).toBe(prevVal)

	stream2.next(val = Math.random().toString())
	expect(node[prop]).toBe(val)
})
