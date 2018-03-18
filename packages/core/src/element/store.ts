import {mutateChilds} from '../childs'
import {mutateProps} from '../props'
import {createElement} from './create'

import {Bag, DOMElement, JSXChild, JSXProps} from '.'

const link = new WeakMap<Node, DOMElement>()

export function recycleElement(
	bag: Bag, id: string, key: string | null, tag: string,
	props: JSXProps | null, childs: JSXChild[] | null
): Node {
	let cached = bag[id]

	if(!cached) {
		cached = bag[id] = createElement(tag, key || undefined, childs || undefined)

		link.set(cached.node, cached)
	}
	else if(childs !== null && cached.childs !== undefined) {
		mutateChilds(cached.node, cached.childs, childs)
	}

	if(props !== null) {
		mutateProps(cached.node, cached.props, props)
	}

	return cached.node
}

export function getNodeElement(node: Node): DOMElement {
	const element = link.get(node)

	if(element === undefined) {
		throw new Error('Cannot find node linked element')
	}

	return element
}

export function isLinkedNode(node: Node): boolean {
	return link.has(node)
}
