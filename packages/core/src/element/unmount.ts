import {DOMElement} from '.'
import {getNodeElement, isLinkedNode} from './store'

export function unmountNode(node: Node) {
	if(isLinkedNode(node)) {
		return unmountElement(getNodeElement(node))
	}

	if(node.parentNode) {
		node.parentNode.removeChild(node)
	}
}

export function unmountElement(
	{
		childs, node,
		props: {
			attributes, events, style
		}
	}: DOMElement
): void {
	let keys = Object.keys(attributes)
	let {length} = keys

	for(let i = 0; i < length; i++) {
		const key = keys[i]
		const attr = attributes[key]

		if(attr.unsubcriber !== null) {
			attr.unsubcriber()
			attr.unsubcriber = null
		}
	}

	keys = Object.keys(events)
	length = keys.length

	for(let i = 0; i < length; i++) {
		(node as any)[keys[i]] = null
	}

	if(childs !== undefined) {
		length = childs.length

		for(let i = 0; i < length; i++) {
			const {raw} = childs[i]

			if(raw.unsubcriber !== null) {
				raw.unsubcriber()
				raw.unsubcriber = null
			}
		}
	}

	if(style.unsubcriber !== null) {
		style.unsubcriber()
		style.unsubcriber = null
	}

	if(node.parentNode) {
		node.parentNode.removeChild(node)
	}
}
