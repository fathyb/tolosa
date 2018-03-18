import {mutateProps} from '..'
import {DOMProps} from '../../element/interfaces.type'

it('should set a style property', () => {
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

	mutateProps(node, prev, {
		style: {[prop]: val}
	})

	expect(node.style[prop]).toBe(val)
})

it('should set a pixel style property', () => {
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
	const val = Math.random()

	mutateProps(node, prev, {
		style: {[prop]: val}
	})

	expect(node.style[prop]).toBe(`${val}px`)
})
