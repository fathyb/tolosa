import {DOMChild, DOMElement, JSXChild} from '.'
import {mutateChild} from '../childs'
import {observe} from '../stream'

const empty = {}

export function createElement(tag: string, key: string | undefined, childs: JSXChild[] | undefined): DOMElement {
	const node = document.createElement(tag)

	return {
		key, node,
		props: {
			style: {
				prop: empty,
				current: {
					value: empty
				},
				unsubcriber: null
			},
			events: {},
			attributes: {}
		},
		childs: childs === undefined
			? undefined
			: childs.map((child, index) => {
				const obj: DOMChild = {
					type: 'partial',
					raw: {
						value: child,
						unsubcriber: null
					}
				}

				obj.raw.unsubcriber = observe(child, value => mutateChild(node, index, obj, value))

				return obj
			})
	}
}
