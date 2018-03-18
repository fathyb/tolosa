import {DOMChild, DOMChildText} from '../element'
import {unmountNode} from '../element/unmount'

export function mutateTextChild(parent: Node, position: number, prev: DOMChild, next: {toString(): string}) {
	const child = prev as DOMChildText
	const text = String(next)

	if(prev.type === 'text') {
		if(prev.text !== text) {
			prev.text = text
			prev.node.nodeValue = text
		}
	}
	else {
		const node = document.createTextNode(text)

		if(prev.type === 'partial') {
			parent.insertBefore(node, parent.childNodes[position] || null)
		}
		else if(prev.type === 'list') {
			throw new Error('Cannot switch from text to array')
		}
		else {
			unmountNode(parent.replaceChild(node, prev.node))
		}

		child.type = 'text'
		child.text = text
		child.node = node
	}
}
