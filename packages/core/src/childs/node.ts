import {DOMChild, DOMChildElement} from '../element'
import {unmountNode} from '../element/unmount'

export function mutateNodeChild(parent: Node, position: number, prev: DOMChild, next: Node) {
	if(prev.type === 'node' && prev.node === next) {
		return
	}

	if(prev.type === 'partial') {
		parent.insertBefore(next, parent.childNodes[position] || null)
	}
	else if(prev.type === 'list') {
		throw new Error('Cannot replace array by node')
	}
	else {
		parent.replaceChild(next, prev.node)
		unmountNode(prev.node)
	}

	const child = prev as DOMChildElement

	child.type = 'node'
	child.node = next
}
