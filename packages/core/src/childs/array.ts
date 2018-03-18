
import {DOMChild, DOMChildList, DOMElement, JSXChildElementType} from '../element'
import {getNodeElement} from '../element/store'
import {unmountElement, unmountNode} from '../element/unmount'

export interface Index {
	key: string
	position: number
}

export interface DiffSumary {
	add: Index[]
	remove: Index[]
	move: Index[]
}

export function mutateNodeArray(
	parent: Node, offset: number, prevChild: DOMChild, nextChilds: JSXChildElementType[]
) {
	const prevChilds = prevChild as DOMChildList

	if(prevChild.type === 'partial') {
		prevChilds.type = 'list'
		prevChilds.nodes = []
	}
	else if(prevChild.type === 'text' || prevChild.type === 'node') {
		unmountNode(prevChild.node)

		prevChilds.type = 'list'
		prevChilds.nodes = []
	}

	const {nodes} = prevChilds
	const {length: pLen} = nodes
	const {length: nLen} = nextChilds

	const removeObject: {[k: string]: Index} = {}
	const add: Index[] = []
	const move: Index[] = []

	const cache: {[key: string]: {element: DOMElement, position: number}} = {}

	for(let i = 0; i < pLen; i++) {
		const prev = nodes[i]
		const {key} = prev

		if(!key) {
			throw new Error('Element list should have a key')
		}

		cache[key] = {element: prev, position: i}
		removeObject[key] = {
			position: i,
			key
		}
	}

	for(let position = 0; position < nLen; position++) {
		const node = nextChilds[position]

		if(!(node instanceof Node)) {
			throw new Error('Array childs should be keyed elements')
		}

		const next = getNodeElement(node)
		const {key} = next

		if(!key) {
			throw new Error('Element list should have a key')
		}

		const indice = removeObject[key]

		if(indice === undefined) {
			add.push({position, key})
		}
		else if(indice.position !== position) {
			move.push({position, key})
		}

		if(!(key in cache)) {
			cache[key] = {element: next, position}
		}

		delete removeObject[key]
	}

	const keys = Object.keys(removeObject)
	let {length} = keys

	for(let i = 0; i < length; i++) {
		const {position, key} = removeObject[keys[i]]

		nodes.splice(position, 1)
		unmountElement(cache[key].element)
	}

	const {childNodes} = parent

	length = move.length

	for(let i = 0; i < length; i++) {
		const {key, position: nextPosition} = move[i]
		const {element} = cache[key]
		const index = nodes.indexOf(element)

		if(index !== nextPosition) {
			const nextNode = childNodes[nextPosition + offset] || null
			const {node} = element

			if(nextNode !== node) {
				nodes.splice(index, 1)
				nodes.splice(nextPosition, 0, element)
				parent.insertBefore(node, nextNode)
			}
		}
	}

	length = add.length

	for(let i = 0; i < length; i++) {
		const {key, position} = add[i]
		const {element} = cache[key]

		nodes.splice(position, 0, element)
		parent.insertBefore(element.node, childNodes[position + offset] || null)
	}
}
