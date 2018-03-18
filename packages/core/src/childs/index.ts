import {DOMChild, JSXChild, JSXChildType} from '../element'
import {observe} from '../stream'

import {mutateNodeArray} from './array'
import {mutateNodeChild} from './node'
import {mutateTextChild} from './text'

export function mutateChilds(parent: Node, prevChilds: DOMChild[], nextChilds: JSXChild[]) {
	const {length} = prevChilds
	const offset = 0

	for(let i = 0; i < length; i++) {
		const prev = prevChilds[i]
		const next = nextChilds[i]
		const {raw} = prev

		if(raw.value === next) {
			continue
		}

		const position = i + offset
		const {unsubcriber} = raw

		if(unsubcriber) {
			unsubcriber()
		}

		raw.value = next
		raw.unsubcriber = observe(next, child =>
			mutateChild(parent, position, prev, child)
		)
	}
}

export function mutateChild(parent: Node, position: number, prev: DOMChild, next: JSXChildType) {
	if(next instanceof Node) {
		mutateNodeChild(parent, position, prev, next)
	}
	else if(Array.isArray(next)) {
		mutateNodeArray(parent, position, prev, next)
	}
	else {
		mutateTextChild(parent, position, prev, next)
	}
}
